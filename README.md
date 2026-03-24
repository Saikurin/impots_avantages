# impots_avantages

Projet initialise avec :
- un backend Django
- un frontend Angular
- un lancement uniquement via Docker

## Lancer le projet

```bash
docker compose up --build
```

## URLs

- Frontend Angular : `http://localhost:4200`
- Backend Django : `http://localhost:8000/`

## Comportement attendu

- `http://localhost:8000/` renvoie un JSON `{"message": "Hello world"}`
- `http://localhost:4200` affiche une page d'accueil Angular avec `Hello world`
