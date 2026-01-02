import { useEffect, useState } from "react";

const ZencalWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Sprawdź czy script już załadowany
    const existingScript = document.querySelector('script[src*="zencal.io"]');
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Utwórz i dodaj script
    const script = document.createElement("script");
    script.src = "https://app.zencal.io/js/embed.js?v=3.11.7";
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
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
      <div className="relative min-h-[600px]">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">Ładowanie kalendarza...</p>
            </div>
          </div>
        )}

        {/* Zencal Widget */}
        <div
          data-type="u"
          data-owner="pl"
          data-slug="konsultacje"
          data-primary="#000000ff"
          data-secondary="#000000ff"
          data-avatar="https://meetendly.fra1.digitaloceanspaces.com/profile-images/a1wSWEyLimmWBNqhXhAk6aIMvNfKPf.jpg"
          data-lang="pl"
          data-ampm="0"
          className="zencal-embed"
          style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.1s" }}
        />
      </div>
    </div>
  );
};

export default ZencalWidget;
