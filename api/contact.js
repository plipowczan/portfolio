/**
 * Contact form endpoint (Vercel Node function).
 *
 * Delivers a message from the contact form on `/` to the site owner's inbox
 * through Resend. Runs server-side so the Resend API key and the recipient
 * address never reach the browser. Called via same-origin `POST /api/contact`,
 * so it is covered by CSP `connect-src 'self'`.
 *
 * Contract:
 *  - POST only (else 405).
 *  - Non-empty honeypot (`gotcha`) → 200 without sending (silent bot drop).
 *  - Invalid or oversized field → 400 (Resend not called).
 *  - Missing server config → 500 (fails closed — never a fake success).
 *  - Email accepted by Resend → 200.
 *  - Upstream failure (network or non-2xx) → 502.
 *
 * Uses only global `fetch` (Node 18+) — no `resend` npm dependency.
 */

// Same anchored pattern as api/subscribe.js — see the note there.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_EMAILS_URL = "https://api.resend.com/emails";

const LIMITS = { name: 200, email: 254, subject: 200, message: 10000 };
const MESSAGE_MIN = 10;
const SUBJECT_TAG = "[pawel.lipowczan.pl]";
const DEFAULT_SUBJECT = "Wiadomość z formularza kontaktowego";

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

// A header field must stay one line, whatever the transport does with it.
const oneLine = (value) => value.replace(/\s*[\r\n]+\s*/g, " ");

/** Returns the cleaned fields, or null when any of them is invalid. */
function validate({ name, email, subject, message }) {
  if (typeof name !== "string" || typeof email !== "string") return null;
  if (typeof message !== "string") return null;
  if (subject != null && typeof subject !== "string") return null;

  const fields = {
    name: oneLine(name.trim()),
    email: email.trim(),
    subject: oneLine((subject ?? "").trim()),
    message: message.trim(),
  };

  if (!fields.name || fields.name.length > LIMITS.name) return null;
  if (fields.email.length > LIMITS.email || !EMAIL_RE.test(fields.email)) return null;
  if (fields.subject.length > LIMITS.subject) return null;
  if (fields.message.length < MESSAGE_MIN || fields.message.length > LIMITS.message) {
    return null;
  }
  return fields;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = parseBody(req.body);

  // Honeypot: real visitors leave `gotcha` empty. A filled value = bot.
  // Return a success-shaped response so the bot gets no signal it was filtered.
  if (typeof body.gotcha === "string" && body.gotcha.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  const fields = validate(body);
  if (!fields) {
    return res.status(400).json({ error: "Invalid message" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FORM_FROM;
  const to = process.env.CONTACT_FORM_TO;
  if (!apiKey || !from || !to) {
    // Misconfiguration must not look like success to the client.
    console.error("contact: server not configured");
    return res.status(500).json({ error: "Server not configured" });
  }

  const subject = fields.subject || DEFAULT_SUBJECT;
  const text = [
    `Imię i nazwisko: ${fields.name}`,
    `E-mail: ${fields.email}`,
    `Temat: ${subject}`,
    "",
    fields.message,
  ].join("\n");

  try {
    const resendRes = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: fields.email,
        subject: `${SUBJECT_TAG} ${subject}`,
        text,
      }),
    });

    if (resendRes.ok) {
      return res.status(200).json({ ok: true });
    }

    // Status only: the message content stays out of the logs.
    console.error(`contact: Resend responded ${resendRes.status}`);
    return res.status(502).json({ error: "Upstream error" });
  } catch (err) {
    console.error(`contact: Resend unreachable (${err?.name ?? "Error"})`);
    return res.status(502).json({ error: "Upstream unreachable" });
  }
}
