# Production VPS

## Fichiers utiles

- `docker-compose.prod.yml`
- `.env.prod.example`
- `infra/docker/backend/prod/Dockerfile`
- `infra/docker/frontend/prod/Dockerfile`

## Ce que fait le setup

- `frontend` : build Angular de production puis service statique via Nginx
- `backend` : Django + Gunicorn
- `keycloak` : Authorization Server OAuth/OIDC
- `keycloak-db` : Postgres pour Keycloak

## Preparation

1. Copier l'exemple d'environnement :

```bash
cp .env.prod.example .env
```

2. Renseigner au minimum :
- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `KEYCLOAK_ADMIN_PASSWORD`
- `KEYCLOAK_DB_PASSWORD`
- `KEYCLOAK_FRONTEND_URL`
- `OPENROUTESERVICE_API_KEY`

## Lancer en production sur le VPS

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Services exposes

- frontend interne : `127.0.0.1:8081`
- keycloak interne : `127.0.0.1:8080`

Le frontend proxy automatiquement `/api/` vers le backend Gunicorn.

## Reverse proxy recommande

Le plus simple sur ton VPS est `Caddy`, car il genere automatiquement les certificats HTTPS.

### Installation Caddy

```bash
apt update
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy
```

### Configuration Caddy

Copier le fichier du repo :

```bash
cp infra/caddy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
```

Ce fichier route :
- `fisceo.theo-sikli.fr` -> `127.0.0.1:8081`
- `auth.fisceo.theo-sikli.fr` -> `127.0.0.1:8080`

### Verifications

```bash
systemctl status caddy
caddy validate --config /etc/caddy/Caddyfile
curl -I https://fisceo.theo-sikli.fr
curl -I https://auth.fisceo.theo-sikli.fr
```

## Notes importantes

- Le backend utilise actuellement SQLite avec un volume persistant `backend_data`
- Pour une production plus robuste a moyen terme, il faudra migrer le backend applicatif vers Postgres
- Le frontend lit `app-config.js` au runtime pour pointer vers la bonne URL Keycloak
- `KEYCLOAK_FRONTEND_URL` doit correspondre a l'URL publique de Keycloak

## Verifications conseillees

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f keycloak
```
