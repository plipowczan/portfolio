/**
 * The prerendered head tags, swapped out once the app renders its own.
 *
 * `scripts/prerender.mjs` saves every route with the `<title>`, description,
 * canonical, hreflang, Open Graph and Twitter tags `<SEO>` rendered into it.
 * The app then mounts with `createRoot`, and React 19 reuses an existing head
 * tag only while hydrating — on a plain render it creates its own and inserts
 * it next to the static one. Every page ended up with two of each, and after a
 * client-side navigation the static set still described the page the visitor
 * first landed on. `hydrateRoot` is not the way out: the saved file is a DOM
 * snapshot, not React server output, so hydration has nothing to match against.
 *
 * `<SEO>` therefore marks every tag it emits with `SEO_TAG_ATTR`, and the saved
 * file carries the mark too. `main.jsx` collects the marked tags right before
 * React renders — at that moment each of them came from the file — and `<SEO>`
 * removes them in a layout effect, in the commit that inserts its own. There
 * is never a frame with two sets, and never one with none: a lazy route keeps
 * the prerendered set until its page chunk arrives and replaces it.
 *
 * Both calls are idempotent. The list empties itself, so StrictMode's double
 * effect and every later `<SEO>` mount find nothing left to remove.
 *
 * No React dependency — this only touches `document.head`.
 */
export const SEO_TAG_ATTR = "data-seo";

let prerendered = [];

/** Call once, before the first render. */
export const collectPrerenderedHead = () => {
  prerendered = [...document.head.querySelectorAll(`[${SEO_TAG_ATTR}]`)];
};

/** Removes the collected tags. Safe to call any number of times. */
export const removePrerenderedHead = () => {
  for (const node of prerendered) node.remove();
  prerendered = [];
};
