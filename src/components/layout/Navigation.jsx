import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../utils/constants";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavClick = (e, href) => {
    // Jeśli klikamy "Home" będąc już na stronie głównej - przewiń do góry
    if (href === "/" && location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }

    // Jeśli link zawiera hash (np. "/#about")
    if (href.includes("#")) {
      const [path, hash] = href.split("#");

      // Jeśli target path to "/" i już jesteśmy na "/" - scrolluj i zaktualizuj URL
      if ((path === "/" || path === "") && location.pathname === "/") {
        e.preventDefault();
        const element = document.querySelector(`#${hash}`);
        if (element) {
          // Zaktualizuj URL z hashem
          navigate(`#${hash}`, { replace: true });
          // Scrolluj do elementu
          element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
        return;
      }
      // W przeciwnym razie pozwól React Router nawigować (Home.jsx obsłuży scroll)
    }

    // W pozostałych przypadkach React Router obsłuży nawigację
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
            to="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center space-x-3 group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary-500 flex items-center justify-center group-hover:border-primary-400 transition-colors">
              <span className="text-primary-500 font-mono text-lg font-bold group-hover:text-primary-400 transition-colors">
                &lt;/&gt;
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">Pawel Lipowczan</h1>
              <p className="text-xs text-primary-500 uppercase tracking-wider">
                Your Tech Guide
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-300 hover:text-primary-500 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:text-primary-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-primary-500/20"
          >
            <div className="section-container py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-gray-300 hover:text-primary-500 transition-colors duration-200 font-medium py-2"
                >
                  {link.name}
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
