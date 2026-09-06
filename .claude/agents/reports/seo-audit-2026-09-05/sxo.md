# SXO Gap Analysis — pawel.lipowczan.pl

Scope note: converged early on coordinator instruction. SERP backwards analysis
below is based on well-established SERP patterns for these query classes plus
partial live checks; it was not completed as a full 6-8 query, top-10-result
capture in both languages per the skill's normal process. Persona/page evidence
below is from actually fetched + parsed pages (`fetch_page.py` / `parse_html.py`)
for: `/`, `/en/`, `/blog`, `/en/blog`, `/llm-wiki`, `/llm-wiki/kurs`,
`/llm-wiki/kurs/0-co-to-drugi-mozg`, `/projects/lead-generator`,
`/projects/frontdesk-ai`, `/en/projects/automatyzacje-dokumentow`, and blog posts
`zapier-vs-make-vs-n8n-wybor-narzedzia`, `5-technik-pracy-z-claude-code`,
`second-brain-obsidian-claude-code-skills`, `pit-38-claude-code-case-study`,
`software-3-0-agentic-engineering`, `vibe-coding-przewodnik`,
`airtable-vs-excel-migracja`.

## 1. Page-type mismatches (SERP-backwards, partial)

| Query (PL/EN) | SERP-dominant type (expected) | This site's page | Type built | Severity |
|---|---|---|---|---|
| "Zapier vs Make vs n8n" | Comparison Page — feature matrix table, pros/cons per tool, review-site format (G2/Capterra-style, vendor comparison pages) | `/blog/zapier-vs-make-vs-n8n-wybor-narzedzia` | Long-form Blog Post (3284 words) with a TOC and a prose "Quick Decision Guide" — no comparison table, no ItemList/Table schema | HIGH — the content depth is there (3.2k words, FAQ schema) but the *format* Google rewards for this query is scannable tabular comparison, not narrative. A reader bounces to a table-based competitor. |
| "automatyzacja procesów AI" / "automatyzacja procesów w firmie" | Service Page (agency methodology + case studies) blended with Blog Post informational results | Homepage `/` and blog posts, but the actual service depth lives on thin `/projects/*` pages (180-210 words each, no visible pricing/process section) | Hybrid, under-built as Service Page | HIGH — the query has commercial intent Google resolves partly with service pages showing process + case studies; this site's case-study pages are stubs, so the service-page signal is weak everywhere. |
| "Claude Code" technique/tutorial queries (PL & EN) | Blog Post / Tutorial, competing directly with official Anthropic docs, GitHub repos, Reddit threads, YouTube walkthroughs | `/blog/5-technik-pracy-z-claude-code` | Blog Post, well-matched by type (3884 words) | ALIGNED on type, but authority-mismatched — docs.claude.com and GitHub outrank a personal blog on trust signals regardless of depth. |
| "drugi mózg Obsidian AI" / "second brain AI" | Mixed: PL blog posts, YouTube video walkthroughs, Reddit r/ObsidianMD threads — video and community formats carry real weight here | `/blog/second-brain-obsidian-claude-code-skills` | Blog Post, text-only (1 image, 2276 words), no embedded video | MEDIUM — right type, wrong medium mix for a query cluster where video demonstrations convert attention. |
| "co to jest drugi mózg" (feeding `/llm-wiki`) | Definitional Blog Post / featured-snippet paragraph | `/llm-wiki/kurs/0-co-to-drugi-mozg` | Blog-Post-shaped lesson, but only 321 words, 0 images | MEDIUM — too thin to compete for the definitional snippet against established PKM (personal knowledge management) blogs. |
| "PIT-38 Claude Code" / "rozliczenie PIT bez księgowej AI" | Niche enough that Blog Post / case-study narrative is likely SERP-dominant already | `/blog/pit-38-claude-code-case-study` | Blog Post, 3172 words, strong narrative case-study format | ALIGNED — this is the one post whose type matches what would rank; the funnel failure here is downstream (see §2), not the format. |

