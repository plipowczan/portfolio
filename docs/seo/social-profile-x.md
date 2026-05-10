# X (Twitter) — profile setup

> **Cel:** uzupełnienie sekcji 4.5 w `docs/seo/INDEXING_RECOVERY.md`.

## Pola do wypełnienia

X ma sztywne limity i tylko **jedno** pole "Website" (jeden klikalny link w bio). Decydujemy: ten jeden link → **`pawel.lipowczan.pl`**. Link do `qamera.ai` umieszczamy w treści bio i pinned tweecie.

### Display name (max 50 znaków)

```
Paweł Lipowczan
```

### Username

```
@plipowczan
```

(Jeśli zajęty: `@pawellipowczan` lub `@lipowczan_pl`.)

### Bio (max 160 znaków — wycinamy mocno)

**Wariant A (rekomendowany, ~155 znaków):**

```
CTO & co-founder @QameraAI 🎨 virtual photo studio for fashion e-com.
Independent consultant: process + tech (AI/no-code). PL/EN 🇵🇱
```

**Wariant B (bardziej PL, ~158 znaków):**

```
CTO/co-founder @QameraAI 🎨 wirtualne studio foto dla fashion e-com.
Konsultant: optymalizacja procesów + tech (AI/no-code). PL/EN 🇵🇱
```

> `@QameraAI` w bio renderuje się jako klikalny link do konta X Qamera AI **jeśli** taki handle istnieje. Jeśli nie ma jeszcze konta X dla Qamera, zamień na napis `Qamera AI` + dodaj link w pinned tweecie. Sprawdź: https://x.com/QameraAI

### Website (jedno pole, klikalne)

```
https://pawel.lipowczan.pl
```

### Location

```
Poland
```

(albo `Polska 🇵🇱` — międzynarodowo czytelne i lokalne sygnały trzymane.)

### Header / banner (1500×500 px)

Jeśli nie masz dedykowanej grafiki — OG-image z home (`/images/og-home.webp`) lub OG któregoś flagowego posta. Puste pole = profil "z gotowca".

### Avatar

To samo co LinkedIn / GitHub / Mastodon — spójność wizualna.

## Pinned tweet (najważniejsze)

X mocno opiera się na pinned tweetach — pierwsze co odwiedzający zobaczą. Tu **explicite** linkujemy `qamera.ai`.

**Wariant EN (rekomendowany — większy zasięg):**

```
Hi 👋 I'm Paweł.

🎨 CTO & co-founder of Qamera AI — virtual photo studio
that replaces expensive product shoots with generative AI
for fashion e-com brands.

🛠 Also independent consultant: process optimization,
no-code & AI workflows for SMBs.

🌐 https://qamera.ai
📝 https://pawel.lipowczan.pl/blog
```

**Wariant PL (jeśli polskie audytorium > globalne):**

```
Cześć 👋 Jestem Paweł.

🎨 CTO i współzałożyciel Qamera AI — wirtualne studio
fotograficzne, które zastępuje kosztowne sesje produktowe
generatywnym AI dla marek fashion e-commerce.

🛠 Niezależny konsultant: optymalizacja procesów,
no-code i AI dla MŚP.

🌐 https://qamera.ai
📝 https://pawel.lipowczan.pl/blog
```

> X obniża zasięg postów z linkami zewnętrznymi (algorithmic downranking od 2023).
> Workaround: wklej tekst BEZ linków, a linki dodaj **w pierwszym komentarzu pod tweetem** (reply do siebie). Przy pinned tweecie efekt jest mniejszy, ale warto.

## Hashtag strategy

X w 2026 to **głównie algorytm rekomendacji**, hashtagi mają mniejsze znaczenie niż 5 lat temu. Reguła: 1–2 hashtagi per tweet, NIGDY 5+. Dłuższy tekst > zbiór hashtagów.

### Twoje core hashtagi

```
#AI #Automation #NoCode #ClaudeAI #LLM
#ProcessOptimization #SaaS #IndieFounder
```

### Niche / Qamera-specific

```
#GenerativeAI #FashionTech #EcommerceAI #ProductPhotography
#AIAgents #VirtualPhotoshoot
```

### PL-specific (gdy post po polsku)

```
#Polska #IT #przedsiębiorczość #AI #automatyzacja
```

### Czego NIE używaj

- ❌ #FollowBack #Like4Like — robiło się to 2015, dziś = niska jakość
- ❌ Stos 8 hashtagów na końcu tweeta — algorytm karze

## Strategia content (na pierwszy miesiąc)

| Format | Częstotliwość | Cel |
|---|---|---|
| Cytat / klucz z nowego posta blogowego (z linkiem w komentarzu) | po każdej publikacji | ruch na blog |
| Mikro-thread (3-5 tweetόw) z case studies Qamera lub konsultingu | 1× tydzień | engagement |
| Reply do branżowych kont (sensowne, nie spam) | 3-5× tydzień | discovery |
| Retweet z komentarzem (quote tweet) | 1-2× tydzień | brand alignment |

X nagradza **engagement w pierwszych 30 minutach** po publikacji. Posty rób w godzinach gdy Twoja audiencja jest online (PL: 9-11, 19-22).

## Wstrzymane decyzje

- **Czy publikować po PL czy EN?** → Mix. Posty o Qamera AI / globalne tematy → EN. Posty o polskim biznesie / case studies z polskich klientów → PL. Bio jak wyżej (mix EN/PL z flagą).
- **Czy linkować bezpośrednio czy przez first comment?** → Bezpośrednio dla pinned tweet. Dla zwykłych postόw → first comment, jeśli zauważysz spadek zasięgu.

## Po wypełnieniu

1. Sprawdź czy avatar + display name + bio renderują się tak, jak chciałeś.
2. Pinned tweet opublikowany i przypięty (3 kropki przy tweecie → "Pin to your profile").
3. Follow 10-15 kont z Twojej branży (founder-advisorzy, AI builderzy, fashion-tech) — bez tego timeline jest pusty.
4. Wróć do `docs/seo/INDEXING_RECOVERY.md` — kolejna platforma (Bluesky) lub punkt 4.6.
