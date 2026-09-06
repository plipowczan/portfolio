import { expect, test } from "@playwright/test";

/**
 * The WCAG 2.2 AA floor, measured rather than reviewed.
 *
 * Capability: `accessibility-baseline`. Every finding that produced that
 * capability was found by measurement and would have been missed by reading the
 * markup, so the floor is enforced here computationally: composited text
 * contrast for every visible text node, resting-state boundary contrast for
 * interactive components, hit-area size for every interactive target, and the
 * carousel's pause behaviour.
 *
 * This file deliberately runs on both default projects. `chromium` supplies the
 * desktop viewport and `Mobile Chrome` the phone one, and the target-size and
 * overflow assertions differ between them — which is why it is not pinned to a
 * single engine through `ENGINE_INDEPENDENT` in `playwright.config.js`.
 */

const ROUTES = ["/", "/blog", "/llm-wiki", "/llm-wiki/kurs", "/en/"];

/** WCAG 1.4.3 — body text, and the large-text relaxation. */
const TEXT_AA = 4.5;
const LARGE_TEXT_AA = 3;
/** WCAG 1.4.11 — interface component boundaries. */
const NON_TEXT_AA = 3;
/** Not a WCAG rule: the legibility floor this change sets for decoration. */
const DECORATIVE_FLOOR = 3;
/**
 * WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA. The enforced floor for
 * every target on the site.
 *
 * Not 44: that is SC 2.5.5 Target Size (Enhanced), Level AAA, and AAA is an
 * explicit non-goal of this change. An earlier draft of the spec asked for 44
 * everywhere, which would have pulled the whole desktop navigation, the footer
 * links, the breadcrumbs and every FAQ summary into scope — layout the proposal
 * put out of bounds.
 */
const MIN_TARGET = 24;

/**
 * The four controls this change deliberately takes past the floor to 44×44.
 * Each is a small graphic with no text to widen the box, so the AA minimum
 * still leaves them fiddly. This is a comfort decision, not a compliance one.
 */
const COMFORT_TARGET = 44;

/**
 * Containers whose text sits over a canvas or gradient rather than over a solid
 * colour. The composited-background walk reads element background colours; it
 * cannot see what a canvas painted, so a measurement taken inside these
 * containers is not evidence either way and is excluded from the text-contrast
 * assertion.
 *
 * Every entry carries its reason. A growing list is a signal that the
 * measurement approach needs revisiting rather than another exception.
 */
const OVER_CANVAS = [
  {
    selector: "#hero",
    reason:
      "Homepage hero text sits over NetworkBackground's <canvas>; the painted " +
      "pixels are not readable from getComputedStyle, so any ratio computed " +
      "here would be measuring the wrong layer.",
  },
];

/**
 * Controls whose resting boundary is what identifies them, beyond the form
 * fields the measurement always covers. WCAG 1.4.11 applies to a boundary that
 * carries the identification, not to every border on the page — a control with
 * a visible label or glyph is identified by that, and holding its decorative
 * border to 3:1 would report findings the criterion does not ask for.
 *
 * Both entries are controls this change altered, so a regression in either has
 * an assertion behind it rather than a commit message.
 */
const BOUNDARY_COMPONENTS = [
  // The consent choice: accept is a filled button, reject is a bordered one,
  // and the pair has to read as equals.
  ".cookie-banner button",
  // The language switcher is a pill whose border is the whole control.
  'nav a[aria-label*="Switch"], nav a[aria-label*="Przełącz"]',
];

/**
 * KNOWN FAILURES — meet-wcag-aa-baseline.
 *
 * Measured on `main` at 445cf56, chromium and Mobile Chrome. Recorded so the
 * branch starts from a passing baseline and every subsequent commit shows up as
 * a shrinking list rather than as noise in an already-red suite.
 *
 * Each entry names the task that removes it. Task 6.1 deletes this constant
 * entirely and the suite must pass with nothing but the `OVER_CANVAS`
 * allowlist — an entry that survives that step is a fix that did not land.
 */
const EXPECTED_FAILURES = [
];

const isExpected = (finding) =>
  EXPECTED_FAILURES.some((known) => finding.includes(known));

