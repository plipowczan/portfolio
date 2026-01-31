# Blog Article Plan: Remotion + AI Explainer Videos

## Phase: PLAN
**Status**: Ready for approval
**Created**: 2026-01-31

---

## 1. Frontmatter Specification

```yaml
---
id: 18
slug: remotion-explainer-videos-ai
title: "Remotion + AI: Jak tworzyć profesjonalne wideo za pomocą kodu i Claude"
excerpt: "Stworzyłem 45-sekundowy explainer video w kilka minut. Bez Adobe, bez Canva - tylko React, Remotion i Claude Code. Zobacz jak."
category: AI
author: Pawel Lipowczan
date: 2026-01-31
readTime: 11 min
image: /images/og-remotion-explainer-videos-ai.webp
tags:
  - AI
  - Remotion
  - Video
  - Automatyzacja
  - Claude Code
---
```

---

## 2. Article Structure Outline

### Introduction (~350 words)
**Hook**: Challenge the reader's assumption about video creation difficulty

**Content**:
- Open with a provocative statement: "Profesjonalne wideo za tysiące złotych? A może w kilka minut i za darmo?"
- Personal story: Pawel's 45-second explainer video at konsultacje.lipowczan.pl/explainer
- Pain point acknowledgment: Video production is expensive, slow, requires specialized skills
- Promise: By the end, readers will be able to create their own explainer videos using AI

**Key phrases to include**:
- "Z własnego doświadczenia wiem..."
- Reference to time investment: "kilka minut"

---

### Section 2: Co to jest Remotion? (~400 words) [H2]
**Purpose**: Establish what Remotion is for non-developers

**Content**:
- Remotion = React-based video creation library
- Code-driven approach: describe what you want, not how to animate frame-by-frame
- Key difference from traditional tools: programmatic, repeatable, scalable
- Visual diagram concept: Traditional video editing vs Remotion workflow

**Code example** (language: `text`):
```text
Tradycyjne podejście: Pomysł → Storyboard → Nagranie → Edycja → Eksport (dni/tygodnie)
Remotion + AI: Pomysł → Prompt → Kod → Renderowanie (minuty)
```

**Internal link**: Reference to "vibe coding" philosophy if relevant

---

### Section 3: Instalacja i pierwsze kroki (~500 words) [H2]
**Purpose**: Get readers set up with Remotion Skills

**Content**:
- Prerequisites: Claude Code installed (or Claude Desktop with MCP)
- Installation command
- What happens during installation
- Verification step

**Code example** (language: `bash`):
```bash
npx skills add remotion-dev/skills
```

**Code example** (language: `text`):
```text
Po instalacji dostępne są komendy:
- /remotion:create - Tworzenie nowego projektu video
- /remotion:render - Renderowanie video do MP4
- /remotion:preview - Podgląd w przeglądarce
```

**Note**: Emphasize that no deep React knowledge is needed

---

### Section 4: Prompt engineering dla wideo (~700 words) [H2]
**Purpose**: Core skill - how to write prompts that generate good video

**Sub-sections**:

#### 4.1 Anatomia dobrego promptu [H3]
- Scene-by-scene breakdown
- Timing specification
- Style descriptors
- Brand elements (colors, fonts, logos)

**Code example** (language: `markdown`):
```markdown
Stwórz 45-sekundowe video explainer dla strony konsultingowej.

**Sceny:**
1. (0-10s) Logo animacja z gradientem #00ff9d → #00cc7d
2. (10-25s) 3 główne usługi jako animowane karty
3. (25-40s) Testimonial lub statystyka
4. (40-45s) CTA z kontaktowym przyciskiem

**Styl:** Profesjonalny, minimalistyczny, dark mode
**Format:** 16:9 (YouTube/website)
**Tempo:** Spokojne, business-oriented
```

#### 4.2 Szablon promptu Pawła [H3]
- Full template used for konsultacje.lipowczan.pl video
- Explanation of each section

**Code example** (language: `markdown`):
```markdown
For the current project create a 45-second explainer video based on the content.

The video should:
- Extract and use the brand colors from the site
- Highlight the main services/products
- Include key selling points
- Use professional, elegant animations
- End with a clear call-to-action

Aspect ratio: 16:9
Style: PROFESSIONAL
```

---

