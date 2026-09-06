import { Helmet } from "react-helmet-async";

/**
 * Emituje jeden blok JSON-LD dla bieżącej trasy.
 *
 * Wcześniej ten komponent budował element `<script>` ręcznie i doklejał go do
 * `document.head` w `useEffect`, ze sprzątaniem przy odmontowaniu. Węzeł żył
 * wtedy poza drzewem Reacta, więc nie był związany z trasą: `/privacy-policy`
 * serwowała blok `Person` ze strony głównej, choć nie ma u siebie żadnego kodu
 * od danych strukturalnych, a `/en/` serwowała ten sam blok dwa razy.
 *
 * Ta sama klasa usterki dotknęła już to repozytorium 2026-07-29, kiedy trzy
 * strony wyszły na produkcję z `<head>` strony głównej. Dołożona wtedy bramka
 * w `scripts/prerender.mjs` sprawdza kanoniczny adres, opis i `og:title` —
 * wszystko, czym zarządza Helmet. JSON-LD był poza jego zasięgiem, więc bramka
 * nie mogła tego zobaczyć.
 *
 * Przejście na Helmet daje związanie z trasą za darmo: opuszczenie trasy usuwa
 * to, co ta trasa zadeklarowała, a bramka prerenderu widzi ten blok tak samo
 * jak resztę nagłówka.
 *
 * @param {{ schema: object|null|undefined }} props
 */
const StructuredData = ({ schema }) => {
  if (!schema) return null;

  // `<` w treści zamknęłoby element `<script>` wcześniej, niż powinien się
  // zamknąć — wystarczy `</script>` w dowolnym łańcuchu znaków. Ucieczka jest
  // po stronie serializacji, bo Helmet wstawia zawartość dosłownie.
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <Helmet>
      <script type="application/ld+json">{json}</script>
    </Helmet>
  );
};

export default StructuredData;
