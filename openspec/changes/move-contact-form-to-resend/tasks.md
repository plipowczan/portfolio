## 1. Contact endpoint

- [x] 1.1 Write `tests/unit/contact.test.mjs` first, in the style of `subscribe.test.mjs`: valid message (one Resend call to `/emails`, from, to, reply_to, subject tag, body fields), empty subject defaulted, invalid and oversized fields, line breaks collapsed in the subject, non-POST 405 with `Allow`, honeypot 200 without a call, each missing variable 500 without a call, upstream non-2xx and network failure 502, no key or recipient in any response body; verify it fails because `api/contact.js` does not exist
- [x] 1.2 Implement `api/contact.js` per design D1–D6 (global `fetch`, no dependency, fail closed, status-only `console.error`); verify `node --test tests/unit/contact.test.mjs` and `npm run test:unit` pass
- [x] 1.3 Add `CONTACT_FORM_FROM` and `CONTACT_FORM_TO` to `.env.example` with placeholders and a server-only note, and drop the commented Formspree `VITE_FORM_ENDPOINT` line there and in `.claude/rules/10-setup.md`; verify `grep -ri formspree .env.example .claude/rules` returns nothing
- [x] 1.4 DOX: `api/AGENTS.md` describes two functions and carries the contact status contract and its verification command; verify every path it cites exists

## 2. Contact form

- [x] 2.1 Rewrite the submit and feedback tests in `tests/e2e/contact-form.spec.js` to mock same-origin `**/api/contact`, assert the POST body (name, email, subject defaulted, message, empty `gotcha`), the success message with cleared fields, the error message with kept fields on a 500, no request to `formspree.io`, and no request when a required field is empty; verify they fail against the Formspree form
- [x] 2.2 Point `src/components/sections/ContactForm.jsx` at `/api/contact`, add the `gotcha` honeypot after the submit button (off-screen, `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`, label `contact.honeypotLabel` in `src/locales/{pl,en}/home.json`) and `maxLength` matching D4 on the inputs; verify the `contact-form` spec passes on the default projects
- [x] 2.3 Run `home` and `a11y-baseline`, the other specs mapped to `src/components/sections/**` and `src/locales/**`; verify they pass

## 3. CSP

- [x] 3.1 Remove `https://formspree.io` from `connect-src` in `vercel.json` and invert its expectation in `tests/e2e/seo-security-headers.spec.js`; verify `grep -c formspree vercel.json` is 0, the file parses as JSON, and `third-party-scripts` (which reads the CSP from `vercel.json`) passes; `seo-security-headers` skips without `SEO_HEADERS_URL` and runs against the PR's Vercel deployment

## 4. Privacy policy

- [x] 4.1 In `src/locales/{pl,en}/legal.json` drop the Formspree item from §7, name Resend for the LLM Wiki list and contact-form delivery, renumber the items, and list Vercel, Google and Resend in the transfer sentence; update the item list in `src/pages/PrivacyPolicy.jsx` if it enumerates keys; verify `/privacy-policy` and `/en/privacy-policy` render with no missing key
- [x] 4.2 Set `LAST_UPDATED` and `@sitemapUpdated` in `src/pages/PrivacyPolicy.jsx` to the day the copy changes and refresh `public/sitemap.xml`; verify `npm run blog:sitemap` passes
- [x] 4.3 In `tests/e2e/policy-pages.spec.js` drop Formspree from the names the privacy policy must carry and assert neither policy names it; verify `policy-pages` passes on the default projects
- [x] 4.4 Run the plain-Polish gate from `.claude/rules/content/10-prosty-polski.md` on the changed PL copy; verify no hit in prose
- [x] 4.5 Replace the Formspree contact-form backend line in `docs/PRD.md`; verify `grep -n -i formspree docs/PRD.md` returns nothing

## 5. Integration

- [x] 5.1 Verify `grep -rni formspree src api vercel.json tests` finds only the absence guards in `contact-form`, `policy-pages` and `seo-security-headers`
- [x] 5.2 Run `npm run build:prerender`; verify it passes, including the sitemap date check
- [ ] 5.3 Rebase onto `main` once PR #56 has merged, open a non-draft PR listing the two Vercel variables to set and the Preview test message, and run `openspec validate move-contact-form-to-resend`; verify the PR checks, Vercel included, are green
