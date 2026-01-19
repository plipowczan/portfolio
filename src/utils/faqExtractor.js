/**
 * FAQ Extraction and Schema Generation Utilities
 *
 * Extracts FAQ sections from blog post HTML and generates FAQPage structured data
 * for LLM/AI consumption (AEO optimization).
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */

/**
 * Extract FAQ items from rendered blog post content
 *
 * Looks for H2 heading containing "FAQ" followed by H3 questions and paragraph answers.
 * Supports Polish headers: "FAQ", "Najczęściej zadawane pytania", "Pytania i odpowiedzi"
 *
 * @param {HTMLElement} contentElement - The rendered blog post content container
 * @returns {{questions: Array<{question: string, answer: string}>, hasFAQ: boolean}}
 */
export function extractFAQ(contentElement) {
  if (!contentElement) {
    return { questions: [], hasFAQ: false };
  }

  // Find H2 heading containing FAQ-related text
  const h2Elements = contentElement.querySelectorAll('h2');
  let faqSection = null;

  for (const h2 of h2Elements) {
    const text = h2.textContent.trim().toLowerCase();
    if (
      text.includes('faq') ||
      text.includes('najczęściej zadawane pytania') ||
      text.includes('pytania i odpowiedzi') ||
      text.includes('najczesciej zadawane pytania') // Without Polish characters
    ) {
      faqSection = h2;
      break;
    }
  }

  if (!faqSection) {
    return { questions: [], hasFAQ: false };
  }

  // Check for multiple FAQ sections (edge case)
  const faqCount = Array.from(h2Elements).filter(h2 => {
    const text = h2.textContent.trim().toLowerCase();
    return text.includes('faq') || text.includes('najczęściej zadawane pytania');
  }).length;

  if (faqCount > 1) {
    console.warn('[FAQ Extractor] Multiple FAQ sections detected. Only the first one will be used for schema generation.');
  }

  // Extract FAQ items - supports both accordion and plain structure
  const faqItems = [];
  let currentElement = faqSection.nextElementSibling;

  while (currentElement) {
    // Stop if we hit another H2 (end of FAQ section)
    if (currentElement.tagName === 'H2') {
      break;
    }

    // Check for accordion structure: <details><summary><h3>Q</h3></summary><p>A</p></details>
    if (currentElement.tagName === 'DETAILS') {
      const summary = currentElement.querySelector('summary');
      const h3 = summary ? summary.querySelector('h3') : null;

      if (h3) {
        const question = sanitizeText(h3.textContent);

        // Collect all paragraphs inside <details> but NOT in <summary>
        const answerParagraphs = [];
        const paragraphs = currentElement.querySelectorAll('p');

        paragraphs.forEach(p => {
          // Check if paragraph is inside summary (skip it)
          if (!summary.contains(p)) {
            answerParagraphs.push(sanitizeText(p.textContent));
          }
        });

        let answer = answerParagraphs.join(' ').trim();

        // Fallback: If no <p> tags found, extract text content directly
        // This handles markdown rendered without explicit paragraph wrapping
        if (!answer) {
          // Collect text from all child nodes except summary
          const textNodes = [];
          const walker = document.createTreeWalker(
            currentElement,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                // Reject text nodes inside summary
                return summary && summary.contains(node)
                  ? NodeFilter.FILTER_REJECT
                  : NodeFilter.FILTER_ACCEPT;
              }
            }
          );

          let node;
          while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (text) {
              textNodes.push(text);
            }
          }

          answer = sanitizeText(textNodes.join(' '));
        }

        if (question && answer) {
          faqItems.push({ question, answer });
        } else if (question && !answer) {
          console.warn(`[FAQ Extractor] Question without answer: "${question}"`);
        }
      }
    }
    // Plain structure: H3 = Question, following P = Answer
    else if (currentElement.tagName === 'H3') {
      const question = sanitizeText(currentElement.textContent);

      // Collect all following paragraphs until next H3 or H2
      const answerParagraphs = [];
      let answerElement = currentElement.nextElementSibling;

      while (answerElement) {
        if (answerElement.tagName === 'H2' || answerElement.tagName === 'H3') {
          break;
        }
        if (answerElement.tagName === 'P') {
          answerParagraphs.push(sanitizeText(answerElement.textContent));
        }
        answerElement = answerElement.nextElementSibling;
      }

      const answer = answerParagraphs.join(' ').trim();

      if (question && answer) {
        faqItems.push({ question, answer });
      } else if (question && !answer) {
        console.warn(`[FAQ Extractor] Question without answer: "${question}"`);
      }
    }

    currentElement = currentElement.nextElementSibling;
  }

  // Warn if FAQ section is empty
  if (faqItems.length === 0) {
    console.warn('[FAQ Extractor] FAQ section found but no valid question/answer pairs extracted.');
  }

  return {
    questions: faqItems,
    hasFAQ: faqItems.length > 0
  };
}

/**
 * Generate FAQPage structured data (JSON-LD) from FAQ items
 *
 * Creates schema.org FAQPage markup for Google Rich Results and AI/LLM consumption.
 *
 * @param {Array<{question: string, answer: string}>} faqItems - Extracted FAQ items
 * @param {string} postUrl - Full URL of the blog post
 * @returns {Object|null} JSON-LD schema object or null if no FAQ items
 */
export function generateFAQSchema(faqItems, postUrl) {
  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

/**
 * Sanitize text by removing HTML tags and extra whitespace
 *
 * @param {string} text - Raw text content
 * @returns {string} Clean text
 */
function sanitizeText(text) {
  if (!text) return '';

  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}