/**
 * Collects every measurement this spec asserts on, in one pass per route.
 *
 * Runs in the page because all three measurements need computed styles and
 * layout boxes. It returns raw records and makes no judgements — the
 * thresholds and the exemptions live in the assertions below, where they are
 * readable.
 */
/* eslint-disable no-undef */
async function measure(page, allowlistSelectors, boundarySelectors) {
  return page.evaluate(([allowlist, boundaries]) => {
    const parseColor = (value) => {
      const match = value && value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(",").map((n) => parseFloat(n));
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts.length > 3 ? parts[3] : 1,
      };
    };

    // Source-over compositing: what `fg` at its own alpha looks like on `bg`.
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });

    const luminance = (c) => {
      const [rs, gs, bs] = [c.r, c.g, c.b].map((channel) => {
        const s = channel / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const contrast = (a, b) => {
      const l1 = luminance(a);
      const l2 = luminance(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    // Walk ancestors collecting background layers until an opaque one is found,
    // then composite them back down. Measuring against the nominal page colour
    // instead of this passes on paper and fails on screen: several surfaces put
    // a translucent panel over the page ground.
    const compositedBackground = (el) => {
      const layers = [];
      let node = el;
      while (node && node.nodeType === 1) {
        const style = getComputedStyle(node);
        const bg = parseColor(style.backgroundColor);
        if (bg && bg.a > 0) {
          layers.push(bg);
          if (bg.a === 1) break;
        }
        node = node.parentElement;
      }
      let base = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i -= 1) base = over(layers[i], base);
      return base;
    };

    const isRendered = (el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      let node = el;
      while (node && node.nodeType === 1) {
        const style = getComputedStyle(node);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          parseFloat(style.opacity) === 0
        ) {
          return false;
        }
        node = node.parentElement;
      }
      return true;
    };

    // A short, human-readable address for a node, so a failure names something
    // findable in the source rather than an index.
    const describe = (el) => {
      const parts = [];
      let node = el;
      for (let depth = 0; node && node.nodeType === 1 && depth < 4; depth += 1) {
        let part = node.tagName.toLowerCase();
        if (node.id) {
          parts.unshift(`${part}#${node.id}`);
          break;
        }
        const cls = (node.getAttribute("class") || "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .join(".");
        if (cls) part += `.${cls}`;
        parts.unshift(part);
        node = node.parentElement;
      }
      return parts.join(" > ");
    };

    const inAllowlist = (el) =>
      allowlist.some((selector) => el.closest(selector) !== null);

    const text = [];
    const unmeasurable = [];
    const unsettled = [];
    const nonText = [];
    const targets = [];

    const main = document.querySelector("main") || document.body;

    for (const el of document.body.querySelectorAll("*")) {
      if (!isRendered(el)) {
        // A text-bearing node still at opacity 0 means the page had not
        // finished settling when it was measured. Left unreported, that turns
        // a green run into proof of nothing — the measurement simply skips
        // whatever has not appeared yet.
        const carriesText = Array.from(el.childNodes).some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
        );
        if (carriesText && main.contains(el) && el.getClientRects().length > 0) {
          unsettled.push(describe(el));
        }
        continue;
      }

      // --- text contrast -------------------------------------------------
      const ownText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();

      if (ownText.length > 0) {
        const style = getComputedStyle(el);
        const colour = parseColor(style.color);
        // Gradient text (`.gradient-text`) paints its glyphs from a background
        // gradient clipped to the text box, leaving `color` transparent. The
        // painted pixels are unreadable from computed style, so measuring it
        // yields a meaningless 1.00:1. Counted, not asserted on — a count that
        // suddenly covers the page would mean the check had stopped seeing text.
        const paintedByGradient =
          style.backgroundClip === "text" ||
          style.webkitBackgroundClip === "text" ||
          (colour !== null && colour.a === 0);
        if (paintedByGradient) {
          unmeasurable.push({ node: describe(el), sample: ownText.slice(0, 60) });
        } else if (colour) {
          const background = compositedBackground(el);
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight, 10) || 400;
          text.push({
            node: describe(el),
            sample: ownText.slice(0, 60),
            ratio: contrast(over(colour, background), background),
            fontSize,
            fontWeight,
            large: fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700),
            decorative: el.closest('[aria-hidden="true"]') !== null,
            overCanvas: inAllowlist(el),
          });
        }
      }

      // --- non-text contrast: the boundary that identifies a component ----
      // Form fields always qualify — the border is the only thing marking the
      // field. Buttons and links qualify when they are named here, because for
      // most of them the label or glyph is what identifies the control and the
      // border is decoration; measuring every bordered control would report
      // findings WCAG 1.4.11 does not ask for.
      const isFormField = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
      const isNamedComponent = boundaries.some((selector) =>
        el.matches(selector),
      );
      if (isFormField || isNamedComponent) {
        const style = getComputedStyle(el);
        const width = parseFloat(style.borderTopWidth);
        const hasBorder = width > 0 && style.borderTopStyle !== "none";
        const fill = parseColor(style.backgroundColor);
        // Neither a border nor a fill means the control is identified by its
        // glyph, not by a boundary — the banner's close cross, for one. There
        // is nothing here for 1.4.11 to measure.
        if (hasBorder || (fill && fill.a > 0)) {
          const parent = el.parentElement
            ? compositedBackground(el.parentElement)
            : { r: 255, g: 255, b: 255, a: 1 };
          const boundary = hasBorder ? parseColor(style.borderTopColor) : fill;
          if (boundary) {
            nonText.push({
              node: describe(el),
              kind: hasBorder ? "border" : "fill",
              ratio: contrast(over(boundary, parent), parent),
            });
          }
        }
      }

      // --- target size ----------------------------------------------------
      const interactive =
        /^(A|BUTTON|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName) ||
        (el.tagName === "INPUT" && el.getAttribute("type") !== "hidden") ||
        ["button", "link", "tab", "checkbox", "radio"].includes(
          el.getAttribute("role"),
        );
      if (interactive) {
        if (el.tagName === "A" && !el.hasAttribute("href")) continue;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        // A visually-hidden control (the skip link is clipped to 1×1 until it
        // takes focus) is not presented at rest. It is measured when it is
        // revealed, not while it is hidden.
        if (rect.width <= 1 || rect.height <= 1) continue;
        // WCAG 2.5.8 exempts a target inline within a sentence of text: the
        // author cannot enlarge it without breaking the line box.
        const parentText = el.parentElement
          ? el.parentElement.textContent.trim()
          : "";
        const inline =
          style.display.startsWith("inline") &&
          parentText.length > (el.textContent || "").trim().length;
        targets.push({
          node: describe(el),
          label:
            el.getAttribute("aria-label") ||
            (el.textContent || "").trim().slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          inlineInSentence: inline,
        });
      }
    }

    return {
      text,
      unmeasurable,
      unsettled,
      nonText,
      targets,
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    };
  }, [allowlistSelectors, boundarySelectors]);
}
/* eslint-enable no-undef */

