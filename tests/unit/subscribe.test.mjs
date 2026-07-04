import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import handler from "../../api/subscribe.js";

// --- test doubles -----------------------------------------------------------

process.env.RESEND_API_KEY = "re_test_key_do_not_use";
process.env.RESEND_AUDIENCE_ID = "aud_test_123";

let fetchCalls;
const realFetch = globalThis.fetch;

function stubFetch(impl) {
  globalThis.fetch = async (url, opts) => {
    fetchCalls.push({ url, opts });
    return impl(url, opts);
  };
}

function okResendResponse() {
  return { ok: true, status: 201, text: async () => JSON.stringify({ id: "c_1" }) };
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

const post = (body) => ({ method: "POST", body });

beforeEach(() => {
  fetchCalls = [];
  stubFetch(okResendResponse);
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

// --- scenarios --------------------------------------------------------------

test("valid new email → Resend called, 2xx", async () => {
  const res = mockRes();
  await handler(post({ email: "new@example.com", source: "waitlist", company: "" }), res);

  assert.equal(fetchCalls.length, 1, "Resend must be called once");
  const { url, opts } = fetchCalls[0];
  assert.match(url, /audiences\/aud_test_123\/contacts$/);
  assert.equal(opts.headers.Authorization, "Bearer re_test_key_do_not_use");
  const sent = JSON.parse(opts.body);
  assert.equal(sent.email, "new@example.com");
  assert.equal(sent.unsubscribed, false);
  assert.ok(res.statusCode >= 200 && res.statusCode < 300, `2xx, got ${res.statusCode}`);
});

test("duplicate via 409 status (generic body) → 2xx", async () => {
  stubFetch(() => ({ ok: false, status: 409, text: async () => "{}" }));
  const res = mockRes();
  await handler(post({ email: "dupe@example.com", company: "" }), res);

  assert.equal(fetchCalls.length, 1);
  assert.ok(res.statusCode >= 200 && res.statusCode < 300, `409 → 2xx, got ${res.statusCode}`);
});

test("duplicate via message fallback (non-409 status) → 2xx", async () => {
  stubFetch(() => ({ ok: false, status: 422, text: async () => "Contact already exists" }));
  const res = mockRes();
  await handler(post({ email: "dupe2@example.com", company: "" }), res);

  assert.ok(res.statusCode >= 200 && res.statusCode < 300, `message fallback → 2xx, got ${res.statusCode}`);
});

test("missing / invalid email → 4xx, Resend NOT called", async () => {
  for (const bad of [undefined, "", "nieprawidlowy", "no-at-sign", "x@@y.com", "a b@c.com", "x@y", 42]) {
    fetchCalls = [];
    const res = mockRes();
    await handler(post({ email: bad, company: "" }), res);
    assert.equal(fetchCalls.length, 0, `no Resend call for ${JSON.stringify(bad)}`);
    assert.ok(res.statusCode >= 400 && res.statusCode < 500, `4xx for ${JSON.stringify(bad)}, got ${res.statusCode}`);
  }
});

test("non-POST method → 405, Resend NOT called", async () => {
  for (const method of ["GET", "PUT", "DELETE"]) {
    fetchCalls = [];
    const res = mockRes();
    await handler({ method, body: { email: "x@example.com" } }, res);
    assert.equal(res.statusCode, 405, `${method} → 405`);
    assert.equal(fetchCalls.length, 0);
  }
});

test("non-empty honeypot → 2xx, Resend NOT called", async () => {
  const res = mockRes();
  await handler(post({ email: "bot@example.com", company: "Acme Corp" }), res);
  assert.equal(fetchCalls.length, 0, "bot submission must not reach Resend");
  assert.ok(res.statusCode >= 200 && res.statusCode < 300, `honeypot → 2xx, got ${res.statusCode}`);
});

test("upstream Resend failure (non-2xx) → 5xx", async () => {
  stubFetch(() => ({ ok: false, status: 500, text: async () => "boom" }));
  const res = mockRes();
  await handler(post({ email: "x@example.com", company: "" }), res);
  assert.ok(res.statusCode >= 500, `upstream fail → 5xx, got ${res.statusCode}`);
});

test("upstream unreachable (fetch throws) → 5xx", async () => {
  stubFetch(() => {
    throw new Error("network down");
  });
  const res = mockRes();
  await handler(post({ email: "x@example.com", company: "" }), res);
  assert.ok(res.statusCode >= 500, `network throw → 5xx, got ${res.statusCode}`);
});

test("response body never contains the API key", async () => {
  const res = mockRes();
  await handler(post({ email: "x@example.com", company: "" }), res);
  assert.ok(
    !JSON.stringify(res.body ?? {}).includes(process.env.RESEND_API_KEY),
    "API key must never appear in the response body"
  );
});

test("missing server config → 5xx (fails closed, not fake success)", async () => {
  const key = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const res = mockRes();
  await handler(post({ email: "x@example.com", company: "" }), res);
  process.env.RESEND_API_KEY = key;
  assert.ok(res.statusCode >= 500, `missing config → 5xx, got ${res.statusCode}`);
  assert.equal(fetchCalls.length, 0);
});
