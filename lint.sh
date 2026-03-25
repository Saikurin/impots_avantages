#!/bin/sh
set -eu

export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"

docker compose exec backend ruff check /app/backend
docker compose exec frontend npm run lint
