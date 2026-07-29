import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SEO from "../components/seo/SEO";
import useLocalizedPath from "../hooks/useLocalizedPath";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation("legal");
  const localizedPath = useLocalizedPath();
  const dateLocale = i18n.language === "en" ? "en-US" : "pl-PL";

  return (
    <>
      <SEO
        title="Privacy Policy"
        description={t("privacy.seoDescription")}
        path={localizedPath("/privacy-policy")}
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
                {t("privacy.title")}
              </h1>
              <p className="text-gray-400">{t("privacy.subtitle")}</p>
              <p className="text-sm text-gray-400">
                {t("privacy.lastUpdate", { date: new Date().toLocaleDateString(dateLocale) })}
              </p>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section1.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section1.content", { url: SITE_CONFIG.url, email: SITE_CONFIG.email })}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section2.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("privacy.section2.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{t("privacy.section2.item1")}</li>
                  <li>{t("privacy.section2.item2")}</li>
                  <li>{t("privacy.section2.item3")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section3.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("privacy.section3.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{t("privacy.section3.item1")}</li>
                  <li>{t("privacy.section3.item2")}</li>
                  <li>{t("privacy.section3.item3")}</li>
                  <li>{t("privacy.section3.item4")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section4.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section4.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 mt-4">
                  <li>{t("privacy.section4.item1")}</li>
                  <li>{t("privacy.section4.item2")}</li>
                  <li>{t("privacy.section4.item3")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section5.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section5.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section6.title")}
                </h2>
                <p className="leading-relaxed mb-4">
                  {t("privacy.section6.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{t("privacy.section6.item1")}</li>
                  <li>{t("privacy.section6.item2")}</li>
                  <li>{t("privacy.section6.item3")}</li>
                  <li>{t("privacy.section6.item4")}</li>
                  <li>{t("privacy.section6.item5")}</li>
                  <li>{t("privacy.section6.item6")}</li>
                  <li>{t("privacy.section6.item7")}</li>
                  <li>{t("privacy.section6.item8")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section7.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section7.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 mt-4">
                  <li>{t("privacy.section7.item1")}</li>
                  <li>{t("privacy.section7.item2")}</li>
                  <li>{t("privacy.section7.item3")}</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  {t("privacy.section7.footer")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section8.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section8.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section9.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section9.content")}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-primary-500 hover:text-primary-400"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("privacy.section10.title")}
                </h2>
                <p className="leading-relaxed">
                  {t("privacy.section10.content")}
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
