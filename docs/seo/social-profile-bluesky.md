# Bluesky — profile setup

> **Cel:** uzupełnienie sekcji 4.5 w `docs/seo/INDEXING_RECOVERY.md`.

Bluesky w 2026 rośnie szybko w branży tech/AI, ale ma inne mechaniki niż X — brak algorytmu rekomendacji (jest "discover feed" + custom feeds), nacisk na **starter packs** i **labelers**. Hashtagi są klikalne ale słabo używane do discovery.

## Pola do wypełnienia

### Display name (~64 znaki, miękki limit)

```
Paweł Lipowczan
```

### Handle

```
@plipowczan.bsky.social
```

> **Pro tip:** możesz zamienić `bsky.social` na własną domenę. Ustaw handle jako `@pawel.lipowczan.pl` (przez DNS TXT record na `_atproto.lipowczan.pl`). Daje Ci weryfikowalność własnością domeny + marketing brand. Jeśli chcesz to zrobić, daj znać — przygotuję osobny mini-task. **Mocno rekomenduję** — to praktycznie jedyna "weryfikacja" jaką Bluesky oferuje.

### Bio / Description (max 256 znaków)

**Wariant rekomendowany (~250 znaków):**

```
CTO & co-founder of Qamera AI 🎨 — virtual photo studio
for fashion e-com (replaces product shoots w/ generative AI).
Independent consultant: process + tech (no-code, AI). PL/EN.

🌐 https://qamera.ai
📝 https://pawel.lipowczan.pl
```

> Bluesky bio renderuje URL-e jako klikalne. **Możesz dać 2 linki** (w odróżnieniu od X), więc oba `qamera.ai` i `pawel.lipowczan.pl` lecą wprost w bio.

### Header / banner (1500×500 px)

Identycznie jak X / Mastodon — banner OG-image albo dedykowany. Spójność wizualna.

### Avatar

To samo co inne platformy.

## Pinned post (od 2025 wspierane natywnie)

```
Hi Bluesky 👋

I'm Paweł — building Qamera AI 🎨 virtual photo studio
that replaces expensive product shoots with generative AI
for fashion e-commerce brands (swimwear, lingerie).

Also independent consultant: process optimization +
tech (AI, no-code, automation) for SMBs.

🌐 https://qamera.ai
📝 https://pawel.lipowczan.pl/blog (case studies, AI workflows)

PL/EN. Analysis-first, tools-second.
```

Po publikacji: trzy kropki przy poście → "Pin to profile".

## Starter packs

Bluesky-specific: **starter packs** to listy ludzi do follow-up jednym klikiem. Rośniesz najszybciej dołączając do branżowych:

- Search "starter pack" + Twoja branża (`AI`, `tech founders`, `Polish tech`).
- Aplikuj o dołączenie do 2-3 packów (zwykle przez DM do owner-a).
- Później sam stwórz pack swoich ulubionych ludzi z branży (działa w obie strony — pojawiasz się w packu, ludzie zaczynają Cię follow-up).

## Hashtag strategy

Bluesky hashtagi są klikalne i działają jako **filtry feedu**, ale mało kto przegląda po tagach (vs Mastodon gdzie to standard). Używaj **1 hashtag** per post, najwyżej 2.

### Twoje core hashtagi

```
#AI #Automation #NoCode #ClaudeAI #LLM
#GenerativeAI #FashionTech #IndieDev
```

### Polish-specific

```
#PolishTech #PolskaIT #Polska
```

### Pro tip — custom feeds

Bluesky pozwala subskrybować custom feeds (np. "AI builders", "Polish tech"). Te feedy są **ważniejsze niż hashtagi** dla discovery — postuj content, który pasuje do feedów Twojej audiencji, niezależnie od hashtagów.

Subskrybuj 3-5 feedów branżowych — zobaczysz, co tam działa, dostosujesz styl.

## Strategia content

| Format | Częstotliwość | Komentarz |
|---|---|---|
| Cross-post z X / Mastodon | po każdej publikacji | identyczna treść — Bluesky tego nie karze |
| Reply do branżowych kont | 3-5× tydzień | discovery działa głównie przez reply graph |
| Quote post (re-post z komentarzem) | 1-2× tydzień | jak quote tweet na X |

Bluesky to wciąż młoda platforma — **niski hałas**, łatwiej się przebić niż na X. Inwestycja czasu zwykle bardziej opłacalna w 2026.

## Po wypełnieniu

1. Avatar + display name + bio + 2 linki widoczne i klikalne.
2. Pinned post opublikowany i przypięty.
3. Follow 15-20 osób z branży tech/AI/no-code (założyciele AI startupόw, no-code influencerzy, polski tech twitter/bluesky).
4. **Mocna rekomendacja:** rozważ ustawienie własnej domeny jako handle (`@pawel.lipowczan.pl` zamiast `@plipowczan.bsky.social`) — to jedna z najsilniejszych form social proof na Bluesky.
5. Wróć do `docs/seo/INDEXING_RECOVERY.md` punkt 4.6 (komentarz pod artykułem branżowym, opcjonalny).

---

## Załącznik: jak ustawić własną domenę jako Bluesky handle

Jeśli zdecydujesz, że chcesz `@pawel.lipowczan.pl`:

1. Na Bluesky: Settings → Account → Handle → "I have my own domain".
2. Bluesky wygeneruje Ci wartość TXT record do dodania w DNS (np. `did=did:plc:xxxxxxxx`).
3. W panelu DNS u dostawcy domeny dodaj TXT record:
   ```
   Host: _atproto
   Type: TXT
   Value: did=did:plc:xxxxxxxx
   ```
4. Wróć do Bluesky → "Verify DNS Record" → potwierdzenie.
5. Handle zmienia się na `@pawel.lipowczan.pl`. Stary `@plipowczan.bsky.social` jest archiwizowany.

Czas: ~15 min (głównie czekanie na propagację DNS, zwykle 5-30 min).
Ryzyko: zerowe — to tylko TXT record, nie wpływa na strony / maile / nic innego.
