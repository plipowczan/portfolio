## ADDED Requirements

### Requirement: The course is reachable from site navigation

The course SHALL be reachable from the site's primary navigation and from the
footer's quick links on Polish routes. It SHALL NOT be reachable only through the
sitemap.

The existing "Course section is PL-only with EN paths redirected" requirement
governs what happens to `/en` paths. This requirement governs the opposite side:
that a Polish reader has a path in at all.

Because the course exists only in Polish, English routes SHALL omit the entry
rather than link it with an `/en` prefix — a link that would only resolve through
a redirect, and would send an English reader into Polish content.

This is stated as a contract because its absence was the original defect: ten
course URLs shipped with no inbound internal link from anywhere on the site, and
nothing failed. A navigation refactor that drops the entry must be a spec
violation, not a silent regression.

#### Scenario: Polish route offers the course in navigation

- **WHEN** a visitor is on any Polish route
- **THEN** the primary navigation contains an entry leading to `/llm-wiki`
- **AND** the footer's quick links contain the same destination

#### Scenario: English route omits the entry rather than redirecting

- **WHEN** a visitor is on any `/en` route
- **THEN** neither the primary navigation nor the footer offers the course
- **AND** no `/en/llm-wiki` URL is presented as a link

#### Scenario: The course landing is reachable, not only the hub

- **WHEN** a crawler or visitor requests `/en/llm-wiki`
- **THEN** it is redirected to `/llm-wiki`

#### Scenario: Switching language from the course does not enter a redirect

- **WHEN** a visitor on a `/llm-wiki` path uses the language switch
- **THEN** they land on the English homepage
- **AND** they are not sent to a URL whose only resolution is a redirect

### Requirement: The free course is reachable from the waitlist landing

The waitlist landing SHALL offer a visible path to the course without requiring a
signup first. The signup form SHALL remain the landing's primary call to action,
and the post-signup success screen SHALL keep its own link to the course.

#### Scenario: Course link is visible before signing up

- **WHEN** a visitor loads `/llm-wiki` and has not submitted the form
- **THEN** a link to `/llm-wiki/kurs` is visible on the page

#### Scenario: Signup remains the primary action

- **WHEN** the landing is rendered
- **THEN** the signup form is still the page's primary call to action

#### Scenario: Success screen keeps its own link

- **WHEN** a visitor completes the signup form
- **THEN** the success screen still offers its own link to the course
