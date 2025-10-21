import { motion } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa'
import NetworkBackground from '../animations/NetworkBackground'

const Hero = () => {
  const handleScrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
              <span className="text-primary-500 font-mono text-3xl md:text-4xl font-bold">
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
            <span className="gradient-text glow-text">
              PAWEL
            </span>
            <br />
            <span className="gradient-text-alt glow-text">
              LIPOWCZAN
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl text-primary-500 uppercase tracking-widest font-light"
          >
            Your Tech Guide
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Full Stack Developer crafting modern web experiences and sharing knowledge through code
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
              View Projects
            </a>
            <a
              href="#contact"
              className="btn-outline w-full sm:w-auto text-center"
            >
              Contact Me
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            onClick={handleScrollToAbout}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
            aria-label="Scroll to about section"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaArrowDown size={32} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900 pointer-events-none" />
    </section>
  )
}

export default Hero

