## Purpose

The WCAG 2.2 AA floor that every surface of this site meets, stated once so it is a contract rather than a per-component judgement call: contrast for text and for interface components, minimum target size, motion that can be paused and that honours the system preference, announced status messages, and named landmarks.

## ADDED Requirements

### Requirement: Text meets AA contrast against its rendered background

Every piece of visible text that conveys meaning SHALL reach a contrast ratio of at least 4.5:1 against the background it is actually rendered on, or 3:1 where it qualifies as large text (18.66 px and bold, or 24 px and above).

The ratio SHALL be measured against the composited background, not against the nominal page colour. Several surfaces layer a translucent panel over the page ground, and a value computed against the wrong layer passes on paper while failing on screen.

Text that is purely decorative and hidden from assistive technology is exempt from this requirement. It remains subject to the legibility rule below.

#### Scenario: LLM Wiki section labels

- **WHEN** the file-name section labels on `/llm-wiki` and `/llm-wiki/kurs` are measured against their rendered background
- **THEN** each reaches at least 4.5:1

#### Scenario: Lesson ordinals

- **WHEN** the lesson number shown beside each lesson title is measured
- **THEN** it reaches at least 4.5:1, because it is the only ordering cue in the list

#### Scenario: Consent notice under the waitlist form

- **WHEN** the data-processing notice below the waitlist form is measured
- **THEN** it reaches at least 4.5:1

#### Scenario: No content text falls below the floor on any audited route

- **WHEN** every visible text node on `/`, `/blog`, `/llm-wiki`, `/llm-wiki/kurs` and `/en/` is measured at both a desktop and a phone viewport
- **THEN** no node that conveys meaning falls below its required ratio

### Requirement: Decorative framing stays legible without competing with content

Decorative text framing that is hidden from assistive technology SHALL still reach at least 3:1 against its background, and SHALL remain below the contrast of the content it frames.

The bracket motif on the LLM Wiki surfaces currently measures 2.60:1. It is formally exempt, but at that ratio it disappears on a bright screen — so the device that gives those pages their identity is invisible exactly where it is most needed. Both bounds matter: raising it to full content contrast would flatten the hierarchy and make the framing compete with the lesson titles.

#### Scenario: Bracket framing is visible

- **WHEN** the decorative bracket framing is measured against its background
- **THEN** it reaches at least 3:1

#### Scenario: Framing stays subordinate

- **WHEN** the framing's contrast is compared with the contrast of the title it frames
- **THEN** the framing is lower

### Requirement: Interface components meet non-text contrast

The visual boundary of an interactive component SHALL reach at least 3:1 against its adjacent background in its resting state, wherever that boundary is what identifies the component.

#### Scenario: Text inputs are identifiable at rest

- **WHEN** the border of any text input or textarea on the contact form or the waitlist form is measured in its resting state
- **THEN** it reaches at least 3:1

#### Scenario: Focus state does not substitute for the resting state

- **WHEN** an input's resting boundary is assessed
- **THEN** it meets the ratio on its own, independently of the focused appearance

#### Scenario: Consent controls carry equal visual weight

- **WHEN** the cookie banner's accept and reject controls are compared
- **THEN** both boundaries reach at least 3:1
- **AND** neither control is given less visual prominence than the other

### Requirement: Interactive targets meet the minimum size

Every interactive target SHALL present a hit area of at least 24×24 CSS pixels, except where the target is inline within a sentence of text.

That is the WCAG 2.2 AA minimum (SC 2.5.8). The 44×44 of SC 2.5.5 is Level AAA, which this change lists as a non-goal; four named controls are taken to 44×44 anyway by the requirement below, as a deliberate comfort decision rather than a conformance one.

The hit area, not the painted graphic, is what SHALL be measured — a small visual indicator with generous padding satisfies this, and is often the right answer where the design calls for a small mark.

#### Scenario: No target falls below the floor on any audited route

- **WHEN** every interactive target on `/`, `/blog`, `/llm-wiki`, `/llm-wiki/kurs` and `/en/` is measured at both a desktop and a phone viewport
- **THEN** no target that is not inline within a sentence falls below 24×24 CSS pixels

### Requirement: Small graphic controls are comfortable to hit

A control whose target is a small graphic with no text to widen its box SHALL present a hit area of at least 44×44 CSS pixels.

The AA floor above is met by a 24×24 box, which still leaves an 8 px dot fiddly on a phone. These four controls carry no label text that would grow the box on its own, so they are raised deliberately.

#### Scenario: Carousel position indicators

