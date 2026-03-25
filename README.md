# impots_avantages

Projet initialise avec :
- un backend Django
- un frontend Angular
- un lancement uniquement via Docker

## Lancer le projet

Creer d'abord ton fichier `.env` a partir de `.env.example` :

```bash
cp .env.example .env
```

Puis renseigner si besoin :
- `OPENROUTESERVICE_API_KEY`
- `OPENROUTESERVICE_BASE_URL`

```bash
docker compose up --build
```

Ensuite, pour le dev quotidien, les fichiers sont montes en volume :

```bash
docker compose up
```

Tu n'as besoin de rebuild que si tu changes :
- `backend/requirements.txt`
- `frontend/package.json`
- un `Dockerfile`

## URLs

- Frontend Angular : `http://localhost:4200`
- Backend Django : `http://localhost:8000/`
- Healthcheck Django : `http://localhost:8000/health/`
- Placeholder bundle backend : `http://localhost:8000/api/bundles/frais-kilometriques/`
- Placeholder bundle frontend : `http://localhost:4200/bundles/frais-kilometriques`
- Collection simulations : `http://localhost:8000/api/bundles/frais-kilometriques/simulations`
- Domicile d une simulation : `http://localhost:8000/api/bundles/frais-kilometriques/simulations/{id}/domicile`
- Sites d une simulation : `http://localhost:8000/api/bundles/frais-kilometriques/simulations/{id}/sites`
- Vehicules d une simulation : `http://localhost:8000/api/bundles/frais-kilometriques/simulations/{id}/vehicules`
- Calendrier d une simulation : `http://localhost:8000/api/bundles/frais-kilometriques/simulations/{id}/calendrier`

## Comportement attendu

- `http://localhost:8000/` renvoie un JSON `{"message": "Hello world"}`
- `http://localhost:8000/health/` renvoie un JSON `{"status": "ok"}`
- `http://localhost:4200` affiche une page d'accueil Angular avec `Hello world`
- `http://localhost:4200/bundles/frais-kilometriques` affiche la page placeholder du premier bundle
- `POST /api/bundles/frais-kilometriques/simulations` cree un brouillon de simulation
- `GET /api/bundles/frais-kilometriques/simulations` retourne les derniers brouillons
- `POST /api/bundles/frais-kilometriques/simulations/{id}/domicile` enregistre le domicile
- `GET /api/bundles/frais-kilometriques/simulations/{id}/domicile` relit le domicile
- `POST /api/bundles/frais-kilometriques/simulations/{id}/sites` ajoute un site de travail
- `GET /api/bundles/frais-kilometriques/simulations/{id}/sites` liste les sites de travail
- `POST /api/bundles/frais-kilometriques/simulations/{id}/vehicules` ajoute un vehicule
- `GET /api/bundles/frais-kilometriques/simulations/{id}/vehicules` liste les vehicules
- `DELETE /api/bundles/frais-kilometriques/simulations/{id}/vehicules/{vehiculeId}` supprime un vehicule
- `POST /api/bundles/frais-kilometriques/simulations/{id}/calendrier` ajoute ou met a jour un jour travaille
- `GET /api/bundles/frais-kilometriques/simulations/{id}/calendrier` liste les jours travailles
- `DELETE /api/bundles/frais-kilometriques/simulations/{id}/calendrier/{jourId}` supprime un jour

## Workflow dev

- premiere fois : `docker compose up --build`
- ensuite : `docker compose up`
- si tu modifies du code backend ou frontend, pas besoin de rebuild
- si tu modifies `docker-compose.yml`, relance avec `docker compose up -d`

## Lint

- backend : `docker compose exec backend ruff check /app/backend`
- frontend : `docker compose exec frontend npm run lint`
- les deux : `./lint.sh`

## Tests

- tests backend bundle : `docker compose exec backend python manage.py test apps.bundles.frais_kilometriques.tests`
- tests E2E Playwright :

```bash
docker run --rm -v "$(pwd)/frontend:/work" -w /work mcr.microsoft.com/playwright:v1.58.2-jammy sh -lc "npm install && npx playwright test"
```

## Premiere feature bundle

Le premier slice reel du bundle est en place :
- modele Django `SimulationFraisKilometriques`
- migration initiale du bundle
- endpoint de creation et de lecture des simulations
- page Angular du bundle qui cree un brouillon et liste les simulations existantes

Le deuxieme slice est aussi en place :
- modele Django `AdresseDomicile`
- migration du domicile
- endpoint de sauvegarde et lecture du domicile
- etape Angular `domicile` branchee apres la creation du brouillon

Le troisieme slice est en place :
- modele Django `SiteTravail`
- migration des sites de travail
- endpoint de creation et lecture des sites
- etape Angular `sites de travail`
- bouton de reprise de brouillon qui redirige vers la bonne etape selon l'avancement

Le quatrieme slice est en place :
- modele Django `Vehicule`
- migration des vehicules
- endpoint de creation, lecture et suppression des vehicules
- etape Angular `vehicule`
- reprise de brouillon jusqu'a l'etape vehicule

Le cinquieme slice est en place :
- modele Django `JourTravaille`
- migration du calendrier
- endpoint de creation, lecture et suppression des jours travailles
- etape Angular `calendrier`
- reprise de brouillon jusqu'au calendrier

La base du calcul GPS est maintenant en place :
- geocodage des adresses domicile et site quand une cle OpenRouteService est disponible
- cache local de distance dans `DistanceTrajet`
- endpoint backend de calcul d un trajet domicile -> site

Ameliorations recentes du bundle :
- synthese avec filtre par annee
- lazy loading des jours au scroll sur la page resultat
- resume visuel sur le calendrier
- base de tests backend sur les baremes et la synthese resultat
