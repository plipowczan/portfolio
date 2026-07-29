import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaCheckCircle, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../components/seo/SEO";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { projects } from "../data/projects";
import useLocalizedPath from "../hooks/useLocalizedPath";
import { FADE_IN_UP, STAGGER_CONTAINER } from "../utils/constants";

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("projects");
  const { t: tc } = useTranslation("common");
  const localizedPath = useLocalizedPath();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <>
        <SEO
          title="Project Not Found"
          description="The requested project could not be found."
          path={localizedPath("/")}
        />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Project Not Found
            </h1>
            <button
              onClick={() => navigate(localizedPath("/"))}
              className="px-6 py-3 bg-primary-500 text-dark-900 font-semibold rounded-lg hover:bg-primary-400 transition-colors"
            >
              {i18n.language === "en" ? "Back to Home" : "Wróć do strony głównej"}
            </button>
          </div>
        </div>
      </>
    );
  }

  const projectTitle = t(`${project.slug}.title`, { defaultValue: project.title });
  const projectDescription = t(`${project.slug}.description`, { defaultValue: project.description });
  const projectFullDescription = t(`${project.slug}.fullDescription`, { defaultValue: project.fullDescription });

  const getFeatures = () => {
    const features = [];
    for (let i = 0; i < (project.features?.length || 0); i++) {
      features.push(t(`${project.slug}.features.${i}`, { defaultValue: project.features[i] }));
    }
    return features;
  };

  const getBenefits = () => {
    const benefits = [];
    for (let i = 0; i < (project.benefits?.length || 0); i++) {
      benefits.push(t(`${project.slug}.benefits.${i}`, { defaultValue: project.benefits[i] }));
    }
    return benefits;
  };

  const features = getFeatures();
  const benefits = getBenefits();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectTitle,
    description: projectDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <SEO
        title={`${projectTitle} | Portfolio`}
        description={projectDescription}
        image={project.image}
        path={localizedPath(`/projects/${project.slug}`)}
        type="article"
        mirroredByPrefix
      />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <article className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: tc("blog.home"), path: localizedPath("/") },
                { label: tc("nav.projects"), path: localizedPath("/#projects") },
                { label: projectTitle, path: localizedPath(`/projects/${project.slug}`) },
              ]}
            />
          </div>

          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={FADE_IN_UP} className="mb-8">
              <Link
                to={localizedPath("/#projects")}
                className="inline-flex items-center text-gray-400 hover:text-primary-500 transition-colors mb-6"
              >
                <FaArrowLeft className="mr-2" /> {i18n.language === "en" ? "Back to Projects" : "Powrót do projektów"}
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {projectTitle}
              </h1>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Project Image */}
            <motion.div
              variants={FADE_IN_UP}
              className="relative aspect-video rounded-xl overflow-hidden mb-12 border border-dark-600 shadow-2xl"
            >
              <img
                src={project.image}
                alt={projectTitle}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <motion.div variants={FADE_IN_UP} className="prose prose-invert max-w-none">
                  <ReactMarkdown>{projectFullDescription}</ReactMarkdown>
                </motion.div>

                {/* Key Features */}
                {features.length > 0 && (
                  <motion.div variants={FADE_IN_UP}>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      {i18n.language === "en" ? "Key Features" : "Kluczowe funkcje"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start p-4 bg-dark-800/50 rounded-lg border border-dark-700"
                        >
                          <FaCheckCircle className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <motion.div variants={FADE_IN_UP} className="space-y-8">
                {/* Actions Card */}
                <div className="p-6 bg-dark-800 rounded-xl border border-dark-700 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {i18n.language === "en" ? "Project Links" : "Linki projektu"}
                  </h3>
                  <div className="space-y-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-6 py-3 bg-primary-500 text-dark-900 font-bold rounded-lg hover:bg-primary-400 transition-all hover:shadow-lg hover:shadow-primary-500/20"
                      >
                        <FaExternalLinkAlt className="mr-2" /> {i18n.language === "en" ? "View Online" : "Zobacz online"}
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-6 py-3 bg-dark-700 text-white font-bold rounded-lg hover:bg-dark-600 transition-colors border border-dark-600"
                      >
                        <FaGithub className="mr-2" /> {i18n.language === "en" ? "View Code" : "Zobacz kod"}
                      </a>
                    )}
                    <Link
                      to={localizedPath("/#contact")}
                      className="flex items-center justify-center w-full px-6 py-3 bg-transparent text-gray-300 font-medium rounded-lg hover:text-white hover:bg-dark-700/50 transition-colors border border-transparent hover:border-dark-600"
                    >
                      {tc("nav.contact")}
                    </Link>
                  </div>

                  {/* Benefits */}
                  {benefits.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-dark-700">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                        {i18n.language === "en" ? "Benefits" : "Korzyści"}
                      </h4>
                      <ul className="space-y-3">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="w-1.5 h-1.5 bg-secondary-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
};

export default ProjectPage;
