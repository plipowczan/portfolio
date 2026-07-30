# performance-image-loading Specification

## Purpose
Which images the browser is told to fetch immediately and which to defer, so that lazy-loading speeds up the long tail of blog cards without delaying the one image each page's Largest Contentful Paint depends on.
## Requirements
### Requirement: Off-screen blog card images are deferred

The blog index renders 30 cards, of which one is above the fold on a phone. Every card image except the first SHALL carry `loading="lazy"`. The first card SHALL instead carry `loading="eager"` and `fetchPriority="high"`, because it is the largest element painted in the initial viewport and lazy-loading it would delay the very paint that Largest Contentful Paint measures.

#### Scenario: Polish blog index

- **WHEN** a crawler fetches the prerendered HTML of `/blog`
- **THEN** exactly one card image carries `loading="eager"`
- **AND** every remaining card image carries `loading="lazy"`

#### Scenario: English blog index

- **WHEN** a crawler fetches the prerendered HTML of `/en/blog`
- **THEN** the same split applies — one eager image, the rest lazy

#### Scenario: Priority hint accompanies the eager image

- **WHEN** the first card is rendered
- **THEN** it carries `fetchPriority="high"` alongside `loading="eager"`
- **AND** no other card image carries a high priority hint, which would dilute it

### Requirement: Article cover image is not deferred

The cover image of a blog post SHALL load eagerly with `fetchPriority="high"`. It is the post's Largest Contentful Paint candidate, so deferring it moves the browser's discovery of the image behind layout and makes the metric strictly worse — the opposite of what lazy-loading is for.

#### Scenario: Blog post cover

- **WHEN** a crawler fetches the prerendered HTML of any blog post that has a cover image
- **THEN** the cover carries `loading="eager"` and `fetchPriority="high"`
- **AND** does not carry `loading="lazy"`

