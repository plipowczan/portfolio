## MODIFIED Requirements

### Requirement: Growing knowledge-graph background, reduced-motion safe

The landing SHALL render an ambient node-graph canvas that accretes nodes over time. The canvas SHALL be decorative (`aria-hidden`).

The original requirement added "without mutating the shared `NetworkBackground` used elsewhere". That clause existed to stop the landing's growth behaviour from changing the homepage, at a time when the only way to get it was to fork the component. The fork then gained a reduced-motion branch, an `aria-hidden` and a resize repaint that were never carried back, so the homepage kept an unbounded animation loop that ignores the system preference — the outcome the clause was written to prevent, arriving by the route it left open.

One parameterised component reaches the same guarantee by construction: the landing's growth is opt-in through props, and the homepage cannot silently inherit it. What the clause protected is therefore stated directly instead.

#### Scenario: Canvas present

- **WHEN** the landing renders
- **THEN** a `canvas` element with `aria-hidden="true"` is present

#### Scenario: Reduced motion honored

- **WHEN** the user agent reports `prefers-reduced-motion: reduce`
- **THEN** the graph renders a single static frame and does not animate or spawn new nodes

#### Scenario: Growth is opt-in, not inherited

- **WHEN** the shared background component is rendered without growth parameters, as on the homepage
- **THEN** it seeds an ambient field sized to the viewport and does not accrete nodes
