import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CookieBanner from "../ui/CookieBanner";
import Footer from "./Footer";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Przewiń do góry tylko jeśli zmienia się pathname (nie hash)
    // Hash linki są obsługiwane w Navigation.jsx i Home.jsx
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Layout;
