import { motion } from "framer-motion";
import NetworkBackground from "../animations/NetworkBackground";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Network Background */}
      <NetworkBackground />

      {/* Content */}
      <div className="section-container relative z-10">
        <div className="text-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-dashed border-primary-500 flex items-center justify-center glow animate-glow">
              <span className="text-primary-500 font-mono text-3xl md:text-4xl font-bold tracking-wider">
                &lt;/&gt;
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="gradient-text glow-text">PAWEL</span>
            <br />
            <span className="gradient-text-alt glow-text">LIPOWCZAN</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl text-primary-500 uppercase tracking-widest font-light"
          >
            Twój Przewodnik Technologiczny
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Architekt oprogramowania i doradca ds. technologii - pomagam firmom
            optymalizować procesy poprzez dobór optymalnych technologii i
            narzędzi
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <a
              href="#projects"
              className="btn-primary w-full sm:w-auto text-center"
            >
              Zobacz Projekty
            </a>
            <a
              href="#contact"
              className="btn-outline w-full sm:w-auto text-center"
            >
              Skontaktuj się
            </a>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900 pointer-events-none" />
    </section>
  );
};

export default Hero;