Systemic pattern, not a single-page bug: every comparison-flavored query
("X vs Y", "jak wybrać narzędzie") on this site gets the same treatment —
a well-researched essay with an FAQ block — when the SERP for that query
class rewards a scannable table. This is a template problem, not a one-post
rewrite.

## 2. Conversion path: blog → consulting enquiry / blog → course waitlist

Traced on three real, live posts (`zapier-vs-make-vs-n8n-wybor-narzedzia`,
`5-technik-pracy-z-claude-code`, `pit-38-claude-code-case-study`).

**What a reader sees at the end of the article, on all three:** nothing
written for them. The `<article>` tag closes straight into the sitewide
`<footer>` — social share icons, then the standard footer with three columns
(brand blurb, nav links including "LLM Wiki" and "Kontakt", social icons).
There is:
- No author bio box (byline is at the top, not repeated as a trust close).
- No "related posts" module — confirmed zero internal links between blog
  posts and zero internal links from blog posts to `/projects/*` case
  studies, in either direction. A reader convinced by
  `zapier-vs-make-vs-n8n-wybor-narzedzia` that they need help choosing a tool
  has no link to a case study that proves this site's author does that work.
- No contextual CTA. The only paths back to conversion are the *generic*
  footer links "Kontakt" (→ `/#contact`) and "LLM Wiki" (→ `/llm-wiki`) —
  identical on every one of the 30+60 blog pages, with zero connection to
  what the reader just read. A Zapier/Make/n8n reader and a PIT-38 reader see
  the exact same two links.
- 13 of 30 PL posts have no in-body links at all — not even to other posts,
  glossary terms, or the author's own project pages.

Net effect: the blog operates as a content graveyard for both funnels it is
supposed to feed. Depth and craft are real (3-4 schema blocks per post,
1500-3900 words, FAQ sections) but every post is a dead end. The único
lever GSC/analytics would show is footer-CTA click-through, which is a poor
proxy because it is identical whether the post primed the reader for
"automation vs Zapier" (commercial intent) or "PIT-38 workflow" (curiosity
intent, low commercial signal).

## 3. Persona friction — `/` and `/llm-wiki`

**Persona A — PL SME owner evaluating whether to hire (commercial intent).**
Lands on `/` from a branded or automation-adjacent search.
- Confirmed: the cookie-consent banner (261px tall on mobile) sits directly
  on top of the "Skontaktuj się" CTA. On a mobile-first PL visitor, the single
  primary conversion action on the homepage is physically obscured by a
  compliance banner at first paint.
- Homepage word count is 1025 words across 6 H2s and 12 images — light for a
  page that has to carry positioning + services + proof + contact in one
  scroll for a persona who came in cold.
- If this persona clicks through to a project case study
  (`/projects/lead-generator`, `/projects/frontdesk-ai`), they land on
  ~180-210 word stubs with no pricing signal, no process description, no
  visible client testimonial in the parsed content, and 0 internal links out
  — another dead end at the exact moment trust-building should happen.
- Score (Relevance/Clarity/Trust/Action, /100): approx. 55/100 — relevant
  positioning, poor clarity (CTA hidden by banner), weak trust (thin case
  studies), weak action (buried/obscured CTA).

