import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import SEO from "../components/seo/SEO";
import StructuredData from "../components/seo/StructuredData";
import { SITE_CONFIG } from "../utils/constants";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Obsługa hash linków przy wejściu na stronę
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Opóźnienie dla animacji i ładowania
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pawel Lipowczan",
    jobTitle: "Software Architect & Technology Advisor",
    url: "https://pawel.lipowczan.pl",
    sameAs: [
      "https://github.com/plipowczan",
      "https://linkedin.com/in/pawellipowczan",
    ],
    knowsAbout: ["AI", "Automation", "No-Code", "Software Architecture"],
    email: "pawel@lipowczan.pl",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEO />
      <StructuredData schema={personSchema} />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </motion.div>
  );
};

export default Home;
