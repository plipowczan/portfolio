/**
 * Emituje jeden blok JSON-LD dla bieżącej trasy.
 *
 * Najpierw ten komponent budował element `<script>` ręcznie i doklejał go do
 * `document.head` w `useEffect`, ze sprzątaniem przy odmontowaniu. Węzeł żył
 * wtedy poza drzewem Reacta, więc nie był związany z trasą: `/privacy-policy`
 * serwowała blok `Person` ze strony głównej, choć nie ma u siebie żadnego kodu
 * od danych strukturalnych, a `/en/` serwowała ten sam blok dwa razy.
 *
 * Ta sama klasa usterki dotknęła już to repozytorium 2026-07-29, kiedy trzy
 * strony wyszły na produkcję z `<head>` strony głównej.
 *
 * Naprawa 2026-09-06 przepięła emisję na `react-helmet-async`. Ta zmiana zdejmuje
 * Helmeta z całego projektu, więc blok wraca do drzewa Reacta — tym razem jako
 * zwykły renderowany element, nie jako efekt uboczny. Związanie z trasą zostaje:
 * odmontowanie komponentu zabiera `<script>` ze sobą, bo to jego własny węzeł.
 *
 * Element zostaje tam, gdzie stoi komponent, czyli w `<body>` — React 19
 * hoistuje `<title>`, `<meta>` i `<link>`, ale **nie** skrypty z treścią.
 * Dla JSON-LD to bez znaczenia: wyszukiwarki czytają go z dowolnego miejsca
 * dokumentu, a testy i prerender pytają o `document.querySelectorAll`, nie o
 * zawartość `<head>`.
 *
 * @param {{ schema: object|null|undefined }} props
 */
const StructuredData = ({ schema }) => {
  if (!schema) return null;

  // `<` w treści zamknęłoby element `<script>` wcześniej, niż powinien się
  // zamknąć — wystarczy `</script>` w dowolnym łańcuchu znaków. Ucieczka jest
  // po stronie serializacji, bo treść wstawiamy dosłownie.
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default StructuredData;
