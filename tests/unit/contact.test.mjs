import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import handler from "../../api/contact.js";

// --- test doubles -----------------------------------------------------------

const ENV = {
  RESEND_API_KEY: "re_test_key_do_not_use",
  CONTACT_FORM_FROM: "Formularz <sender@example.test>",
  CONTACT_FORM_TO: "inbox@example.test",
};
Object.assign(process.env, ENV);

let fetchCalls;
let errorLogs;
const realFetch = globalThis.fetch;
const realConsoleError = console.error;

function stubFetch(impl) {
  globalThis.fetch = async (url, opts) => {
    fetchCalls.push({ url, opts });
    return impl(url, opts);
  };
}

function okResendResponse() {
  return { ok: true, status: 200, text: async () => JSON.stringify({ id: "e_1" }) };
}

function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end() {
      return this;
    },
  };
}

const VALID = {
  name: "Jan Kowalski",
  email: "jan@example.com",
  subject: "Automatyzacja procesów",
  message: "Dzień dobry, chciałbym porozmawiać o wdrożeniu.",
  gotcha: "",
};

const post = (body) => ({ method: "POST", body });
const sentPayload = () => JSON.parse(fetchCalls[0].opts.body);

beforeEach(() => {
  fetchCalls = [];
  errorLogs = [];
  stubFetch(okResendResponse);
  console.error = (...args) => errorLogs.push(args);
});

afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realConsoleError;
});

// --- scenarios --------------------------------------------------------------

test("valid message → one Resend email to the configured inbox, 200", async () => {
  const res = mockRes();
  await handler(post(VALID), res);

  assert.equal(fetchCalls.length, 1, "Resend must be called once");
  const { url, opts } = fetchCalls[0];
  assert.equal(url, "https://api.resend.com/emails");
  assert.equal(opts.method, "POST");
  assert.equal(opts.headers.Authorization, "Bearer re_test_key_do_not_use");

  const sent = sentPayload();
  assert.equal(sent.from, ENV.CONTACT_FORM_FROM);
  assert.deepEqual(sent.to, [ENV.CONTACT_FORM_TO]);
  assert.equal(sent.reply_to, VALID.email, "Reply goes to the visitor");
  assert.equal(sent.subject, `[pawel.lipowczan.pl] ${VALID.subject}`);
  for (const value of [VALID.name, VALID.email, VALID.subject, VALID.message]) {
    assert.ok(sent.text.includes(value), `body carries ${JSON.stringify(value)}`);
  }
  assert.equal(sent.html, undefined, "plain text only");
  assert.equal(res.statusCode, 200);
});

test("fields are trimmed before they are sent", async () => {
  const res = mockRes();
  await handler(post({ ...VALID, name: "  Jan  ", email: " jan@example.com " }), res);

  const sent = sentPayload();
  assert.equal(sent.reply_to, "jan@example.com");
  assert.ok(sent.text.includes("Jan\n"), "trimmed name in the body");
  assert.equal(res.statusCode, 200);
});

test("empty or missing subject → default subject, still sent", async () => {
  for (const subject of [undefined, null, "", "   "]) {
    fetchCalls = [];
    const res = mockRes();
    await handler(post({ ...VALID, subject }), res);
    assert.equal(fetchCalls.length, 1, `sent for subject ${JSON.stringify(subject)}`);
    assert.equal(
      sentPayload().subject,
      "[pawel.lipowczan.pl] Wiadomość z formularza kontaktowego"
    );
    assert.equal(res.statusCode, 200);
  }
});

test("missing or malformed fields → 400, Resend NOT called", async () => {
  const bad = [
    { name: undefined },
    { name: "" },
    { name: "   " },
    { name: 42 },
    { email: undefined },
    { email: "" },
    { email: "nieprawidlowy" },
    { email: "x@@y.com" },
    { email: "a b@c.com" },
    { email: "x@y" },
    { email: 42 },
    { message: undefined },
    { message: "" },
    { message: "za krótko" },
    { message: "   krótko   " },
    { message: 1234567890 },
    { subject: 42 },
  ];
  for (const override of bad) {
    fetchCalls = [];
    const res = mockRes();
    await handler(post({ ...VALID, ...override }), res);
    assert.equal(fetchCalls.length, 0, `no Resend call for ${JSON.stringify(override)}`);
    assert.equal(res.statusCode, 400, `400 for ${JSON.stringify(override)}`);
  }
});

