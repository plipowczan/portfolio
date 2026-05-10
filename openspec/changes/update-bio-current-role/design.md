## Context

Pure content change — text rewrites in 3 files (2 translation JSON, 1 docs template). No architectural decisions, no new dependencies, no migration. Design doc exists only to lock in editorial decisions before tasks, so the writer (me on apply, or the user on review) doesn't drift.

## Goals / Non-Goals

**Goals:**
- Settle paragraph structure (how many paragraphs, what each one covers).
- Lock final PL and EN copy so apply is mechanical paste, not creative writing.
- Decide schema JSON-LD `worksFor` question.
- Decide `<meta description>` retune question.

**Non-Goals:**
- Rewriting blog post bodies (out of scope, see proposal).
- Updating `.claude/skills/` or other agent-facing files (follow-up).
- Visual or layout changes to About section.
- Adding new sections to the home page (e.g. dedicated Qamera AI block).

## Decisions

### Decision 1: Paragraph structure (3 paragraphs, same as today)

Keep the existing 3-paragraph structure rendered by `src/components/sections/About.jsx`:
- **paragraph1** — "who I am, what I do now"
- **paragraph2** — "where I came from"
- **paragraph3** — "how I work / philosophy"

This is the cleanest mapping to the user's three-part identity (current role / history / operating principle). No need to introduce paragraph4 or merge.

### Decision 2: Final PL copy

```
about.paragraph1:
"Cześć! Jestem Paweł — niezależny konsultant w zakresie optymalizacji procesów
biznesowych i wykorzystania technologii oraz współzałożyciel i CTO w Qamera AI.
Qamera AI to wirtualne studio fotograficzne dla marek e-commerce (głównie
fashion — swimwear, bielizna), które zastępuje kosztowne sesje produktowe
generatywnym AI: użytkownik klika i zatwierdza, a agent AI sam komponuje zdjęcia
i wideo produktowe."

about.paragraph2:
"Moja droga w IT zaczęła się w 2008 roku od programowania w .NET i SQL Server.
Przez lata rozwijałem systemy medyczne, byłem CTO w startupie ShareFund,
zarządzałem projektami IT, a wcześniej jako Technical Lead w Tigers/Automation
House współtworzyłem ponad 100 wdrożeń automatyzacji dla klientów. Dziś łączę
doświadczenie programistyczne z nowoczesnymi narzędziami automatyzacji i AI."

about.paragraph3:
"Działam według prostej zasady: kluczowa jest analiza i procesy, technologia
jest wtórna. Najpierw rozumiem problem, potem dobieram narzędzia. Pracuję
z Make, n8n, Airtable, Pythonem, modelami AI (Claude, OpenAI) i wieloma innymi
technologiami — ale narzędzie zawsze idzie za procesem, nie odwrotnie. Dzielę
się wiedzą poprzez konsultacje, warsztaty i artykuły techniczne na blogu."
```

### Decision 3: Final EN copy

```
about.paragraph1:
"Hi! I'm Paweł — an independent consultant in business process optimization
and technology, and co-founder and CTO at Qamera AI. Qamera AI is a virtual
photo studio for e-commerce brands (focused on fashion — swimwear, lingerie)
that replaces expensive product photo shoots with generative AI: the user
clicks and approves while an AI agent composes product photos and videos."

about.paragraph2:
"My path in IT started in 2008 with .NET and SQL Server programming. Over
the years I built medical systems, served as CTO at the ShareFund startup,
managed IT projects, and earlier — as Technical Lead at Tigers/Automation
House — co-led over 100 automation deployments for clients. Today I combine
programming experience with modern automation and AI tooling."

about.paragraph3:
"I operate by a simple rule: analysis and processes come first, technology
is secondary. I understand the problem before picking the tools. I work
with Make, n8n, Airtable, Python, AI models (Claude, OpenAI) and many other
technologies — but the tool always follows the process, not the other way
around. I share knowledge through consulting, workshops, and technical
articles on the blog."
```

### Decision 4: Add `worksFor` to Person schema

