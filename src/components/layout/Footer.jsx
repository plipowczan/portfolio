import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGithub, FaLinkedin, FaMastodon, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { SITE_CONFIG } from "../../utils/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, i18n } = useTranslation("common");
  const localizedPath = useLocalizedPath();

  const socialLinks = [
    { icon: FaGithub, href: SITE_CONFIG.social.github, label: "GitHub" },
    { icon: FaLinkedin, href: SITE_CONFIG.social.linkedin, label: "LinkedIn" },
    { icon: FaMastodon, href: SITE_CONFIG.social.mastodon, label: "Mastodon", relMe: true },
    { icon: FaTwitter, href: SITE_CONFIG.social.twitter, label: "Twitter" },
    { icon: FaEnvelope, href: `mailto:${SITE_CONFIG.email}`, label: "Email" },
  ];

  const legalLinks = [
    { key: "footer.privacyPolicy", href: "/privacy-policy" },
    { key: "footer.termsOfService", href: "/terms-of-service" },
    { key: "footer.cookiePolicy", href: "/cookie-policy" },
  ];

  return (
    <footer className="relative bg-dark-800 border-t-2 border-primary-500/30">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-primary-500 flex items-center justify-center">
                <span className="text-primary-500 font-mono text-base font-bold tracking-wider">
                  &lt;/&gt;
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Pawel Lipowczan
                </h3>
                <p className="text-xs text-primary-500 uppercase tracking-wider">
                  {t("nav.tagline")}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={localizedPath("/#about")}
                  className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                >
                  {t("nav.about")}
                </a>
              </li>
              <li>
                <a
                  href={localizedPath("/#projects")}
                  className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                >
                  {t("nav.projects")}
                </a>
              </li>
              <li>
                <Link
                  to={localizedPath("/blog")}
                  className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                >
                  {t("nav.blog")}
                </Link>
              </li>
              {/* Polish-only section. There is no /en/llm-wiki page — it resolves
                  only through the 301 in vercel.json — so the entry is omitted on
                  English routes rather than linked with an /en prefix. */}
              {i18n.language !== "en" && (
                <li>
                  <Link
                    to="/llm-wiki"
                    className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                  >
                    {t("nav.llmWiki")}
                  </Link>
                </li>
              )}
              <li>
                <a
                  href={localizedPath("/#contact")}
                  className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                >
                  {t("nav.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.socialMedia")}</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel={social.relMe ? "me noopener noreferrer" : "noopener noreferrer"}
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
            {/* Hidden rel="me" verification links — Mastodon profile metadata
                verification. Not part of UI; required only for the green checkmark. */}
            <a
              rel="me"
              href={SITE_CONFIG.social.mastodonAlt}
              style={{ display: "none" }}
              aria-hidden="true"
              tabIndex={-1}
            >
              Mastodon (alt)
            </a>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.key}
                  to={localizedPath(link.href)}
                  className="block text-gray-400 hover:text-primary-500 transition-colors text-xs"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <p className="text-gray-400 text-sm">
            {t("footer.builtWith")} <span className="text-primary-500">React</span> +{" "}
            <span className="text-primary-500">Vite</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
