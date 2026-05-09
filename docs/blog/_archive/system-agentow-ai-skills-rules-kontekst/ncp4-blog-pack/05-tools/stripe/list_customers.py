#!/usr/bin/env python3
"""List Stripe customers with expanded subscription data.

Paginates through all customers and prints a JSON array to stdout.
Each customer includes the primary active subscription inline (first found, if any).
"""
from __future__ import annotations

import base64
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

from _common import stripe_config


def _auth_header(secret: str) -> str:
    token = base64.b64encode(f"{secret}:".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    cfg = stripe_config()
    headers = {"Authorization": _auth_header(cfg["STRIPE_SECRET_KEY"])}

    customers: list[dict] = []
    starting_after: str | None = None
    while True:
        params: dict[str, str] = {"limit": "100"}
        if starting_after:
            params["starting_after"] = starting_after
        # Expand default subscription list for convenience
        params["expand[]"] = "data.subscriptions"
        url = f"https://api.stripe.com/v1/customers?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            print(f"Stripe API error {e.code}: {e.read().decode('utf-8', errors='replace')}", file=sys.stderr)
            return 1
        page = payload.get("data", [])
        customers.extend(page)
        if not payload.get("has_more") or not page:
            break
        starting_after = page[-1]["id"]

    json.dump(customers, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
