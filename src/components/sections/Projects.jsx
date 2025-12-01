import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { projects } from "../../data/projects";
import { FADE_IN_UP, STAGGER_CONTAINER } from "../../utils/constants";

import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.slug}`} className="block h-full">
      <motion.div
        variants={FADE_IN_UP}
        className="card project-card group cursor-pointer h-full flex flex-col"
      >
        {/* Project Image */}
        <div className="relative overflow-hidden rounded-lg mb-6 bg-dark-600 h-48">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Overlay with external links */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/90 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary-500 text-dark-900 rounded-full hover:bg-primary-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub size={24} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-secondary-500 text-white rounded-full hover:bg-secondary-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt size={24} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="space-y-4 flex-grow flex flex-col">
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed flex-grow">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mt-auto pt-4">
            {project.technologies.slice(0, 4).map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-3 py-1 text-xs font-medium bg-dark-700 text-gray-400 rounded-full border border-dark-600">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

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
              Projekty
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Wybrane projekty automatyzacji i systemów no-code wdrożone dla
              klientów.
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
              href="https://automation.house"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <FaExternalLinkAlt size={20} />
              <span>Zobacz więcej projektów</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
