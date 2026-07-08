import { motion } from "framer-motion";
import { COURSE_FAQ_HEADING, courseFaq } from "../../data/courseFaq";
import { FADE_IN_UP } from "../../utils/constants";

// Living-note file label per surface — the hub reads as a FAQ note, the
// landing block is framed as the objections note from the sales deck.
const SURFACE_LABELS = {
  hub: "faq.md",
  landing: "obiekcje.md",
};

/**
 * Objections FAQ in the living-note aesthetic, fed from src/data/courseFaq.js.
 * Renders only the entries tagged for the given surface, so the hub shows the
 * full set while the landing shows the conversion-critical subset. Contains no
 * links by design: the landing renders it pre-signup, where repo/course links
 * must stay gated.
 * @param {{ surface: "hub" | "landing" }} props
 */
const CourseFaq = ({ surface }) => {
  const entries = courseFaq.filter((entry) =>
    entry.surfaces.includes(surface)
  );

  if (entries.length === 0) return null;

  return (
    <motion.div
      variants={FADE_IN_UP}
      className="space-y-4"
      data-testid="course-faq"
    >
      <p
        className="select-none font-mono text-xs text-gray-600"
        aria-hidden="true"
      >
        {SURFACE_LABELS[surface]}
      </p>
      <h2 className="text-lg font-bold text-white md:text-xl">
        {COURSE_FAQ_HEADING}
      </h2>
      <dl className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <dt className="font-mono text-base text-white">
              <span className="text-gray-600">[[</span>
              {entry.question}
              <span className="text-gray-600">]]</span>
            </dt>
            <dd className="text-sm leading-relaxed text-gray-400 md:text-base">
              {entry.answer}
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
};

export default CourseFaq;