**Yes, add** `worksFor: { "@type": "Organization", "name": "Qamera AI", "url": "<qamera-ai-url-if-known-else-omit>" }` to the JSON-LD Person object on the home page. Rationale:
- Entity disambiguation: tells Google there's a real org behind the bio, strengthens E-E-A-T.
- Cost: 5 lines of JSON, zero runtime impact.
- Risk: low — `worksFor` is standard schema.org property.

URL: **`https://qamera.ai`** (confirmed public). Final shape:

```json
"worksFor": {
  "@type": "Organization",
  "name": "Qamera AI",
  "url": "https://qamera.ai"
}
```

### Decision 5: Retune `<meta description>` in `index.html`

**No retune.** Current value:
> "Architekt oprogramowania i doradca ds. technologii - agnostyczny dobór narzędzi do problemu, optymalizacja procesów biznesowych przez automatyzację i inteligentne rozwiązania no-code oraz AI."

Reads cleanly with the new bio. "Doradca ds. technologii" = consultant. "Agnostyczny dobór narzędzi" = the new philosophy. No mention of stale employer. Leaving alone avoids invalidating any current SERP snippet Google may already be testing.

### Decision 6: Update README template

The freshly created `docs/seo/github-profile-readme-template.md` mentions "Technical Lead at Tigers/Automation House" in the "Co robię" / "What I do" bullet list of both variants. The replacement uses an explicit linked bullet so visitors can click through to Qamera AI directly:

**PL variant — bullet w sekcji "🛠 Co robię":**

```markdown
- **CTO i współzałożyciel [Qamera AI](https://qamera.ai)** — wirtualne studio fotograficzne dla marek e-commerce (głównie fashion: swimwear, bielizna), które zastępuje kosztowne sesje produktowe generatywnym AI.
- **Niezależny konsulting** — optymalizacja procesów biznesowych i dobór technologii. Wcześniej Technical Lead w Tigers/Automation House (~100 wdrożeń automatyzacji).
```

**EN variant — bullet in "🛠 What I do" section:**

```markdown
- **CTO and co-founder of [Qamera AI](https://qamera.ai)** — virtual photo studio for e-commerce brands (focused on fashion: swimwear, lingerie) that replaces expensive product photo shoots with generative AI.
- **Independent consulting** — business process optimization and technology selection. Previously Technical Lead at Tigers/Automation House (~100 automation deployments).
```

These two bullets replace the existing `Technical leadership` bullet and any line mentioning Tigers/AH as current role.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Bio paragraph length grows (Qamera description adds ~50 words) — could overflow About section visually | About.jsx renders text with no length cap; paragraphs already comparable length. Visual check on preview. |
| Polish copy uses "swimwear, bielizna" — code-switching looks odd | Keep — "swimwear" is industry term in Polish e-commerce; "bielizna" is the natural Polish word for lingerie. |
| Translation drift between PL and EN over time | Both variants edited in same change, same review pass. Future updates: keep PL ↔ EN parity on every edit. |
| Adding `worksFor` to schema reveals Qamera AI before it's officially public | If Qamera is stealth-mode, omit `worksFor` for now — easy revert. Confirm with user before apply. |

## Migration Plan

1. Edit `src/locales/pl/home.json` (3 paragraph keys).
2. Edit `src/locales/en/home.json` (3 paragraph keys).
3. Edit `docs/seo/github-profile-readme-template.md` (2 places per variant).
4. Edit JSON-LD generator to add `worksFor: { name: "Qamera AI" }`.
5. Run `npm run build:prerender` locally — verify dist/index.html contains new About text and Person schema with worksFor.
6. Visual check: `npm run preview`, navigate to home, confirm About section renders cleanly and at expected length.
7. Commit, push, deploy.

Rollback: revert commit. Trivial.

## Open Questions

(Resolved during design phase.)

- ~~Qamera AI public URL?~~ → **`https://qamera.ai`** (confirmed).
- ~~Stealth mode concern?~~ → Not stealth; OK to mention publicly (confirmed).
