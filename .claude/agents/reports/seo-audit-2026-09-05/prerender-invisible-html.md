# The prerendered HTML ships invisible

Traced by the orchestrator after the performance run reported mobile FCP of 5.6s
on a page with a 30ms TTFB and prerendered markup — a combination that cannot
happen if the served HTML paints.

## The evidence

The homepage's `<h1>` — the element Lighthouse identifies as the mobile LCP —
is served like this:

    <h1 class="text-5xl sm:text-6xl ..." style="opacity: 0; transform: translateY(13.8694px);">

Inline `opacity: 0`, baked into the static file Vercel serves.

Counts of inline opacity in the live prerendered HTML:

| URL | `opacity: 0` | `opacity: 1` |
|---|---|---|
| `/` | **74** | 1 |
| `/en/` | **75** | **0** |
| `/blog` | 27 | 7 |
| `/llm-wiki/kurs` | 9 | 1 |
| `/llm-wiki` | 8 | 1 |
| `/projects/frontdesk-ai` | 1 | 6 |
| `/blog/rag-ragowi-nierowny` | 1 | 1 |

The homepage serves 74 invisible elements and one visible one. `/en/` serves 75
invisible and none visible.

## Two causes, both in the prerender step

**1. The snapshot is taken mid-animation.** `Hero.jsx` staggers its entry:
logo `duration: 0.8`, then h1 `delay: 0.2`, subtitle `delay: 0.4`, description
`delay: 0.6`, CTA buttons `delay: 0.8` — so the hero is not settled until roughly
1.6s. `scripts/prerender.mjs:199` waits `IS_VERCEL ? 1000 : 2000` ms. On Vercel
that is 1000ms, which lands inside the animation.

The frozen fractional values prove it: `translateY(13.8694px)` and
`scale(0.94685)` are not start or end states, they are frames.

Note this also makes the bug environment-dependent — 2000ms locally versus
1000ms on Vercel means a local build looks better than the deployed one, which is
the same asymmetry that made the July head-leak incident hard to see.

**2. `whileInView` never fires.** Six homepage sections animate on scroll —
`About`, `Skills`, `Projects`, `Testimonials`, `BookingCTA`, `ContactForm`. The
prerenderer never scrolls the page, so these never enter view, never animate, and
are captured at their `initial` state permanently. That accounts for most of the
74. It is also why article and project pages, which have fewer motion sections,
score 1 instead of 74.

## Why it matters

The site pays the full cost of prerendering and throws away the user-facing
benefit. The HTML arrives in 30ms and paints nothing; the hero appears only after
the 753 KB bundle downloads, parses, hydrates, and Framer Motion resumes the
animation. That is the 5.6s FCP and 6.5s LCP on mobile — not network, not server.

Indexing is probably fine, since Google renders JavaScript and will complete the
animations. But Core Web Vitals field data is a ranking signal and is measured on
real users, who are watching a blank hero. And with JS slow, blocked, or broken,
the homepage is blank rather than degraded.

The visual agent independently observed this from the other end: a blank hero
~150ms after `domcontentloaded`, settling later. Same defect, two instruments.

## Fix

Do not fix this by lengthening the wait or scripting a scroll. Both are
timing-dependent and will regress the moment an animation delay changes — the
1000/2000ms split is already why this differs between local and Vercel.

1. **Neutralise motion initial states during prerender.** `App.jsx:27` already
   wraps the tree in `<MotionConfig reducedMotion="user">`, so there is a natural
   seam: detect the prerender pass and render with `initial={false}` so elements
   are captured settled and visible.
2. **Or strip the frozen inline styles at capture time** in `prerender.mjs`,
   after `page.content()` — remove inline `opacity`/`transform` that Framer Motion
   left behind. Cruder, but contained to one file.
3. **Gate it in the build.** Add an assertion to
   `scripts/verify-prerender-output.mjs` that fails when a snapshot contains
   inline `opacity: 0` above a small threshold. This is the same move already made
   for the canonical guard after the 2026-07-29 incident, applied to the failure
   mode that guard cannot see.

Fix 1 or 2 stops the bleeding; 3 is what stops it coming back.

Severity: **Critical.** Highest-leverage item in the audit — it is the direct
cause of four failing mobile LCP scores, and the fix is in the build pipeline
rather than spread across the content.
