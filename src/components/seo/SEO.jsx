import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "../../utils/constants";

const SEO = ({
  title,
  description,
  path = "/",
  image,
  article = false,
  publishedTime,
  author,
}) => {
  const siteUrl = SITE_CONFIG.url;
  // Ensure path starts with /
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${formattedPath}`;

  const metaTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`;

  const metaDescription = description || SITE_CONFIG.description;

  // Handle image URL - if it's absolute, use it; otherwise prepend siteUrl
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/images/og-home.webp`;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Article Specific Meta Tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
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
