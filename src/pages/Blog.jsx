import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FaCalendar, FaClock, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import { FADE_IN_UP, SITE_CONFIG, STAGGER_CONTAINER } from "../utils/constants";

const BlogCard = ({ post }) => {
  return (
    <motion.article variants={FADE_IN_UP} className="card blog-card group">
      {/* Featured Image */}
      <div className="relative overflow-hidden rounded-lg mb-6 bg-dark-600 h-48">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      {/* Excerpt */}
      <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
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
            className="text-xs text-gray-500 flex items-center space-x-1"
          >
            <FaTag className="text-primary-500" />
            <span>{tag}</span>
          </span>
        ))}
      </div>

      {/* Read More Link */}
      <Link
        to={`/blog/${post.slug}`}
        className="text-primary-500 hover:text-primary-400 font-medium inline-flex items-center space-x-2 group/link"
      >
        <span>Read More</span>
        <span className="group-hover/link:translate-x-1 transition-transform">
          →
        </span>
      </Link>
    </motion.article>
  );
};

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog | {SITE_CONFIG.name}</title>
        <meta
          name="description"
          content="Technical articles and insights about web development, React, and modern technologies."
        />
        <link rel="canonical" href={`${SITE_CONFIG.url}/blog`} />
        <meta property="og:title" content={`Blog - ${SITE_CONFIG.name}`} />
        <meta
          property="og:description"
          content="Technical articles and insights about web development"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_CONFIG.url}/blog`} />
        <meta
          property="og:image"
          content={`${SITE_CONFIG.url}/images/og-blog.webp`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Blog - ${SITE_CONFIG.name}`} />
        <meta
          name="twitter:description"
          content="Technical articles and insights about web development, React, and modern technologies."
        />
        <meta
          name="twitter:image"
          content={`${SITE_CONFIG.url}/images/og-blog.webp`}
        />
      </Helmet>

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
              <h1 className="text-5xl md:text-6xl font-bold gradient-text">
                Tech Blog
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Insights, tutorials, and thoughts on web development and
                technology.
              </p>
            </motion.div>

            {/* Blog Posts Grid */}
            <motion.div
              variants={STAGGER_CONTAINER}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog;