test("fields over their limit → 400; fields at their limit are accepted", async () => {
  const atLimit = {
    name: "n".repeat(200),
    email: `${"e".repeat(242)}@example.com`, // 254 characters
    subject: "s".repeat(200),
    message: "m".repeat(10000),
  };
  const overLimit = {
    name: "n".repeat(201),
    email: `${"e".repeat(243)}@example.com`, // 255 characters
    subject: "s".repeat(201),
    message: "m".repeat(10001),
  };

  for (const [field, value] of Object.entries(atLimit)) {
    fetchCalls = [];
    const res = mockRes();
    await handler(post({ ...VALID, [field]: value }), res);
    assert.equal(res.statusCode, 200, `${field} at its limit is accepted`);
  }
  for (const [field, value] of Object.entries(overLimit)) {
    fetchCalls = [];
    const res = mockRes();
    await handler(post({ ...VALID, [field]: value }), res);
    assert.equal(fetchCalls.length, 0, `no Resend call for an oversized ${field}`);
    assert.equal(res.statusCode, 400, `${field} over its limit → 400`);
  }
});

test("line breaks never reach a header field", async () => {
  const res = mockRes();
  await handler(
    post({
      ...VALID,
      name: "Jan\r\nBcc: victim@example.com",
      subject: "Pytanie\r\nBcc: victim@example.com\nX-Test: 1",
    }),
    res
  );

  const sent = sentPayload();
  for (const field of ["from", "reply_to", "subject"]) {
    assert.doesNotMatch(sent[field], /[\r\n]/, `${field} is a single line`);
  }
  assert.ok(sent.to.every((addr) => !/[\r\n]/.test(addr)), "to is a single line");
  assert.equal(sent.subject, "[pawel.lipowczan.pl] Pytanie Bcc: victim@example.com X-Test: 1");
  assert.equal(res.statusCode, 200);
});

test("JSON string body is parsed", async () => {
  const res = mockRes();
  await handler(post(JSON.stringify(VALID)), res);
  assert.equal(fetchCalls.length, 1);
  assert.equal(res.statusCode, 200);
});

test("non-POST method → 405 with Allow, Resend NOT called", async () => {
  for (const method of ["GET", "PUT", "DELETE"]) {
    fetchCalls = [];
    const res = mockRes();
    await handler({ method, body: VALID }, res);
    assert.equal(res.statusCode, 405, `${method} → 405`);
    assert.equal(res.headers.allow, "POST");
    assert.equal(fetchCalls.length, 0);
  }
});

test("non-empty honeypot → 200, Resend NOT called", async () => {
  const res = mockRes();
  await handler(post({ ...VALID, gotcha: "http://spam.example" }), res);
  assert.equal(fetchCalls.length, 0, "bot submission must not reach Resend");
  assert.equal(res.statusCode, 200);
});

test("each missing server variable → 500 (fails closed), Resend NOT called", async () => {
  for (const name of Object.keys(ENV)) {
    fetchCalls = [];
    delete process.env[name];
    const res = mockRes();
    await handler(post(VALID), res);
    process.env[name] = ENV[name];
    assert.equal(res.statusCode, 500, `missing ${name} → 500`);
    assert.equal(fetchCalls.length, 0);
  }
});

test("upstream Resend failure (non-2xx) → 502, logged", async () => {
  stubFetch(() => ({ ok: false, status: 403, text: async () => "forbidden" }));
  const res = mockRes();
  await handler(post(VALID), res);
  assert.equal(res.statusCode, 502);
  assert.equal(errorLogs.length, 1, "failure is logged once");
  assert.ok(
    !JSON.stringify(errorLogs).includes(VALID.message),
    "the log carries no message content"
  );
});

test("upstream unreachable (fetch throws) → 502, logged", async () => {
  stubFetch(() => {
    throw new Error("network down");
  });
  const res = mockRes();
  await handler(post(VALID), res);
  assert.equal(res.statusCode, 502);
  assert.equal(errorLogs.length, 1, "failure is logged once");
});

test("no response body ever contains the API key or the recipient", async () => {
  const cases = [
    () => okResendResponse(),
    () => ({ ok: false, status: 500, text: async () => "boom" }),
    () => {
      throw new Error("network down");
    },
  ];
  for (const impl of cases) {
    stubFetch(impl);
    const res = mockRes();
    await handler(post(VALID), res);
    const body = JSON.stringify(res.body ?? {});
    assert.ok(!body.includes(ENV.RESEND_API_KEY), "no API key in the response");
    assert.ok(!body.includes(ENV.CONTACT_FORM_TO), "no recipient in the response");
  }
});
