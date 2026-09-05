## ADDED Requirements

### Requirement: The build enforces a JavaScript payload budget

`npm run build:prerender` SHALL compare the gzipped JavaScript required for the initial render of the homepage against a declared ceiling, and SHALL exit non-zero when the ceiling is exceeded. The ceiling and the measured value SHALL both appear in the build output, whether the check passes or fails.

The current build emits a single 2,417.80 kB chunk (779.92 kB gzipped) and reports it only as an advisory Rollup warning, which nothing acts on. A budget expressed as a build failure is what stops the payload from creeping back — and because `vercel.json` sets `buildCommand: "npm run build:prerender"`, it gates every deployment at no CI cost. This follows the rule already stated in this capability: a claim about the contents of `dist/` belongs to the build check, not to a Playwright spec that skips on a normal run.

#### Scenario: Payload exceeds the ceiling

- **WHEN** the prerender build finishes and the homepage's initial gzipped JavaScript exceeds the declared ceiling
- **THEN** the build exits non-zero
- **AND** the error reports the measured size and the ceiling

#### Scenario: Payload is within the ceiling

- **WHEN** the prerender build finishes and the payload is within the ceiling
- **THEN** the build succeeds
- **AND** reports the measured size and the ceiling

#### Scenario: Vercel deployment fails on a payload regression

- **WHEN** Vercel builds a deployment whose payload exceeds the ceiling
- **THEN** the deployment fails
- **AND** the failure is visible on the pull request before merge

#### Scenario: Ceiling is declared in one place

- **WHEN** a contributor needs to change the ceiling
- **THEN** it is edited in a single declared constant
- **AND** raising it is a visible change in the diff rather than a silent drift
