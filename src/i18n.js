import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enLegal from "./locales/en/legal.json";
import enProjects from "./locales/en/projects.json";
import plCommon from "./locales/pl/common.json";
import plHome from "./locales/pl/home.json";
import plLegal from "./locales/pl/legal.json";
import plProjects from "./locales/pl/projects.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        common: plCommon,
        home: plHome,
        projects: plProjects,
        legal: plLegal,
      },
      en: {
        common: enCommon,
        home: enHome,
        projects: enProjects,
        legal: enLegal,
      },
    },
    fallbackLng: "pl",
    supportedLngs: ["pl", "en"],
    defaultNS: "common",
    ns: ["common", "home", "projects", "legal"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },
  });

export default i18n;
