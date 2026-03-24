## Modele de donnees - Bundle frais kilometriques

### Objectif
Definir une structure de donnees exploitable pour le backend Django et suffisamment claire pour alimenter le frontend Angular du bundle `frais kilometriques`.

### Principes de modelisation
- separer les donnees de saisie, les donnees de reference et les donnees de calcul ;
- permettre plusieurs sites de travail ;
- permettre au moins un vehicule par simulation ;
- garder la possibilite de gerer plusieurs vehicules plus tard ;
- conserver une structure modulaire compatible avec d'autres bundles.

### Vue d'ensemble des entites
- `SimulationFraisKilometriques`
- `AdresseDomicile`
- `SiteTravail`
- `Vehicule`
- `JourTravaille`
- `DistanceTrajet`
- `ResultatSimulation`

### 1. SimulationFraisKilometriques
Entite racine du bundle.

Role :
- regrouper toutes les informations d'une simulation ;
- servir de point d'entree pour les calculs et la restitution ;
- porter la periode de declaration.

Champs suggeres :
- `id`
- `annee_fiscale`
- `date_debut_periode`
- `date_fin_periode`
- `statut` : brouillon, completee, calculee
- `created_at`
- `updated_at`

Relations :
- 1 simulation -> 1 domicile
- 1 simulation -> N sites de travail
- 1 simulation -> N vehicules
- 1 simulation -> N jours travailles
- 1 simulation -> 0..1 resultat de simulation

### 2. AdresseDomicile
Adresse de reference de l'utilisateur pour le calcul des trajets domicile-travail.

Champs suggeres :
- `id`
- `simulation_id`
- `libelle`
- `adresse_ligne_1`
- `adresse_ligne_2`
- `code_postal`
- `ville`
- `pays`
- `latitude`
- `longitude`
- `created_at`
- `updated_at`

Notes :
- `latitude` et `longitude` peuvent etre renseignees apres geocodage ;
- un seul domicile est necessaire dans le MVP.

### 3. SiteTravail
Lieu sur lequel l'utilisateur peut se rendre dans le cadre de son travail.

Champs suggeres :
- `id`
- `simulation_id`
- `nom`
- `adresse_ligne_1`
- `adresse_ligne_2`
- `code_postal`
- `ville`
- `pays`
- `latitude`
- `longitude`
- `actif`
- `created_at`
- `updated_at`

Notes :
- plusieurs sites sont autorises ;
- le champ `nom` permet d'afficher facilement `Siege`, `Site A`, `Entrepot`, etc.

### 4. Vehicule
Vehicule personnel utilise pour les trajets professionnels.

Champs suggeres :
- `id`
- `simulation_id`
- `nom`
- `type_vehicule` : voiture, motocyclette, cyclomoteur, electrique
- `puissance_administrative`
- `energie` : thermique, electrique, inconnu
- `date_achat`
- `date_vente`
- `immatriculation_partielle`
- `actif`
- `created_at`
- `updated_at`

Regles de gestion :
- `puissance_administrative` est obligatoire pour voiture et motocyclette ;
- elle peut etre nulle pour cyclomoteur si la regle ne l'exige pas ;
- `date_vente` est optionnelle ;
- dans le MVP, un seul vehicule peut etre utilise pour toute la simulation, meme si le modele autorise deja plusieurs vehicules.

### 5. JourTravaille
Representation d'un jour declare par l'utilisateur.

Champs suggeres :
- `id`
- `simulation_id`
- `vehicule_id`
- `site_travail_id`
- `date`
- `type_jour` : site, teletravail
- `distance_km`
- `montant_eur`
- `commentaire`
- `created_at`
- `updated_at`

Regles de gestion :
- si `type_jour = teletravail`, alors `site_travail_id` est nul ;
- si `type_jour = teletravail`, alors `distance_km = 0` et `montant_eur = 0` ;
- si `type_jour = site`, alors `site_travail_id` est obligatoire ;
- `vehicule_id` permet d'ouvrir la porte au changement de vehicule en cours d'annee.

### 6. DistanceTrajet
Entite optionnelle de cache ou de reference pour eviter de recalculer plusieurs fois la meme distance.

Champs suggeres :
- `id`
- `simulation_id`
- `adresse_domicile_id`
- `site_travail_id`
- `distance_km`
- `source_calcul`
- `date_calcul`
- `created_at`
- `updated_at`

