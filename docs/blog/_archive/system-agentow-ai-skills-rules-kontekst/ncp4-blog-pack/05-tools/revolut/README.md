# Revolut Business API — auth tooling

One-shot OAuth handshake + refresh-token flow for Revolut Business API.

## Setup

1. **Generate RSA keypair** (1Password lub openssl):
   ```bash
   openssl genrsa -out privatecert.pem 2048
   openssl req -new -x509 -key privatecert.pem -out publiccert.cer -days 1825 \
     -subj "/CN=200iqlabs.io"
   ```
   Wgraj `publiccert.cer` w Revolut Business → Settings → APIs → twoja aplikacja.
   Trzymaj `privatecert.pem` lokalnie (np. w `tools/revolut/privatecert.pem` —
   katalog jest gitignored).

2. **Skopiuj `.env`:**
   ```bash
   cp .env.example .env
   ```
   Uzupełnij `REVOLUT_CLIENT_ID`, `REVOLUT_PRIVATE_KEY_PATH`. Domyślny
   `REVOLUT_REDIRECT_URI=https://localhost:8443/callback` jest OK do
   jednorazowej autoryzacji — strona docelowa nie musi istnieć, liczy się
   tylko URL w pasku przeglądarki po kliknięciu „Authorize".

3. **Autoryzuj:**
   ```bash
   python authorize.py
   ```
   Skrypt otwiera URL w przeglądarce, prosi o wklejenie callback URL,
   wymienia `code` na tokeny i zapisuje `REVOLUT_REFRESH_TOKEN` do `.env`.

4. **Pobierz świeży access_token (40 min ważności):**
   ```bash
   python refresh.py            # samo access_token
   python refresh.py --json     # pełna odpowiedź
   ```

## Token lifecycle

- `access_token` — 40 min. Generuj na żądanie przez `refresh.py`.
- `refresh_token` — 90 dni od ostatniego użycia. Cron uderzający w API
  regularnie utrzyma go żywym. Jeśli wygaśnie — uruchom `authorize.py`
  ponownie.

## Pliki

- `authorize.py` — one-shot OAuth (uruchamiany ręcznie)
- `refresh.py` — odświeża access_token (cron-friendly)
- `_common.py` — ładowanie .env, podpisywanie JWT (RS256, private_key_jwt)
- `.env` (gitignored) — credentials + refresh_token
- `privatecert.pem` (gitignored) — klucz prywatny RSA
