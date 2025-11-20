import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import StructuredData from "../components/seo/StructuredData";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
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
      <Helmet>
        <title>
          {SITE_CONFIG.name} | {SITE_CONFIG.title}
        </title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="canonical" href={SITE_CONFIG.url} />
        <meta property="og:title" content={`${SITE_CONFIG.name} - Portfolio`} />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_CONFIG.url} />
        <meta
          property="og:image"
          content={`${SITE_CONFIG.url}/images/og-home.webp`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${SITE_CONFIG.name} - Portfolio`}
        />
        <meta name="twitter:description" content={SITE_CONFIG.description} />
        <meta
          name="twitter:image"
          content={`${SITE_CONFIG.url}/images/og-home.webp`}
        />
      </Helmet>
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
