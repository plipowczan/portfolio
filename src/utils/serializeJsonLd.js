/**
 * Serializuje schemat do treści bloku `<script type="application/ld+json">`.
 *
 * Treść wstawiamy do dokumentu dosłownie, więc znak `<` musi zniknąć: gdyby
 * w jakiejkolwiek wartości pojawiło się `</script>`, przeglądarka zamknęłaby
 * element wcześniej, niż powinien się zamknąć, a reszta danych wylądowałaby
 * w dokumencie jako znaczniki. Prerender zrzuca `outerHTML` do pliku, więc
 * taki blok trafiłby też na produkcję.
 *
 * `\u003c` jest poprawną ucieczką wewnątrz łańcucha JSON, a każdy `<` w wyniku
 * `JSON.stringify` siedzi w łańcuchu (JSON nie ma `<` w składni). Odbiorca
 * dostaje więc po sparsowaniu dokładnie te same wartości.
 *
 * Ucieczka jest potrzebna także wtedy, gdy treść trafia do elementu jako
 * zwykłe dziecko tekstowe, a nie przez `dangerouslySetInnerHTML`. `<script>`
 * jest elementem o surowej treści: serializacja HTML wypisuje ją dosłownie,
 * bez zamiany `<` na encję. React nie ma tu czego uciec za nas — i właśnie
 * taka serializacja zapisuje prerenderowane pliki na dysk.
 *
 * Funkcja jest wydzielona z komponentu, żeby dało się ją sprawdzić testem
 * jednostkowym na wrogich danych — patrz tests/unit/serializeJsonLd.test.mjs.
 *
 * @param {object} schema
 * @returns {string} treść gotowa do wstawienia do elementu `<script>`
 */
export const serializeJsonLd = (schema) =>
  JSON.stringify(schema).replace(/</g, "\\u003c");
