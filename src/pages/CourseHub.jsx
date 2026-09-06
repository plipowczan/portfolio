/**
 * @sitemapUpdated 2026-09-05
 *
 * Data ostatniej znaczacej zmiany tresci tej strony, czytana przez
 * scripts/update-sitemap.js. Trzymana tutaj, a nie wyciagana z historii
 * gita, bo srodowisko budujace klonuje repozytorium ze skrocona historia
 * i kazdy plik nietkniety od granicy skrotu raportowal te sama, falszywa
 * date. Zmieniasz tresc strony - zmieniasz te date.
 */
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import GrowingNetworkBackground from "../components/animations/GrowingNetworkBackground";
import CourseAudience from "../components/sections/CourseAudience";
import CourseFaq from "../components/sections/CourseFaq";
import SEO from "../components/seo/SEO";
import StructuredData from "../components/seo/StructuredData";
import { courseFaq } from "../data/courseFaq";
import { coursePosts } from "../data/coursePosts";
import { useIsFirstLoad } from "../hooks/useFirstLoad";
import { generateFAQSchema } from "../utils/faqExtractor";
import { FADE_IN_UP, SITE_CONFIG, STAGGER_CONTAINER } from "../utils/constants";

const REPO_URL = "https://github.com/plipowczan/second-brain-template";

// FAQPage JSON-LD built straight from the data module (no DOM extraction —
// that path exists for markdown lessons, where the DOM is the only structured
// source). The hub is the only non-lesson page emitting FAQ schema; the
// landing renders a subset of the same entries without markup.
const HUB_FAQ_SCHEMA = generateFAQSchema(
  courseFaq.filter((entry) => entry.surfaces.includes("hub")),
  `${SITE_CONFIG.url}/llm-wiki/kurs`
);

// Short one-line blurbs per lesson (from the deliverable Hub "spis lekcji").
const LESSON_BLURBS = {
  // L0 basics tier — non-technical primer.
  "0-co-to-drugi-mozg": "Po ludzku, bez techniki - o co w tym chodzi.",
  "0-trzy-pojecia": "Agent AI, repozytorium, markdown - rozbrojone.",
  "0-uruchom-w-swoim-narzedziu": "Gdzie i jak to odpalić, bez terminala.",
  "1-zaloz-katalog":
    "Czym jest LLM Wiki i jak postawić uzbrojoną, pustą bazę.",
  "2-onboarding": "Jeden wywiad konfiguruje całą bazę.",
  "3-pierwszy-ingest": "Zamień surowe źródło w noty i indeksy.",
  "4-pytania-i-zarzadzanie": "Pytaj bazę (nie czat) i utrzymuj jakość.",
  "5-rozwoj-i-publikacja": "Opublikuj bazę i co dalej.",
};

// L0 basics tier (order < 1: 0.1/0.2/0.3) vs the main L1–L5 course. Split so
// the hub can render the non-technical primer in its own section above.
const basicsLessons = coursePosts.filter((lesson) => lesson.order < 1);
const mainLessons = coursePosts.filter((lesson) => lesson.order >= 1);

/**
 * Single lesson row in the hub index — shared by the L0 basics tier and the
 * main L1–L5 list. Title is an h3 so it nests under each section's h2.
 * @param {{ lesson: { slug: string, order: number, title: string, excerpt: string } }} props
 */
const LessonLink = ({ lesson }) => (
  <li>
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
        <h3 className="font-mono text-base text-white">
          <span className="text-gray-600" aria-hidden="true">
            [[
          </span>
          {lesson.title}
          <span className="text-gray-600" aria-hidden="true">
            ]]
          </span>
        </h3>
        <p className="text-sm leading-relaxed text-gray-400">
          {LESSON_BLURBS[lesson.slug] || lesson.excerpt}
        </p>
      </div>
    </Link>
  </li>
);

const CourseHub = () => {
  // Wejście bezpośrednie dostaje prerenderowany, widoczny hub — hydratacja nie
  // ma go po co gasić. Patrz `useFirstLoad`.
  const entrance = useIsFirstLoad() ? false : "hidden";

  return (
    <>
      <SEO
        title="LLM Wiki - darmowy kurs: zbuduj własny second brain"
        description="Od «Use this template» do bazy wiedzy, która kumuluje się sama i zasila Twojego agenta. Krok po kroku, na darmowym szablonie - kurs rośnie o kolejne lekcje."
        path="/llm-wiki/kurs"
        // PL-only section: no alternate, so <SEO> emits no hreflang. A
        // /en/llm-wiki/kurs mirror does not exist.
        // Shared course OG (hub + all lessons use the same card).
        image="/images/og-llm-wiki-kurs.webp"
      />

      <StructuredData schema={HUB_FAQ_SCHEMA} />

      <section className="relative flex min-h-screen items-center overflow-hidden py-24 md:py-32">
        <GrowingNetworkBackground />

        <div className="section-container relative z-10">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial={entrance}
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

            {/* Basics tier (L0) — non-technical primer, above the main course */}
            {basicsLessons.length > 0 && (
              <motion.div variants={FADE_IN_UP} className="space-y-3">
                <p className="select-none font-mono text-xs text-gray-600">
                  podstawy.md
                </p>
                <h2 className="text-lg font-bold text-white md:text-xl">
                  Zanim zaczniesz - podstawy{" "}
                  <span className="text-gray-400">(dla początkujących)</span>
                </h2>
                <p className="text-sm leading-relaxed text-gray-400">
                  Nie programujesz? Zacznij tu. Trzy krótkie lekcje bez żargonu
                  - o co w tym chodzi, trzy pojęcia i jak to odpalić w swoim
                  narzędziu. Kto zna temat, przeskakuje od razu do lekcji 1.
                </p>
                <ul className="space-y-3 pt-1">
                  {basicsLessons.map((lesson) => (
                    <LessonLink key={lesson.slug} lesson={lesson} />
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Main course (L1–L5) */}
            <motion.div variants={FADE_IN_UP} className="space-y-3">
              <p className="select-none font-mono text-xs text-gray-600">
                spis-lekcji.md
              </p>
              <h2 className="text-lg font-bold text-white md:text-xl">
                Kurs właściwy{" "}
                <span className="text-gray-400">(lekcje 1-5)</span>
              </h2>
              <ul className="space-y-3">
                {mainLessons.map((lesson) => (
                  <LessonLink key={lesson.slug} lesson={lesson} />
                ))}
              </ul>
            </motion.div>

            {/* Audience + prerequisites — shared with the landing */}
            <CourseAudience />

            {/* Objections FAQ — full set; source: src/data/courseFaq.js */}
            <CourseFaq surface="hub" />

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
