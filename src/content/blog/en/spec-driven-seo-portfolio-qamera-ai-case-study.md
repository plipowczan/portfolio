---
id: 25
slug: spec-driven-seo-portfolio-qamera-ai-case-study
title: "Why WordPress can't do this - spec-driven SEO on a portfolio and Qamera AI"
excerpt: "An SEO audit, spec-driven changes, and an AI workflow optimized two projects in hours, not weeks. Case study from a portfolio and Qamera AI."
category: Code
author: Pawel Lipowczan
date: 2026-04-26
readTime: 16 min
image: /images/og-spec-driven-seo-portfolio-qamera-ai.webp
tags:
  - SEO
  - GEO
  - OpenSpec
  - Claude Code
  - Next.js
  - Vercel
lang: en
alternateSlug: spec-driven-seo-portfolio-qamera-ai
---

## Two projects, two stacks, one workflow loop

In two weeks I optimized SEO on two radically different projects. **The portfolio** ([pawel.lipowczan.pl](https://pawel.lipowczan.pl)) - a Vite 7 + React 19 SPA with prerendering. The audit found 10 findings; I fixed five of them in a single afternoon. Securityheaders.com went from **C to A**, Rich Results Test from **5 warnings to 0**, the sitemap got per-URL `lastmod` instead of one build timestamp for all 73 URLs.

**Qamera AI** ([qamera.ai](https://qamera.ai)) - my AI product photography SaaS, Next.js 16 App Router + Turborepo + Vercel + Supabase + i18n EN/PL/UK. The audit returned a health score of **56/100**. In five working days I closed **nine spec-driven changes** (seven planned plus two discovered along the way), which resolved every "Critical" finding. CLS on `/marketplace/styles` dropped from **0.467 to 0.016** - a 27× improvement. Hreflang coverage grew from "docs only" to **20 static marketing paths plus docs**. The homepage got three JSON-LD blocks (Organization + WebSite + SoftwareApplication); pricing got three more (Product × 2 + FAQPage).

The central thesis of this article is simple and inconvenient for some readers: **full control over SEO and GEO is only possible with a code-based stack**. WordPress, Webflow, and Wix give you plugins - they don't give you a `Content-Security-Policy` header reporting to Sentry, sitemap-level `xhtml:link`, `requestIdleCallback` in `<head>`, or `llms.txt` generated with your own build-time logic. The second multiplier is a good **AI workflow** - brainstorm → spec → execute → review → test. A code-based stack without a process = two weeks of manual work. An AI workflow on a closed platform = you hit the plugin ceiling. Both together = hours.

I'll show you the process across both projects. You'll see what transfers 1:1 and what requires different decisions per stack.

## Why "platform vs code" is no longer a debate about hosting cost

Five years ago, choosing WordPress over your own code was pragmatic. WordPress gave you themes, plugins, an ecosystem, and an admin panel for non-technical clients. Vercel with your own framework was overkill for 80% of projects.

In 2026 those proportions shifted. **SEO has shifted toward GEO** (Generative Engine Optimization) - ChatGPT web search, Perplexity, Claude Search, and Gemini Deep Research read your pages, but differently from Googlebot. They respect the [llmstxt.org](https://llmstxt.org/) spec, weight `author.name` and `datePublished` in JSON-LD when picking sources, and prefer a "factual-definition opener" in the first 150 words. Security headers have become a trust signal. Core Web Vitals are validated with field data from CrUX, not lab scores from Lighthouse. Schema enrichment translates into rich results in SERP.

What WordPress / Webflow give you in 2026: an SEO plugin (Yoast, Rank Math), basic schema for Article and Product, an automatically generated sitemap, redirects, `meta description`. That's about **80% of needs** for a typical company site.

What they don't give you (or only with a serious fight):

```text
- Content-Security-Policy Report-Only with reporting to Sentry
- Permissions-Policy per-page (geolocation, camera, microphone, payment)
- requestIdleCallback for third-party scripts instead of async=true
- xhtml:link in the sitemap (not just hreflang in head)
- llms.txt / llms-full.txt with your own generation logic
- BlogPosting with mainEntityOfPage + publisher (raster logo) + ISO 8601 datetime
- Per-bot rules in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- Sitemap lastmod per page-type (post: frontmatter.modified, listing: max, legal: git mtime)
```

This is the top 20% of control. And it's exactly the range where today you win positions - in classic SERP and in LLM answers. Plugins close the top 80%. The top 20% requires editing HTTP headers, the HTML structure in `<head>`, your own artifact builder. You don't do this in an admin panel - because the admin panel deliberately doesn't expose those layers.

## Toolchain - five tools, one loop

I use the same five tools on every SEO project. Each on its own is ordinary. Together they form a loop that compresses time by 80-90%.

| Tool | Role |
|---|---|
| **`claude-seo`** plugin (20+ sub-skills) | Audit as the first command - technical, GEO, schema, performance, hreflang, AI discoverability |
| **OPSX / OpenSpec** | Spec-driven workflow - `proposal.md` → `design.md` → `specs/` → `tasks.md` before code |
| **Lighthouse MCP** | Lab CWV and LCP opportunities from inside the agent, no context-switching to PageSpeed |
| **Rich Results Test + securityheaders.com + Sentry CSP Reports** | Verification at every step |
| **Git worktrees** | Parallel work on independent changes (when the project allows it) |

I described OPSX in more detail in a [separate article on a structured approach to AI workflows](/en/blog/opsx-workflow-structured-ai-work). `claude-seo` is an example of a **specialized skill** in the sense from the [Skills 2.0 post](/en/blog/skills-2-0-multi-agent-system-company-management) - domain-specific knowledge plus checklist plus pre-built sub-skills.

The work loop looks the same on every project:

```text
┌─────────┐    ┌──────────┐    ┌────────┐    ┌───────┐
│  Audit  │ →  │ Proposal │ →  │ Design │ →  │ Specs │
└─────────┘    └──────────┘    └────────┘    └───────┘
                                                  │
┌─────────┐    ┌────────┐    ┌──────────┐    ┌───▼───┐
│ Archive │ ←  │ Verify │ ←  │ Implement│ ←  │ Tasks │
└─────────┘    └────────┘    └──────────┘    └───────┘
```

A typical command sequence:

```bash
# Phase 1: audit
/claude-seo:seo

# Phase 2: change proposal
/opsx:new "seo-improvements"
/opsx:ff   # fast-forward - all planning artifacts at once

# Phase 3: implementation
/opsx:apply

# Phase 4: verification
/opsx:verify
# manually: securityheaders.com, Rich Results Test, Lighthouse MCP

# Phase 5: archival
/opsx:archive
```

Each of these tools works **because the substrate is code**. The audit can read any source file and the raw `<head>` output. OPSX can edit `vite.config.js`, `next.config.ts`, `vercel.json`, `robots.txt` in one session. Verifiers get full output without a sandbox. This is not a coincidence - it's a consequence of architecture.

## The audit - what claude-seo finds on two radically different projects

The first observation that surprised me: **claude-seo returns the same set of finding categories regardless of stack**. Only the way to fix them differs.

| Project | Stack | Findings | Initial state |
|---|---|---|---|
| Portfolio | Vite 7 + React 19 + Vercel | 10 (4 perf, 2 schema, 2 security, 1 sitemap, 1 GEO) | securityheaders C, Rich Results 5 warnings |
| Qamera AI | Next.js 16 + Turborepo + Vercel | 7 + 2 discovered along the way | health score 56/100 |

Shared finding categories that transfer 1:1 between stacks:

- **Missing or incomplete `llms.txt`** - biggest miss on GEO readiness in both projects
- **Schema enrichment** - missing `publisher`, `dateModified`, `mainEntityOfPage`, ISO 8601 datetime
- **Hreflang only at head-level**, no `xhtml:link` in the sitemap for clustering language variants
- **Security headers** - deprecated `X-XSS-Protection`, no `Permissions-Policy`, no HSTS preload, no CSP
- **AI bot allowlist is wildcard** - which for `Google-Extended` and `GPTBot` means "no signal", not "allow"

Stack-specific findings that require different decisions:

- **Portfolio:** `clickrank.ai` synchronous in `<head>` blocks the parser before First Paint, sitemap with 73 URLs and a single `lastmod`, `articleBody: post.excerpt` semantically wrong in `BlogPosting`
- **Qamera:** CLS 0.467 on `/marketplace/styles` from a client-side fetch from Airtable without reserved card dimensions, hardcoded EN strings in `root-metadata.ts` (PL/UK users got English OG on every marketing page), Merchant Listings false-positive on pricing

The shared finding set is the **first proof that the process is transferable**. I know plugin-based SEO scanners exist, and each of them on the two projects would have returned fundamentally different reports because each is bound to a specific platform. An agent audit on a neutral substrate - code - returns a universal picture.

## From audit to change proposal - when to bundle, when to split

Two projects, two different change-packaging strategies.

**The portfolio** got one change `seo-improvements` with five pillars in a single PR ([#2](https://github.com/plipowczan/portfolio/pull/2)). Single-maintainer, no risk of file conflicts, easier review of the whole - because the changes are logically related thematically.

**Qamera** got nine separate changes, eight PRs (#75/76/77/82/92/93/94/96), worked in parallel on git worktrees. Multi-developer, monorepo, disjoint file sets. Worktrees let each change have its own `node_modules` and its own dev server port - zero state conflict.

The decision criterion I use:

| Factor | One-PR (portfolio) | Multi-PR (Qamera) |
|---|---|---|
| Number of maintainers | 1 | 2+ |
| File conflict risk | low | high |
| Review cycle | self-review | peer review |
| Time spread | one afternoon | 5 working days |
| Rollback granularity | all or nothing | per-feature |
| Dev environment isolation | not needed | worktree + separate node_modules |

Common to both: every change = OPSX `proposal.md` + `design.md` + `specs/` + `tasks.md` **before** code. This isn't bureaucracy. It's a **feedback loop for AI**: reviewing a spec costs minutes, reviewing 200 lines of generated code in the wrong place costs hours. Spec-driven gives you a veto point before you pay the cost of implementation.

```text
## Tasks - seo-improvements

- [x] Move clickrank inline to requestIdleCallback (+ setTimeout fallback)
- [x] Generate dedicated raster logo (600×60 PNG via sharp)
- [x] Add publisher / dateModified / mainEntityOfPage to BlogPosting
- [x] Drop articleBody: excerpt (semantically wrong)
- [x] Build llms.txt / llms-full.txt generator (scripts/generate-llms-txt.js)
- [x] Replace X-XSS-Protection with Permissions-Policy + HSTS preload
- [x] Configure CSP Report-Only → Sentry Security Reports bucket
- [x] Per-page-type lastmod (post: frontmatter.modified, listing: max, legal: git mtime)
```

Each task in `tasks.md` is one unit of work with known scope and known verification. After implementation, the checkbox is proof the task was done - not a declaration.

## What transfers 1:1 (and why this is an argument for code)

Four things I implemented in identical patterns on portfolio and Qamera. Each would be hard or impossible on a closed platform.

### A. `llms.txt` as your own build-time artifact

The [llmstxt.org](https://llmstxt.org/) spec has existed since 2024 (Answer.AI / Jeremy Howard). In 2026 ChatGPT web search, Perplexity, Claude Search, and Gemini Deep Research respect it. The file is a shortened content index for LLMs, with an optional `llms-full.txt` containing the full content for single-token ingest.

On the portfolio I have `scripts/generate-llms-txt.js` running in `build:prerender`. It reads `src/content/blog/*.md` (PL + EN) via `gray-matter`, plus `src/data/projects.js`. It generates `public/llms.txt` (~16 KB index) and `public/llms-full.txt` (~800 KB full content with `\n\n---\n\n` separator).

```text
# Pawel Lipowczan

> Software architect and technology advisor...

## Blog (PL)
- [Title](url): one-line description
...

## Blog (EN)
- [Title](url): one-line description
...

## Contact
- email: ...
```

In Qamera a sibling script in the `apps/web` workspace generates `llms.txt` from marketing pages, blog posts, and public docs. The logic differs (data sources, section structure), but the pattern - a build-time generator following the spec - is identical.

**You won't do this in a panel:** a WordPress plugin can spit out a static `llms.txt`, but you won't integrate it with your CMS on your own terms (section order per language, fallbacks for missing `description`, pagination at 100+ articles).

### B. Schema enrichment - `articleBody: excerpt` is a semantic error

My old `BlogPosting` had six fields. Rich Results Test showed five non-critical warnings. After enrichment - eleven fields, zero warnings.

```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "description": "first 300 characters of content or frontmatter.description",
  "author": {
    "@type": "Person",
    "name": "Pawel Lipowczan",
    "url": "https://pawel.lipowczan.pl"
  },
  "datePublished": "2026-01-15T00:00:00Z",
  "dateModified": "2026-04-21T00:00:00Z",
  "image": "...",
  "url": "...",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "..." },
  "publisher": {
    "@type": "Organization",
    "name": "Pawel Lipowczan",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pawel.lipowczan.pl/logo-schema.png"
    }
  }
}
```

Three non-obvious details: `articleBody: post.excerpt` is **semantically wrong** (the spec requires the full body, not a summary) - I removed the field entirely. `publisher.logo` must be a **raster** (PNG 600×60), not SVG. ISO 8601 with `Z` or offset, not `2026-01-15` without a timezone. In Qamera the same set of changes hit `Article` on `/blog`, `Service` on `/offer/*`, and `Product` on `/pricing`.

**You won't do this in a panel:** SEO plugins set the top six fields. `mainEntityOfPage`, `publisher.logo` as a separate raster, ISO datetime, `description` with a fallback to the first paragraph - that's manual work in a schema generator.

### C. Hreflang at the sitemap level, not just `<head>`

Next.js `Metadata.alternates.languages` is a head-level signal. Google prefers **sitemap-level `xhtml:link`** for clustering language variants. In Qamera we solved it with a shared helper `buildLanguageAlternates(pathname)` used from two places - `sitemap.ts` and every page's `generateMetadata`.

```xml
<url>
  <loc>https://qamera.ai/pricing</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://qamera.ai/pricing"/>
  <xhtml:link rel="alternate" hreflang="pl" href="https://qamera.ai/pl/pricing"/>
  <xhtml:link rel="alternate" hreflang="uk" href="https://qamera.ai/uk/pricing"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://qamera.ai/pricing"/>
</url>
```

A drift-guard test in CI fails when someone adds a path to the sitemap but forgets to add `alternates` to `page.tsx`. It's a safeguard against silent regression - it's very easy to add a new landing and forget about its language variant.

**You won't do this in a panel:** Yoast generates hreflang in head. Sitemap-level requires editing the sitemap generator plus a drift-guard - i.e., CI code.

### D. AI bot allowlist - named rules instead of wildcard

`robots.txt` with separate blocks for `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, and `CCBot`. Wildcard = "no signal" - the bot interprets it conservatively. Named allow = "explicit yes" - the bot knows it can crawl and index for its pipeline.

**You won't do this in a panel:** WordPress writes to `robots.txt` via a plugin, but per-bot rules require editing the physical file - i.e., filesystem access you don't have on typical shared hosting.

## What's stack-specific (and what each project taught me separately)

### Portfolio - `async=true` on an inline script is a myth

This finding surprised me the most, because everyone gets it wrong. The `clickrank.ai` script in `<head>` looked like this:

```html
<script>
  var s = document.createElement('script');
  s.src = 'https://js.clickrank.ai/...';
  s.async = true;
  document.head.appendChild(s);
</script>
```

The trap: `async=true` applies to **fetching** the script, but the inline code that creates it executes **synchronously during HTML parsing**. It adds a microtask to the event loop before the browser renders anything.

Fix - `requestIdleCallback` plus a fallback for Safari 16.3 and older:

```html
<script>
  (function () {
    var inject = function () { /* current logic */ };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(inject, { timeout: 3000 });
    } else {
      setTimeout(inject, 2000);
    }
  })();
</script>
```

Verification after deploy to prod: `performance.getEntriesByType('resource').filter(r => r.name.match(/clickrank/))` → `startTime: 101.6ms`. The browser reported idle after ~100ms and only then fired the callback. Lighthouse lab variance stayed large (post: prod 38 → preview 61 → second run 43) - **lab score ≠ field data**. Real verification is CrUX from Google Search Console after 2-4 weeks.

### Qamera - CLS 0.467 → 0.016 via SSR initial grid

`/marketplace/styles` rendered style cards loaded client-side from Airtable. Without reserved dimensions, the grid layout shifted 4× over the failing threshold (0.467 vs target ≤ 0.1). Three options for the fix - SSR initial grid, reserved card dimensions, combined. We chose **SSR**: bonus for GEO (non-JS crawlers see the content) plus eliminating CLS at the source.

Result: **CLS 0.016** (27× improvement), LCP 2.4s → 1.6s. Post-deploy twist: PageSpeed Insights showed LCP 14.4s (cold Vercel function), Lighthouse MCP in parallel: 1.6s (warm). **A single PSI metric is sampling.** Always re-run or verify locally.

## A bug the audit wasn't looking for - and why this argues for regular audits

The portfolio's SEO audit surfaced a finding I didn't expect: hreflang alternates for the post `llm-knowledge-base-brain-karpathy` pointed to `/en/blog/<pl-slug>`, which returns "Post not found".

Root cause: the post was **PL-only** (no EN version), but its frontmatter had `alternateSlug: llm-knowledge-base-brain-karpathy` - pointing at itself. The result of an earlier iteration of the blog-article-writer skill that **auto-filled the field without validation**. The chain of events:

1. User on the PL post clicks the language switcher
2. `getAlternatePost(currentSlug)` returns... the same PL post
3. LanguageSwitcher builds `/en/blog/<pl-slug>` and navigates
4. `BlogPostPage` filters `getPostsByLang("en")` → no match → "Post not found"
5. The sitemap inherits this bug as bad hreflang and propagates to Google

A three-level fix: **data fix** (remove the field), **code defense** (`getAlternatePost` rejects self-reference and same-lang candidates), **process fix** (rule in `.claude/rules/data-storage/` plus updating the validator in the blog-article-writer skill).

The meta-lesson is strong: an SEO audit triggers bugs **that weren't its target**. I would never have found this without claude-seo. That's an argument for regular audits even on a small project.

The second meta-level - the bug was **introduced by an AI workflow** (the blog-article-writer skill), fixed by **another AI workflow** (audit + spec-driven fix + a rule in the skill). That's a self-correcting loop, provided there's a process. Without a process - the bug would have lived for weeks. A related thread on how an agent enforces its own standards I described in the [Karpathy LLM Wiki post](/en/blog/karpathy-llm-wiki-knowledge-base) and [Second Brain with Obsidian and Claude Code](/en/blog/second-brain-obsidian-claude-code-skills).

## Time compression is multiplicative, not additive

By the numbers:

- **Portfolio:** audit 15 min + 4h implementation + 30 min verification = **5h** for 5 changes
- **Qamera:** **5 working days** for 9 changes (seven planned plus two discovered along the way)
- **Second project = ~30% the time of the first** thanks to pattern transfer (llms.txt, schema enrichment, hreflang sitemap, AI bot allowlist)

Multiplier: **code-based stack × good AI workflow = hours**. Each on its own isn't enough. A code-based stack without a process = two weeks of manual work with forums and Stack Overflow. An AI workflow on a closed platform = you hit the plugin ceiling in half an hour. Together they yield 80-90% compression. That's not additive - it's multiplication. The argument for why I increasingly choose code-based solutions I also described in the [vibe coding guide](/en/blog/vibe-coding-guide).

Six takeaways from both projects:

1. **A code-based stack gives you the top 20% of control plugins don't** - and that's the range that wins positions today
2. **Spec-driven as a feedback loop for AI** - reviewing a spec costs minutes, reviewing 200 lines of code costs hours
3. **Transferable 1:1 between stacks:** llms.txt, schema enrichment, hreflang sitemap-level, AI bot allowlist
4. **Stack-specific:** every framework has its own performance traps and its own metadata API - that's where you save least
5. **The audit finds bugs outside its scope** - `alternateSlug === slug` was never on the list, I found it via claude-seo
6. **Second project = 30% the time of the first** - provided you document patterns

If you stay on WordPress, this article doesn't change your life. If you're considering moving to your own stack, it's the argument you needed.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Need an SEO + GEO audit on your own stack?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I do the same on client projects - from audit through spec-driven changes to post-deploy verification. We'll discuss your stack and a realistic scope in 30 minutes.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [llmstxt.org](https://llmstxt.org/) - llms.txt spec
- [securityheaders.com](https://securityheaders.com/) - security headers scanner
- [Rich Results Test](https://search.google.com/test/rich-results) - Google's structured data validator
- [PageSpeed Insights](https://pagespeed.web.dev/) - Core Web Vitals lab + field data
- [MDN - requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN - Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [Sentry Security Reports](https://docs.sentry.io/product/security-policy-reporting/) - CSP reports via Sentry
- [Google Search Central - Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Qamera AI](https://qamera.ai) - the project described in the case study

## FAQ

<details open>
<summary>

### Is every code-based site automatically better at SEO than WordPress?

</summary>

No - a code-based stack gives you **control**, not results. Without a process (audit → spec → execute → verify), you'll end up with a worse site than a well-configured WordPress with Yoast. The argument of this article is this: a code-based stack **lets you** optimize the top 20% (CSP, llms.txt, sitemap-level hreflang, schema enrichment) that platforms don't expose. Whether you use it depends on your workflow.

</details>

<details open>
<summary>

### What does spec-driven development mean in the context of SEO?

</summary>

Spec-driven means every change starts with artifacts: `proposal.md` (what and why), `design.md` (how), `specs/` (contracts), `tasks.md` (a list of steps) - **before** writing code. It works especially well in SEO because changes touch many layers (HTTP headers, HTML head, structured data, sitemap), and skipping the spec means AI generates 200 lines of code in the wrong place. I use the OpenSpec / OPSX workflow - details in a [separate article](/en/blog/opsx-workflow-structured-ai-work).

</details>

<details open>
<summary>

### Does llms.txt make sense in 2026 if my site isn't an AI tutorial?

</summary>

Yes, but the ROI is lower. `llms.txt` works strongest for content that LLMs cite (tutorials, documentation, case studies). For e-commerce or portfolio the impact is smaller but still positive - the cost is 100-200 lines of a Node script, the benefit is presence in ChatGPT, Perplexity, and Claude Search grounding. The `llms-full.txt` file gets heavy at 100+ articles - at that scale, paginate or use `top-articles-only`.

</details>

<details open>
<summary>

### How do I choose between one big PR and many small ones for SEO changes?

</summary>

Single-PR makes sense with a single maintainer and thematically coherent changes (like the portfolio: 5 SEO pillars in one PR, 4h of work). Multi-PR is necessary with multiple maintainers, monorepo, and parallel work (like Qamera: 9 changes, 8 PRs, 5 days). The criterion: do the changes touch the same files (conflict = split) and is reviewing the whole realistic in one pass (>500 lines diff = split).

</details>

<details open>
<summary>

### Does an AI workflow replace code review on SEO changes?

</summary>

No - it complements it. On Qamera, Copilot review on a PR caught three valid issues (placeholder Sentry DSN, missing preview env var, unused import) that the spec-driven workflow didn't catch. An AI workflow speeds up generating code that conforms to the spec, but a **second pair of eyes** (human or AI reviewer) still catches the difference between "the code does what the spec says" and "the code does what the spec says, in a way that's safe for production".

</details>
