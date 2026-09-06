/**
 * @sitemapUpdated 2026-07-30
 *
 * Data ostatniej znaczacej zmiany tresci tej strony, czytana przez
 * scripts/update-sitemap.js. Trzymana tutaj, a nie wyciagana z historii
 * gita, bo srodowisko budujace klonuje repozytorium ze skrocona historia
 * i kazdy plik nietkniety od granicy skrotu raportowal te sama, falszywa
 * date. Zmieniasz tresc strony - zmieniasz te date.
 */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "../components/seo/SEO";
import useLocalizedPath from "../hooks/useLocalizedPath";
import { getConsentState, withdrawAnalyticsConsent } from "../utils/analytics";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";

const CookiePolicy = () => {
  const { t, i18n } = useTranslation("legal");
  const localizedPath = useLocalizedPath();
  const dateLocale = i18n.language === "en" ? "en-US" : "pl-PL";
  // null until read on the client. Reading during render would bake a decision
  // into the prerendered HTML that belongs to whoever ran the build.
  const [consentState, setConsentState] = useState(null);

  useEffect(() => {
    setConsentState(getConsentState());
  }, []);

  const handleWithdraw = () => {
    withdrawAnalyticsConsent();
    // Reloading rather than patching state: gtag.js cannot be unloaded once
    // injected, and the reload is also what brings the banner back.
    window.location.reload();
  };

  return (
    <>
      <SEO
        title="Cookie Policy"
        description={t("cookies.seoDescription")}
        path={localizedPath("/cookie-policy")}
        mirroredByPrefix
      />

      <div className="min-h-screen py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="space-y-8"
          >
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {t("cookies.title")}
              </h1>
              <p className="text-gray-400">{t("cookies.subtitle")}</p>
              <p className="text-sm text-gray-400">
                {t("cookies.lastUpdate", { date: new Date().toLocaleDateString(dateLocale) })}
              </p>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section1.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("cookies.section1.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section2.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("cookies.section2.intro")}
                </p>

                <div className="space-y-4">
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("cookies.section2.essential.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("cookies.section2.essential.content")}
                    </p>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("cookies.section2.functional.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("cookies.section2.functional.content")}
                    </p>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("cookies.section2.analytics.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("cookies.section2.analytics.content")}
                    </p>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("cookies.section2.marketing.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("cookies.section2.marketing.content")}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section3.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("cookies.section3.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>{t("cookies.section3.item1.label")}</strong>
                    {t("cookies.section3.item1.text")}
                  </li>
                  <li>
                    <strong>{t("cookies.section3.item2.label")}</strong>
                    {t("cookies.section3.item2.text")}
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  {t("cookies.section3.footer")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section4.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("cookies.section4.intro")}
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {t("cookies.section4.browser.title")}
                    </h3>
                    <p className="text-gray-400 mb-2">
                      {t("cookies.section4.browser.intro")}
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-4 text-gray-400">
                      <li>{t("cookies.section4.browser.chrome")}</li>
                      <li>{t("cookies.section4.browser.firefox")}</li>
                      <li>{t("cookies.section4.browser.safari")}</li>
                      <li>{t("cookies.section4.browser.edge")}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {t("cookies.section4.delete.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("cookies.section4.delete.content")}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section5.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("cookies.section5.content")}
                </p>

                {consentState && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-gray-400">
                      {t(`cookies.section5.status.${consentState}`)}
                    </p>
                    {consentState !== "none" && (
                      <button
                        type="button"
                        onClick={handleWithdraw}
                        className="px-6 py-3 rounded-lg font-semibold text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 transition-all"
                        aria-label={t("cookies.section5.withdrawAria")}
                      >
                        {t("cookies.section5.withdraw")}
                      </button>
                    )}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section6.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("cookies.section6.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section7.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("cookies.section7.content")}
                  <a
                    href="https://www.aboutcookies.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-400"
                  >
                    www.aboutcookies.org
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("cookies.section8.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("cookies.section8.content")}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-primary-500 hover:text-primary-400"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