- **WHEN** each testimonial position indicator is measured
- **THEN** its hit area is at least 44×44 CSS pixels at every viewport
- **AND** its painted indicator may remain smaller

#### Scenario: Carousel arrows

- **WHEN** the previous and next controls are measured at a phone viewport
- **THEN** each is at least 44×44 CSS pixels

#### Scenario: Footer social links

- **WHEN** each footer social link is measured
- **THEN** its hit area is at least 44×44 CSS pixels
- **AND** adjacent links do not overlap

#### Scenario: Banner close control

- **WHEN** the cookie banner's close control is measured
- **THEN** it is at least 44×44 CSS pixels

### Requirement: Automatically moving content can be paused

Content that starts moving, scrolling, or updating automatically, runs for more than five seconds, and is presented alongside other content SHALL offer a mechanism to pause, stop, or hide it. That mechanism SHALL be operable by keyboard.

#### Scenario: Keyboard focus pauses the carousel

- **WHEN** any carousel control holds keyboard focus for longer than one advance interval
- **THEN** the carousel has not advanced

#### Scenario: A pause control is available

- **WHEN** the testimonials section is displayed
- **THEN** a visible control that stops the automatic advance is present
- **AND** it is reachable and operable by keyboard

#### Scenario: Pointer pause still works

- **WHEN** a pointer hovers the carousel
- **THEN** it does not advance, as it already does today

### Requirement: Automatic motion honours the system preference

Where a visitor has requested reduced motion, decorative animation SHALL NOT run continuously. A static presentation SHALL be shown in place of the animation, preserving whatever the animation conveys rather than removing the element.

This applies to canvas-driven backgrounds as well as to element transitions. The site's central motion configuration covers component animation; a hand-written animation loop is outside it and has to honour the preference itself.

#### Scenario: Homepage background under reduced motion

- **WHEN** the homepage is loaded with `prefers-reduced-motion: reduce`
- **THEN** the hero background renders a single static frame
- **AND** no continuous animation frame loop is running

#### Scenario: Background survives a viewport change under reduced motion

- **WHEN** the viewport is resized or the device is rotated with reduced motion requested
- **THEN** the static background is redrawn rather than left blank

#### Scenario: Carousel does not auto-advance under reduced motion

- **WHEN** the testimonials section is displayed with reduced motion requested
- **THEN** it does not advance automatically
- **AND** its manual controls still work

#### Scenario: Decorative canvases are hidden from assistive technology

- **WHEN** a purely decorative canvas background is inspected
- **THEN** it is hidden from assistive technology

### Requirement: Status messages and late-appearing notices are announced

Content that appears without a change of context, and that asks the visitor to act or reports the outcome of an action, SHALL be announced to assistive technology without moving focus.

#### Scenario: Cookie banner announces itself

- **WHEN** the cookie banner appears after its delay
- **THEN** it is exposed as a named region and announced politely
- **AND** focus is not moved away from wherever the visitor was

#### Scenario: Carousel slide changes are announced

- **WHEN** the displayed testimonial changes
- **THEN** the change is announced politely rather than silently replacing the text

### Requirement: Landmarks and states are named

Where more than one landmark of the same type exists on a page, each SHALL carry a distinguishing accessible name. A navigation SHALL indicate which of its links refers to the current page. A control that exposes a value SHALL expose that value to assistive technology, not only visually.

#### Scenario: Every navigation landmark is named

- **WHEN** the landmarks on any page are enumerated
- **THEN** each navigation carries a distinguishing accessible name, the primary site navigation included

#### Scenario: Current page is marked

- **WHEN** the primary navigation is rendered on a route it links to
- **THEN** that link is marked as the current page

#### Scenario: Level meters expose their value

- **WHEN** a skill level meter is rendered
- **THEN** its value and range are exposed to assistive technology

### Requirement: Full-height sections fit the visible viewport on mobile

A section sized to fill the screen SHALL be measured against the visible viewport, not against the largest possible viewport.

On mobile browsers the classic viewport-height unit resolves to the height with the browser chrome retracted, so a full-height hero measured that way overflows behind a visible URL bar and pushes its call to action out of the first screen.

#### Scenario: Hero fits the first screen on a phone

- **WHEN** a full-height hero section is rendered at a phone viewport with browser chrome visible
- **THEN** the section's primary call to action is within the visible viewport

#### Scenario: No horizontal overflow is introduced

- **WHEN** every audited route is rendered at a phone viewport
- **THEN** the document does not scroll horizontally
