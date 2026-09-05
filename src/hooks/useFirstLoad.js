import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Czy trasa została otwarta wejściem bezpośrednim, czy nawigacją wewnątrz serwisu.
 *
 * Wejście bezpośrednie dostaje HTML z prerenderu — treść nad zgięciem jest już
 * namalowana. Animacja wejścia odtworzona po hydratacji cofa tę pracę: ustawia
 * `opacity: 0` na czymś, co widz już widzi, a Largest Contentful Paint,
 * ignorując elementy o zerowej przezroczystości, mierzy się wtedy od końca
 * animacji, nie od faktycznego malowania.
 *
 * Nawigacja wewnątrz serwisu nie ma prerenderu, więc animacja nic tam nie
 * kosztuje i zostaje. Stąd flaga: nie „wyłącz animację", tylko „odłóż ją do
 * przypadku, w którym jest darmowa".
 *
 * Flaga przełącza się przy pierwszej zmianie ścieżki, nie po pierwszym
 * zamontowaniu aplikacji. Trasy są leniwe — strona wczytana z `import()`
 * montuje się długo po starcie aplikacji i nadal jest wejściem bezpośrednim.
 */
let hasNavigated = false;

/**
 * Spina flagę z routerem. Wołane raz, w `App`.
 *
 * Przełączenie idzie w renderze, nie w efekcie. `App` renderuje się przed
 * trasą, a efekty lecą po całym drzewie — flaga ustawiona w efekcie zdążyłaby
 * na drugą nawigację, ale nie na pierwszą, i pierwsze wejście na stronę główną
 * z wnętrza serwisu nie zagrałoby animacji. Zapis jest jednokierunkowy
 * (`false` → `true`) i wynika wyłącznie ze stanu routera, więc podwójny render
 * w `StrictMode` daje ten sam wynik.
 */
export function useFirstLoadTracker() {
  const { pathname } = useLocation();
  const entryPath = useRef(pathname);

  if (pathname !== entryPath.current) {
    hasNavigated = true;
  }
}

/**
 * @returns {boolean} czy ten komponent zamontował się przy wejściu
 *   bezpośrednim. Wartość jest zamrażana przy montowaniu, żeby ponowny render
 *   nie zmienił zachowania animacji w trakcie jej trwania.
 */
export function useIsFirstLoad() {
  const [firstLoad] = useState(() => !hasNavigated);
  return firstLoad;
}