/**
 * Brings a route to the state a visitor actually sees before measuring it.
 *
 * Six homepage sections animate on viewport entry. Without the scroll pass they
 * sit at `opacity: 0`, drop out of `isRendered`, and the measurement silently
 * covers a fraction of the page — the same failure mode that let the
 * prerenderer ship invisible HTML.
 */
async function settle(page) {
  // Walks the page top to bottom, dwelling long enough at each step for the
  // viewport-entry animations to fire and finish, then returns to the top.
  const scrollPass = async () => {
    const step = Math.round(window.innerHeight * 0.6);
    let y = 0;
    // `scrollHeight` is re-read every step on purpose: sections that animate in
    // change it, and a height sampled once leaves the tail of a long page
    // unvisited.
    while (y < document.documentElement.scrollHeight) {
      window.scrollTo(0, y);
      // At 120 ms the walk moved on before the sections appeared, and the whole
      // of `#testimonials`, `#contact` and `#skills` dropped out of the
      // measurement unnoticed.
      await new Promise((resolve) => setTimeout(resolve, 350));
      y += step;
    }
    // Dwell at the foot of the page: the last section enters the viewport on
    // the final step and needs its own beat before the walk turns around.
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 600));
    window.scrollTo(0, 0);
  };

  // True when nothing that carries text is still waiting to appear.
  const hasSettled = () => {
    const main = document.querySelector("main") || document.body;
    const hidden = (el) => {
      let node = el;
      while (node && node.nodeType === 1) {
        if (parseFloat(getComputedStyle(node).opacity) === 0) return true;
        node = node.parentElement;
      }
      return false;
    };
    return !Array.from(main.querySelectorAll("*")).some(
      (el) =>
        Array.from(el.childNodes).some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
        ) &&
        el.getClientRects().length > 0 &&
        hidden(el),
    );
  };

  // One pass is not always enough. A section can be scrolled past before its
  // observer fires, and then it never animates at all — measured on `/`, where
  // the booking call to action stayed hidden through a full pass and an eight
  // second wait. Repeating the walk is what actually clears it; waiting longer
  // does not, because nothing is in flight to wait for.
  for (let pass = 0; pass < 3; pass += 1) {
    await page.evaluate(scrollPass);
    // The cookie banner mounts one second after load and carries its own targets.
    await page.waitForTimeout(pass === 0 ? 1200 : 300);
    if (await page.evaluate(hasSettled)) return;
  }
  // Still unsettled: the `unsettled` assertion names the nodes, which is more
  // use than a bare timeout here.
}

