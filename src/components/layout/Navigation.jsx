import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { getAlternatePost } from "../../data/blogPosts";

const NAV_ITEMS = [
  { key: "nav.start", href: "/" },
  { key: "nav.about", href: "/#about" },
  { key: "nav.projects", href: "/#projects" },
  { key: "nav.skills", href: "/#skills" },
  { key: "nav.testimonials", href: "/#testimonials" },
  { key: "nav.blog", href: "/blog" },
  { key: "nav.contact", href: "/#contact" },
];

/**
 * Where the language switch leads from a given path. Pure, so it can run
 * during render instead of inside a click handler — that is what puts the
 * href into the prerendered HTML and makes /en/* reachable in the link graph.
 *
 * @param {string} pathname current location pathname
 * @param {string} currentLang "pl" | "en"
 * @returns {string} path of the alternate-language version
 */
export const resolveLanguageSwitchPath = (pathname, currentLang) => {
  // Blog posts have translated slugs, so the target comes from frontmatter.
  const blogPostMatch = pathname.match(/^(?:\/en)?\/blog\/([^/]+)\/?$/);
  if (blogPostMatch) {
    const alternatePost = getAlternatePost(blogPostMatch[1]);

    if (alternatePost) {
      return currentLang === "pl"
        ? `/en/blog/${alternatePost.slug}`
        : `/blog/${alternatePost.slug}`;
    }

    // No translation → the blog listing in the other language. It returns 200,
    // unlike the current slug with the other prefix bolted on.
    return currentLang === "pl" ? "/en/blog" : "/blog";
  }

  // Everything else mirrors by prefix.
  if (currentLang === "pl") return `/en${pathname}`;
  return pathname.replace(/^\/en/, "") || "/";
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;

  const target = resolveLanguageSwitchPath(location.pathname, currentLang);

  return (
    <Link
      to={target}
      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border border-primary-500/30 hover:border-primary-500 transition-colors text-sm font-medium"
      aria-label={currentLang === "pl" ? "Switch to English" : "Przełącz na polski"}
    >
      <span className={currentLang === "pl" ? "text-primary-500" : "text-gray-400"}>PL</span>
      <span className="text-gray-500">|</span>
      <span className={currentLang === "en" ? "text-primary-500" : "text-gray-400"}>EN</span>
    </Link>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const localizedPath = useLocalizedPath();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Get the base path without language prefix for comparison
  const getBasePath = (pathname) => pathname.replace(/^\/en/, "") || "/";

  const handleNavClick = (e, href) => {
    const localizedHref = localizedPath(href);
    const basePath = getBasePath(location.pathname);

    // If clicking "Home" while already on homepage - scroll to top
    if (href === "/" && basePath === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }

    // If link contains hash (e.g., "/#about")
    if (href.includes("#")) {
      const [path, hash] = href.split("#");

      // If target path is "/" and we're already on "/" - scroll to element
      if ((path === "/" || path === "") && basePath === "/") {
        e.preventDefault();
        const element = document.querySelector(`#${hash}`);
        if (element) {
          navigate(`${localizedPath("/")}#${hash}`, { replace: true });
          element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
        return;
      }
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to={localizedPath("/")}
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center space-x-3 group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary-500 flex items-center justify-center group-hover:border-primary-400 transition-colors">
              <span className="text-primary-500 font-mono text-lg font-bold group-hover:text-primary-400 transition-colors tracking-wider">
                &lt;/&gt;
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-white">Pawel Lipowczan</div>
              <p className="text-xs text-primary-500 uppercase tracking-wider">
                {t("nav.tagline")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={localizedPath(item.href)}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-gray-300 hover:text-primary-500 transition-colors duration-200 font-medium"
              >
                {t(item.key)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 hover:text-primary-500 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-primary-500/20"
          >
            <div className="section-container py-6 space-y-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  to={localizedPath(item.href)}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block text-gray-300 hover:text-primary-500 transition-colors duration-200 font-medium py-2"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
