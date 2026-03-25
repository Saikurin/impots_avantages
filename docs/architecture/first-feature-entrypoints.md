## Premier point d'entree feature

### Objectif
Poser les premiers points d'entree techniques du bundle `frais_kilometriques` pour lancer l'implementation incrementalement.

### Backend
- route racine JSON : `GET /`
- healthcheck : `GET /health/`
- placeholder bundle : `GET /api/bundles/frais-kilometriques/`
- collection des simulations : `GET /api/bundles/frais-kilometriques/simulations`
- creation d'une simulation : `POST /api/bundles/frais-kilometriques/simulations`
- detail d'une simulation : `GET /api/bundles/frais-kilometriques/simulations/{id}`
- lecture du domicile : `GET /api/bundles/frais-kilometriques/simulations/{id}/domicile`
- sauvegarde du domicile : `POST /api/bundles/frais-kilometriques/simulations/{id}/domicile`
- lecture des sites : `GET /api/bundles/frais-kilometriques/simulations/{id}/sites`
- creation d'un site : `POST /api/bundles/frais-kilometriques/simulations/{id}/sites`
- lecture des vehicules : `GET /api/bundles/frais-kilometriques/simulations/{id}/vehicules`
- creation d'un vehicule : `POST /api/bundles/frais-kilometriques/simulations/{id}/vehicules`
- suppression d'un vehicule : `DELETE /api/bundles/frais-kilometriques/simulations/{id}/vehicules/{vehiculeId}`
- lecture du calendrier : `GET /api/bundles/frais-kilometriques/simulations/{id}/calendrier`
- creation ou mise a jour d'un jour : `POST /api/bundles/frais-kilometriques/simulations/{id}/calendrier`
- suppression d'un jour : `DELETE /api/bundles/frais-kilometriques/simulations/{id}/calendrier/{jourId}`

### Frontend
- page d'accueil : `/`
- page placeholder bundle : `/bundles/frais-kilometriques`
- page du bundle branchee a l'API via proxy Angular
- page domicile : `/bundles/frais-kilometriques/{id}/domicile`
- page sites : `/bundles/frais-kilometriques/{id}/sites`
- page vehicule : `/bundles/frais-kilometriques/{id}/vehicule`
- page calendrier : `/bundles/frais-kilometriques/{id}/calendrier`

### Prochaine implementation conseillee
- brancher ensuite le calendrier et le calcul.
