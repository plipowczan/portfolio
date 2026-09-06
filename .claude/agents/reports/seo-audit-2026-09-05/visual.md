# Visual & Mobile Rendering Audit — pawel.lipowczan.pl

Captured with Playwright (Chromium) directly against production, two viewports
(390×844 mobile, 1440×900 desktop), six pages, both an "early" screenshot
(~150ms after `domcontentloaded`) and a "settled" screenshot (after
`networkidle` + 800ms) to catch load-in flashes. All screenshots are in
`screenshots\` alongside this file. DOM analysis (overflow, tap-target size,
font size, CTA/H1 bounding boxes) was pulled via `page.evaluate` and saved to
`analysis.json` in the same folder.

## 1. Cookie/consent banner vs. first viewport (390×844)

Screenshots: `home-mobile-settled.png`, `llm-wiki-mobile-settled.png`,
`blog-article-mobile-settled.png`, `home-desktop-settled.png`.

- The banner is a bottom-fixed sheet. On mobile it measures **261px tall,
  starting at y=559 in an 844px viewport — 31% of the fold**, on every page
  checked (home, blog, blog article, llm-wiki, project page).
- **Home (/) mobile**: H1 ("PAWEL LIPOWCZAN") is above the banner and fully
  visible. The subheadline "Architekt oprogramowania i doradca ds..." sits
  right at the banner's top edge and is visibly clipped by it in the
  screenshot. The primary CTA "Skontaktuj się" (bounding box y=760–812) falls
  entirely inside the banner's footprint (y=559–820) — **the banner sits
  directly on top of the only above-fold CTA on the homepage.**
- **Home (/) desktop (1440×900)**: banner is much shorter here — 82px, 9% of
  viewport, y=795–877. The "Skontaktuj się" button (y=788–840) still overlaps
  the banner's top ~45px. Visible in `home-desktop-settled.png`: a faint
  button-shaped shadow shows through/behind the banner strip at roughly
  x=570–690, y=790 — the CTA is partially obstructed even on desktop.
- **/llm-wiki mobile**: this page fares better — H1 ("Baza wiedzy, która
  rośnie sama") and the full value-prop paragraph are above the banner and
  untouched. But there is **no CTA anywhere in the first viewport regardless
  of the banner** — see finding 3.
- Banner buttons themselves ("Odrzuć" / "Akceptuję") are well-sized (open
  full-width, ~64–80px tall) — not a tap-target problem, only a coverage
  problem.

## 2. Mobile layout integrity (390px)

- No page tested has real horizontal overflow: `document.documentElement`
  `scrollWidth === clientWidth === 390` on every one of home, home-en, blog,
  blog article, llm-wiki, project page. The only elements whose
  `getBoundingClientRect()` fall outside the viewport are (a) decorative
  `position: absolute` blurred glow circles that sit under an
  `overflow-hidden` ancestor (they do not add scrollable width — confirmed by
  `scrollWidth` staying at 390), and (b) an off-screen `left:-9999px` input +
  label on `/llm-wiki` that is a standard visually-hidden honeypot field, not
  a bug.
- **Code blocks in `/blog/rag-ragowi-nierowny`**: the `<pre>` block is
  correctly boxed (`width: 358px`, matching the 390px viewport minus padding,
  `overflow-x: auto`), so it does not break page layout. But functionally the
  block **truncates code text at the right edge with no visible scrollbar or
  fade affordance** — see `screenshots\blog-article-mobile-codeblock.png`:
  lines like `Pytanie: „co pęknie, gdy zmienię sygnatu[ry...]"`, `grep plik po
  pliku: dziesiątki wyszukiw[ań...]`, and `(liczby: deklaracja autorów
  codebase-mem[...])` are all cut off mid-word with zero indication the block
  scrolls horizontally. A mobile reader is very likely to read this as
  clipped/broken text rather than "swipe to see more."
- Same screenshot also shows the fixed top nav bar sitting directly over
  in-flow article text as the page is scrolled (text bleeds visibly right up
  to/behind the header edge) — worth a second look at scroll-margin/header
  z-index, though this is a minor visual overlap, not a functional break.

## 3. Above-fold value proposition + CTA

- **/ (home) mobile**: value prop visible (H1 + tagline), but as per finding 1
  the CTA is covered by the cookie banner on first paint.
- **/llm-wiki mobile and desktop (the conversion page)**: H1 and value-prop
  copy are visible above the fold in both viewports, but the actual signup CTA
  ("Zapisz mnie") sits **2048px down the mobile page and 1601px down the
  desktop page** (viewport heights are 844 and 900 respectively) — i.e. there
  is **no CTA of any kind in the first viewport on the main conversion page,
  independent of the cookie banner**. A visitor who doesn't scroll sees only
  the concept pitch, never the ask.

## 4. Tap targets, fonts, hydration, language switcher

- Small tap targets found in the first viewport on mobile (`w`×`h` in CSS
  px): cookie-banner close `✕` button 32×32; "Dowiedz się więcej" link
  127×**17**; language switcher "PL|EN" 75×**34**. All are under the 44px
  guideline; the "Dowiedz się więcej" link at 17px tall is the tightest.
- No sub-16px body copy found on primary paragraph text; some metadata/badge
  text runs at 12–14px (e.g. "Twój Przewodnik Technolog[iczny]" tagline at
  12px, tech-stack pill labels like "Make"/"Airtable"/"n8n" at 12px, blog date
  and read-time at 14px). These are secondary/label text, not body copy, and
  are still legible in the screenshots at 2x DPR.
- **Hydration/paint flash**: compared `home-mobile-early.png` (150ms after
  `domcontentloaded`) against `home-mobile-settled.png`. The early frame shows
  only the nav bar and a faint particle/graph decoration — the H1, tagline,
  and body copy are completely absent from the paint. `curl`-ing the raw
  prerendered HTML confirms the text *is* present in the initial document
  (`Twój Przewodnik`, `Architekt oprogramowania` both appear server-side), so
  this is not a missing-content/SEO problem — it's an opacity/fade-in
  animation delaying the visible paint of the hero by at least ~150ms, likely
  longer on slower devices. Net effect for a real user: a brief blank flash
  before content fades in.
- **Language switcher**: `/en/` was captured and renders correctly — same
  layout, no overflow, nav labels translate (Home/About/Projects/Skills/
  Testimonials/Blog/Contact), no broken strings observed. The switcher
  control itself is the 75×34 "PL|EN" pill noted above.

## Screenshots captured

All under `screenshots\`, pattern `<page>-<viewport>-<early|settled>.png` for:
`home`, `home-en`, `blog`, `blog-article`, `llm-wiki`, `project-frontdesk`, at
`mobile` (390×844) and `desktop` (1440×900). Plus
`blog-article-mobile-codeblock.png` (scrolled to the first code block after
dismissing the cookie banner).
