/**
 * Waitlist subscribe endpoint (Vercel Node function).
 *
 * Captures a `/llm-wiki` signup into a Resend Audience. Runs server-side so the
 * Resend API key never reaches the browser. Called via same-origin
 * `POST /api/subscribe`, so it is covered by CSP `connect-src 'self'`.
 *
 * Contract:
 *  - POST only (else 405).
 *  - Non-empty honeypot (`company`) → 200 without storing (silent bot drop).
 *  - Invalid/missing email → 400 (Resend not called).
 *  - Missing server config → 500 (fails closed — never a fake success).
 *  - New contact created OR already exists → 2xx (idempotent).
 *  - Upstream failure (network or non-2xx) → 502.
 *
 * Uses only global `fetch` (Node 18+) — no `resend` npm dependency.
 */

const EMAIL_RE = /\S+@\S+\.\S+/;
const RESEND_CONTACTS_URL = (audienceId) =>
  `https://api.resend.com/audiences/${audienceId}/contacts`;

function parseBody(raw) {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = parseBody(req.body);
  const { email, company } = body;

  // Honeypot: real users leave `company` empty. A filled value = bot.
  // Return a success-shaped response so the bot gets no signal it was filtered.
  if (typeof company === "string" && company.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    // Misconfiguration must not look like success to the client.
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    const resendRes = await fetch(RESEND_CONTACTS_URL(audienceId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim(), unsubscribed: false }),
    });

    if (resendRes.ok) {
      return res.status(200).json({ ok: true });
    }

    // Duplicate contact must resolve to success (idempotent — no signal leak).
    const detail = await resendRes.text().catch(() => "");
    if (/already exist|duplicate|conflict/i.test(detail)) {
      return res.status(200).json({ ok: true });
    }

    return res.status(502).json({ error: "Upstream error" });
  } catch {
    return res.status(502).json({ error: "Upstream unreachable" });
  }
}
