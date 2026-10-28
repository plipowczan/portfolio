# Review record — remove-clickrank-and-align-policies

## Round 1 — 2026-10-28 — reviewed 8d718d6

No findings. The changes consistently remove ClickRank, update the policy disclosures, and replace render-time legal dates with fixed, timezone-safe dates.

Codex reviewed without a repository review policy: there is no `REVIEW.md` and no `AGENTS.md` pointer to one or to this record, so default severities (`P0`–`P2` important) applied.

Checks: none run for this round — it made no code change. The reviewed commit had passed `npm run test:unit` (35/35) and `npm test` on chromium and Mobile Chrome (456 passed, 26 skipped, 1 flaky that passed on retry: the `/llm-wiki` landing check in `llm-wiki-course.spec.js`, a timeout under load, in code this change does not touch).
