import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCookie, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Pokazuj banner po krótkiej chwili, aby nie przeszkadzać w animacjach strony
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="cookie-banner fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-md border-t border-primary-500/20 p-6 z-50 shadow-2xl"
        >
          <div className="section-container">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Cookie Icon & Message */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0">
                  <FaCookie className="text-primary-500 text-3xl" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-lg">
                    Używamy plików cookie
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Ta strona wykorzystuje pliki cookie, aby zapewnić Ci
                    najlepsze doświadczenie. Kontynuując przeglądanie, wyrażasz
                    zgodę na ich użycie.{" "}
                    <Link
                      to="/cookie-policy"
                      className="text-primary-500 hover:text-primary-400 underline"
                    >
                      Dowiedz się więcej
                    </Link>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={rejectCookies}
                  className="px-6 py-3 rounded-lg font-semibold text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 transition-all text-center"
                  aria-label="Odrzuć cookies"
                >
                  Odrzuć
                </button>
                <button
                  onClick={acceptCookies}
                  className="btn-primary"
                  aria-label="Zaakceptuj cookies"
                >
                  Akceptuję
                </button>
              </div>

              {/* Close Button (X) */}
              <button
                onClick={rejectCookies}
                className="absolute top-4 right-4 md:relative md:top-auto md:right-auto text-gray-500 hover:text-white transition-colors p-2"
                aria-label="Zamknij banner cookies"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