const allowlistSelectors = OVER_CANVAS.map((entry) => entry.selector);
const boundarySelectors = BOUNDARY_COMPONENTS;

const format = (rows) => rows.map((row) => `  ${row}`).join("\n");

test.describe("accessibility baseline", () => {
  for (const route of ROUTES) {
    test.describe(`${route}`, () => {
      // Serial, and measured once for the whole block. Settling a route means
      // walking it end to end, which costs 12-15 s on `/blog`; doing that in
      // `beforeEach` repeated it for each of the five assertions and pushed the
      // route past the per-test timeout. The measurement is a read of a settled
      // page, so one sample serves every assertion below.
      test.describe.configure({ mode: "serial" });

      let measured;
      let context;

      test.beforeAll(async ({ browser }, testInfo) => {
        // The project's device options have to be carried over by hand: a page
        // opened straight from `browser` gets none of them, and the phone
        // viewport is half of what this spec exists to check.
        const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, baseURL } =
          testInfo.project.use;
        context = await browser.newContext({
          viewport,
          userAgent,
          deviceScaleFactor,
          isMobile,
          hasTouch,
          baseURL,
        });
        const page = await context.newPage();
        await page.goto(route);
        await settle(page);
        measured = await measure(page, allowlistSelectors, boundarySelectors);
      });

      test.afterAll(async () => {
        await context?.close();
      });

      test("the page had settled before it was measured", () => {
        // Guards every assertion below. Sections that animate on viewport entry
        // are invisible to the measurement until they have appeared, so a page
        // measured too early produces a short finding list and a green run that
        // proves nothing.
        expect(
          measured.unsettled,
          `content still at opacity 0 when ${route} was measured:\n${format(
            measured.unsettled,
          )}`,
        ).toEqual([]);
      });

      test("most text on the page is measurable", () => {
        // Gradient-painted text is excluded from the contrast assertion because
        // its glyphs come from a clipped background and cannot be read off
        // computed style. That exclusion is only safe while it stays a handful
        // of headings. If a regression made `color` transparent across the
        // page — or the contrast check simply stopped seeing text — the
        // exclusion would swallow the page and every assertion below would pass
        // on an empty set. Headings are outnumbered by body text on every one
        // of these routes, so this holds with room to spare.
        expect(
          measured.text.length,
          `measurable text nodes on ${route}: ${measured.text.length}, unmeasurable: ${measured.unmeasurable.length}`,
        ).toBeGreaterThan(measured.unmeasurable.length);
      });

      test("text that conveys meaning reaches its contrast floor", () => {
        const failures = measured.text
          .filter((node) => !node.decorative && !node.overCanvas)
          .filter(
            (node) => node.ratio < (node.large ? LARGE_TEXT_AA : TEXT_AA),
          )
          .map(
            (node) =>
              `${node.ratio.toFixed(2)}:1 (needs ${
                node.large ? LARGE_TEXT_AA : TEXT_AA
              }) — ${node.node} — "${node.sample}"`,
          )
          .filter((line) => !isExpected(line));

        expect(failures, `text below AA on ${route}:\n${format(failures)}`).toEqual([]);
      });

      test("decorative framing stays legible", () => {
        const failures = measured.text
          .filter((node) => node.decorative && !node.overCanvas)
          .filter((node) => node.ratio < DECORATIVE_FLOOR)
          .map(
            (node) =>
              `${node.ratio.toFixed(2)}:1 (needs ${DECORATIVE_FLOOR}) — ${
                node.node
              } — "${node.sample}"`,
          )
          .filter((line) => !isExpected(line));

        expect(
          failures,
          `decoration below the legibility floor on ${route}:\n${format(failures)}`,
        ).toEqual([]);
      });

      test("interface components have an identifiable resting boundary", () => {
        const failures = measured.nonText
          .filter((node) => node.ratio < NON_TEXT_AA)
          .map(
            (node) =>
              `${node.ratio.toFixed(2)}:1 (needs ${NON_TEXT_AA}) — ${node.kind} — ${node.node}`,
          )
          .filter((line) => !isExpected(line));

        expect(
          failures,
          `component boundaries below AA on ${route}:\n${format(failures)}`,
        ).toEqual([]);
      });

      test("interactive targets meet the minimum hit area", () => {
        const failures = measured.targets
          .filter((node) => !node.inlineInSentence)
          .filter((node) => node.width < MIN_TARGET || node.height < MIN_TARGET)
          .map(
            (node) =>
              `${node.width}×${node.height} (needs ${MIN_TARGET}×${MIN_TARGET}) — ${node.node} — "${node.label}"`,
          )
          .filter((line) => !isExpected(line));

        expect(
          failures,
          `targets below the minimum on ${route}:\n${format(failures)}`,
        ).toEqual([]);
      });

      test("the document does not scroll horizontally", () => {
        expect(measured.horizontalOverflow, `horizontal overflow on ${route}`).toBe(
          false,
        );
      });
    });
  }
});

