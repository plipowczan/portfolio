# Emails (React Email)

Brandowane maile transakcyjne/broadcast dla waitlisty „LLM Wiki". Źródło = komponenty React,
render do email-safe HTML (inline CSS) przez [React Email](https://react.email).

Motyw i kolory: `../context/brand/brand-design.md` w repo `agentic-ai-private` (single source of
truth) — motyw ciemny, akcent `#00ff9d`, font Inter.

## Maile

| Plik | Do czego |
|---|---|
| `WaitlistLaunch.jsx` | Ogłoszenie startu darmowego kursu → CTA `pawel.lipowczan.pl/llm-wiki/kurs` |

## Instalacja (raz)

```bash
npm i @react-email/components
npm i -D react-email
```

## Podgląd (na żywo, przeglądarka)

```bash
npx react-email dev
# http://localhost:3000 — edytuj .jsx, odświeża się
```

## Wysyłka — dwie drogi

### A) Broadcast w dashboardzie Resend (bez kodu)

1. Wyeksportuj statyczny HTML:
   ```bash
   npx react-email export      # → ./out/WaitlistLaunch.html
   ```
2. Resend → **Broadcasts** → *Create* → wybierz Audience → tryb HTML → wklej zawartość `out/WaitlistLaunch.html`.
3. *Send test* na własny adres (Gmail + Outlook), potem wyślij do listy.

Link „Wypisz się" używa tokenu `{{{RESEND_UNSUBSCRIBE_URL}}}` — Resend podmienia go w broadcastach automatycznie.

### B) Przez API (kod)

Resend SDK przyjmuje komponent React wprost — bez ręcznego renderu:

```js
import { Resend } from "resend";
import WaitlistLaunch from "./emails/WaitlistLaunch.jsx";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Paweł Lipowczan <pawel@lipowczan.pl>",   // wymaga zweryfikowanej domeny
  to: ["odbiorca@example.com"],
  subject: "Obiecałem dać znać — darmowy kurs LLM Wiki jest online",
  react: WaitlistLaunch(),
});
```

> Uwaga: przy API `{{{RESEND_UNSUBSCRIBE_URL}}}` NIE jest podmieniany automatycznie (to mechanika
> broadcastów). Do zwykłego `emails.send` albo użyj broadcastu, albo podstaw własny link wypisu.

## Zasady (email ≠ strona WWW)

- **CSS tylko inline** (jest — style w komponencie). Bez `<style>`/klas.
- **Logo tekstowe** (`</>` + nazwisko) — SVG z `/public/logo.svg` nie renderuje się w mailu; obrazy
  wymagają absolutnego URL. Jeśli chcesz raster: hostuj PNG i podmień na `<Img src="https://pawel.lipowczan.pl/...png" />`.
- **Font Inter** ładowany przez `<Font>` z fallbackiem systemowym (webfonty w mailach bywają ignorowane — fallback to zabezpieczenie).
- **Test** przed wysyłką: *Send test* w Resend na Gmaila i Outlooka (dark mode odwraca kolory — sprawdź).
- **Tożsamość nadawcy + unsubscribe** w stopce (wymóg antyspamowy / dobra praktyka RODO).

## Powiązanie

Ten szablon = element migracji Formspree → Resend (patrz `agentic-ai-private` →
`SECOND_BRAIN_KURS/deliverables/2026-07-04_resend-migracja-explore-prompt.md`). Wysyłka broadcastu
i endpoint `api/subscribe` domykają się w changu OpenSpec po `/opsx:explore`.
