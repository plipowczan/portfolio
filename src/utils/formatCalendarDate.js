/**
 * Formats an ISO `YYYY-MM-DD` date as that calendar day in the given locale.
 *
 * `new Date("2026-10-28")` is midnight UTC, so formatting it in the visitor's
 * own time zone prints the 27th anywhere west of UTC. The app mounts with
 * `createRoot`, which re-renders the prerendered page in each visitor's
 * browser, so the date is formatted in UTC: the day written in the source is
 * the day every visitor reads.
 *
 * Requirements: openspec/specs/policy-pages/spec.md
 *
 * @param {string} isoDate calendar day, `YYYY-MM-DD`
 * @param {string} locale BCP 47 tag, e.g. `pl-PL`
 * @returns {string}
 */
export function formatCalendarDate(isoDate, locale) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(locale, {
    timeZone: "UTC",
  });
}
