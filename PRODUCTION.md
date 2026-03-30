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

- frontend : port `80`
- keycloak : port `8080`

Le frontend proxy automatiquement `/api/` vers le backend Gunicorn.

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
