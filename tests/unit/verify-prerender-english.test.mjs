import { test } from "node:test";
import assert from "node:assert/strict";

import {
  findPolishInEnglishPages,
  readPolishBookingStrings,
} from "../../scripts/verify-prerender-output.mjs";

// Strona angielska, która wyszła z polskim tytułem, to dokładnie to, co
// wyjechało na produkcję: `/en/` miał polski <title> i og:title przy
// angielskim opisie, a sekcja rezerwacji była zaszyta po polsku. Test karmi
// sprawdzenie sztucznym HTML-em, bo test czytający `dist/` mógłby się tylko
// pominąć (patrz tests/AGENTS.md), a pominięty test wygląda jak zielony.

const BOOKING_PL = ["Umów spotkanie", "Zarezerwuj Bezpłatną Konsultację"];

/** Minimalna strona z pełnym kompletem pól, które sprawdzenie czyta. */
const page = ({
  title = "Pawel Lipowczan | Your Tech Guide",
  description = "Software architect and technology advisor.",
  body = "<main><h2>Book a meeting</h2></main>",
} = {}) => `<!DOCTYPE html><html lang="en"><head>
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="twitter:title" content="${title}">
</head><body>${body}</body></html>`;

const run = (pages, allowedTerms = []) =>
  findPolishInEnglishPages(pages, BOOKING_PL, allowedTerms);

test("czysta strona angielska przechodzi", () => {
  assert.deepEqual(run([{ file: "en/index.html", html: page() }]), []);
});

test("polski tytuł strony angielskiej łamie sprawdzenie i wskazuje plik", () => {
  const problems = run([
    {
      file: "en/index.html",
      html: page({ title: "Pawel Lipowczan | Twój Przewodnik Technologiczny" }),
    },
  ]);

  assert.ok(problems.length >= 1);
  assert.match(problems[0], /en\/index\.html/);
  assert.match(problems.join("\n"), /title/);
});

test("polski og:title łamie sprawdzenie nawet przy czystym <title>", () => {
  const html = page().replace(
    '<meta property="og:title" content="Pawel Lipowczan | Your Tech Guide">',
    '<meta property="og:title" content="Pawel Lipowczan | Twój Przewodnik">',
  );
  const problems = run([{ file: "en/index.html", html }]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /og:title/);
});

test("polski opis łamie sprawdzenie", () => {
  const problems = run([
    {
      file: "en/blog/post/index.html",
      html: page({
        description: "Architekt oprogramowania i doradca - dobór narzędzi do problemu",
      }),
    },
  ]);

  assert.ok(problems.length >= 1);
  assert.match(problems.join("\n"), /en\/blog\/post\/index\.html/);
  assert.match(problems.join("\n"), /description/);
});

test("polski tekst rezerwacji w treści strony angielskiej łamie sprawdzenie", () => {
  const problems = run([
    {
      file: "en/index.html",
      html: page({ body: "<section id=\"booking\"><h2>Umów spotkanie</h2></section>" }),
    },
  ]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /en\/index\.html/);
  assert.match(problems[0], /Umów spotkanie/);
});

test("polski tekst rezerwacji wewnątrz skryptu nie liczy się jako widoczny", () => {
  const html = page({
    body: '<script type="application/json">{"x":"Umów spotkanie"}</script>',
  });

  assert.deepEqual(run([{ file: "en/index.html", html }]), []);
});

test("encje w treści nie ukrywają polskiego tekstu", () => {
  const html = page({ body: "<p>Zarezerwuj&nbsp;Bezpłatną Konsultację</p>" });
  // &nbsp; jest zwykłą spacją po dekodowaniu — tekst rezerwacji nadal tam jest
  const problems = run([{ file: "en/index.html", html }]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /Zarezerwuj Bezpłatną Konsultację/);
});

test("zdublowane znaczniki w komentarzach HTML są ignorowane", () => {
  const html = page({
    body: "<!-- <title>Twój</title> Umów spotkanie --><main>Book a meeting</main>",
  });

  assert.deepEqual(run([{ file: "en/index.html", html }]), []);
});

test("nazwa własna z listy dozwolonych nie łamie sprawdzenia", () => {
  const html = page({ description: "A talk by Paweł Lipowczan about automation." });

  assert.equal(run([{ file: "en/index.html", html }]).length, 1);
  assert.deepEqual(run([{ file: "en/index.html", html }], ["Paweł"]), []);
});

test("lista dozwolonych nazw nie przepuszcza reszty polskiego tekstu", () => {
  const html = page({ description: "Paweł o automatyzacji, łatwo i szybko" });

  assert.equal(run([{ file: "en/index.html", html }], ["Paweł"]).length, 1);
});

test("pusta lista stron to awaria, nie sukces", () => {
  const problems = run([]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /żadnej trasy/);
});

test("pusta lista polskich tekstów rezerwacji to awaria, nie sukces", () => {
  const problems = findPolishInEnglishPages(
    [{ file: "en/index.html", html: page() }],
    [],
    [],
  );

  assert.equal(problems.length, 1);
  assert.match(problems[0], /booking/);
});

test("klucze rezerwacji czytane z locales/pl nie są puste", () => {
  const strings = readPolishBookingStrings();

  assert.ok(strings.length >= 10, `znaleziono tylko ${strings.length} tekstów`);
  assert.ok(strings.includes("Umów spotkanie"));
  assert.ok(strings.includes("Rezerwacja bezpłatnej konsultacji"));
});
