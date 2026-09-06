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
 * Renders the entries tagged for the given surface (currently the full set on
 * both pages). On the hub entries are an open list; on the landing each entry
 * is a native details/summary accordion, collapsed by default, so the block
 * stays compact on the conversion page. Contains no links by design: the
 * landing renders it pre-signup, where repo/course links must stay gated.
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
        className="select-none font-mono text-xs text-gray-400"
        aria-hidden="true"
      >
        {SURFACE_LABELS[surface]}
      </p>
      <h2 className="text-lg font-bold text-white md:text-xl">
        {COURSE_FAQ_HEADING}
      </h2>

      {surface === "landing" ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <details key={entry.id} className="group">
              <summary className="flex cursor-pointer list-none items-baseline gap-2 rounded font-mono text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                <span
                  className="select-none text-primary-500 transition-transform group-open:rotate-90"
                  aria-hidden="true"
                >
                  ▸
                </span>
                <span>
                  <span className="text-gray-500" aria-hidden="true">
                    [[
                  </span>
                  {entry.question}
                  <span className="text-gray-500" aria-hidden="true">
                    ]]
                  </span>
                </span>
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-gray-400 md:text-base">
                {entry.answer}
              </p>
            </details>
          ))}
        </div>
      ) : (
        <dl className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <dt className="font-mono text-base text-white">
                <span className="text-gray-500" aria-hidden="true">
                  [[
                </span>
                {entry.question}
                <span className="text-gray-500" aria-hidden="true">
                  ]]
                </span>
              </dt>
              <dd className="text-sm leading-relaxed text-gray-400 md:text-base">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </motion.div>
  );
};

export default CourseFaq;
