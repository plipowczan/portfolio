# worktree-port-isolation Specification

## Purpose

Gives every git worktree its own dev and preview ports, derived from where the checkout lives.

The repository is developed across several worktrees. With hardcoded ports two of them cannot test or prerender at the same time — and, worse, `reuseExistingServer` lets a run in one worktree attach to another worktree's server and pass while exercising the wrong application. A silent false green is the failure this capability exists to remove.

## Requirements

### Requirement: Ports derive from the working directory

The dev-server port and the preview-server port SHALL be derived deterministically from the absolute path of the working directory, and SHALL fall within a range that does not collide with well-known local services.

The derivation removes per-worktree collisions without requiring configuration a contributor must remember to create — an untracked config file would leave every fresh worktree back at the original problem.

#### Scenario: Two worktrees

- **WHEN** the dev server or preview server starts in two different worktrees of this repository
- **THEN** each receives its own dev port and its own preview port

#### Scenario: Same worktree, repeated runs

- **WHEN** a command runs twice in the same working directory
- **THEN** it resolves to the same ports both times

#### Scenario: Fresh worktree

- **WHEN** a new worktree is created and a command is run in it
- **THEN** ports resolve without any manual setup, configuration file, or environment variable

#### Scenario: A fixed port is required

- **WHEN** external tooling needs to aim at a known address
- **THEN** an explicit environment override takes precedence over the derived value

### Requirement: One source of port truth

A single shared module SHALL be the only place where port numbers are computed. `vite.config.js`, `playwright.config.js` and `scripts/prerender.mjs` SHALL consume it, and no port literal SHALL remain in `package.json` scripts or in test files.

#### Scenario: Dev and preview servers

- **WHEN** `npm run dev`, `npm run preview` or `npm run preview:test` starts
- **THEN** the port comes from the shared module
- **AND** no `--port` flag is present in the `package.json` script

#### Scenario: Playwright targets

- **WHEN** the Playwright configuration resolves `baseURL` and its `webServer` URLs
- **THEN** both come from the shared module

#### Scenario: Prerender target

- **WHEN** `scripts/prerender.mjs` builds the URL it navigates to
- **THEN** the base URL comes from the shared module rather than a hardcoded literal

#### Scenario: Test files

- **WHEN** a test needs an absolute local URL
- **THEN** it resolves that URL from the shared module or from `baseURL`, not from a hardcoded `localhost:` literal

#### Scenario: Readiness detection in tooling

- **WHEN** a script waits for a server to report itself ready
- **THEN** it matches against the derived port rather than a written-out number

### Requirement: A run never silently uses a foreign server

A test run SHALL either serve the working directory it was started from, or fail loudly. It SHALL NOT report success while exercising an application served by a different worktree.

#### Scenario: Another worktree is serving

- **WHEN** a run starts in worktree A while worktree B has its own servers running
- **THEN** the run in A starts or reuses servers on A's own ports
- **AND** the assertions execute against A's application

#### Scenario: The derived port is occupied by an unrelated process

- **WHEN** the derived port is already taken by something that is not this worktree's server
- **THEN** startup fails with an error naming the port
- **AND** the run does not silently continue against whatever answers on that port
