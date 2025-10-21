import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { FADE_IN_UP, STAGGER_CONTAINER } from '../../utils/constants'
import { projects } from '../../data/projects'

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="card group cursor-pointer"
    >
      {/* Project Image */}
      <div className="relative overflow-hidden rounded-lg mb-6 bg-dark-600 h-48">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
          <span className="text-6xl opacity-20">
            {project.title.charAt(0)}
          </span>
        </div>
        <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/90 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-primary-500 text-dark-900 rounded-full hover:bg-primary-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub size={24} />
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-secondary-500 text-white rounded-full hover:bg-secondary-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  return (
    <section id="projects" className="py-24 md:py-32 bg-dark-800/50">
      <div className="section-container">
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
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and passion for web development.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={STAGGER_CONTAINER}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>

          {/* View More */}
          <motion.div variants={FADE_IN_UP} className="text-center pt-8">
            <a
              href="https://github.com/pawellipowczan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <FaGithub size={20} />
              <span>View More on GitHub</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects

