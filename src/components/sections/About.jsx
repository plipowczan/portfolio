import { motion } from 'framer-motion'
import { FADE_IN_UP, STAGGER_CONTAINER } from '../../utils/constants'
import { highlights } from '../../data/skills'

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
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={FADE_IN_UP} className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Full Stack Developer & Tech Enthusiast
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Hello! I'm Pawel, a passionate Full Stack Developer with a love for creating 
                modern, responsive web applications. With over 5 years of experience in the field, 
                I specialize in building scalable solutions using cutting-edge technologies.
              </p>
              <p className="text-gray-300 leading-relaxed">
                My journey in web development started with a curiosity about how things work 
                on the internet. Today, I combine technical expertise with creative problem-solving 
                to deliver exceptional digital experiences.
              </p>
              <p className="text-gray-300 leading-relaxed">
                When I'm not coding, I enjoy sharing my knowledge through technical blog articles, 
                contributing to open-source projects, and staying up-to-date with the latest 
                web development trends.
              </p>
              <div className="pt-4">
                <a 
                  href="/cv.pdf" 
                  download
                  className="btn-primary inline-block"
                >
                  Download CV
                </a>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={FADE_IN_UP} className="grid grid-cols-2 gap-6">
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
  )
}

export default About

