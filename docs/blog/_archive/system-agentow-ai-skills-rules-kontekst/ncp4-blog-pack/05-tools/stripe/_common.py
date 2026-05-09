"""Shared helpers for Stripe CLI scripts."""
from __future__ import annotations

import os
import sys
from pathlib import Path


def load_env() -> None:
    """Load .env from the tools/stripe directory into os.environ."""
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        print(
            f"Error: {env_path} not found.\n"
            f"Copy {env_path.parent / '.env.example'} to .env and fill in your API key.",
            file=sys.stderr,
        )
        sys.exit(1)
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


def require_env(*keys: str) -> dict[str, str]:
    missing = [k for k in keys if not os.environ.get(k)]
    if missing:
        print(
            f"Error: missing environment variables: {', '.join(missing)}.\n"
            f"Check tools/stripe/.env.",
            file=sys.stderr,
        )
        sys.exit(1)
    return {k: os.environ[k] for k in keys}


def stripe_config() -> dict[str, str]:
    load_env()
    return require_env("STRIPE_SECRET_KEY")
