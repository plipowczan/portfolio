#!/usr/bin/env python
"""Exchange the stored refresh_token for a fresh access_token.

Prints the access token to stdout (suitable for `$(python refresh.py)` use)
or as JSON when --json is passed. Does NOT persist the access token —
it's short-lived (40 min) and meant to be used immediately.
"""
from __future__ import annotations

import argparse
import json
import sys

import requests

from _common import build_client_assertion, revolut_config, token_url

CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="emit full token response as JSON")
    args = parser.parse_args()

    import os

    cfg = revolut_config()
    refresh_token = os.environ.get("REVOLUT_REFRESH_TOKEN", "").strip()
    if not refresh_token:
        print(
            "Error: REVOLUT_REFRESH_TOKEN is empty. Run authorize.py first.",
            file=sys.stderr,
        )
        return 1

    assertion = build_client_assertion(
        client_id=cfg["REVOLUT_CLIENT_ID"],
        issuer=cfg["REVOLUT_JWT_ISSUER"],
        private_key_path=cfg["REVOLUT_PRIVATE_KEY_PATH"],
    )

    resp = requests.post(
        token_url(),
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": cfg["REVOLUT_CLIENT_ID"],
            "client_assertion_type": CLIENT_ASSERTION_TYPE,
            "client_assertion": assertion,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )

    if resp.status_code != 200:
        print(f"Refresh failed [{resp.status_code}]:\n{resp.text}", file=sys.stderr)
        return 1

    body = resp.json()
    if args.json:
        print(json.dumps(body, indent=2))
    else:
        print(body["access_token"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
