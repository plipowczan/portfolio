# Blog Article Validation Report: Software 3.0: dlaczego twoja aplikacja nie powinna istnieć

## Article Details

- **File:** `src/content/blog/software-3-0-agentic-engineering.md`
- **Blog ID:** 28 (unikalny; poprzednie max = 27)
- **Date:** 2026-05-29 · **Read Time:** 9 min
- **Word Count:** ~1600 słów treści + FAQ (esej, zgodnie z planem)
- **Validated:** 2026-05-29

## Validation Results

### ✅ PASSED

**Struktura pliku / frontmatter**
- Plik istnieje, slug = nazwa pliku, frontmatter to poprawny YAML (build go sparsował).
- Wszystkie wymagane pola: id 28, slug, title (w cudzysłowie — zawiera `:`), excerpt, category AI, author Pawel Lipowczan, date, readTime, image, tags (5), lang pl. Bez `alternateSlug` (PL-only na starcie — zgodnie z regułą).

**Treść**
- Title: **57 znaków** (zakres 50-60) ✅
- Excerpt: **158 znaków** po rozszerzeniu (było 143; zakres 150-160) ✅
- H2: 9 (7 sekcji treści + Przydatne zasoby + FAQ); brak osieroconych H3 ✅
- Akapity krótkie, kluczowe pojęcia pogrubione, pierwsza osoba ✅
- **Bloki kodu: 0** — świadoma decyzja (esej o modelu myślenia), brak bloków bez language tagu ✅
- **Polonizacja: brak** (`komendyfik`/`skomendyfik`/`zvalid` — nieobecne) ✅
- Cytaty Karpathy'ego 1:1 z notatek źródłowych (`C:\Projects\brain`), każdy z glossem PL ✅

**CTA (wzorzec kanoniczny)**
- `class="btn-primary inline-block"` ×1 ✅
- Wrapper `bg-dark-800/50 backdrop-blur-md` ×1 ✅
- `href="/#contact"` ×1 ✅
- Tekst przycisku „Umów bezpłatną konsultację" ✅
- Brak deprecated (`cta-section` = 0, `automation.house` href = 0) ✅
- **Kolejność:** CTA (l. 140) → `## Przydatne zasoby` (l. 150) → `## FAQ` (l. 157) ✅

**FAQ (AEO)**
- 5 pytań w `<details open>`, H3 w `<summary>`, odpowiedzi 2-4 zdania ✅
- Tematy: definicja 1.0/2.0/3.0, vibe vs agentic, jagged intelligence, czego nie outsourcować, agent-native ✅

**SEO**
- Primary keyword „Software 3.0" w tytule + H2; secondary w nagłówkach ✅
- Linki wewnętrzne: 2 (`/blog/vibe-coding-przewodnik`, `/blog/llm-knowledge-base-brain-karpathy`) ✅
- Linki zewnętrzne: 2 (Sequoia, Dream Labs AI) ✅

**Diagram (spine)**
- `/images/karpathy-paradigm-software-3-0.webp` osadzony po wstępie z opisowym alt-textem ✅

### ⚠️ WARNINGS

- Diagram-spine `karpathy-paradigm-software-3-0.webp` waży ~800 KB (q85, grafika tekstowa). Czytelność OK; opcjonalna recompresja, jeśli zależy na wadze hero treści.
- Render w przeglądarce (Level 5) niewykonany automatycznie — zalecany ręczny podgląd przed publikacją.

### ❌ FAILURES

- Brak.

## Post-Article Tasks Completed

- [x] OG prompt zapisany: `.claude/agents/prompts/og-software-3-0-agentic-engineering-prompt.md`
- [x] OG image wygenerowany (Gemini `gemini-3-pro-image-preview`; skrypt zapisał `.jpeg` w natywnym rozmiarze — flagi `--convert-webp/--size` są nieobsługiwane)
- [x] Resize + konwersja przez `sharp`: `public/images/og-software-3-0-agentic-engineering.webp` **1200×630, 41 KB**; JPEG usunięty, brak rasterowych leftoverów
- [x] Sitemap zaktualizowany — wpis `https://pawel.lipowczan.pl/blog/software-3-0-agentic-engineering` obecny
- [x] Build: `npm run build` → 2483 moduły, built in ~6s, brak błędów (loader zwalidował frontmatter)
- [ ] Dev server render test — do ręcznego sprawdzenia (`npm run dev`)

## Overall Status

✅ **VALIDATION PASSED** — artykuł PL zwalidowany, brak błędów krytycznych. Tłumaczenie EN oczekuje.

## Next Step

1. Podgląd: `npm run dev` → `http://localhost:5173/blog/software-3-0-agentic-engineering` (diagram, blockquote-glossy, akordeon FAQ).
2. Tłumaczenie EN: `/blog-article-writer:translate software-3-0-agentic-engineering` (po akceptacji dodać `alternateSlug` po obu stronach).
3. Commit (PL+EN razem): `feat(blog): add post 28 (PL+EN) — Software 3.0 & agentic engineering`.
