import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SEO from "../components/seo/SEO";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";

const TermsOfService = () => {
  const { t, i18n } = useTranslation("legal");
  const dateLocale = i18n.language === "en" ? "en-US" : "pl-PL";

  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms of Service and usage guidelines"
        path="/terms-of-service"
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
                {t("terms.title")}
              </h1>
              <p className="text-gray-400">{t("terms.subtitle")}</p>
              <p className="text-sm text-gray-400">
                {t("terms.lastUpdate", { date: new Date().toLocaleDateString(dateLocale) })}
              </p>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section1.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("terms.section1.content1", { url: SITE_CONFIG.url })}
                </p>
                <p className="leading-relaxed">
                  {t("terms.section1.content2")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section2.title")}
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>{t("terms.section2.item1.label")}</strong>
                    {t("terms.section2.item1.text", { url: SITE_CONFIG.url })}
                  </li>
                  <li>
                    <strong>{t("terms.section2.item2.label")}</strong>
                    {t("terms.section2.item2.text")}
                  </li>
                  <li>
                    <strong>{t("terms.section2.item3.label")}</strong>
                    {t("terms.section2.item3.text")}
                  </li>
                  <li>
                    <strong>{t("terms.section2.item4.label")}</strong>
                    {t("terms.section2.item4.text")}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section3.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("terms.section3.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{t("terms.section3.item1")}</li>
                  <li>{t("terms.section3.item2")}</li>
                  <li>{t("terms.section3.item3")}</li>
                  <li>{t("terms.section3.item4")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section4.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("terms.section4.content1")}
                </p>
                <p className="leading-relaxed">
                  {t("terms.section4.content2")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section5.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("terms.section5.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{t("terms.section5.item1")}</li>
                  <li>{t("terms.section5.item2")}</li>
                  <li>{t("terms.section5.item3")}</li>
                  <li>{t("terms.section5.item4")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section6.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("terms.section6.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section7.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("terms.section7.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section8.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("terms.section8.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section9.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("terms.section9.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("terms.section10.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("terms.section10.content")}
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

export default TermsOfService;
