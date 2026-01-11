# Vercel Testing

## Preview Deployments
Every Pull Request gets a unique preview URL. Use this for:
- User Acceptance Testing (UAT)
- Visual regression testing (against preview URL)
- Sharing progress with stakeholders

## E2E on Preview
Configure CI (GitHub Actions) to wait for Vercel deployment and run Playwright tests against the preview URL.
