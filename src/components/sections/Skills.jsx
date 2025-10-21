import { motion } from 'framer-motion'
import { FADE_IN_UP, STAGGER_CONTAINER, SCALE_IN } from '../../utils/constants'
import { skillCategories } from '../../data/skills'

const SkillCard = ({ skill }) => {
  return (
    <motion.div
      variants={SCALE_IN}
      className="flex flex-col items-center space-y-3 p-4 card group"
      whileHover={{ scale: 1.05 }}
    >
      <skill.icon 
        className="text-5xl text-primary-500 group-hover:text-primary-400 transition-colors" 
      />
      <span className="text-gray-300 font-medium text-center">{skill.name}</span>
      
      {/* Skill Level Bar */}
      <div className="w-full bg-dark-600 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
        />
      </div>
      <span className="text-xs text-gray-500">{skill.level}%</span>
    </motion.div>
  )
}

const Skills = () => {
  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
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
              Skills & Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life.
            </p>
          </motion.div>

          {/* Skills by Category */}
          <div className="space-y-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={STAGGER_CONTAINER}
                className="space-y-8"
              >
                <motion.h3
                  variants={FADE_IN_UP}
                  className="text-2xl md:text-3xl font-bold text-white text-center md:text-left"
                >
                  {category.name}
                </motion.h3>
                
                <motion.div
                  variants={STAGGER_CONTAINER}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {category.skills.map((skill, skillIndex) => (
                    <SkillCard key={skillIndex} skill={skill} />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
    </section>
  )
}

export default Skills

