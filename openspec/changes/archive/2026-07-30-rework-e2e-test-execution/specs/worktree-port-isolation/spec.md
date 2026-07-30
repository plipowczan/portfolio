## ADDED Requirements

### Requirement: Ports derive from the working directory

The dev-server port and the preview-server port SHALL be derived deterministically from the absolute path of the working directory, and SHALL fall within a range that does not collide with well-known local services.

The repository is developed across multiple git worktrees. Hardcoded ports make two worktrees mutually exclusive for testing and prerendering, and the derivation removes that without requiring per-worktree configuration a contributor must remember to create.

#### Scenario: Two worktrees

- **WHEN** the dev server or preview server starts in two different worktrees of this repository
- **THEN** each receives its own dev port and its own preview port

#### Scenario: Same worktree, repeated runs

- **WHEN** a command runs twice in the same working directory
- **THEN** it resolves to the same ports both times

#### Scenario: Fresh worktree

- **WHEN** a new worktree is created and a command is run in it
- **THEN** ports resolve without any manual setup, configuration file, or environment variable

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

- **WHEN** a test needs an absolute local URL, as `policy-pages.spec.js` and `seo-metadata-invariants.spec.js` do today
- **THEN** it resolves that URL from the shared module or from `baseURL`, not from a hardcoded `localhost:` literal

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
