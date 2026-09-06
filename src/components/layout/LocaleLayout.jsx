import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const SUPPORTED_LANGS = ["en"];

const LocaleLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && !SUPPORTED_LANGS.includes(lang)) {
      // Invalid language prefix — redirect to PL equivalent (strip prefix)
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(`/${lang}`, "") || "/";
      navigate(pathWithoutLang, { replace: true });
      return;
    }

    const targetLang = lang === "en" ? "en" : "pl";
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [lang, i18n, navigate]);

  const currentLang = lang === "en" ? "en" : "pl";

  // React 19 hoists `<title>`, `<meta>` and `<link>` on its own, but not
  // attributes of `<html>` — there is no element to insert, only one to mutate.
  // Setting it imperatively is safe under StrictMode precisely because it is a
  // mutation: running the effect twice lands on the same value.
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return <Outlet />;
};

export default LocaleLayout;
