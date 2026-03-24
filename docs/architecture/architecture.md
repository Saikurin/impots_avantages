## Architecture cible

### Vue d'ensemble
- `backend/` porte la logique metier et l'API
- `frontend/` porte les parcours utilisateurs Angular
- `infra/` porte Docker et la couche d'exposition
- la logique fonctionnelle est organisee par bundles

### Backend Django
- `config/` : settings, urls, entrypoints Django
- `apps/common/` : briques partagees
- `apps/bundles/` : modules metier par avantage fiscal
- `apps/bundles/frais_kilometriques/` : premier bundle

### Frontend Angular
- `src/app/core/` : services globaux, config, interceptors
- `src/app/shared/` : composants et utilitaires communs
- `src/app/bundles/` : parcours par bundle
- `src/app/bundles/frais-kilometriques/` : ecrans du premier bundle

### Infrastructure
- `infra/docker/backend/` : image backend
- `infra/docker/frontend/` : image frontend
- `infra/nginx/` : reverse proxy pour VPS plus tard

### Principes d'organisation
- une responsabilite claire par dossier
- isolement des regles metier sensibles
- ajout simple de nouveaux bundles
- structure compatible dev local et deploiement Docker
