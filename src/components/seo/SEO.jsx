import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { SITE_CONFIG } from "../../utils/constants";
import {
  SEO_TAG_ATTR,
  removePrerenderedHead,
} from "../../utils/prerenderedHead";

// Spread last on every tag below. The mark is how the prerendered copies are
// told apart from these on mount (see utils/prerenderedHead.js); placing it
// last keeps the attribute order scripts/verify-prerender-output.mjs reads.
const seoTag = { [SEO_TAG_ATTR]: "" };

/**
 * Page-level metadata: title, description, canonical, hreflang, OG, Twitter.
 *
 * The tags are returned as a plain fragment — React 19 hoists `<title>`,
 * `<meta>` and `<link>` into `<head>` itself, as part of committing the render.
 * No metadata library is involved: `react-helmet-async` did this in an effect,
 * which `<React.StrictMode>` broke by double-invoking (mount, cleanup, mount)
 * until `<head>` came out empty in dev.
 *
 * @param {{
 *   title?: string,
 *   description?: string,
 *   path?: string,
 *   image?: string,
 *   article?: boolean,
 *   publishedTime?: string,
 *   modifiedTime?: string,
 *   author?: string,
 *   alternateUrl?: string,
 *   mirroredByPrefix?: boolean,
 * }} props
 *
 * `path` must already carry the `/en` prefix on English routes (use
 * `useLocalizedPath()`), so every URL canonicalises to itself.
 *
 * The alternate-language URL comes from data, never from string surgery on the
 * current path: a page that owns the mapping passes `alternateUrl` (blog posts
 * resolve it through `getAlternatePost()`), and a page whose two versions
 * genuinely are the same path with an `/en` prefix opts in with
 * `mirroredByPrefix`. Without either, no `alternate` tag is emitted — a
 * guessed URL that 404s is worse than a missing tag.
 *
 * The default title (`<name> | <tagline>`) and the default description are the
 * `siteConfig.*` locale keys of the page's language, never a constant: a
 * constant is one language, and the English routes would inherit it.
 *
 * On a prerendered page `<head>` already holds these tags when the app mounts,
 * and React 19 adds its own beside them rather than reusing them. The layout
 * effect removes the prerendered copies in the same commit that inserts these,
 * so the document never holds two sets — see `utils/prerenderedHead.js`.
 */
const SEO = ({
  title,
  description,
  path = "/",
  image,
  article = false,
  publishedTime,
  modifiedTime,
  author,
  alternateUrl,
  mirroredByPrefix = false,
}) => {
  const { t, i18n } = useTranslation();
  useLayoutEffect(() => removePrerenderedHead(), []);
  const siteUrl = SITE_CONFIG.url;
  const currentLang = i18n.language;

  // Ensure path starts with /
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${formattedPath}`;

  const metaTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${t("siteConfig.title")}`;

  const metaDescription = description || t("siteConfig.description");

  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}${SITE_CONFIG.ogImage}`;

  const isEnglish = currentLang === "en";

  // Only for pages that opted in via `mirroredByPrefix`.
  const prefixMirrorUrl = isEnglish
    ? `${siteUrl}${formattedPath.replace(/^\/en(?=\/|$)/, "") || "/"}`
    : `${siteUrl}/en${formattedPath}`;

  const resolvedAlternate =
    alternateUrl || (mirroredByPrefix ? prefixMirrorUrl : null);

  // An alternate pointing back at this very page is not an alternate. Guarding
  // here keeps a self-referential `alternateUrl` from producing an hreflang
  // pair that contradicts sitemap.xml.
  const hasAlternate = Boolean(
    resolvedAlternate && resolvedAlternate !== canonicalUrl,
  );

  const plUrl = isEnglish ? resolvedAlternate : canonicalUrl;
  const enUrl = isEnglish ? canonicalUrl : resolvedAlternate;

  return (
    <>
      <title {...seoTag}>{metaTitle}</title>
      <meta name="description" content={metaDescription} {...seoTag} />
      <link rel="canonical" href={canonicalUrl} {...seoTag} />

      {/* Hreflang — emitted as a complete set or not at all */}
      {hasAlternate && (
        <link rel="alternate" hreflang="pl" href={plUrl} {...seoTag} />
      )}
      {hasAlternate && (
        <link rel="alternate" hreflang="en" href={enUrl} {...seoTag} />
      )}
      {hasAlternate && (
        <link rel="alternate" hreflang="x-default" href={plUrl} {...seoTag} />
      )}

      {/* Open Graph */}
      <meta property="og:url" content={canonicalUrl} {...seoTag} />
      <meta
        property="og:type"
        content={article ? "article" : "website"}
        {...seoTag}
      />
      <meta property="og:title" content={metaTitle} {...seoTag} />
      <meta property="og:description" content={metaDescription} {...seoTag} />
      <meta property="og:image" content={metaImage} {...seoTag} />
      <meta property="og:image:width" content="1200" {...seoTag} />
      <meta property="og:image:height" content="630" {...seoTag} />
      <meta
        property="og:locale"
        content={currentLang === "en" ? "en_US" : "pl_PL"}
        {...seoTag}
      />

      {/* Article Specific Meta Tags */}
      {article && publishedTime && (
        <meta
          property="article:published_time"
          content={publishedTime}
          {...seoTag}
        />
      )}
      {article && modifiedTime && (
        <meta
          property="article:modified_time"
          content={modifiedTime}
          {...seoTag}
        />
      )}
      {article && author && (
        <meta property="article:author" content={author} {...seoTag} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" {...seoTag} />
      <meta name="twitter:title" content={metaTitle} {...seoTag} />
      <meta name="twitter:description" content={metaDescription} {...seoTag} />
      <meta name="twitter:image" content={metaImage} {...seoTag} />
    </>
  );
};

export default SEO;
