import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook that returns a function to localize paths based on current language.
 * PL paths have no prefix, EN paths get /en prefix.
 */
const useLocalizedPath = () => {
  const { i18n } = useTranslation();

  const localizedPath = useCallback(
    (path) => {
      if (i18n.language === "en") {
        // For hash-only paths like #about, prefix with /en/
        if (path.startsWith("#")) {
          return `/en/${path}`;
        }
        // For paths starting with /, prefix with /en
        if (path.startsWith("/")) {
          return `/en${path}`;
        }
        return `/en/${path}`;
      }
      return path;
    },
    [i18n.language],
  );

  return localizedPath;
};

export default useLocalizedPath;
