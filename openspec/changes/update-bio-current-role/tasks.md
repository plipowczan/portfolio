## 1. Pre-flight checks

- [x] 1.1 Qamera AI public URL: **`https://qamera.ai`** (confirmed during design).
- [x] 1.2 Qamera AI is public, not stealth (confirmed during design).

## 2. Update Polish translations

- [x] 2.1 Open `src/locales/pl/home.json`.
- [x] 2.2 Replace `about.paragraph1` with the locked PL copy from `design.md` Decision 2.
- [x] 2.3 Replace `about.paragraph2` with the locked PL copy from `design.md` Decision 2.
- [x] 2.4 Replace `about.paragraph3` with the locked PL copy from `design.md` Decision 2.
- [x] 2.5 Validate JSON syntax (`node -e "JSON.parse(require('fs').readFileSync('src/locales/pl/home.json','utf8'))"`).

## 3. Update English translations

- [x] 3.1 Open `src/locales/en/home.json`.
- [x] 3.2 Replace `about.paragraph1` with the locked EN copy from `design.md` Decision 3.
- [x] 3.3 Replace `about.paragraph2` with the locked EN copy from `design.md` Decision 3.
- [x] 3.4 Replace `about.paragraph3` with the locked EN copy from `design.md` Decision 3.
- [x] 3.5 Validate JSON syntax (`node -e "JSON.parse(require('fs').readFileSync('src/locales/en/home.json','utf8'))"`).

## 4. Update JSON-LD Person schema

- [x] 4.1 Locate the JSON-LD Person generator (likely `src/utils/schemaGenerators.js` or similar — grep for `"@type":"Person"` and `Software Architect`).
- [x] 4.2 Add `worksFor: { "@type": "Organization", "name": "Qamera AI", "url": "https://qamera.ai" }` to the Person object.
- [x] 4.3 Verify the generator runs at prerender time — no runtime regression.

## 5. Update GitHub profile README template

- [x] 5.1 Open `docs/seo/github-profile-readme-template.md`.
- [x] 5.2 In the **PL variant**, in section "🛠 Co robię", replace the existing "Technical leadership" bullet (current role line mentioning Tigers/Automation House) with these two bullets, exactly as written in `design.md` Decision 6:
  ```markdown
  - **CTO i współzałożyciel [Qamera AI](https://qamera.ai)** — wirtualne studio fotograficzne dla marek e-commerce (głównie fashion: swimwear, bielizna), które zastępuje kosztowne sesje produktowe generatywnym AI.
  - **Niezależny konsulting** — optymalizacja procesów biznesowych i dobór technologii. Wcześniej Technical Lead w Tigers/Automation House (~100 wdrożeń automatyzacji).
  ```
- [x] 5.3 In the **EN variant**, in section "🛠 What I do", replace the existing "Technical leadership" bullet with these two bullets, exactly as written in `design.md` Decision 6:
  ```markdown
  - **CTO and co-founder of [Qamera AI](https://qamera.ai)** — virtual photo studio for e-commerce brands (focused on fashion: swimwear, lingerie) that replaces expensive product photo shoots with generative AI.
  - **Independent consulting** — business process optimization and technology selection. Previously Technical Lead at Tigers/Automation House (~100 automation deployments).
  ```
- [x] 5.4 Verify in both variants: no remaining standalone mention of "Technical Lead at Tigers" / "Technical Lead w Tigers" outside the past-tense "Previously" / "Wcześniej" framing.

## 6. Local verification

- [x] 6.1 Run `npm run build:prerender`. Build must succeed.
- [x] 6.2 Open `dist/index.html` (PL home). Confirm About text contains "niezależny konsultant", "Qamera AI", "wirtualne studio fotograficzne".
- [x] 6.3 Open `dist/en/index.html` (EN home). Confirm About text contains "independent consultant", "Qamera AI", "virtual photo studio".
- [x] 6.4 Grep `dist/index.html` and `dist/en/index.html` for "Jako Technical Lead w Tigers" / "As a Technical Lead at Tigers" — must return zero matches.
- [x] 6.5 Grep prerendered HTML for `worksFor` — must contain `"name":"Qamera AI"`.
- [ ] 6.6 `npm run preview`, navigate to `/` and `/en/`. Visual check: About section renders cleanly, no overflow, paragraphs balanced.

## 7. Deploy

- [ ] 7.1 Commit with message `content(home): update bio to current role (consultant + CTO Qamera AI)`.
- [ ] 7.2 Push, let Vercel build preview.
- [ ] 7.3 On preview URL, repeat checks 6.2 – 6.6 against live preview.
- [ ] 7.4 Promote to production.

## 8. Post-deploy follow-up

- [ ] 8.1 In Google Search Console → URL Inspection → request re-indexing of `/` and `/en/` (so Google sees the new bio sooner).
- [ ] 8.2 Update LinkedIn profile headline / About section to match (manual, outside this repo).
- [ ] 8.3 Schedule a follow-up cleanup change for `.claude/skills/portfolio-copywriting/` and other agent-facing files referencing Tigers/AH (low priority — not user-facing).
