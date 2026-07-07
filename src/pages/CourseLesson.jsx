import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/seo/SEO";
import StructuredData from "../components/seo/StructuredData";
import ArticleTOC from "../components/ui/ArticleTOC";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import MarkdownContent from "../components/ui/MarkdownContent";
import { getLessonBySlug, getPrevNext } from "../data/coursePosts";
import { extractFAQ, generateFAQSchema } from "../utils/faqExtractor";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";

const CourseLesson = () => {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const contentRef = useRef(null);
  const [faqSchema, setFaqSchema] = useState(null);

  // After the markdown renders, extract any FAQ section (H2 "FAQ" → H3 Q / P A)
  // and emit FAQPage JSON-LD — same DOM-based extraction the blog uses, so the
  // prerender captures the schema. Hook runs before the early return below to
  // keep hook order stable when a slug is unknown.
  useEffect(() => {
    if (!lesson) {
      setFaqSchema(null);
      return;
    }
    const timer = setTimeout(() => {
      if (!contentRef.current) return;
      const faqData = extractFAQ(contentRef.current);
      if (faqData.hasFAQ) {
        const url = `${SITE_CONFIG.url}/llm-wiki/kurs/${lesson.slug}`;
        setFaqSchema(generateFAQSchema(faqData.questions, url));
      } else {
        setFaqSchema(null);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [lesson]);

  // Unknown slug → graceful "not found" state (mirror blog post-not-found).
  if (!lesson) {
    return (
      <>
        <SEO
          title="Lekcja nie znaleziona"
          description="Nie znaleźliśmy tej lekcji kursu LLM Wiki."
          path="/llm-wiki/kurs"
          alternateUrl={`${SITE_CONFIG.url}/llm-wiki/kurs`}
        />

        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Lekcja nie znaleziona
            </h1>
            <Link to="/llm-wiki/kurs" className="btn-primary">
              ← Wróć do kursu
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { prev, next } = getPrevNext(slug);
  const lessonUrl = `${SITE_CONFIG.url}/llm-wiki/kurs/${lesson.slug}`;

  // Build <source> list from optional frontmatter. Type is derived from the
  // extension so an author can put either webm or mp4 in `video`; `videoMp4`
  // is always the H.264 fallback. Empty when the lesson has no recording yet.
  const screencastSources = [
    lesson.video && {
      src: lesson.video,
      type: lesson.video.endsWith(".mp4") ? "video/mp4" : "video/webm",
    },
    lesson.videoMp4 && { src: lesson.videoMp4, type: "video/mp4" },
  ].filter(Boolean);

  return (
    <>
      <SEO
        title={lesson.title}
        description={lesson.excerpt}
        path={`/llm-wiki/kurs/${lesson.slug}`}
        // PL-only lesson: point the en-alternate at this lesson's own PL URL so
        // no /en mirror leaks to crawlers.
        alternateUrl={lessonUrl}
        // Shared course OG (same card across hub + all lessons).
        image="/images/og-llm-wiki-kurs.webp"
        article={true}
      />

      {/* FAQPage JSON-LD — null until an FAQ section is found in the content */}
      <StructuredData schema={faqSchema} />

      <article className="min-h-screen py-24 md:py-32">
        <div className="section-container">
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
            {/* Main lesson content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={FADE_IN_UP}
              className="w-full min-w-0 space-y-8"
            >
              {/* Breadcrumbs */}
              <Breadcrumbs
                items={[
                  { label: "Home", path: "/" },
                  { label: "Kurs", path: "/llm-wiki/kurs" },
                  { label: lesson.title, path: null },
                ]}
              />

              {/* Progress */}
              <div className="font-mono text-sm text-primary-500">
                Lekcja {String(lesson.order).padStart(2, "0")}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {lesson.title}
              </h1>

              {/* Screencast slot — lesson recording when present, else placeholder */}
              {screencastSources.length > 0 ? (
                <video
                  className="aspect-video w-full rounded-xl border border-white/10 bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  poster={lesson.poster || "/images/og-llm-wiki-kurs.webp"}
                >
                  {screencastSources.map((s) => (
                    <source key={s.src} src={s.src} type={s.type} />
                  ))}
                  Twoja przeglądarka nie odtworzy tego wideo.
                </video>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary-500/20 bg-dark-800/50">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500/10"
                    aria-hidden="true"
                  >
                    <FaPlay className="text-primary-500" />
                  </div>
                  <p className="font-mono text-sm text-gray-500">
                    Screencast wkrótce
                  </p>
                </div>
              )}

              {/* Lesson body */}
              <MarkdownContent content={lesson.content} contentRef={contentRef} />

              {/* Prev / next navigation */}
              <nav
                aria-label="Nawigacja po lekcjach"
                className="grid gap-4 border-t border-gray-700 pt-8 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    to={`/llm-wiki/kurs/${prev.slug}`}
                    className="group flex flex-col rounded-lg border border-white/10 bg-dark-800/50 p-4 transition-colors hover:border-primary-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <span className="flex items-center gap-2 font-mono text-xs text-gray-500">
                      <FaArrowLeft size={12} /> Poprzednia
                    </span>
                    <span className="mt-1 text-white group-hover:text-primary-400">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {next ? (
                  <Link
                    to={`/llm-wiki/kurs/${next.slug}`}
                    className="group flex flex-col rounded-lg border border-white/10 bg-dark-800/50 p-4 text-right transition-colors hover:border-primary-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:col-start-2"
                  >
                    <span className="flex items-center justify-end gap-2 font-mono text-xs text-gray-500">
                      Następna <FaArrowRight size={12} />
                    </span>
                    <span className="mt-1 text-white group-hover:text-primary-400">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <span className="sm:col-start-2" />
                )}
              </nav>

              {/* Bottom CTA → waitlist */}
              <div className="space-y-3 rounded-lg border border-primary-500/20 bg-dark-700 p-5">
                <p className="text-gray-300">
                  Zostaw maila - dam znać, gdy ruszą gotowe paczki wiedzy.
                </p>
                <Link to="/llm-wiki" className="btn-primary inline-block">
                  Zapisz się na listę →
                </Link>
              </div>
            </motion.div>

            {/* TOC — desktop sidebar + mobile drawer */}
            <ArticleTOC contentRef={contentRef} contentKey={lesson.slug} />
          </div>
        </div>
      </article>
    </>
  );
};

export default CourseLesson;
