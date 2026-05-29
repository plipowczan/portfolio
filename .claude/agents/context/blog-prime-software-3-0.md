# Blog Prime: Software 3.0 i agentic engineering

> Faza PRIME (research) ukończona 2026-05-29. Wejście do `/blog-article-writer:plan`.

## 1. Materiały źródłowe (przeanalizowane)

| Plik | Rola |
|------|------|
| `docs/blog/2026-05-29_software-3-0-blog-wsad.md` | **WSAD** — brief redakcyjny + pełny szkielet sekcja-po-sekcji + bank cytatów + linki. Source of truth. |
| `src/content/blog/system-agentow-ai-skills-rules-kontekst.md` (id 27, 2026-05-09) | Najnowszy artykuł — wzorzec stylu i frontmatter (`lang: pl`, `alternateSlug`). |
| `src/content/blog/llm-knowledge-base-brain-karpathy.md` (id 24, 2026-04-12) | **Sąsiedni temat** — metoda Karpathy'ego na bazę wiedzy (fosa #1). Cross-link, nie duplikat. |
| `.claude/skills/portfolio-copywriting/SKILL.md` + `references/` | Styl, struktura, FAQ, CTA. |

**Notatki źródłowe DOSTĘPNE** (user wskazał 2026-05-29): baza `C:\Projects\brain`, oryginalny wsad: `C:\Projects\brain\content\_outputs\2026-05-29_software-3-0-blog-wsad.md`. Notatki w `C:\Projects\brain\content\AI\KNOWLEDGE\INFO\`:

| Notatka | Co wnosi (przeczytane) |
|---------|------------------------|
| `Software 3.0.md` | Tabela 3 paradygmatów; 4 przykłady transformacji; **4 fosy rozpisane** (dane / prompty-kontekst / system design / zaufanie); cytat „All businesses… design your own car". |
| `Agentic Engineering.md` | Tabela vibe vs agentic (5 wymiarów); co robi agentic engineer; **dodatkowy cytat** „The previous generation of computers automated what you could specify. This generation automates what you can verify."; wszystkie cytaty zweryfikowane 1:1. |
| `Context Engineering.md` | Cytat „prompt = program / context window is your lever"; progressive disclosure, legible, retrieval, kompresja. |
| `Agentic Coding.md` | Człowiek jako reviewer; pętla plan→akcja→weryfikacja. |
| `LLM Knowledge Bases.md` | Fosa #1 = wiedza; legible dla modelu (cross-link do art. id 24). |
| `Self-Improving Company.md` | Firma jako system agentowy / „samochód wokół silnika-LLM" — wzmacnia reframe biznesowy. |
| `Karpathy Paradigm.excalidraw.md` | Edytowalne źródło diagramu (osadzony WebP już w repo). |

Wszystkie cytaty w WSAD = wierne kopie z notatek. Nowe powiązania, których nie ma w bazie portfolio: `[[Jagged Intelligence]]`, `[[Vibe Coding]]`, `[[Andrej Karpathy]]` (notatki w `brain`).

## 2. Kluczowe tematy (z WSAD)

1. **Trzy paradygmaty**: 1.0 (jawny kod) → 2.0 (dane/wagi) → 3.0 (prompting; okno kontekstu = dźwignia nad LLM).
2. **Reframe biznesowy**: „software" = wszystkie cyfrowe biznesy; LLM to silnik, ty projektujesz samochód.
3. **Cztery przykłady**: instalator (self-healing skill), MenuGen (apka 2.0 staje się zbędna), kurs→agent-coach, usługa montażu wideo→pole tekstowe. Puenta: *sprzedajesz outcome, nie narzędzie*.
4. **Vibe coding ≠ agentic engineering**: vibe coding podnosi PODŁOGĘ (demokratyzacja), agentic engineering trzyma SUFIT (poprzeczka jakości + przyspieszenie). „10× engineer" wzmocniony daleko poza 10×.
5. **Weryfikowalność**: dawniej automatyzujesz co umiesz *zaprogramować*, dziś co umiesz *zweryfikować* → jagged intelligence (car wash quote). Founder takeaway: problem weryfikowalny = własna fosa przez RL/fine-tune.
6. **Czego nie da się outsourcować**: smak/osąd/nadzór, fundamenty > trivia API, „myślenie możesz oddelegować, zrozumienia — nie". Anegdota: MenuGen dopasowywał po e-mailu zamiast po user ID.
7. **Buduj dla agentów, nie dla ludzi**: sensory + aktuatory, dane legible dla LLM, „mój agent rozmawia z twoim agentem".
8. **Zakończenie**: „nie zwierzęta, lecz duchy" — nastawienie: zdrowa podejrzliwość, empiryczna weryfikacja. Klamra: w którym paradygmacie jest twój produkt? Cztery fosy: dane / prompty / system design / zaufanie.

## 3. Grupa docelowa

Founderzy, inżynierowie, no-code/automatyzatorzy, osoby budujące produkty AI-first. Poziom: świadomi AI, ale szukają **mapy myślenia**, nie listy narzędzi. Polski czytelnik PL, terminy techniczne EN.

## 4. Unikalny kąt / obietnica

Nie „kolejny hype o AI", tylko **mapa decyzyjna**: czego NIE budować, co budować, co zostaje po stronie człowieka. Obietnica: po przeczytaniu wiesz, w którym paradygmacie działasz i gdzie jest twoja fosa. Wątek przewodni: **rośnie abstrakcja → przesuwa się to, co robi człowiek**.

## 5. Wzorce stylu (zaobserwowane)

- Pierwsza osoba, otwarcia typu „Przez ostatnie miesiące...", konkretny obraz/anegdota na start każdej sekcji.
- Krótkie akapity (3-4 zdania), pogrubienia kluczowych pojęć, listy.
- **Cytaty Karpathy'ego zostaw w EN + krótki gloss PL** (instrukcja z WSAD — mocniejsze w oryginale).
- **Unikaj listy „10 narzędzi AI"** — to tekst o modelu myślenia.
- Cross-link do istniejącego artykułu o bazie wiedzy Karpathy'ego (`/blog/llm-knowledge-base-brain-karpathy`, id 24) tam, gdzie WSAD wspomina fosę #1 / `[[LLM Knowledge Bases]]`. Ewentualnie też do `vibe-coding-przewodnik` (id 14) przy rozróżnieniu vibe vs agentic.

## 6. Frontmatter — ustalenia dla fazy PLAN

- **id: 28** (max istniejący = 27).
- **category: AI** (zgodnie z dwoma sąsiednimi artykułami).
- **date: 2026-05-29**, **modified: 2026-05-29**.
- **slug** (propozycja): `software-3-0-agentic-engineering` (3-6 słów, kebab-case). Wolny — brak kolizji.
- **image**: `/images/og-software-3-0-agentic-engineering.webp` (do wygenerowania w fazie OG).
- **lang: pl** (sąsiednie artykuły mają to pole). **Bez `alternateSlug`** na starcie.
- **tags** (propozycja): `AI`, `Agentic Engineering`, `Software 3.0`, `Karpathy`, `Vibe Coding`.
- **title** (50-60 zn., do wyboru w PLAN) — kandydaci z WSAD:
  1. „Software 3.0: dlaczego twoja aplikacja nie powinna istnieć"
  2. „Vibe coding podnosi podłogę. Agentic engineering trzyma sufit."
  3. „1.0 → 2.0 → 3.0: nowa mapa dla każdego, kto buduje software"
- **excerpt**: 150-160 zn., „dlaczego przeczytać" — sformułować w PLAN.
- Pominąć `alternateSlug` na starcie (EN to osobny, świadomy krok w fazie translate — domyślnie PL-only).

## 7. Wymogi obowiązkowe (z reguł projektu)

- **FAQ** wymagane (4-6 pytań, akordeon `<details open>`, H3 w `<summary>`, AEO).
- **CTA**: HTML+Tailwind, link `/#contact`, button „Umów bezpłatną konsultację", PRZED „Przydatne zasoby" i FAQ. Kolejność: Wnioski → CTA → Przydatne zasoby → FAQ.
- Długość: WSAD mówi 1200-1800 słów (~6-8 min); SKILL standardowo 2000-3000. **Trzymaj intencję WSAD (~1500 słów, esej o modelu myślenia)** — to nie how-to.
- Diagram „Karpathy Paradigm" z WSAD **nie istnieje w repo** jako asset — w PLAN zdecydować: pominąć osadzenie albo potraktować jako koncept OG image. Nie linkować do nieistniejącego pliku.
- Po napisaniu: `npm run blog:sitemap`, generacja OG, `npm run dev`.

## 8. Dokładność techniczna

Treść konceptualna (paradygmaty, cytaty) — nie wymaga weryfikacji wersji bibliotek przez Context7. Zadbać o **wierność cytatów** (przepisać 1:1 z banku cytatów w WSAD) i poprawną atrybucję (Andrej Karpathy, wywiad Sequoia Capital). Linki do wideo z WSAD zachować.

## 9. Code examples

Brak — artykuł nie zawiera kodu (to esej o paradygmacie, nie tutorial). Nie dodawać sztucznych snippetów.

---

## Następny krok

```
/blog-article-writer:plan "Software 3.0 i agentic engineering"
```
