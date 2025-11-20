import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FaArrowLeft, FaCalendar, FaClock, FaTag } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import StructuredData from "../components/seo/StructuredData";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | {SITE_CONFIG.name}</title>
          <meta
            name="description"
            content="The requested blog post could not be found."
          />
          <meta property="og:title" content="Post Not Found" />
          <meta
            property="og:description"
            content="The requested blog post could not be found."
          />
        </Helmet>

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Post Not Found
            </h1>
            <Link to="/blog" className="btn-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.date,
    image: `${SITE_CONFIG.url}${post.image}`,
    articleBody: post.excerpt, // Using excerpt as body summary for now
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
  };

  return (
    <>
      <Helmet>
        <title>
          {post.title} | {SITE_CONFIG.name}
        </title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`${SITE_CONFIG.url}/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${SITE_CONFIG.url}/blog/${post.slug}`}
        />
        <meta property="og:image" content={`${SITE_CONFIG.url}${post.image}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta
          name="twitter:image"
          content={`${SITE_CONFIG.url}${post.image}`}
        />
      </Helmet>
      <StructuredData schema={blogPostingSchema} />

      <article className="min-h-screen py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="space-y-8"
          >
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Blog</span>
            </Link>

            {/* Category Badge */}
            <div>
              <span className="px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-8 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-primary-500" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-primary-500" />
                <span>{post.readTime}</span>
              </div>
              <div>
                By <span className="text-primary-500">{post.author}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-xl bg-dark-700 h-96">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-4xl font-bold text-white mt-12 mb-6"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-3xl font-bold text-white mt-10 mb-4"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-2xl font-bold text-white mt-8 mb-3"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-gray-300 leading-relaxed mb-6"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="px-2 py-1 bg-dark-700 text-primary-500 rounded text-sm font-mono"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block px-6 py-4 bg-dark-700 text-primary-500 rounded-lg overflow-x-auto font-mono text-sm"
                        {...props}
                      />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre
                      className="mb-6 rounded-lg overflow-hidden"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside text-gray-300 mb-6 space-y-2"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside text-gray-300 mb-6 space-y-2"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-300" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-primary-500 hover:text-primary-400 underline"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-primary-500 pl-6 italic text-gray-400 my-6"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="pt-8 border-t border-gray-700">
              <div className="flex flex-wrap gap-3">
                <span className="text-gray-400 flex items-center space-x-2">
                  <FaTag className="text-primary-500" />
                  <span>Tags:</span>
                </span>
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-8 border-t border-gray-700 flex justify-center">
              <Link to="/blog" className="btn-outline">
                View All Posts
              </Link>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
