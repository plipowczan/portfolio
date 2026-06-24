import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendar, FaClock, FaList, FaTag, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import SEO from "../components/seo/SEO";
import StructuredData from "../components/seo/StructuredData";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useBooking } from "../context/BookingContext";
import { getPostsByLang, getAlternatePost } from "../data/blogPosts";
import useLocalizedPath from "../hooks/useLocalizedPath";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";
import { extractFAQ, generateFAQSchema } from "../utils/faqExtractor";
import { extractFirstParagraph } from "../utils/extractFirstParagraph";

// Desktop TOC Sidebar Component - defined outside to prevent remounting
const TableOfContentsSidebar = ({ items, activeId, onScrollToSection, tocLabel = "Spis treści" }) => {
  const navRef = useRef(null);
  const activeItemRef = useRef(null);

  // Auto-scroll within sidebar to keep active item visible (only on lg screens)
  useEffect(() => {
    // Only run on lg breakpoint where sidebar is visible
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (!activeItemRef.current || !navRef.current || !activeId) return;

    // Calculate position relative to nav container and scroll nav directly
    const nav = navRef.current;
    const item = activeItemRef.current;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    // Check if item is outside visible area of nav
    const itemTop = itemRect.top - navRect.top + nav.scrollTop;
    const itemBottom = itemTop + itemRect.height;
    const visibleTop = nav.scrollTop;
    const visibleBottom = nav.scrollTop + navRect.height;

    // Scroll nav container if item is outside visible area
    if (itemTop < visibleTop) {
      nav.scrollTo({ top: itemTop - 10, behavior: "smooth" });
    } else if (itemBottom > visibleBottom) {
      nav.scrollTo({
        top: itemBottom - navRect.height + 10,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  if (!items || items.length < 2) return null;

  // Hide scrollbar styles
  const hideScrollbarStyle = {
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  };

  return (
    <nav
      ref={navRef}
      aria-label="Table of Contents"
      className="sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto hidden lg:block [&::-webkit-scrollbar]:hidden"
      style={hideScrollbarStyle}
    >
      <div className="bg-dark-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-3">{tocLabel}</h2>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.id} className={item.level === "h3" ? "pl-4" : ""}>
              <button
                ref={activeId === item.id ? activeItemRef : null}
                onClick={() => onScrollToSection(item.id)}
                className={`text-left w-full ${
                  item.level === "h2" ? "text-sm" : "text-xs"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded px-2 py-1 -mx-2 ${
                  activeId === item.id
                    ? "text-primary-500 font-medium"
                    : "text-gray-400 hover:text-primary-400"
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Mobile FAB Component - defined outside
const FloatingTOCButton = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Open Table of Contents"
    className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900"
  >
    <FaList className="text-dark-900 text-xl" />
  </button>
);

// Mobile Drawer Component - defined outside to prevent remounting
const TableOfContentsDrawer = ({
  items,
  activeId,
  isOpen,
  onClose,
  onScrollToSection,
  tocLabel = "Spis treści",
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = (id) => {
    // Close drawer first
    onClose();

    // Use the same scroll function as desktop, with delay for drawer animation
    setTimeout(() => {
      onScrollToSection(id);
    }, 300); // 300ms for drawer close animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-white/10 rounded-t-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">{tocLabel}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close Table of Contents"
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* TOC List */}
              <nav aria-label="Table of Contents">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={item.level === "h3" ? "pl-4" : ""}
                    >
                      <button
                        onClick={() => handleLinkClick(item.id)}
                        className={`text-left w-full ${
                          item.level === "h2" ? "text-sm" : "text-xs"
                        } transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 -mx-2 ${
                          activeId === item.id
                            ? "text-primary-500 font-medium"
                            : "text-gray-300 hover:text-primary-400"
                        }`}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation("common");
  const localizedPath = useLocalizedPath();
  const langPosts = getPostsByLang(i18n.language);
  const post = langPosts.find((p) => p.slug === slug);
  const alternatePost = post ? getAlternatePost(post.slug) : null;
  const [imageError, setImageError] = useState(false);
  const { openBookingModal } = useBooking();

  // Flag to prevent scroll spy updates during manual scrolling
  const isManualScrollingRef = useRef(false);

  // Track ID counters per slug to generate consistent IDs across re-renders
  // Key: heading text -> Value: assigned counter
  const headingCountersRef = useRef(new Map());

  // Generate unique slug for heading text (memoized per article)
  const generateSlug = useMemo(() => {
    // Reset counters when post changes
    headingCountersRef.current.clear();

    // Shared normalization function for consistent slug generation
    const normalizeToSlug = (text) => {
      if (!text) return "";

      const polishCharsMap = {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ź: "z",
        ż: "z",
        Ą: "a",
        Ć: "c",
        Ę: "e",
        Ł: "l",
        Ń: "n",
        Ó: "o",
        Ś: "s",
        Ź: "z",
        Ż: "z",
      };

      return (
        text
          .toString()
          .trim()
          // Replace Polish characters with ASCII equivalents (both upper and lowercase)
          .replace(
            /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
            (char) => polishCharsMap[char] || char,
          )
          .toLowerCase()
          .replace(/[^\w\s-]/g, "") // Remove remaining special chars
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Remove consecutive hyphens
          .replace(/^-+|-+$/g, "")
      ); // Trim hyphens from start/end
    };

    return (text) => {
      if (!text) return "";

      let baseSlug = normalizeToSlug(text);

      // Handle empty slugs from special-char-only headings
      if (!baseSlug || baseSlug === "-") {
        baseSlug = "untitled";
      }

      // Check if we've already assigned an ID for this exact text (cache for re-renders)
      if (headingCountersRef.current.has(text)) {
        const existingCounter = headingCountersRef.current.get(text);
        const finalSlug =
          existingCounter === 0 ? baseSlug : `${baseSlug}-${existingCounter}`;
        return finalSlug;
      }

      // Find the next available counter for this base slug (for duplicates)
      let counter = 0;
      for (const [
        existingText,
        existingCounter,
      ] of headingCountersRef.current.entries()) {
        const existingBase = normalizeToSlug(existingText);
        if (existingBase === baseSlug && existingCounter >= counter) {
          counter = existingCounter + 1;
        }
      }

      const finalSlug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`;
      headingCountersRef.current.set(text, counter);
      return finalSlug;
    };
  }, [post]);

  // Reference to content container for TOC extraction
  const contentRef = useRef(null);

  // Custom hook: Track active section based on scroll position
  const useScrollSpy = (tocItems, manualScrollingRef) => {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
      if (!tocItems || tocItems.length === 0) {
        return;
      }

      // Set initial active ID to first item
      if (tocItems[0]?.id) {
        setActiveId(tocItems[0].id);
      }

      const handleScroll = () => {
        // SKIP if manual scroll is in progress - prevents re-renders during smooth scroll
        if (manualScrollingRef?.current) return;

        const scrollOffset = 150; // Offset from top of viewport

        // Find all heading elements with their positions
        const headingPositions = tocItems
          .map(({ id }) => {
            const element = document.getElementById(id);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { id, top: rect.top };
          })
          .filter(Boolean);

        if (headingPositions.length === 0) return;

        // Find the heading that's closest to the top but still visible (or just passed)
        // We want the last heading that has scrolled past the offset point
        let activeHeading = headingPositions[0];

        for (const heading of headingPositions) {
          if (heading.top <= scrollOffset) {
            activeHeading = heading;
          } else {
            break; // Headings are in order, so we can stop
          }
        }

        setActiveId(activeHeading.id);
      };

      // Run once on mount
      handleScroll();

      // Add scroll listener with throttling
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, [tocItems]);

    return activeId;
  };

  // Helper: Check if an H2 heading is an FAQ section by text content
  // This matches the detection logic in faqExtractor.js for consistency
  const isFAQSection = (heading) => {
    if (heading.tagName.toLowerCase() !== "h2") return false;
    const text = heading.textContent.trim().toLowerCase();
    return (
      text.includes("faq") ||
      text.includes("najczęściej zadawane pytania") ||
      text.includes("pytania i odpowiedzi") ||
      text.includes("najczesciej zadawane pytania") // Without Polish characters
    );
  };

  // Extract TOC items from rendered content
  const [contentElement, setContentElement] = useState(null);
  const [tocItems, setTocItems] = useState([]);
  const [faqSchema, setFaqSchema] = useState(null);

  useEffect(() => {
    // Guard: Don't run if post doesn't exist (handles navigation to non-existent post)
    if (!post) {
      setTocItems([]);
      setFaqSchema(null);
      return;
    }

    // Use setTimeout to allow React to render headings with IDs
    const timer = setTimeout(() => {
      if (contentRef.current) {
        setContentElement(contentRef.current);

        // Extract TOC immediately after contentElement is set
        const headings = contentRef.current.querySelectorAll("h2, h3");

        let currentlyInFAQ = false;

        const items = Array.from(headings)
          .map((heading) => {
            const level = heading.tagName.toLowerCase();
            const id = heading.id;

            // Track if we're in FAQ section using text content detection
            if (level === "h2") {
              currentlyInFAQ = isFAQSection(heading);
            }

            // Filter out H3s that are FAQ questions (keep FAQ H2 header)
            const shouldInclude = !(level === "h3" && currentlyInFAQ);

            return shouldInclude
              ? {
                  id: id,
                  text: heading.textContent,
                  level: level,
                }
              : null;
          })
          .filter(Boolean); // Remove nulls

        setTocItems(items);

        // Extract FAQ and generate schema
        const faqData = extractFAQ(contentRef.current);
        if (faqData.hasFAQ) {
          const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
          const schema = generateFAQSchema(faqData.questions, postUrl);
          setFaqSchema(schema);
        } else {
          setFaqSchema(null);
        }
      }
    }, 150); // Increase to 150ms for safer timing

    return () => clearTimeout(timer);
  }, [post]);

  const activeId = useScrollSpy(tocItems, isManualScrollingRef);

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Intercept blog CTA clicks to open modal instead of navigating
  useEffect(() => {
    const handleCtaClick = (e) => {
      // Check if clicked element is a CTA button to contact section
      const target = e.target.closest('a[href="/#contact"]');

      if (target && target.classList.contains("btn-primary")) {
        e.preventDefault();
        e.stopPropagation();
        openBookingModal();
      }
    };

    // Use capture phase to intercept before default navigation
    document.addEventListener("click", handleCtaClick, true);

    return () => {
      document.removeEventListener("click", handleCtaClick, true);
    };
  }, [openBookingModal]);

  if (!post) {
    return (
      <>
        <SEO
          title={t("blog.postNotFound")}
          description={t("blog.postNotFoundDesc")}
          path={localizedPath("/blog")}
        />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {t("blog.postNotFound")}
            </h1>
            <Link to={localizedPath("/blog")} className="btn-primary">
              {t("blog.backToBlog")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Unified scroll function that manages the isManualScrollingRef flag
  const scrollToSection = (id) => {
    if (!id) return;

    const element = document.getElementById(id);
    if (!element) return;

    // Set flag - disable scroll spy during manual scroll
    isManualScrollingRef.current = true;

    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const targetPosition = elementPosition + window.scrollY - headerOffset;

    // Use native scrollTo with smooth behavior
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Clear flag after scroll completes (max 1s for smooth scroll animation)
    setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1000);
  };

  const postUrl = `${SITE_CONFIG.url}${localizedPath(`/blog/${post.slug}`)}`;
  const postDescription =
    post.description || extractFirstParagraph(post.content);
  const dateModifiedRaw = post.modified || post.date;
  const toIsoDateTime = (d) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d;
  const datePublishedIso = toIsoDateTime(post.date);
  const dateModifiedIso = toIsoDateTime(dateModifiedRaw);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: postDescription,
    author: {
      "@type": "Person",
      name: post.author,
      url: SITE_CONFIG.url,
    },
    datePublished: datePublishedIso,
    dateModified: dateModifiedIso,
    image: `${SITE_CONFIG.url}${post.image}`,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}${SITE_CONFIG.schemaLogo}`,
      },
    },
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={localizedPath(`/blog/${post.slug}`)}
        image={post.image}
        article={true}
        publishedTime={datePublishedIso}
        modifiedTime={dateModifiedIso}
        author={post.author}
      />
      <StructuredData schema={blogPostingSchema} />
      <StructuredData
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE_CONFIG.url}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${SITE_CONFIG.url}/blog`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: `${SITE_CONFIG.url}/blog/${post.slug}`,
            },
          ],
        }}
      />
      <StructuredData schema={faqSchema} />

      <article className="min-h-screen py-24 md:py-32">
        <div className="section-container">
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
            {/* Main Article Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={FADE_IN_UP}
              className="space-y-8 w-full min-w-0"
            >
              {/* Breadcrumbs */}
              <Breadcrumbs
                items={[
                  { label: t("blog.home"), path: localizedPath("/") },
                  { label: "Blog", path: localizedPath("/blog") },
                  { label: post.title, path: null },
                ]}
              />

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
                  {t("blog.by")} <span className="text-primary-500">{post.author}</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative overflow-hidden rounded-xl bg-dark-700 h-96">
                {!imageError ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => {
                      console.error(`Failed to load image: ${post.image}`);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-800">
                    <p className="text-gray-400 text-center px-4">
                      {t("blog.imageError")}
                      <br />
                      <span className="text-sm text-gray-400">
                        {post.image}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                ref={contentRef}
                className="prose prose-invert prose-lg max-w-none"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ node, children, ...props }) => {
                      // Recursively extract text from children (handles arrays, nested elements)
                      const extractText = (children) => {
                        if (typeof children === "string") return children;
                        if (Array.isArray(children)) {
                          return children.map(extractText).join("");
                        }
                        if (children?.props?.children) {
                          return extractText(children.props.children);
                        }
                        return "";
                      };

                      const text = extractText(children);
                      const id = generateSlug(text);

                      return (
                        <h2
                          id={id}
                          className="text-3xl font-bold text-white mt-10 mb-4"
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h2: ({ node, children, ...props }) => {
                      // Recursively extract text from children (handles arrays, nested elements)
                      const extractText = (children) => {
                        if (typeof children === "string") return children;
                        if (Array.isArray(children)) {
                          return children.map(extractText).join("");
                        }
                        if (children?.props?.children) {
                          return extractText(children.props.children);
                        }
                        return "";
                      };

                      const text = extractText(children);
                      const id = generateSlug(text);

                      return (
                        <h2
                          id={id}
                          className="text-3xl font-bold text-white mt-10 mb-4"
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ node, children, ...props }) => {
                      // Recursively extract text from children (handles arrays, nested elements)
                      const extractText = (children) => {
                        if (typeof children === "string") return children;
                        if (Array.isArray(children)) {
                          return children.map(extractText).join("");
                        }
                        if (children?.props?.children) {
                          return extractText(children.props.children);
                        }
                        return "";
                      };

                      const text = extractText(children);
                      const id = generateSlug(text);

                      return (
                        <h3
                          id={id}
                          className="text-2xl font-bold text-white mt-8 mb-3"
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ node, ...props }) => (
                      <p
                        className="text-gray-300 leading-relaxed mb-6"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      // Block code: inline === false OR className starts with 'language-'
                      // Inline code: inline !== false AND (no className OR className doesn't start with 'language-')
                      const isBlockCode =
                        inline === false ||
                        (className && className.startsWith("language-"));
                      const isInline = !isBlockCode;

                      return isInline ? (
                        <span
                          className="px-1.5 py-0.5 bg-dark-700 text-primary-500 rounded text-sm font-mono inline-block max-w-full [overflow-wrap:anywhere]"
                          {...props}
                        >
                          {children}
                        </span>
                      ) : (
                        <code
                          className="block px-6 py-4 bg-dark-700 text-primary-500 rounded-lg overflow-x-auto font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre className="mb-6 rounded-lg" {...props} />
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
                    a: ({ node, href, ...props }) => {
                      const isExternal =
                        href &&
                        (href.startsWith("http://") ||
                          href.startsWith("https://")) &&
                        !href.includes("pawel.lipowczan.pl");
                      return (
                        <a
                          href={href}
                          className="text-primary-500 hover:text-primary-400 underline"
                          {...(isExternal && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                          {...props}
                        />
                      );
                    },
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-primary-500 pl-6 italic text-gray-400 my-6"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto mb-6">
                        <table
                          className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-lg"
                          {...props}
                        />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-dark-700" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody
                        className="divide-y divide-gray-700 bg-dark-800"
                        {...props}
                      />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr
                        className="hover:bg-dark-700/50 transition-colors"
                        {...props}
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-primary-500 uppercase tracking-wider border-b border-gray-700"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="px-4 py-3 text-sm text-gray-300"
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
                    <span>{t("blog.tags")}</span>
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
                <Link to={localizedPath("/blog")} className="btn-outline">
                  {t("blog.viewAllPosts")}
                </Link>
              </div>
            </motion.div>

            {/* Desktop TOC Sidebar */}
            {tocItems.length >= 2 && (
              <aside className="hidden lg:block">
                <TableOfContentsSidebar
                  items={tocItems}
                  activeId={activeId}
                  onScrollToSection={scrollToSection}
                  tocLabel={t("blog.toc")}
                />
              </aside>
            )}
          </div>

          {/* Mobile FAB + Drawer */}
          {tocItems.length >= 2 && (
            <div className="lg:hidden">
              <FloatingTOCButton onClick={() => setIsDrawerOpen(true)} />
              <TableOfContentsDrawer
                items={tocItems}
                activeId={activeId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onScrollToSection={scrollToSection}
                tocLabel={t("blog.toc")}
              />
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
