import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SITE_CONFIG } from "../../utils/constants";

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

  // Build hreflang URLs
  const plUrl = currentLang === "en"
    ? (alternateUrl || canonicalUrl.replace("/en/", "/").replace("/en", "/"))
    : canonicalUrl;
  const enUrl = currentLang === "en"
    ? canonicalUrl
    : (alternateUrl || `${siteUrl}/en${formattedPath}`);

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang Alternate Links */}
      <link rel="alternate" hreflang="pl" href={plUrl} />
      <link rel="alternate" hreflang="en" href={enUrl} />
      <link rel="alternate" hreflang="x-default" href={plUrl} />

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
    </Helmet>
  );
};

export default SEO;