### Section 5: Przypadki użycia (~600 words) [H2]
**Purpose**: Inspire readers with specific applications

**Sub-sections**:

#### 5.1 Dla przedsiębiorców i konsultantów [H3]
- Explainer videos for service pages
- Product demos
- Case study visualizations

#### 5.2 Dla twórców treści [H3]
- Animated title sequences
- Lower thirds
- Social media content (9:16 for Stories/Reels)

#### 5.3 Dla SaaS i produktów [H3]
- Feature announcements
- Onboarding videos
- Release notes as video

**Code example** (language: `markdown`):
```markdown
Stwórz 15-sekundowy teaser nowej funkcji dla LinkedIn.

Scena 1: Nazwa funkcji jako duży napis z glow effect
Scena 2: 3 bullet points z korzyściami (staggered animation)
Scena 3: "Już dostępne" z logo produktu

Format: 1:1 (LinkedIn feed)
Kolory: Paleta produktu (#1a1a2e, #16213e, #0f3460, #e94560)
```

---

### Section 6: Wskazówki dla lepszych wyników (~500 words) [H2]
**Purpose**: Pro tips from tutorial + Pawel's experience

**Content (as bullet list)**:
1. **Zawsze podawaj timing** - AI domyślnie robi za długie sceny
2. **Opisuj brand assets** - kolory hex, nie "niebieski"
3. **Używaj "vibe" opisów** - "Apple-like minimalism" jest lepsze niż szczegółowe instrukcje
4. **Iteruj małymi krokami** - Jedno video, jedna zmiana
5. **Testuj różne formaty** - 16:9 ≠ 9:16 w strukturze treści
6. **Eksportuj w odpowiedniej jakości** - 1080p dla web, 4K dla prezentacji

**Reference**: Link to Apple-style animations article (`/blog/animacje-apple-ai-cursor`)

---

### Section 7: Czego Remotion nie zrobi (~300 words) [H2]
**Purpose**: Set realistic expectations

**Content**:
- Limitations:
  - Complex motion graphics (no After Effects replacement)
  - Real footage editing (not a video editor)
  - Voice generation (needs external TTS)
  - Photo-realistic graphics
- Workarounds:
  - Combine with external tools (ElevenLabs for voice)
  - Use as animation layer over existing footage
  - Hybrid approach for complex projects

---

### Section 8: Podsumowanie (~250 words) [H2]
**Purpose**: Wrap up and encourage action

**Content**:
- Numbered list of key takeaways (5-7 points)
- Personal closing: Pawel's perspective on democratization of video production
- Encouragement to try with simple project first

**Key takeaways (numbered list)**:
1. Remotion + AI = video w minutach zamiast dni
2. Nie musisz być animatorem ani programistą
3. Dobre prompty = dobre wyniki (struktura, timing, brand)
4. Zaczynaj od prostych projektów (logo animation, title card)
5. Iteruj - AI nie musi trafić za pierwszym razem
6. Format ma znaczenie - 16:9 vs 9:16 vs 1:1

---

### CTA Section [HTML]

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz tworzyć profesjonalne wideo dla swojego biznesu?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci wdrożyć AI w procesie tworzenia treści marketingowych - od strategii przez implementację po automatyzację produkcji.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

---

### Resources Section (~150 words) [H2]
**Title**: Zasoby

