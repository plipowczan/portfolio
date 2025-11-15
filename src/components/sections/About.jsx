import { motion } from "framer-motion";
import { highlights } from "../../data/skills";
import { FADE_IN_UP, STAGGER_CONTAINER } from "../../utils/constants";

const About = () => {
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
              O mnie
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={FADE_IN_UP} className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Twój Przewodnik Technologiczny
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Cześć! Jestem Paweł, ekspertem optymalizacji procesów
                biznesowych i specjalistą w zakresie automatyzacji. Jako
                Technical Lead w Tigers/Automation House pomagam firmom w
                cyfrowej transformacji poprzez inteligentny dobór technologii i
                wdrażanie rozwiązań no-code oraz AI.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Moja droga w IT rozpoczęła się w 2008 roku od programowania w
                .NET i SQL Server. Przez lata rozwijałem systemy medyczne, byłem
                CTO w startucie ShareFund, zarządzałem projektami IT. Dziś łączę
                doświadczenie programistyczne z nowoczesnymi narzędziami
                automatyzacji, tworząc systemy które rzeczywiście rozwiązują
                problemy biznesowe.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Jestem agnostykiem technologicznym - dobieram narzędzia do
                problemu, nie problem do narzędzi. Wykorzystuję Make, n8n,
                Airtable, AI (OpenAI, Claude), Python i wiele innych
                technologii, by dostarczać optymalne rozwiązania. Dzielę się
                wiedzą poprzez konsultacje, warsztaty i artykuły techniczne.
              </p>
              <div className="pt-4">
                <a href="#contact" className="btn-primary inline-block">
                  Bezpłatna Konsultacja
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
                    {highlight.label}
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
