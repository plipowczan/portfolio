import { useEffect, useRef, useState } from "react";
import { PRERENDER_READY_ATTR } from "../utils/prerenderMarker";

/**
 * Wczytuje treść artykułu albo lekcji przez dynamiczny `import()`.
 *
 * Treść nie jest już wkompilowana w bundle — pobiera się osobnym chunkiem
 * dopiero dla otwartej trasy. To znaczy, że strona ma trzy stany zamiast
 * jednego, a dwa z nich muszą być widoczne: nieudane pobranie nie może wyjść
 * jako artykuł z pustym ciałem.
 *
 * Po wyrenderowaniu treści hook ustawia znacznik gotowości dla prerenderu
 * (`src/utils/prerenderMarker.js`). Znacznik znika przy zmianie trasy, więc
 * kolejna lekcja ustawia go od nowa.
 *
 * @param {() => Promise<string>} load funkcja pobierająca treść
 * @param {string|null} key identyfikator treści; zmiana resetuje stan, `null`
 *   wstrzymuje pobieranie (nieznany slug)
 * @returns {{ content: string|null, status: "loading"|"ready"|"error" }}
 */
export default function useContentBody(load, key) {
  const [state, setState] = useState({ content: null, status: "loading" });

  // `load` bywa świeżą funkcją przy każdym renderze, a jedyną zależnością
  // pobierania jest `key`. Ref trzyma aktualną wersję bez restartu efektu.
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!key) {
      setState({ content: null, status: "loading" });
      return;
    }

    let active = true;
    setState({ content: null, status: "loading" });

    loadRef
      .current()
      .then((content) => {
        if (active) setState({ content, status: "ready" });
      })
      .catch((error) => {
        console.error(`Nie udało się wczytać treści (${key}):`, error);
        if (active) setState({ content: null, status: "error" });
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (state.status !== "ready") return undefined;

    // Efekt odpala się po commicie, w którym treść trafiła już do DOM-u, więc
    // znacznik nigdy nie wyprzedza tekstu, na który prerender czeka.
    document.documentElement.setAttribute(PRERENDER_READY_ATTR, "true");
    return () => {
      document.documentElement.removeAttribute(PRERENDER_READY_ATTR);
    };
  }, [state.status, key]);

  return state;
}