**Links**:
1. [Remotion Official Docs](https://remotion.dev/docs) - Oficjalna dokumentacja
2. [Remotion Skills Repository](https://github.com/remotion-dev/skills) - Instalacja i przykłady
3. [Mój explainer video](https://konsultacje.lipowczan.pl/explainer) - Efekt końcowy

**Internal links**:
- [Animacje w stylu Apple](/blog/animacje-apple-ai-cursor) - Powiązany artykuł o AI i animacjach
- [Vibe coding przewodnik](/blog/vibe-coding-przewodnik) - Filozofia kodowania z AI

---

### FAQ Section (~500 words) [H2]
**Title**: FAQ

**Questions (6)**:

1. **Czy muszę znać programowanie żeby używać Remotion z AI?**
   - Nie, Claude Code generuje kod za Ciebie. Wystarczy umiejętność pisania dobrych promptów i podstawowe zrozumienie co chcesz osiągnąć. React działa "pod maską".

2. **Ile kosztuje tworzenie wideo w Remotion?**
   - Remotion jest open-source i darmowy do użytku osobistego. Płatna licencja wymagana tylko dla firm z przychodami >$1M rocznie. Claude Code wymaga subskrypcji Claude Pro lub używania przez API.

3. **Czy mogę użyć wygenerowanego wideo komercyjnie?**
   - Tak, wideo stworzone w Remotion należy do Ciebie. Upewnij się tylko, że używane assets (czcionki, ikony) mają odpowiednie licencje.

4. **Jak długo trwa renderowanie 45-sekundowego wideo?**
   - Zależy od złożoności i sprzętu. Typowo 2-5 minut dla prostych animacji na nowoczesnym laptopie. Można też renderować w chmurze przez Remotion Lambda.

5. **Czy Remotion może wygenerować wideo z lektorem?**
   - Remotion nie generuje głosu. Możesz połączyć go z ElevenLabs lub innymi usługami TTS, a następnie zsynchronizować audio z animacją.

6. **Czym różni się Remotion od Canva czy CapCut?**
   - Canva i CapCut to edytory wizualne z gotowymi szablonami. Remotion to narzędzie programistyczne dające pełną kontrolę i powtarzalność. Lepsze dla automatyzacji i personalizacji na skalę, gorsze dla jednorazowej szybkiej edycji.

---

## 3. Word Count Targets

| Section | Target Words |
|---------|--------------|
| Introduction | 350 |
| Co to jest Remotion? | 400 |
| Instalacja i pierwsze kroki | 500 |
| Prompt engineering dla wideo | 700 |
| Przypadki użycia | 600 |
| Wskazówki dla lepszych wyników | 500 |
| Czego Remotion nie zrobi | 300 |
| Podsumowanie | 250 |
| Resources | 150 |
| FAQ | 500 |
| **TOTAL** | **~4250 words** |

**Estimated read time**: 11 min (at ~200 wpm with code examples)

---

## 4. Technical Accuracy Notes

- [ ] Verify Remotion Skills installation command is current
- [ ] Confirm MCP integration still works with Claude Desktop
- [ ] Check Remotion licensing terms (verify $1M threshold)
- [ ] Validate Pawel's explainer video link is still live
- [ ] Ensure code blocks have correct language tags

---

## 5. SEO Keywords

**Primary**: Remotion AI video, tworzenie wideo AI, explainer video programowanie

**Secondary**:
- Claude Code video
- React video generator
- automatyzacja wideo
- video marketing AI
- programowalne wideo

**H2 keywords**:
- Remotion tutorial
- prompt engineering video
- AI video generator po polsku

---

## 6. Style Guidelines Checklist

- [ ] Polish language with English technical terms (no polonization)
- [ ] First-person perspective (Pawel's voice)
- [ ] Short paragraphs (2-4 sentences)
- [ ] Bold key concepts on first mention
- [ ] ALL code blocks have language tags (bash, markdown, text, etc.)
- [ ] Numbered lists for sequential steps
- [ ] Bullet lists for features/benefits
- [ ] Personal anecdotes ("Z własnego doświadczenia...")
- [ ] Direct, practical tone

---

## 7. Cross-Links

**From this article TO**:
- `/blog/animacje-apple-ai-cursor` - Apple animations (Section 6)
- `/blog/vibe-coding-przewodnik` - Vibe coding philosophy (Section 2, Resources)
- `/blog/5-technik-pracy-z-claude-code` - Claude Code techniques (optional, FAQ)

**Potential future backlinks FROM**:
- Update `animacje-apple-ai-cursor` to link back to this article

---

## 8. Image Requirements

**OG Image**: `/images/og-remotion-explainer-videos-ai.webp`
- Suggested content: Remotion logo + video timeline visual + AI sparkle
- Style: Dark mode, green accent (#00ff9d)
- Text overlay: Article title or key phrase

---

## Execution Checklist

- [x] Prime artifact read and analyzed
- [x] Next blog ID determined (18)
- [x] Complete frontmatter specified
- [x] All sections outlined with word targets
- [x] FAQ section planned (6 questions)
- [x] Code examples identified with language tags
- [x] Language guidelines noted
- [x] SEO keywords identified
- [x] Cross-links planned
- [x] CTA HTML prepared

---

## Next Step

After plan approval, run:
```
/blog-article-writer:execute
```

This will generate the full article content based on this plan.
