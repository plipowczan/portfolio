# Design

## Context

See `proposal.md`. The page is `src/pages/LlmWikiLanding.jsx`; its copy is hard-coded Polish, there is no `src/locales` key for it, and there is no English version (`/en/llm-wiki` redirects to the PL page). So "one wording for every language version" is one wording.

Facts the copy has to respect:

- `api/subscribe.js` stores the address and returns 2xx. It sends nothing. The success screen is the only confirmation.
- The course (`/llm-wiki/kurs`, 8 lessons) is public. The page links to it below the form before signup and again on the success screen.
- The template repo is public; only its link is hidden until signup.
- Lesson 5 (`src/content/kurs/5-rozwoj-i-publikacja.md`) says the ready-made skills and the real-base extract are being prepared as **paid packs**. `CourseHub` and `CourseLesson` CTAs say "dam znać, gdy ruszą gotowe paczki wiedzy".
- The owner may later send a launch broadcast (`migrate-waitlist-to-resend`, tasks 8.x). That is why the copy must not depend on whether the broadcast has gone out.

## Goals / Non-Goals

**Goals:**

- One account of the list on every surface of the page: it delivers news about further materials, by email.
- A success screen that confirms the saved address and points at the course.
- Plain Polish per `.claude/rules/content/10-prosty-polski.md`: short sentences, no epithets, no borrowed word where a Polish one exists.

**Non-Goals:**

- A welcome or confirmation email. New scope, owner's decision.
- Reordering or restyling the success screen. Only strings change.
- Touching the course hub and lesson CTAs, which talk about paid packs and are accurate.

## Decisions

### D1. Describe the list by what it delivers, never by a launch event

"Gdy ruszy kurs" was true when the course was not public and is false now; "Kurs już ruszył" is true but is an announcement, not a confirmation, and says nothing about the list. Both tie the copy to a moment. "O kolejnych materiałach dam znać mailem" is true before and after the broadcast, and before and after any later launch.

### D2. Wording

| Place | Old | New |
| --- | --- | --- |
| Above the form | Zostaw maila - dostaniesz darmowy szablon i dam znać, gdy ruszy kurs i kolejne materiały. | Zostaw maila - zobaczysz od razu darmowy szablon, a o kolejnych materiałach dam znać mailem. |
| Success header | ✅ Jesteś na liście! | ✅ Adres zapisany! |
| Success text | Kurs już ruszył - a o kolejnych materiałach dam znać. Skoro już tu jesteś - zacznij od razu. Szablon jest darmowy i publiczny. | Zapisałem Twój adres - o kolejnych materiałach dam znać mailem. Szablon i kurs są darmowe i publiczne, więc możesz zacząć od razu. |
| Success closing line | Pełny przewodnik + akceleratory (gotowe skille, ekstrakt realnej bazy) będą w kursie. Odezwę się. | removed |
| Meta description (second sentence) | Zapisz się na listę - dam znać, gdy ruszy kurs i kolejne materiały. | Zapisz się na listę - dam znać o kolejnych materiałach. |

"Dostaniesz darmowy szablon" became "zobaczysz od razu": the template is a link on the success screen, not an attachment, and "dostaniesz" next to "mailem" reads as an email. The unchanged second sentence above the form ("Metoda, szablon i kurs są darmowe - …") is asserted by an existing test and stays.

### D3. The header names the fact, not the list

"Jesteś na liście" asks "which list?" now that no one is waiting for a launch. "Adres zapisany" states what happened. It costs three assertions (two e2e specs and the spec requirement), all updated here.

### D4. Do not promise that no email will come

The honest confirmation would also say "nie wyślę maila z potwierdzeniem". It is true today and false the day the owner adds a welcome mail, and nothing would flag the sentence. "Zapisałem Twój adres" is true either way, so the success screen says only that.

### D5. The closing line is removed, not rewritten

It had two defects. "Będą w kursie" is wrong for the accelerators (lesson 5 calls them paid packs) and the course is live. And what is still true in it, that news will come, is now in the paragraph above. A line that can go without losing information goes.

### D6. The spec is corrected where the page already differs from it

`llm-wiki-landing` says a visitor sees no link to `/llm-wiki/kurs` before signup. The page has linked to it, ungated, since commit `8ed283b` (the link into the site), and `llm-wiki-course.spec.js` already asserts exactly one such link before signup. The requirement is restated with the link as a fact, because the success-screen requirement is being rewritten anyway and leaving a known false scenario beside it would be a contradiction in one spec.

## Risks / Trade-offs

- **A visitor with a typo gets no mail and no way to notice.** "Adres zapisany" does not show the address, so a mistyped one is stored silently. Echoing the address on the success screen would let them catch it, at the price of holding it in component state after submit. Not done here; raise with the owner if bounces appear in the Audience.
- **Header text is asserted in two specs.** A later rewording has to touch both; they are listed in the tasks.
- **"Kolejne materiały" is vague by design.** It covers the paid packs and anything else. It makes no date or content promise, which is the point.