/**
 * The four controls raised past the AA floor to 44×44. Addressed by role and
 * name rather than by class, so a restyle does not quietly stop checking them.
 */
test.describe("named controls reach the comfort target", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await settle(page);
  });

  const atLeastComfort = async (locator, what) => {
    const box = await locator.boundingBox();
    expect(box, `${what} is not rendered`).not.toBeNull();
    expect(
      Math.min(Math.round(box.width), Math.round(box.height)),
      `${what} measured ${Math.round(box.width)}×${Math.round(box.height)}`,
    ).toBeGreaterThanOrEqual(COMFORT_TARGET);
  };

  test("carousel position indicators", async ({ page }) => {
    const dots = page.locator("#testimonials").getByRole("button", {
      name: /przejd|go to/i,
    });
    const count = await dots.count();
    expect(count, "no carousel position indicators found").toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await atLeastComfort(dots.nth(i), `position indicator ${i + 1}`);
    }
  });

  test("carousel arrows", async ({ page }) => {
    const section = page.locator("#testimonials");
    await atLeastComfort(
      section.getByRole("button", { name: /poprzedn|previous/i }).first(),
      "previous control",
    );
    await atLeastComfort(
      section.getByRole("button", { name: /następn|next/i }).first(),
      "next control",
    );
  });

  test("footer social links", async ({ page }) => {
    const social = page
      .locator("footer")
      .getByRole("link", { name: /github|linkedin|mastodon|twitter|email/i });
    const count = await social.count();
    expect(count, "no footer social links found").toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await atLeastComfort(social.nth(i), `social link ${i + 1}`);
    }
  });

  test("cookie banner close control", async ({ page }) => {
    await atLeastComfort(
      page
        .locator(".cookie-banner")
        .getByRole("button", { name: /zamknij|close/i })
        .first(),
      "banner close control",
    );
  });
});

/**
 * WCAG 2.2.2. The carousel advances every five seconds and pauses on hover and
 * touch, but not on keyboard focus — so a keyboard visitor reading a
 * testimonial has it replaced under them, with no way to stop it.
 */
