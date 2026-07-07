import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import GrowingNetworkBackground from "../components/animations/GrowingNetworkBackground";
import CourseAudience from "../components/sections/CourseAudience";
import SEO from "../components/seo/SEO";
import { coursePosts } from "../data/coursePosts";
import { FADE_IN_UP, SITE_CONFIG, STAGGER_CONTAINER } from "../utils/constants";

const REPO_URL = "https://github.com/plipowczan/second-brain-template";

// Short one-line blurbs per lesson (from the deliverable Hub "spis lekcji").
const LESSON_BLURBS = {
  "1-zaloz-katalog":
    "Czym jest LLM Wiki i jak postawić uzbrojoną, pustą bazę.",
  "2-onboarding": "Jeden wywiad konfiguruje całą bazę.",
  "3-pierwszy-ingest": "Zamień surowe źródło w noty i indeksy.",
  "4-pytania-i-zarzadzanie": "Pytaj bazę (nie czat) i utrzymuj jakość.",
  "5-rozwoj-i-publikacja": "Opublikuj bazę i co dalej.",
};

const CourseHub = () => {
  return (
    <>
      <SEO
        title="LLM Wiki - darmowy kurs: zbuduj własny second brain"
        description="Od «Use this template» do bazy wiedzy, która kumuluje się sama i zasila Twojego agenta. Krok po kroku, na darmowym szablonie - kurs rośnie o kolejne lekcje."
        path="/llm-wiki/kurs"
        // PL-only section: point the en-alternate at the PL URL so no
        // /en/llm-wiki/kurs mirror leaks to crawlers.
        alternateUrl={`${SITE_CONFIG.url}/llm-wiki/kurs`}
        // Shared course OG (hub + all lessons use the same card).
        image="/images/og-llm-wiki-kurs.webp"
      />

      <section className="relative flex min-h-screen items-center overflow-hidden py-24 md:py-32">
        <GrowingNetworkBackground />

        <div className="section-container relative z-10">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl space-y-8 rounded-xl border border-primary-500/20 bg-dark-800/50 p-6 backdrop-blur-sm md:p-10"
          >
            {/* Eyebrow */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex items-center gap-2 font-mono text-xs text-gray-500 md:text-sm"
            >
              <span>second-brain/llm-wiki/kurs.md</span>
              <span className="text-primary-500" aria-hidden="true">
                ●
              </span>
              <span className="text-primary-500">free</span>
            </motion.div>

            {/* Title + subtitle */}
            <motion.div variants={FADE_IN_UP} className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                <span className="font-mono text-primary-500" aria-hidden="true">
                  #
                </span>{" "}
                <span className="gradient-text">
                  LLM Wiki - darmowy kurs: zbuduj własny second brain
                </span>
              </h1>
              <p className="text-base text-gray-400 md:text-lg">
                Od «Use this template» do bazy wiedzy, która kumuluje się sama i
                zasila Twojego agenta. Krok po kroku, na darmowym szablonie -
                kurs rośnie o kolejne lekcje.
              </p>
            </motion.div>

            {/* Lesson index */}
            <motion.div variants={FADE_IN_UP} className="space-y-3">
              <p className="select-none font-mono text-xs text-gray-600">
                spis-lekcji.md
              </p>
              <ul className="space-y-3">
                {coursePosts.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      to={`/llm-wiki/kurs/${lesson.slug}`}
                      className="group flex items-baseline gap-3 rounded-lg border border-transparent p-3 -m-3 transition-colors hover:border-primary-500/20 hover:bg-dark-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <span className="select-none font-mono text-sm text-gray-600">
                        {String(lesson.order).padStart(2, "0")}
                      </span>
                      <span
                        className="select-none font-mono text-primary-500"
                        aria-hidden="true"
                      >
                        ◍
                      </span>
                      <div>
                        <h2 className="font-mono text-base text-white">
                          <span className="text-gray-600">[[</span>
                          {lesson.title}
                          <span className="text-gray-600">]]</span>
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-400">
                          {LESSON_BLURBS[lesson.slug] || lesson.excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audience + prerequisites — shared with the landing */}
            <CourseAudience />

            {/* Repo link */}
            <motion.div variants={FADE_IN_UP}>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-primary-500 hover:text-primary-400"
              >
                <FaGithub size={16} />
                second-brain-template - weź szablon na GitHubie →
              </a>
            </motion.div>

            {/* CTA → waitlist */}
            <motion.div
              variants={FADE_IN_UP}
              className="space-y-3 rounded-lg border border-primary-500/20 bg-dark-700 p-5"
            >
              <p className="text-gray-300">
                Zostaw maila - dam znać, gdy ruszą gotowe paczki wiedzy.
              </p>
              <Link to="/llm-wiki" className="btn-primary inline-block">
                Zapisz się na listę →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CourseHub;
