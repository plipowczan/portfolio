"""Shared helpers for Revolut Business API scripts."""
from __future__ import annotations

import base64
import json
import os
import sys
import time
from pathlib import Path

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

ENV_PATH = Path(__file__).resolve().parent / ".env"

TOKEN_URLS = {
    "production": "https://b2b.revolut.com/api/1.0/auth/token",
    "sandbox": "https://sandbox-b2b.revolut.com/api/1.0/auth/token",
}

AUTH_URLS = {
    "production": "https://business.revolut.com/app-confirm",
    "sandbox": "https://sandbox-business.revolut.com/app-confirm",
}


def load_env() -> None:
    if not ENV_PATH.exists():
        print(
            f"Error: {ENV_PATH} not found.\n"
            f"Copy {ENV_PATH.parent / '.env.example'} to .env and fill in your values.",
            file=sys.stderr,
        )
        sys.exit(1)
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
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
            f"Check {ENV_PATH}.",
            file=sys.stderr,
        )
        sys.exit(1)
    return {k: os.environ[k] for k in keys}


def update_env_var(key: str, value: str) -> None:
    """Rewrite a single KEY=VALUE line in .env (or append if missing)."""
    lines = ENV_PATH.read_text(encoding="utf-8").splitlines()
    out: list[str] = []
    found = False
    for line in lines:
        if line.strip().startswith(f"{key}="):
            out.append(f"{key}={value}")
            found = True
        else:
            out.append(line)
    if not found:
        out.append(f"{key}={value}")
    ENV_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def build_client_assertion(client_id: str, issuer: str, private_key_path: str) -> str:
    """Build a private_key_jwt client assertion signed with RS256."""
    key_path = Path(private_key_path).expanduser()
    if not key_path.is_absolute():
        key_path = ENV_PATH.parent / key_path
    key_bytes = key_path.read_bytes()
    private_key = serialization.load_pem_private_key(key_bytes, password=None)

    header = {"alg": "RS256", "typ": "JWT"}
    now = int(time.time())
    payload = {
        "iss": issuer,
        "sub": client_id,
        "aud": "https://revolut.com",
        "exp": now + 3600,
    }
    signing_input = (
        _b64url(json.dumps(header, separators=(",", ":")).encode()).encode()
        + b"."
        + _b64url(json.dumps(payload, separators=(",", ":")).encode()).encode()
    )
    signature = private_key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256())
    return signing_input.decode() + "." + _b64url(signature)


def revolut_config() -> dict[str, str]:
    load_env()
    cfg = require_env(
        "REVOLUT_ENV",
        "REVOLUT_CLIENT_ID",
        "REVOLUT_REDIRECT_URI",
        "REVOLUT_JWT_ISSUER",
        "REVOLUT_PRIVATE_KEY_PATH",
    )
    if cfg["REVOLUT_ENV"] not in TOKEN_URLS:
        print(f"Error: REVOLUT_ENV must be 'production' or 'sandbox'.", file=sys.stderr)
        sys.exit(1)
    return cfg


def token_url() -> str:
    return TOKEN_URLS[os.environ["REVOLUT_ENV"]]


def auth_url() -> str:
    return AUTH_URLS[os.environ["REVOLUT_ENV"]]
