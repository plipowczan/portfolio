import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Zencal booking embed for the free consultation.
 *
 * The interface language follows the route (`en` under `/en/`, `pl` elsewhere).
 * The embed takes it from `data-lang`; it ignores a `?lang=` query, which only
 * the hosted booking page reads.
 */
const ZencalWidget = () => {
  const { t, i18n } = useTranslation("common");
  const [isLoaded, setIsLoaded] = useState(false);
  const lang = i18n.language === "en" ? "en" : "pl";

  useEffect(() => {
    // Sprawdź czy script już załadowany
    const existingScript = document.querySelector('script[src*="zencal.io"]');
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Utwórz i dodaj script
    const script = document.createElement("script");
    script.src = "https://app.zencal.io/js/embed.js?v=3.11.8";
    script.async = true;
    script.setAttribute("data-cookieconsent", "ignore");

    script.onload = () => {
      setIsLoaded(true);
    };

    document.body.appendChild(script);

    // Cleanup przy unmount
    return () => {
      const scriptToRemove = document.querySelector('script[src*="zencal.io"]');
      if (scriptToRemove && document.body.contains(scriptToRemove)) {
        document.body.removeChild(scriptToRemove);
      }

      // Cleanup widget div
      const widgetDiv = document.querySelector(".zencal-embed");
      if (widgetDiv) {
        widgetDiv.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 shadow-lg">
      <div className="relative min-h-[600px]">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-300">{t("booking.loading")}</p>
            </div>
          </div>
        )}

        {/* Zencal Widget */}
        <div
          data-type="u"
          data-owner="pl"
          data-slug="konsultacja"
          data-primary="#00ff9d"
          data-secondary="#00b8ff"
          data-avatar="https://meetendly.fra1.digitaloceanspaces.com/profile-images/a1wSWEyLimmWBNqhXhAk6aIMvNfKPf.jpg"
          data-lang={lang}
          data-ampm="0"
          className="zencal-embed"
          style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.1s" }}
        />
      </div>
    </div>
  );
};

export default ZencalWidget;
