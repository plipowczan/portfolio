## Why

The site's About paragraph and several derived assets state "Technical Lead w Tigers/Automation House" as the current role. That role ended several months ago. The current professional identity is: independent consultant (process optimization & technology) + co-founder/CTO at Qamera AI. Stale bio causes ongoing miscommunication (recurring "I keep hearing about Automation House" issue) and weakens trust signals for visitors checking who they'd be hiring.

## What Changes

- Rewrite `about.paragraph1` (PL + EN) in `src/locales/{pl,en}/home.json` to state the current dual role:
  - Independent consultant (own brand = first name + last name) for business process optimization and technology.
  - Co-founder & CTO at Qamera AI — virtual photo studio for e-commerce brands (focus: fashion — swimwear, lingerie), replacing expensive product photo sessions with generative AI; the user clicks and approves while an AI agent composes product photos and videos.
- Rewrite `about.paragraph3` (or paragraph2/3 split, decided in design) to lead with the philosophy "analysis & processes first, technology second" — the current operating principle.
- Preserve historical Tigers/Automation House mention in **one** sentence as past experience ("previously Technical Lead at Tigers/Automation House, ~100 automation deployments"), so testimonials and blog case studies remain coherent.
- Update `docs/seo/github-profile-readme-template.md` (PL + EN variants) to match the new bio.
- **Out of scope (intentionally not changed):**
  - Blog post bodies that reference Automation House (`kazda-firma-dziala-nieoptymalnie.md`, `dane-jako-paliwo-biznesu.md`, `chatboty-ai-od-koncepcji-do-wdrozenia.md`, `airtable-vs-excel-migracja.md`, `zapier-vs-make-vs-n8n-wybor-narzedzia.md` and EN counterparts) — these are time-bound case studies; rewriting them destroys authenticity.
  - `src/data/testimonials.js` `company: "Automation House"` field — testimonials carry the role/company at time of issuance. Industry standard.
  - `.claude/skills/portfolio-copywriting/` and other agent-facing files referencing Tigers/AH — follow-up cleanup, not user-facing.
  - `public/llms-full.txt` — auto-generated from sources; will refresh on next build.

## Capabilities

### New Capabilities

- `site-bio`: textual identity claims on the home page (About section paragraphs, headline taglines) that describe the current professional role of the site owner. Establishes which roles MUST be present in the live bio and which must NOT.

### Modified Capabilities

(none)

## Impact

- **Content files (live):**
  - `src/locales/pl/home.json` — `about.paragraph1`, possibly `about.paragraph2`/`paragraph3` rewrite.
  - `src/locales/en/home.json` — same.
- **Documentation:**
  - `docs/seo/github-profile-readme-template.md` — update both PL and EN variants.
- **Code changes (minor, schema-only):** `src/pages/Home.jsx` — extend the existing inline JSON-LD `Person` object with `worksFor: { "@type": "Organization", "name": "Qamera AI" }` to strengthen entity disambiguation for the new role. React components (`About.jsx`, etc.) continue to read from translation keys; their JSX structure is unchanged.
- **SEO impact:** prerendered HTML body and DOM tree are unchanged (text-only swap inside translated paragraphs). The `Person` JSON-LD gains a `worksFor` property — additive, no removals — which sharpens the entity graph signal sent to Google/AI search without affecting Core Web Vitals or rendering.
- **`<meta description>` in `index.html`:** currently "Architekt oprogramowania i doradca ds. technologii…". Reads OK with the new role too (it's role-agnostic). Decision deferred to design.md whether to retune.
