# FAQ Template for Blog Articles

## Purpose

This template provides the structure for creating FAQ sections in blog articles that are optimized for:
- **AI/LLM consumption** (ChatGPT, Perplexity, Claude, Gemini)
- **Answer Engine Optimization (AEO)**
- **Google Rich Results** (FAQPage schema)
- **User experience** (quick answers to follow-up questions)

## Placement
**ALWAYS place the FAQ section at the very end of the article**, after the Conclusion, CTA, and Resources/References sections.

## Template Structure

Copy and paste this structure into your blog article markdown file:

```markdown
## FAQ

<details open>
<summary>

### [Natural question prompt in Polish, 10-25 words, full sentence ending with "?"]

</summary>

[Snippet-style answer, 2-4 sentences. Key information in first sentence. Concrete facts, numbers, definitions, or how-to instructions. Natural, conversational Polish with technical English terms where appropriate.]

</details>

<details open>
<summary>

### [Next question...]

</summary>

[Answer...]

</details>

<details open>
<summary>

### [Next question...]

</summary>

[Answer...]

</details>

<details open>
<summary>

### [4-6 questions total recommended]

</summary>

[Answer...]

</details>
```

**Important Notes:**
- Each question-answer pair is wrapped in `<details open>` tags for collapsible accordion UX
- The `open` attribute ensures questions are expanded by default (SEO-friendly)
- Questions are H3 headings inside `<summary>` tags
- Answers are regular paragraphs inside `<details>` body
- Native HTML accordion = no JavaScript required, keyboard accessible

## Example: Real FAQ Section

```markdown
## FAQ

<details open>
<summary>

### Jak zoptymalizować FAQ pod AI chatboty i LLM takie jak ChatGPT czy Perplexity?

</summary>

Optymalizacja FAQ pod AI wymaga trzech kluczowych elementów: pełne pytania w naturalnym języku (10-25 słów), snippet-style odpowiedzi (2-4 zdania z kluczową info na początku) oraz FAQPage schema. AI boty preferują strukturalne dane i konkretne fakty zamiast ogólników. Dodatkowo ważne jest użycie long-tail queries i unikanie unexplained jargon.

</details>

<details open>
<summary>

### Dlaczego FAQPage schema jest ważne dla Answer Engine Optimization (AEO)?

</summary>

FAQPage schema to structured data format, który pozwala AI botom i wyszukiwarkom automatycznie wyodrębnić pytania i odpowiedzi z treści. Google Rich Results używa tego schema do wyświetlania featured snippets. LLM-y typu ChatGPT czy Perplexity priorytetyzują content z wyraźną strukturą semantyczną przy generowaniu odpowiedzi.

</details>

<details open>
<summary>

### Ile pytań powinno znaleźć się w sekcji FAQ artykułu blogowego?

</summary>

Optymalna liczba to 4-6 pytań, które pokrywają najczęstsze follow-up questions czytelników po przeczytaniu artykułu. Każde pytanie powinno adresować jeden clear intent i być long-tail query (10-25 słów). Unikaj duplikowania treści z głównego artykułu – FAQ ma dostarczać quick reference i dodatkowy context.

</details>

<details open>
<summary>

### Jak sprawdzić czy FAQ schema jest poprawnie zaimplementowane?

</summary>

Użyj Google Rich Results Test (https://search.google.com/test/rich-results) wklejając URL artykułu lub kod HTML. Validator sprawdzi czy FAQPage schema jest valid i czy question/answer pairs są complete. Dodatkowo sprawdź DevTools → Elements → <head> → szukaj <script type="application/ld+json"> z @type: "FAQPage".

</details>
```

## Guidelines Summary

**Questions:**
- Full, natural prompts (not keywords)
- 10-25 words
- Conversational language
- One clear intent per question
- Polish with technical English terms

**Answers:**
- Snippet-style: 2-4 sentences
- Key info in first sentence
- Concrete facts, numbers, definitions, mini how-tos
- Natural, conversational language
- Avoid unexplained jargon

**Technical:**
- Use accordion structure: `<details open>` wrapping each Q&A pair
- FAQ section header: "## FAQ"
- Questions as H3 inside `<summary>`: "### [Question text]"
- Answers as paragraphs inside `<details>` body
- Use `open` attribute for SEO (default expanded state)
- FAQPage schema auto-generated from content (accordion-transparent)

## Common Mistakes to Avoid

❌ **DON'T:**
- Use keyword-only questions ("AI FAQ")
- Write generic, vague answers
- Duplicate entire sections from main article
- Use unexplained acronyms without context
- Create FAQ with less than 4 questions (insufficient)
- Create FAQ with more than 8 questions (overwhelming)

✅ **DO:**
- Write full, natural questions readers would ask
- Provide specific, actionable answers
- Link to sources, case studies, research
- Include numbers, definitions, concrete examples
- Test with Google Rich Results validator

## Related Resources

- **Comprehensive Guidelines**: `docs/blog/FAQ_GUIDELINES.md`
- **LLM Optimization Research**: See plan references in `.claude/agents/plans/llm-optimized-faq-sections.md`
- **Blog Workflow**: `docs/BLOG_WORKFLOW.md`

## Validation Checklist

Before publishing, verify:

- [ ] 4-6 questions total
- [ ] Each question is 10-25 words
- [ ] Each answer is 2-4 sentences
- [ ] Key info in first sentence of each answer
- [ ] Natural, conversational language
- [ ] Technical terms explained or contextual
- [ ] H2 "FAQ" header present
- [ ] Each Q&A wrapped in `<details open>` tags
- [ ] Questions as H3 headings inside `<summary>`
- [ ] Answers as paragraphs inside `<details>` body
- [ ] `open` attribute present on all `<details>` (SEO)
- [ ] No unexplained jargon
- [ ] Concrete facts/numbers included
- [ ] FAQPage schema validates (after publish)
- [ ] Accordion functionality works (click to collapse/expand)

---

**Last Updated**: 2026-01-18
**Maintainer**: Pawel Lipowczan