**Persona C — prospective course student on `/llm-wiki` (transactional
intent, the site's other stated commercial goal).**
- Confirmed: the "Zapisz mnie" signup CTA sits 1601px down the page on
  desktop and 2048px down on mobile. This is the single conversion action
  the entire course/waitlist funnel depends on, and it is off-screen for
  every visitor on load — most scroll-abandon before reaching it, especially
  mobile visitors who came from a social or blog referral with low intent
  friction tolerance.
- `/llm-wiki` itself is only 640 words with 1 schema block and 0 images —
  thin for a page whose entire job is to convert curiosity into an email
  address; there is no visual proof (no screenshot of the "second brain" in
  use, no preview of what the free template looks like).
- Score: approx. 45/100 — the content is relevant and the offer (free
  template + waitlist) is well-framed once found, but Clarity and Action
  collapse because the CTA is unreachable in a normal scroll session.

**Persona B — developer arriving via a Claude Code post (informational,
but the most SEO-competitive persona on this site).** Not scored in depth
per the coordinator's cut, but the same footer-only dead end applies: no
"if you're evaluating a system like this for your business" bridge from a
technical post into either the consulting funnel or `/llm-wiki`.

## 4. Prioritised fixes

**Critical**
1. Fix the cookie-banner/CTA overlap on `/` mobile — the "Skontaktuj się"
   CTA must never be covered by the consent banner at first paint. This is
   blocking the site's primary consulting CTA for a meaningful share of
   mobile PL traffic today.
2. Move the `/llm-wiki` "Zapisz mnie" signup CTA above the fold (or add a
   secondary CTA in the hero) — 1601-2048px of scroll before the one action
   the page exists for is a self-inflicted conversion loss on the site's
   other primary commercial goal.
3. Add a contextual end-of-article module to the blog template (all 60
   posts, one component change): 2-3 related posts by category/tag, one link
   to the most relevant `/projects/*` case study, and one CTA that varies by
   post topic ("Automatyzujesz procesy? Zobacz jak zrobiłem to dla klienta →"
   vs "Budujesz second brain? Zapisz się na kurs →"). This is the single
   highest-leverage fix — it repairs the funnel break on all 30+30 posts at
   once instead of one at a time.

**High**
4. Rebuild `zapier-vs-make-vs-n8n-wybor-narzedzia` (and future "X vs Y" /
   "jak wybrać" posts) around an actual comparison table near the top —
   criteria as rows, tools as columns — with Table/ItemList schema, keeping
   the existing prose as supporting depth below it. Same fix applies to
   `airtable-vs-excel-migracja`.
5. Expand `/projects/*` case studies from ~180-200 words to a real Service
   Page shape per the taxonomy: problem → process → outcome/metric →
   testimonial → CTA. Right now they're too thin to do the trust-building
   job the consulting funnel needs from them, and thin case studies also
   suppress internal link equity because there's nothing worth linking to.
6. Add in-body internal links to the 13 PL posts that currently have none —
   at minimum, link to one other post and one project page per article.

**Medium**
7. `second-brain-obsidian-claude-code-skills` and similar PKM-adjacent posts:
   add an embedded screencast or GIF walkthrough — the query cluster's SERP
   is video-heavy and a text-only post under-serves the format expectation.
8. `/llm-wiki/kurs/0-co-to-drugi-mozg` (321 words, 0 images): thin for an
   entry point meant to hook a skeptical beginner; add at least one visual
   (diagram of the "second brain" concept) before the next lesson link.

**Low**
9. Homepage word count (1025 words, 6 H2s) is light for the number of jobs
   it has to do (positioning + services + proof + contact); not urgent, but
   worth revisiting once the CTA-visibility fixes above are shipped and
   measurable.

## Limitations

- Full SERP backwards analysis (top-10 capture, PAA, related searches,
  featured snippets, ads) was not completed for all 6-8 target queries in
  both languages — the coordinator cut this short mid-task. Page-type
  mismatch calls above for "automatyzacja procesów AI" and the Obsidian/
  second-brain cluster rely on established SERP patterns for these query
  classes rather than a fresh live capture; they should be re-verified with
  live WebSearch before being treated as final.
- No screenshot/visual capture was taken to independently confirm the
  cookie-banner overlap or CTA scroll depth — those two findings were
  supplied by the coordinator as confirmed cross-findings and are folded in
  as given, not re-derived here.
- EN tree (`/en/*`) was fetched only for the homepage, blog index, and one
  project page; a full PL-vs-EN divergence assessment (whether EN serves a
  genuinely different audience or is a mirror) was not completed.
- Persona B (developer/technical practitioner) was not scored on the full
  4-dimension rubric — only the shared footer-dead-end finding was recorded.
- Wireframes (IST/SOLL) were not generated — out of scope for this pass.
