import { useTranslation } from "react-i18next";
import { SITE_CONFIG } from "../../utils/constants";

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
  const { i18n } = useTranslation();
  const siteUrl = SITE_CONFIG.url;
  const currentLang = i18n.language;

  // Ensure path starts with /
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${formattedPath}`;

  const metaTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`;

  const metaDescription = description || SITE_CONFIG.description;

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
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang — emitted as a complete set or not at all */}
      {hasAlternate && <link rel="alternate" hreflang="pl" href={plUrl} />}
      {hasAlternate && <link rel="alternate" hreflang="en" href={enUrl} />}
      {hasAlternate && (
        <link rel="alternate" hreflang="x-default" href={plUrl} />
      )}

      {/* Open Graph */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={currentLang === "en" ? "en_US" : "pl_PL"} />

      {/* Article Specific Meta Tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </>
  );
};

export default SEO;
