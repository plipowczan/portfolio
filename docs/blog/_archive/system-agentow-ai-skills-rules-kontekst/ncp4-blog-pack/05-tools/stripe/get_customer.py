#!/usr/bin/env python3
"""Fetch a single Stripe customer with expanded subscription data.

Usage: get_customer.py CUSTOMER_ID
"""
from __future__ import annotations

import base64
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

from _common import stripe_config


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) != 2:
        print("Usage: get_customer.py CUSTOMER_ID", file=sys.stderr)
        return 2
    customer_id = sys.argv[1]
    cfg = stripe_config()
    params = urllib.parse.urlencode({"expand[]": "subscriptions"})
    url = f"https://api.stripe.com/v1/customers/{customer_id}?{params}"
    token = base64.b64encode(f"{cfg['STRIPE_SECRET_KEY']}:".encode("utf-8")).decode("ascii")
    req = urllib.request.Request(url, headers={"Authorization": f"Basic {token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Stripe API error {e.code}: {e.read().decode('utf-8', errors='replace')}", file=sys.stderr)
        return 1
    json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
