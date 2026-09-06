## ADDED Requirements

### Requirement: Structured data is scoped to the page that declares it

Structured data is page metadata and SHALL follow the same rule this capability
already applies to descriptions and canonicals: what a document serves belongs to
that document. Every JSON-LD block a page serves SHALL be declared by the route
being rendered, and SHALL be emitted through the same route-scoped metadata path
as the rest of the document head, so that leaving a route removes what that route
declared.

A page SHALL NOT serve a block declared only by another route, and SHALL NOT
serve the same block more than once.

This is the same class of defect the capability's canonical requirement guards
against — metadata that belongs to one page appearing on another — applied to the
one part of the head that currently escapes it.

#### Scenario: A page with no structured data of its own

- **WHEN** a crawler fetches a route whose page declares no structured data, such
  as `/privacy-policy`
- **THEN** the document contains no JSON-LD block belonging to another route

#### Scenario: Navigating away from a route that declares structured data

- **WHEN** a visitor moves from a route that declares a structured-data block to
  one that does not
- **THEN** the block declared by the first route is no longer present in the
  document

#### Scenario: A localised route

- **WHEN** a crawler fetches `/en/` and the Polish and English homepages both
  declare the same entity
- **THEN** the document contains that entity exactly once
