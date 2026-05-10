# Mastodon — profile setup

> **Cel:** uzupełnienie sekcji 4.5 w `docs/seo/INDEXING_RECOVERY.md` — sygnał crawl/discovery + ekspozycja w branżowym Fediverse.

## Wybór instancji (rekomendacja)

Jeśli nie masz konta — zarejestruj na **tech-friendly** instancji, nie na `mastodon.social` (zatłoczona, generic):

| Instancja | Profil tematyczny |
|---|---|
| **`hachyderm.io`** | tech, infra, SRE — najbardziej rekomendowana dla Twojego content-mixu |
| `fosstodon.org` | open source, FOSS-leaning |
| `infosec.exchange` | jeśli będziesz dużo pisać o security/AI safety |
| `ioc.exchange` / `mastodonapp.uk` | general tech |

Hachyderm = bezpieczny default.

## Pola do wypełnienia

### Display name (max 30 znaków)

```
Paweł Lipowczan
```

### Username

```
@plipowczan
```

(jeśli zajęte: `@pawel_lipowczan` lub `@lipowczan`)

### Bio (max 500 znaków — wykorzystujemy ~400)

```
CTO & współzałożyciel Qamera AI 🎨 — wirtualne studio
fotograficzne dla marek fashion e-commerce, zastępujące sesje
zdjęciowe AI generatywnym.

Niezależny konsultant: optymalizacja procesów biznesowych
i dobór technologii (no-code, AI, automatyzacja).

🧭 Zasada: najpierw analiza i procesy, technologia jest wtórna.

🔧 Make · n8n · Airtable · Python · Claude · OpenAI
🌐 PL/EN · 🇵🇱 Polska
```

**Liczba znaków:** ~390. Mastodon obsługuje emoji + linki w bio i wszystkie one renderują się klikalnie.

### Profile metadata (4 key:value pairs — wszystkie się weryfikują)

Mastodon ma 4 pola "metadata" obok bio. Każde renderuje się jako klikalny link, a jeśli pole zawiera link do strony, na której jest `<a rel="me" href="https://mastodon-instance/@username">…</a>`, pole zostaje **zweryfikowane** zielonym checkiem.

```
Strona      | https://pawel.lipowczan.pl
Blog        | https://pawel.lipowczan.pl/blog
Qamera AI   | https://qamera.ai
LinkedIn    | https://linkedin.com/in/pawellipowczan
```

> **Verification trick (opcjonalnie, ale daje zielony checkmark):**
> Dodaj na `pawel.lipowczan.pl` (np. w stopce, ukryty `display:none` jest OK)
> link `<a rel="me" href="https://hachyderm.io/@plipowczan">Mastodon</a>`.
> Mastodon to wykryje i da Ci ✓ przy polu Strona.

### Header / banner

Banner (1500×500 px). Jeśli nie masz dedykowanej grafiki, użyj OG-image z home (`/images/og-home.webp`) lub z któregoś flagowego posta. Nie krytyczne, ale puste pole = "leniwy profil" w odbiorze.

### Avatar

Twoje normalne zdjęcie profilowe. To samo, co na LinkedIn / GitHub — spójność wizualna.

## Pinned post (toot)

Mastodon pozwala przypiąć do 5 tootόw. Zacznij od jednego:

```
Cześć Fediverse 👋

Jestem Paweł. Buduję Qamera AI — wirtualne studio
fotograficzne, które zastępuje sesje produktowe AI generatywnym.
Plus prowadzę konsulting: optymalizacja procesów + technologia
(no-code, AI, automatyzacja).

Piszę o tym wszystkim na blogu — case studies, narzędzia,
workflow z Claude Code:
🔗 https://pawel.lipowczan.pl/blog

Działam w PL/EN. Zasada: najpierw analiza, potem narzędzie.

#introductions #AI #automation #noCode #consulting
```

`#introductions` to standardowy onboarding hashtag w Fediverse — daje boost discovery przez pierwsze 24-48h.

## Hashtag strategy

Mastodon hashtagi działają **inaczej niż na X** — są podstawowym mechanizmem discovery (brak algorytmu rekomendacji). Używaj 2–4 hashtagów per post, branżowych.

### Twoje core hashtagi (używaj często)

```
#AI #Automation #NoCode #LowCode #ProcessOptimization
#ClaudeAI #LLM #AIAgents #Consulting #SmallBusiness
#Productivity #PythonDev #Webdev #Fashion (dla Qamera content)
```

### Mniej popularne ale niche-fit

```
#AgenticAI #SpecDrivenDev #OpsX #Fediverse #IndieDev
#TechAdvisor #DigitalTransformation
```

### Polish-specific (jeśli post po PL)

```
#Polska #IT #automatyzacja #przedsiębiorczość
```

## Strategia content (na pierwszy miesiąc)

| Co tygodniowo | Częstotliwość |
|---|---|
| Repost / link do nowego posta blogowego | po każdej publikacji |
| Krótka myśl / mikro-tip z konsultingu (2-3 zdania) | 2-3× tydzień |
| Boost (RT) postów branżowych z komentarzem | 1-2× tydzień |
| Zdjęcie / case study Qamera AI (gdy publiczne) | 1× tydzień |

Mastodon nagradza **konsystencję**, nie volume. 3 dobre tooty/tydzień > 20 słabych.

## Po wypełnieniu

1. Sprawdź profil oczami osoby która Cię nie zna — czy w 5 sekund rozumie kim jesteś?
2. Toot #introductions opublikowany?
3. Boost 1-2 postów osób które obserwujesz w branży — Mastodon = social, początek wymaga ruchu.
4. Wróć do `docs/seo/INDEXING_RECOVERY.md` punkt 4.6 (opcjonalny komentarz pod artykułem branżowym).
