/**
 * Znacznik gotowości dla prerenderu.
 *
 * Treść artykułów i lekcji przychodzi teraz osobnym `import()`, więc jest za
 * granicą asynchroniczną. Prerender, który zrobiłby zrzut przed jej
 * rozwiązaniem, zapisałby stronę z tytułem i metadanymi, ale bez tekstu —
 * wyglądającą poprawnie w przeglądarce i pustą dla robotów.
 *
 * Dlatego trasa z treścią ustawia ten atrybut na `<html>` dopiero po
 * wyrenderowaniu tekstu, a `scripts/prerender.mjs` na niego czeka i przewraca
 * build, gdy się nie pojawi. Czekanie na ciszę w sieci tego nie zastąpi: nie
 * odróżnia „chunk z treścią doszedł" od „beacon analityki doszedł".
 *
 * Ten moduł nie ma zależności — importuje go i aplikacja, i skrypt Node'a.
 */
export const PRERENDER_READY_ATTR = "data-content-ready";
