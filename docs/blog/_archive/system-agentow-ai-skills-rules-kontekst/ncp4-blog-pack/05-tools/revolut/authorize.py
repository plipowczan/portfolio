#!/usr/bin/env python
"""One-shot Revolut Business OAuth handshake.

Flow:
  1. Builds the consent URL and opens it in your browser.
  2. You click "Authorize" in Revolut Business; browser is redirected to
     REVOLUT_REDIRECT_URI?code=oa_prod_xxx (the page itself does not need
     to load — the URL bar is what matters).
  3. Paste the full callback URL (or just the code) back here.
  4. Script exchanges the code for access_token + refresh_token, then
     saves REVOLUT_REFRESH_TOKEN into tools/revolut/.env.

Run again any time the refresh token expires (90 days idle).
"""
from __future__ import annotations

import sys
import urllib.parse
import webbrowser

import requests

from _common import (
    auth_url,
    build_client_assertion,
    revolut_config,
    token_url,
    update_env_var,
)

CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"


def main() -> int:
    cfg = revolut_config()
    consent = (
        f"{auth_url()}?client_id={urllib.parse.quote(cfg['REVOLUT_CLIENT_ID'])}"
        f"&redirect_uri={urllib.parse.quote(cfg['REVOLUT_REDIRECT_URI'])}"
        f"&response_type=code&scope=READ"
    )

    print("Open this URL in your browser and click 'Authorize':\n")
    print(f"  {consent}\n")
    try:
        webbrowser.open(consent)
    except Exception:
        pass

    raw = input(
        "After authorizing, paste the full redirect URL (or just the code value): "
    ).strip()
    if not raw:
        print("No input — aborting.", file=sys.stderr)
        return 1

    if raw.startswith("http"):
        parsed = urllib.parse.urlparse(raw)
        params = urllib.parse.parse_qs(parsed.query)
        code = (params.get("code") or [""])[0]
    else:
        code = raw

    if not code:
        print("Could not extract authorization code from input.", file=sys.stderr)
        return 1

    assertion = build_client_assertion(
        client_id=cfg["REVOLUT_CLIENT_ID"],
        issuer=cfg["REVOLUT_JWT_ISSUER"],
        private_key_path=cfg["REVOLUT_PRIVATE_KEY_PATH"],
    )

    resp = requests.post(
        token_url(),
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": cfg["REVOLUT_CLIENT_ID"],
            "client_assertion_type": CLIENT_ASSERTION_TYPE,
            "client_assertion": assertion,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )

    if resp.status_code != 200:
        print(f"Token exchange failed [{resp.status_code}]:\n{resp.text}", file=sys.stderr)
        return 1

    body = resp.json()
    refresh = body.get("refresh_token")
    access = body.get("access_token")
    expires_in = body.get("expires_in")

    if not refresh:
        print(f"No refresh_token in response:\n{body}", file=sys.stderr)
        return 1

    update_env_var("REVOLUT_REFRESH_TOKEN", refresh)

    print("\nAuthorization complete.")
    print(f"  refresh_token saved to .env (rotate every <90 days of inactivity)")
    print(f"  access_token (use immediately, expires in {expires_in}s):\n    {access}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