/**
 * Waits for the carousel to stand still, then watches it for `windowMs` and
 * returns every movement it saw.
 *
 * Both halves matter. Watching rather than sampling the ends means a movement
 * anywhere in the window counts, and the timeline says when it happened.
 * Settling first means the clock does not start inside a slide transition: that
 * animation runs 300 ms, and a transition left over from before the test
 * touched anything swaps the card under the reader while the index stays put.
 * An earlier version of these tests reported that tail as an advance in roughly
 * one run in fifteen — a measurement artefact that looked exactly like a
 * product defect.
 */
async function watchCarousel(page, windowMs) {
  return page.evaluate(async (duration) => {
    const read = () => {
      const dots = Array.from(
        document.querySelectorAll("#testimonials [aria-label^='Przejd']"),
      );
      const active = dots.findIndex((d) =>
        d.firstElementChild?.className.includes("bg-primary-500"),
      );
      const text =
        document.querySelector("#testimonials p.text-gray-300")?.innerText ?? "";
      return { active, text: text.slice(0, 40) };
    };

    // Two agreeing reads 400 ms apart, longer than the transition. Bounded, so
    // a genuinely moving carousel cannot stall here — it just starts moving
    // inside the window instead, which is what the assertion is looking for.
    const settleStart = performance.now();
    let stable = read();
    while (performance.now() - settleStart < 4000) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const next = read();
      if (next.text === stable.text && next.active === stable.active) break;
      stable = next;
    }

    const start = performance.now();
    const first = read();
    const changes = [];
    let previous = first;

    while (performance.now() - start < duration) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const now = read();
      if (now.text !== previous.text || now.active !== previous.active) {
        changes.push({
          at: Math.round(performance.now() - start),
          from: previous.active,
          to: now.active,
        });
        previous = now;
      }
    }
    return { first, changes };
  }, windowMs);
}

test.describe("testimonials carousel can be paused", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#testimonials");
    await settle(page);
  });

  test("keyboard focus on a control stops the automatic advance", async ({
    page,
  }) => {
    const next = page
      .locator("#testimonials")
      .getByRole("button", { name: /następn|next/i })
      .first();
    await next.focus();

    // Preconditions, stated rather than assumed: focus has to have landed, and
    // it has to have landed *inside* the carousel. Without the second check a
    // stray match elsewhere on the page would leave the carousel unpaused and
    // the failure would look like a product bug.
    await expect(next).toBeFocused();
    expect(
      await page.evaluate(
        () => document.activeElement?.closest("#testimonials") !== null,
      ),
      "focus is not inside the testimonials section",
    ).toBe(true);

    const timeline = await watchCarousel(page, 6500);

    const stillFocused = await page.evaluate(
      () => document.activeElement?.getAttribute("aria-label") ?? "(none)",
    );

    expect(
      timeline.changes,
      `carousel moved while a control held focus. Started at indicator ${
        timeline.first.active
      }, focus at the end: ${stillFocused}. Timeline: ${JSON.stringify(
        timeline.changes,
      )}`,
    ).toEqual([]);
  });

  test("a visible pause control is present and keyboard operable", async ({
    page,
  }) => {
    const pause = page
      .locator("#testimonials")
      .getByRole("button", { name: /pauz|pause|zatrzym|stop|wznów|resume|play/i })
      .first();

    await expect(pause).toBeVisible();

    // Operate it from the keyboard, which is what the requirement asks for —
    // merely focusing it would re-test the focus pause covered above.
    await pause.focus();
    await expect(pause).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(pause).toHaveAttribute("aria-pressed", "true");

    // Then take focus out of the carousel. Stopping it is a standing choice, so
    // it has to survive focus leaving — otherwise the control would only appear
    // to work for as long as it happened to be focused.
    await page.evaluate(() => document.activeElement?.blur());
    await expect(pause).not.toBeFocused();

    const timeline = await watchCarousel(page, 6500);

    expect(
      timeline.changes,
      `carousel moved after the pause control was used. Started at indicator ${
        timeline.first.active
      }. Timeline: ${JSON.stringify(timeline.changes)}`,
    ).toEqual([]);
  });
});
