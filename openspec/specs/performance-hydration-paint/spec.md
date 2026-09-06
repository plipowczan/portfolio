# performance-hydration-paint Specification

## Purpose

Keeps hydration from undoing the prerender: content the server already painted stays painted when React takes over, so entrance animation never becomes the thing that delays first paint.

## Requirements

### Requirement: Hydration does not hide content the prerenderer painted

An element rendered visible in the prerendered HTML SHALL remain visible when the application hydrates. Hydration SHALL NOT reset an already-painted element to a hidden or transparent state in order to animate it into view.

Measured on the current homepage: the hero heading ships from `dist/` with `opacity: 1`, hydration sets it to `opacity: 0` roughly 380 ms later, and it returns to full opacity at about 1.45 s. The visitor sees the largest text on the site vanish and fade back, and Largest Contentful Paint — which disregards zero-opacity elements — is measured against the end of the animation rather than against the paint that already happened. The prerender is doing correct work that hydration then discards.

#### Scenario: Hero heading stays visible through hydration

- **WHEN** the homepage is loaded and its opacity is sampled continuously from navigation commit until two seconds after
- **THEN** the hero heading's computed opacity is never below its prerendered value at any sample

#### Scenario: Above-the-fold content is not re-animated on first load

- **WHEN** any route is entered by direct navigation
- **THEN** no element that the prerendered HTML rendered visible plays an entrance animation

#### Scenario: Largest Contentful Paint is not gated by animation

- **WHEN** Largest Contentful Paint is measured on the homepage
- **THEN** it is not deferred by an entrance animation on the element that produced it

### Requirement: Entrance animation is reserved for client-side navigation

Entrance animation for above-the-fold content SHALL play when a route is entered by in-page navigation, where nothing has been prerendered for that transition and no first paint is at stake.

The animation is not being deleted; it is being confined to the case where it costs nothing. Stating this keeps a later contributor from reading the first-load rule as "remove the motion".

#### Scenario: Client-side navigation animates

- **WHEN** a visitor navigates to a route from within the site
- **THEN** that route's above-the-fold entrance animation plays

#### Scenario: Reduced motion still wins

- **WHEN** a visitor with `prefers-reduced-motion: reduce` navigates within the site
- **THEN** the entrance animation is suppressed, as the site-wide motion preference already requires

### Requirement: Below-the-fold scroll animations are unchanged

Content that animates on scroll SHALL keep doing so. This requirement governs the first painted screen only.

#### Scenario: Scroll-triggered sections still animate

- **WHEN** a visitor scrolls a section below the fold into view
- **THEN** that section plays its scroll-triggered entrance animation
