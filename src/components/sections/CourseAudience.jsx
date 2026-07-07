import { motion } from "framer-motion";
import {
  COURSE_AUDIENCE_HEADING,
  courseAudienceDescription,
  coursePrerequisites,
  coursePrerequisitesIntro,
} from "../../data/coursePrerequisites";
import { FADE_IN_UP } from "../../utils/constants";

/**
 * "Dla kogo jest ten kurs" — audience description plus prerequisite concepts,
 * each with a one-sentence plain-Polish definition. Rendered on the /llm-wiki
 * landing (before the waitlist form) and on the /llm-wiki/kurs hub, both fed
 * from src/data/coursePrerequisites.js so the copy cannot drift.
 */
const CourseAudience = () => {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="space-y-3"
      data-testid="course-audience"
    >
      <p
        className="select-none font-mono text-xs text-gray-600"
        aria-hidden="true"
      >
        dla-kogo.md
      </p>
      <h2 className="text-lg font-bold text-white md:text-xl">
        {COURSE_AUDIENCE_HEADING}
      </h2>
      <p className="text-sm leading-relaxed text-gray-400 md:text-base">
        {courseAudienceDescription}
      </p>
      <p className="text-sm leading-relaxed text-gray-400 md:text-base">
        {coursePrerequisitesIntro}
      </p>
      <dl className="space-y-2">
        {coursePrerequisites.map((item) => (
          <div key={item.term} className="flex items-baseline gap-3">
            <span
              className="select-none font-mono text-primary-500"
              aria-hidden="true"
            >
              ◍
            </span>
            <div>
              <dt className="inline font-mono text-sm text-white">
                <span className="text-gray-600">[[</span>
                {item.term}
                <span className="text-gray-600">]]</span>
              </dt>{" "}
              <dd className="inline text-sm leading-relaxed text-gray-400">
                {item.definition}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </motion.div>
  );
};

export default CourseAudience;
