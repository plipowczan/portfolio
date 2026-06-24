import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaQuoteLeft, FaLinkedin, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

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
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="
                absolute left-0 top-1/2 -translate-y-1/2 z-10
                -translate-x-4 md:-translate-x-6
                w-10 h-10 md:w-12 md:h-12
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
                w-10 h-10 md:w-12 md:h-12
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
            <div className="overflow-hidden mx-8 md:mx-14">
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

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${
                      idx === currentIndex
                        ? "bg-primary-500 w-6"
                        : "bg-gray-600 hover:bg-gray-500"
                    }
                  `}
                  aria-label={t("testimonials.goTo", { index: idx + 1 })}
                />
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
