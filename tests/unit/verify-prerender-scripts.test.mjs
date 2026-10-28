import { test } from "node:test";
import assert from "node:assert/strict";

import { findClickRankScripts } from "../../scripts/verify-prerender-output.mjs";

// ClickRank wjechał na każdą stronę dwiema drogami naraz: wstrzykiwacz w
// `index.html` i tag, który prerender utrwalił po jego uruchomieniu. Test
// karmi sprawdzenie sztucznym HTML-em, bo test czytający `dist/` mógłby się
// tylko pominąć (patrz tests/AGENTS.md).

const page = (head = "", body = "<main><h1>Strona</h1></main>") =>
  `<!DOCTYPE html><html lang="pl"><head><title>T</title>${head}</head><body>${body}</body></html>`;

const run = (html) => findClickRankScripts([{ file: "x/index.html", html }]);

test("czysta strona przechodzi", () => {
  assert.deepEqual(
    run(page('<script type="module" src="/assets/index-abc.js"></script>')),
    []
  );
});

test("tag utrwalony przez prerender łamie sprawdzenie i wskazuje plik", () => {
  const html = page(
    '<script src="https://js.clickrank.ai/seo/0000/script?1792171542411" async=""></script>'
  );
  assert.deepEqual(run(html), ["x/index.html"]);
});

test("wstrzykiwacz inline łamie sprawdzenie", () => {
  const html = page(`<script>
    (function () {
      var s = document.createElement("script");
      s.src = "https://js.clickrank.ai/seo/0000/script?" + new Date().getTime();
      document.head.appendChild(s);
    })();
  </script>`);
  assert.deepEqual(run(html), ["x/index.html"]);
});

test("wzmianka w JSON-LD artykułu nie jest skryptem", () => {
  const html = page(
    '<script type="application/ld+json">{"@type":"BlogPosting","articleBody":"Skrypt clickrank.ai w head"}</script>'
  );
  assert.deepEqual(run(html), []);
});

test("przykład kodu w treści artykułu nie jest skryptem", () => {
  const html = page(
    "",
    '<article><pre><code>s.src = "https://js.clickrank.ai/...";</code></pre><p>Skrypt clickrank.ai blokował parser.</p></article>'
  );
  assert.deepEqual(run(html), []);
});

test("zakomentowany tag nie jest skryptem", () => {
  const html = page('<!-- <script src="https://js.clickrank.ai/x"></script> -->');
  assert.deepEqual(run(html), []);
});