Utilite :
- memoriser la distance entre un domicile et un site ;
- reutiliser cette distance sur tous les jours concernes ;
- stocker la provenance du calcul si un service externe est utilise.

### 7. ResultatSimulation
Synthese persistable du calcul final.

Champs suggeres :
- `id`
- `simulation_id`
- `total_jours_declares`
- `total_jours_sur_site`
- `total_jours_teletravail`
- `total_km`
- `bareme_type`
- `bareme_puissance`
- `montant_total_eur`
- `details_calcul_json`
- `calculated_at`
- `created_at`
- `updated_at`

Utilite :
- figer un resultat a un instant donne ;
- afficher rapidement une synthese sans recalcul complet ;
- conserver une trace detaillee de la formule appliquee.

### Relations entre entites
Relations principales :
- `SimulationFraisKilometriques` 1 -> 1 `AdresseDomicile`
- `SimulationFraisKilometriques` 1 -> N `SiteTravail`
- `SimulationFraisKilometriques` 1 -> N `Vehicule`
- `SimulationFraisKilometriques` 1 -> N `JourTravaille`
- `SimulationFraisKilometriques` 1 -> N `DistanceTrajet`
- `SimulationFraisKilometriques` 1 -> 0..1 `ResultatSimulation`
- `Vehicule` 1 -> N `JourTravaille`
- `SiteTravail` 1 -> N `JourTravaille`

### Champs a prevoir en enum
Enums suggeres :

`type_vehicule`
- `voiture`
- `motocyclette`
- `cyclomoteur`
- `electrique`

`energie`
- `thermique`
- `electrique`
- `inconnu`

`type_jour`
- `site`
- `teletravail`

`statut`
- `brouillon`
- `completee`
- `calculee`

### Contraintes metier importantes
- une simulation doit avoir un domicile avant calcul ;
- une simulation doit avoir au moins un site de travail si elle contient des jours sur site ;
- une simulation doit avoir au moins un vehicule avant calcul ;
- un jour de teletravail ne genere ni distance ni montant ;
- un jour sur site doit etre rattache a un site ;
- un vehicule ne doit pas etre utilise hors de sa periode de possession ;
- la puissance administrative doit etre compatible avec le type de vehicule choisi.

### Proposition de structure Django
Apps ou modules possibles :
- `bundles.frais_kilometriques.models.simulation`
- `bundles.frais_kilometriques.models.addresses`
- `bundles.frais_kilometriques.models.vehicles`
- `bundles.frais_kilometriques.models.calendar`
- `bundles.frais_kilometriques.models.results`

Modeles Django cibles :
- `SimulationFraisKilometriques`
- `AdresseDomicile`
- `SiteTravail`
- `Vehicule`
- `JourTravaille`
- `DistanceTrajet`
- `ResultatSimulation`

### Proposition de structure API
Ressources API probables :
- `GET/POST /api/bundles/frais-kilometriques/simulations`
- `GET/PATCH /api/bundles/frais-kilometriques/simulations/{id}`
- `POST /api/bundles/frais-kilometriques/simulations/{id}/domicile`
- `POST /api/bundles/frais-kilometriques/simulations/{id}/sites`
- `POST /api/bundles/frais-kilometriques/simulations/{id}/vehicules`
- `POST /api/bundles/frais-kilometriques/simulations/{id}/jours`
- `POST /api/bundles/frais-kilometriques/simulations/{id}/calculer`
- `GET /api/bundles/frais-kilometriques/simulations/{id}/resultat`

### Points a faire evoluer plus tard
- plusieurs domiciles sur une meme annee ;
- plusieurs trajets dans une meme journee ;
- changement de vehicule pleinement gere dans l'interface ;
- gestion plus fine de l'electrique si la regle differe ;
- ajout d'un historique de recalculs ;
- stockage des justificatifs ou pieces explicatives.

### Recommandation pour le MVP
Pour aller vite sans se bloquer :
- garder le modele `Vehicule` deja pret pour plusieurs vehicules ;
- mais limiter l'interface MVP a un seul vehicule principal ;
- stocker `distance_km` et `montant_eur` au niveau de `JourTravaille` pour faciliter les verifications ;
- stocker aussi une synthese dans `ResultatSimulation` pour l'affichage final.
