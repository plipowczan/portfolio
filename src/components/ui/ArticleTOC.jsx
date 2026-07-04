import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaList, FaTimes } from "react-icons/fa";

/**
 * Self-contained scroll-spy Table of Contents (desktop sticky sidebar + mobile
 * FAB/drawer). Extracts h2/h3 headings from `contentRef` and highlights the
 * active section on scroll. Mirrors the blog TOC behaviour, including the
 * blog's FAQ filtering: the FAQ H2 stays, but its H3 questions are dropped so
 * a long FAQ list doesn't flood the sidebar.
 *
 * Render this as the second child of a `lg:grid lg:grid-cols-[1fr_280px]`
 * container: it emits a sticky `<aside>` (desktop) plus fixed FAB + drawer
 * (mobile). Returns null when there are fewer than two headings.
 *
 * @param {object} contentRef  Ref to the rendered markdown container.
 * @param {string} [contentKey]  Changes when the article changes → re-extract.
 * @param {string} [tocLabel]  Heading for the TOC panel.
 */

// Detect an FAQ H2 by its text (matches faqExtractor.js so the TOC and the
// FAQPage schema agree on what counts as the FAQ section).
const isFAQSection = (heading) => {
  const text = heading.textContent.trim().toLowerCase();
  return (
    text.includes("faq") ||
    text.includes("najczęściej zadawane pytania") ||
    text.includes("pytania i odpowiedzi") ||
    text.includes("najczesciej zadawane pytania")
  );
};

// Custom hook: track the active section based on scroll position.
const useScrollSpy = (tocItems, manualScrollingRef) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!tocItems || tocItems.length === 0) return;

    if (tocItems[0]?.id) {
      setActiveId(tocItems[0].id);
    }

    const handleScroll = () => {
      if (manualScrollingRef?.current) return;

      const scrollOffset = 150;

      const headingPositions = tocItems
        .map(({ id }) => {
          const element = document.getElementById(id);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { id, top: rect.top };
        })
        .filter(Boolean);

      if (headingPositions.length === 0) return;

      let activeHeading = headingPositions[0];
      for (const heading of headingPositions) {
        if (heading.top <= scrollOffset) {
          activeHeading = heading;
        } else {
          break;
        }
      }

      setActiveId(activeHeading.id);
    };

    handleScroll();

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
    return () => window.removeEventListener("scroll", onScroll);
  }, [tocItems]);

  return activeId;
};

// Desktop TOC Sidebar — defined outside to prevent remounting.
const TableOfContentsSidebar = ({
  items,
  activeId,
  onScrollToSection,
  tocLabel,
}) => {
  const navRef = useRef(null);
  const activeItemRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (!activeItemRef.current || !navRef.current || !activeId) return;

    const nav = navRef.current;
    const item = activeItemRef.current;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const itemTop = itemRect.top - navRect.top + nav.scrollTop;
    const itemBottom = itemTop + itemRect.height;
    const visibleTop = nav.scrollTop;
    const visibleBottom = nav.scrollTop + navRect.height;

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

  const hideScrollbarStyle = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
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

// Mobile FAB — defined outside.
const FloatingTOCButton = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Open Table of Contents"
    className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900"
  >
    <FaList className="text-dark-900 text-xl" />
  </button>
);

// Mobile Drawer — defined outside to prevent remounting.
const TableOfContentsDrawer = ({
  items,
  activeId,
  isOpen,
  onClose,
  onScrollToSection,
  tocLabel,
}) => {
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
    onClose();
    setTimeout(() => {
      onScrollToSection(id);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 lg:hidden"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-white/10 rounded-t-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
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

const ArticleTOC = ({ contentRef, contentKey, tocLabel = "Spis treści" }) => {
  const isManualScrollingRef = useRef(false);
  const [tocItems, setTocItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract h2/h3 headings from the rendered content once it is in the DOM.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!contentRef?.current) return;
      const headings = contentRef.current.querySelectorAll("h2, h3");
      let currentlyInFAQ = false;
      const items = Array.from(headings)
        .map((heading) => {
          const level = heading.tagName.toLowerCase();
          // Track FAQ boundaries: entered at the FAQ H2, left at the next H2.
          if (level === "h2") currentlyInFAQ = isFAQSection(heading);
          // Keep the FAQ H2 header, drop its H3 questions from the TOC.
          if (level === "h3" && currentlyInFAQ) return null;
          return { id: heading.id, text: heading.textContent, level };
        })
        .filter(Boolean);
      setTocItems(items);
    }, 150);

    return () => clearTimeout(timer);
  }, [contentKey]);

  const activeId = useScrollSpy(tocItems, isManualScrollingRef);

  const scrollToSection = (id) => {
    if (!id) return;
    const element = document.getElementById(id);
    if (!element) return;

    isManualScrollingRef.current = true;

    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const targetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({ top: targetPosition, behavior: "smooth" });

    setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1000);
  };

  if (tocItems.length < 2) return null;

  return (
    <>
      <aside className="hidden lg:block">
        <TableOfContentsSidebar
          items={tocItems}
          activeId={activeId}
          onScrollToSection={scrollToSection}
          tocLabel={tocLabel}
        />
      </aside>

      <div className="lg:hidden">
        <FloatingTOCButton onClick={() => setIsDrawerOpen(true)} />
        <TableOfContentsDrawer
          items={tocItems}
          activeId={activeId}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onScrollToSection={scrollToSection}
          tocLabel={tocLabel}
        />
      </div>
    </>
  );
};

export default ArticleTOC;
