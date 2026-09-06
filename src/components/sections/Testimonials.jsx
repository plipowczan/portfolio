import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaQuoteLeft, FaLinkedin, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";
import { testimonials } from "../../data/testimonials";
import { FADE_IN_UP, STAGGER_CONTAINER } from "../../utils/constants";

const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds

const TestimonialCard = ({ testimonial, lang }) => {
  const displayContent = lang === "en" && testimonial.contentOriginal
    ? testimonial.contentOriginal
    : testimonial.content;

  return (
    <div
      className="
        bg-white/5 backdrop-blur-sm
        border border-white/10 rounded-xl
        p-6 h-full flex flex-col
        transition-all duration-300
        hover:border-primary-500/30
        hover:shadow-[0_0_30px_rgba(0,255,157,0.1)]
      "
    >
      {/* Quote Icon */}
      <FaQuoteLeft className="text-primary-500/30 text-2xl mb-4" />

      {/* Content */}
      <div className="flex-1 mb-4">
        <p className="text-gray-300 leading-relaxed text-sm">
          "{displayContent}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
        <img
          src={testimonial.image}
          alt={testimonial.author}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {testimonial.author}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {testimonial.role}
          </p>
          <p className="text-primary-500/70 text-xs truncate">
            {testimonial.company}
          </p>
        </div>
        <a
          href={testimonial.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-primary-500 transition-colors p-2"
          aria-label={`Profil LinkedIn - ${testimonial.author}`}
        >
          <FaLinkedin className="text-lg" />
        </a>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { t, i18n } = useTranslation("home");
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Three independent reasons the carousel may be still: the pointer is over
  // it, keyboard focus is inside it, or the visitor stopped it. The first two
  // last only as long as they last; the third is a standing choice, so moving
  // the mouse away must not restart something deliberately stopped.
  //
  // The first two are read off the DOM at the moment of each tick rather than
  // tracked through events. Tracking them means the pause can go stale: pausing
  // by tearing the interval down waits on a React re-render, and a mirrored ref
  // can be overwritten by a sync effect carrying a value from before the pause.
  // Asking `document.activeElement` at tick time cannot go stale, and it is
  // less code than either. Neither failure was observed in the wild — this is a
  // design choice, not a bug fix.
  const carouselRef = useRef(null);
  const touchPausedRef = useRef(false);
  const stoppedRef = useRef(false);
  const [isStopped, setIsStopped] = useState(false);

  const setStopped = useCallback((value) => {
    stoppedRef.current = value;
    setIsStopped(value);
  }, []);

  const setTouchPaused = useCallback((value) => {
    touchPausedRef.current = value;
  }, []);

  // The preference can flip mid-session; the carousel follows it rather than
  // stranding the visitor with motion they just asked to stop.
  useEffect(() => {
    if (prefersReducedMotion) setStopped(true);
  }, [prefersReducedMotion, setStopped]);

  const isPausedNow = useCallback(() => {
    if (stoppedRef.current || touchPausedRef.current) return true;
    const node = carouselRef.current;
    if (!node) return false;
    // `:hover` covers the pointer without a pair of listeners to keep in step;
    // touch does not report it reliably, which is what `touchPausedRef` is for.
    return node.contains(document.activeElement) || node.matches(":hover");
  }, []);

  // Number of visible cards based on screen size (handled via CSS)
  const totalItems = testimonials.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedNow()) return;
      nextSlide();
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [nextSlide, isPausedNow]);

  // Get visible testimonials (3 for desktop, 1 for mobile - handled via CSS)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % totalItems;
      visible.push({ ...testimonials[index], displayIndex: i });
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 bg-dark-800/50 relative overflow-hidden"
    >
      <div className="section-container relative z-10">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {/* Section Title */}
          <motion.div variants={FADE_IN_UP} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              {t("testimonials.title")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t("testimonials.description")}
            </p>
          </motion.div>

          {/* Carousel Container */}
          <motion.div
            variants={FADE_IN_UP}
            ref={carouselRef}
            className="relative"
            onTouchStart={() => setTouchPaused(true)}
            onTouchEnd={() => setTouchPaused(false)}
          >
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="
                absolute left-0 top-1/2 -translate-y-1/2 z-10
                -translate-x-4 md:-translate-x-6
                w-11 h-11 md:w-12 md:h-12
                bg-dark-700/80 backdrop-blur-sm
                border border-white/10
                rounded-full
                flex items-center justify-center
                text-gray-400 hover:text-primary-500
                hover:border-primary-500/30
                transition-all duration-300
              "
              aria-label={t("testimonials.prev")}
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={nextSlide}
              className="
                absolute right-0 top-1/2 -translate-y-1/2 z-10
                translate-x-4 md:translate-x-6
                w-11 h-11 md:w-12 md:h-12
                bg-dark-700/80 backdrop-blur-sm
                border border-white/10
                rounded-full
                flex items-center justify-center
                text-gray-400 hover:text-primary-500
                hover:border-primary-500/30
                transition-all duration-300
              "
              aria-label={t("testimonials.next")}
            >
              <FaChevronRight />
            </button>

            {/* Cards Container */}
            {/* Polite live region: the slide changes on its own, so the change
                has to be announced rather than silently swapping the text. */}
            <div
              className="overflow-hidden mx-8 md:mx-14"
              role="region"
              aria-label={t("testimonials.region")}
              aria-live="polite"
              aria-atomic="false"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {visibleTestimonials.map((testimonial, idx) => (
                    <div
                      key={`${testimonial.id}-${idx}`}
                      className={`${idx > 0 ? "hidden md:block" : ""}`}
                    >
                      <TestimonialCard testimonial={testimonial} lang={i18n.language} />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Indicator, with the stop/resume toggle beside it */}
            {/* Eight 44 px targets fill 352 px of a 361 px phone content box,
                so there is no room for gaps and none of them may shrink — flex
                was squeezing the indicators to 42 px, just under the floor. The
                painted dot stays 8 px, so the row still reads as spaced out. */}
            <div className="flex justify-center items-center mt-8">
              <button
                onClick={() => setStopped(!stoppedRef.current)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                aria-label={isStopped ? t("testimonials.play") : t("testimonials.pause")}
                aria-pressed={isStopped}
              >
                {isStopped ? <FaPlay /> : <FaPause />}
              </button>
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                  aria-label={t("testimonials.goTo", { index: idx + 1 })}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      h-2 rounded-full transition-all duration-300
                      ${
                        idx === currentIndex
                          ? "bg-primary-500 w-6"
                          : "w-2 bg-gray-600"
                      }
                    `}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* LinkedIn CTA */}
          <motion.div variants={FADE_IN_UP} className="text-center pt-4">
            <a
              href="https://www.linkedin.com/in/pawellipowczan/details/recommendations/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                px-6 py-3
                border border-primary-500 text-primary-500
                hover:bg-primary-500/10
                rounded-lg
                transition-all duration-300
                text-sm font-medium
              "
            >
              <FaLinkedin />
              {t("testimonials.linkedinCta")}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl transform -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl transform translate-x-1/2" />
    </section>
  );
};

export default Testimonials;
