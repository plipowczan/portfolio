import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCalendar, FaClock, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import StructuredData from "../components/seo/StructuredData";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { getPostsByLang } from "../data/blogPosts";
import useLocalizedPath from "../hooks/useLocalizedPath";
import { FADE_IN_UP, SITE_CONFIG, STAGGER_CONTAINER } from "../utils/constants";

const BlogCard = ({ post, localizedPath, readMoreLabel, isFirst = false }) => {
  return (
    <motion.article variants={FADE_IN_UP} className="card blog-card group">
      {/* Featured Image */}
      <div className="relative overflow-hidden rounded-lg mb-6 bg-dark-600 h-48">
        {/*
          The first card is this page's LCP candidate, so it stays eager and
          priority-hinted; marking it lazy is its own Lighthouse penalty.
          Every other card is lazy — the rest of the first row is inside the
          viewport and still fetches immediately, while the ~27 below the fold
          stop blocking first paint.
        */}
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading={isFirst ? "eager" : "lazy"}
          fetchPriority={isFirst ? "high" : "auto"}
        />
      </div>

      {/* Category */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white group-hover:text-primary-500 transition-colors mb-3">
        <Link to={localizedPath(`/blog/${post.slug}`)}>{post.title}</Link>
      </h2>

      {/* Excerpt */}
      <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-2">
          <FaCalendar />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaClock />
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs text-gray-400 flex items-center space-x-1"
          >
            <FaTag className="text-primary-500" />
            <span>{tag}</span>
          </span>
        ))}
      </div>

      {/* Read More Link */}
      <Link
        to={localizedPath(`/blog/${post.slug}`)}
        className="text-primary-500 hover:text-primary-400 font-medium inline-flex items-center space-x-2 group/link"
      >
        <span>{readMoreLabel}</span>
        <span className="group-hover/link:translate-x-1 transition-transform">
          →
        </span>
      </Link>
    </motion.article>
  );
};

const Blog = () => {
  const { t, i18n } = useTranslation("common");
  const localizedPath = useLocalizedPath();
  const posts = getPostsByLang(i18n.language);

  return (
    <>
      <SEO
        title="Blog"
        description={t("blog.seoDescription")}
        path={localizedPath("/blog")}
        image="/images/og-blog.webp"
        mirroredByPrefix
      />
      <StructuredData
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: t("blog.home"),
              item: `${SITE_CONFIG.url}${localizedPath("/")}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${SITE_CONFIG.url}${localizedPath("/blog")}`,
            },
          ],
        }}
      />

      <div className="min-h-screen py-24 md:py-32">
        <div className="section-container">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Page Header */}
            <motion.div variants={FADE_IN_UP} className="text-center space-y-4">
              <div className="flex justify-center">
                <Breadcrumbs
                  items={[
                    { label: t("blog.home"), path: localizedPath("/") },
                    { label: "Blog", path: localizedPath("/blog") },
                  ]}
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold gradient-text">
                {t("blog.title")}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {t("blog.description")}
              </p>
            </motion.div>

            {/* Blog Posts Grid */}
            <motion.div
              variants={STAGGER_CONTAINER}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  localizedPath={localizedPath}
                  readMoreLabel={t("blog.readMore")}
                  isFirst={index === 0}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog;
