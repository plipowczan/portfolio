import { Link } from "react-router-dom";
import MarkdownContent from "./MarkdownContent";

/**
 * Ciało artykułu albo lekcji w trzech stanach, które daje `useContentBody`.
 *
 * Treść przychodzi osobnym chunkiem, więc pobranie może trwać albo się nie
 * udać. Oba stany są widoczne z premedytacją: artykuł z pustym ciałem wygląda
 * na poprawny i nie zgłasza niczego, a to najgorszy możliwy wynik.
 *
 * @param {{
 *   status: "loading"|"ready"|"error",
 *   content: string|null,
 *   contentRef?: object,
 *   loadingLabel: string,
 *   errorLabel: string,
 *   backTo: string,
 *   backLabel: string,
 * }} props
 */
const ContentBody = ({
  status,
  content,
  contentRef,
  loadingLabel,
  errorLabel,
  backTo,
  backLabel,
}) => {
  if (status === "error") {
    return (
      <div
        role="alert"
        className="space-y-4 rounded-xl border border-red-500/30 bg-dark-800/50 p-6"
      >
        <p className="text-gray-300">{errorLabel}</p>
        <Link to={backTo} className="btn-outline inline-block">
          {backLabel}
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div aria-busy="true" aria-live="polite" className="space-y-4">
        <span className="sr-only">{loadingLabel}</span>
        {/*
          Zastępcze paski o wysokości akapitu. Rezerwują pion, żeby wejście
          treści nie przesunęło spisu treści ani przycisków pod spodem.
        */}
        {["w-3/4", "w-full", "w-full", "w-5/6", "w-full", "w-2/3"].map(
          (width, index) => (
            <div
              key={index}
              className={`h-4 rounded bg-dark-700/70 ${width}`}
              aria-hidden="true"
            />
          ),
        )}
      </div>
    );
  }

  return <MarkdownContent content={content} contentRef={contentRef} />;
};

export default ContentBody;
