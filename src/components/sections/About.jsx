import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { highlights } from "../../data/skills";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { FADE_IN_UP, STAGGER_CONTAINER } from "../../utils/constants";

const HIGHLIGHT_KEYS = [
  "highlights.yearsExperience",
  "highlights.completedProjects",
  "highlights.satisfiedClients",
  "highlights.technologies",
];

const About = () => {
  const { t } = useTranslation("home");
  const localizedPath = useLocalizedPath();

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Section Title */}
          <motion.div variants={FADE_IN_UP} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              {t("about.title")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={FADE_IN_UP} className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {t("about.subtitle")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("about.paragraph1")}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t("about.paragraph2")}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t("about.paragraph3")}
              </p>
              <div className="pt-4">
                <a href={localizedPath("/#contact")} className="btn-primary inline-block">
                  {t("about.cta")}
                </a>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={FADE_IN_UP}
              className="grid grid-cols-2 gap-6"
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  variants={FADE_IN_UP}
                  className="card text-center group hover:scale-105 transition-transform"
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {highlight.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">
                    {t(HIGHLIGHT_KEYS[index])}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl transform translate-x-1/2" />
    </section>
  );
};

export default About;
