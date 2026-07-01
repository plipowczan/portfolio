import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

/**
 * Shared markdown renderer used by both the blog and the LLM Wiki course.
 *
 * Renders the markdown string through ReactMarkdown (remarkGfm + rehypeRaw)
 * with the full components map (headings/tables/code/pre/lists/links/blockquote)
 * and the Polish-aware heading-id generator, so heading anchors + scroll-spy TOC
 * behave identically wherever it is used.
 *
 * @param {string} content   Markdown string to render.
 * @param {object} [contentRef]  Optional ref attached to the content wrapper so
 *                               the consumer can query rendered headings for TOC.
 */
const MarkdownContent = ({ content, contentRef }) => {
  // Heading-id generator. A fresh counter map is created on every render, so
  // IDs come out deterministically from heading order; repeated headings (same
  // base slug) get -1, -2, … suffixes to keep IDs unique — valid HTML and a
  // working anchor + scroll-spy TOC.
  const slugCounts = new Map();

  // Normalize a heading's text to an ASCII kebab-case slug (Polish-aware).
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
        // Replace Polish characters with ASCII equivalents (both cases).
        .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => polishCharsMap[char] || char)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove remaining special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Remove consecutive hyphens
        .replace(/^-+|-+$/g, "")
    ); // Trim hyphens from start/end
  };

  // Assign a unique id per heading. The first use of a base slug keeps it as-is;
  // each later heading with the same base slug is suffixed -1, -2, …
  const generateSlug = (text) => {
    let base = normalizeToSlug(text);
    if (!base || base === "-") base = "untitled";
    const seen = slugCounts.get(base) ?? 0;
    slugCounts.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen}`;
  };

  // Recursively extract plain text from children (arrays, nested elements).
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

  return (
    <div ref={contentRef} className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, children, ...props }) => {
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
            <p className="text-gray-300 leading-relaxed mb-6" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            // Block code: inline === false OR className starts with 'language-'
            // Inline code: inline !== false AND (no className OR not 'language-')
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
              (href.startsWith("http://") || href.startsWith("https://")) &&
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
            <tbody className="divide-y divide-gray-700 bg-dark-800" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-dark-700/50 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-primary-500 uppercase tracking-wider border-b border-gray-700"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 text-sm text-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
