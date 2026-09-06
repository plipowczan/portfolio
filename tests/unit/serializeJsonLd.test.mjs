import { test } from "node:test";
import assert from "node:assert/strict";

import { serializeJsonLd } from "../../src/utils/serializeJsonLd.js";

// Treść bloku JSON-LD trafia do dokumentu dosłownie, a prerender zrzuca ją do
// pliku. Jeden nieuciekniety `<` wystarczy, żeby wartość ze schematu wyszła
// z elementu `<script>` i stała się znacznikami na produkcji.
//
// Ta ucieczka pękła już raz, po cichu: edycja zamieniła `\\u003c` na `\u003c`,
// czyli zwykły znak `<`, przez co `replace` stał się operacją pustą. Żaden
// test tego nie zauważył, bo prawdziwe schematy w repozytorium nie zawierają
// `<`. Dlatego test karmi funkcję danymi wrogimi, nie prawdziwymi.

test("żaden znak < nie przeżywa serializacji", () => {
  const json = serializeJsonLd({ name: "</script><img src=x onerror=alert(1)>" });

  assert.equal(json.includes("<"), false, "w wyniku został surowy <");
  assert.match(json, /\\u003c/, "brak ucieczki w wyniku");
});

test("nie da się zamknąć elementu script", () => {
  const json = serializeJsonLd({
    a: "</script >",
    b: "</SCRIPT>",
    c: { "klucz</script>": ["</script>"] },
  });

  assert.equal(/<\/script/i.test(json), false);
});

test("wartości wracają nietknięte po sparsowaniu", () => {
  const schema = {
    "@type": "Person",
    name: "</script>",
    math: "a < b && c > d",
    backslash: "C:\\ścieżka",
    nested: { "k<ey": ["<a>", "<b>"] },
  };

  assert.deepEqual(JSON.parse(serializeJsonLd(schema)), schema);
});

test("schemat bez znaku < wychodzi jak zwykły JSON.stringify", () => {
  const schema = { "@type": "FAQPage", name: "Pytania i odpowiedzi" };

  assert.equal(serializeJsonLd(schema), JSON.stringify(schema));
});
