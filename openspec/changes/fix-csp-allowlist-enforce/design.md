## Context

`vercel.json` serves a `Content-Security-Policy-Report-Only` header whose allowlist omits resources the site loads itself. Result: ~7,700 CSP violation reports/month POSTed to the Sentry `portfolio-csp` project, exhausting the 5,000-event plan quota.

The fix is to **correct the allowlist** so self-inflicted violations stop. We **keep Report-Only mode and reporting** on purpose: the site keeps working (Report-Only never blocks), and once noise is silenced, remaining reports are genuine anomaly signal. A Sentry-side guard caps the residual, uncontrollable client-injected noise.

**Resource audit.** The Sentry violation data is an *incomplete* picture of the site's real resource set — it only captures pages/flows visitors exercised. A code audit surfaced resources that produce few or zero reports today:

| Resource | Used by | Trigger | Directive |
|---|---|---|---|
| `fonts.googleapis.com` / `fonts.gstatic.com` | `src/styles/index.css` | every page | `style-src`, `font-src` |
| `js.clickrank.ai` | `index.html` loader | every page (connect) | `connect-src` (script-src already has it) |
| `app.zencal.io/js/embed.js` + booking iframe | `ZencalWidget.jsx` | widget mount | `script-src`, `frame-src`, `connect-src` |
| `formspree.io` | `ContactForm.jsx` `handleSubmit` | form submit (rare) | `connect-src` |
| `vercel.live` | Vercel preview toolbar | preview deploys | `script-src`, `frame-src` |

The current policy has **no `frame-src` directive**, so the Zencal iframe currently triggers a report (falls back to `default-src`). Avatar image (`meetendly.fra1.digitaloceanspaces.com`) is already covered by `img-src 'self' data: https:`.

Navigations to github/linkedin/mastodon/qamera/etc. are `<a href>`, not subresources — not CSP-restricted.

## Goals / Non-Goals

**Goals:**
- Correct the Report-Only allowlist to cover every resource the site actually loads (audit-derived), silencing self-inflicted reports.
- Keep Report-Only mode and reporting so genuine anomalies still surface as Sentry issues.
- Bound the residual, uncontrollable client-injected noise with a Sentry-side guard so it can never re-exhaust the quota.

**Non-Goals:**
- Promoting to an enforcing `Content-Security-Policy` (deferred to a future change once allowlist confidence is high).
- Removing reporting (`report-uri`/`report-to`/`Reporting-Endpoints`) — explicitly retained.
- Adding a Sentry browser error-monitoring SDK (none exists today).
- Tightening `'unsafe-inline'` on script/style (needs nonces via prerender — separate effort).

## Decisions

**1. Keep Report-Only + reporting; do not enforce.** *(User-confirmed.)*
Rationale: the allowlist fix alone removes ~99.7% of volume and solves the quota problem — enforcing is unnecessary for that goal. Report-Only keeps the site working unconditionally (no risk of blocking a missed resource for real users) while still surfacing anomalies as Sentry issues. The owner explicitly wants ongoing visibility ("I want to know when something like this happens"). Enforcing is a strictly larger, riskier step and is deferred.

**2. Build the allowlist from a code audit, not from Sentry violations.**
Rationale: violations under-report rarely-triggered flows (form submit, booking widget). We add all audited hosts so they become known-good and stop generating reports — leaving only genuine anomalies.

**3. Add an explicit `frame-src`.**
Today only `frame-ancestors 'none'` exists. Framed content (Zencal, Vercel preview toolbar) needs `frame-src 'self' https://app.zencal.io https://vercel.live`; otherwise it reports against `default-src`.

**4. Add a Sentry-side guard instead of touching CSP for residual noise.**
Residual reports come from client-injected resources (browser extensions, AI browsers — e.g. `frontend-cdn.perplexity.ai`) that the allowlist can never fix. Today ~2/month, but unbounded if a post goes viral across extension-laden browsers. Mitigate at the sink: an inbound filter for known junk hosts + spike protection / rate-limit on the `portfolio-csp` project. This protects the quota without sacrificing the anomaly signal. Alternative (drop reporting) rejected — loses the visibility the owner wants.

**5. Retain the Sentry ingest host in `connect-src`.**
It is the active report sink (`report-uri`/`report-to` target). Required as long as reporting stays.

Target Report-Only policy (single source for tasks/specs):

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.clickrank.ai https://vitals.vercel-insights.com https://va.vercel-scripts.com https://app.zencal.io https://vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://o4511257435308032.ingest.de.sentry.io https://js.clickrank.ai https://formspree.io https://app.zencal.io;
  frame-src 'self' https://app.zencal.io https://vercel.live;
  frame-ancestors 'none';
  report-uri https://o4511257435308032.ingest.de.sentry.io/api/4511257447432272/security/?sentry_key=35e235d76a965a67ed15c12671c3a01d;
  report-to csp-endpoint
```

`Reporting-Endpoints` response header and the `report-uri`/`report-to` directives are **unchanged** (retained).

## Risks / Trade-offs

- **Residual client-injected noise spikes (viral traffic).** → Mitigation: Sentry inbound filter + spike protection (Decision 4). Bounds the quota regardless of source.
- **A real new third-party resource appears later.** → This is the *desired* behaviour: it surfaces as a Sentry issue (Report-Only reports it, site still works), prompting an allowlist review. Exactly the visibility being preserved.
- **No hard enforcement yet — a malicious injected script would still execute.** → Accepted for this change; enforcing is the follow-up. Report-Only is unchanged from today's posture, only the noise is removed.
- **`'unsafe-inline'` remains on script/style.** → Out of scope; needs nonces. Documented as future hardening.

## Migration Plan

1. Update `vercel.json`: replace only the `Content-Security-Policy-Report-Only` value with the audited policy above. Header name, `report-uri`/`report-to`, and `Reporting-Endpoints` stay.
2. Update `tests/e2e/seo-security-headers.spec.js`: assert Report-Only retained, reporting retained, and corrected allowlist values present.
3. Push to a Vercel preview; run `npm test`.
4. After production deploy, confirm `portfolio-csp` event inflow drops to near-zero (only genuine anomalies remain).
5. In Sentry: resolve open issues; add inbound filter for known client-injected hosts; enable spike protection / rate-limit.

**Rollback:** revert the single `vercel.json` commit → previous policy returns. Low blast radius.

## Plan limitation (Sentry free plan)

The Sentry-side guard from Decision 4 (inbound filter + spike protection + DSN rate-limit) is **not available on the free plan** — custom inbound filters, delete-and-discard, spike protection, and per-key rate limits are all paid features. Tasks 3.2/3.3 are therefore **deferred (blocked-by-plan)**, not implemented.

Accepted risk: the allowlist correction alone removes ~99.7% of report volume (the self-inflicted fonts/clickrank noise). Post-fix residual is ~2 events/month from uncontrollable client-injected hosts (`frontend-cdn.perplexity.ai`, isolated as issue CSP-H) — far below the 5,000-event quota. The unbounded-viral-spike scenario remains unmitigated until either the plan is upgraded (enables the native guard) or report-uri is proxied through a rate-limiting Vercel function (separate change). Decision: accept and document; revisit if inflow rises.

## Open Questions

- Add defensive `base-uri 'self'` as cheap hardening? (Resolved: yes — added.)
- Which exact hosts to seed the Sentry inbound filter with beyond `frontend-cdn.perplexity.ai`? (Moot — inbound filters unavailable on free plan; see Plan limitation above.)
