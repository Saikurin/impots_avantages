import os
from pathlib import Path

from .base import *  # noqa: F403,F401

DEBUG = False

DATABASES = globals()["DATABASES"]

SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "replace-this-with-a-long-random-production-secret-key-1234567890",
)

SECURE_HSTS_SECONDS = int(os.getenv("DJANGO_SECURE_HSTS_SECONDS", "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = os.getenv("DJANGO_SECURE_SSL_REDIRECT", "true").lower() == "true"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

DATABASES["default"]["NAME"] = os.getenv(
    "DJANGO_SQLITE_PATH",
    str(Path("/app/backend/data/db.sqlite3")),
)
