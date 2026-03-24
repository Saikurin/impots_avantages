## Regles metier - Bundle frais kilometriques

### Objectif
Formaliser les regles metier du bundle `frais kilometriques` afin de preparer l'implementation backend Django, les validations fonctionnelles et le moteur de calcul du MVP.

### Portee du document
Ce document couvre :
- les regles de saisie ;
- les regles de validation ;
- les regles de calcul kilometrique ;
- les regles d'application des baremes ;
- les cas limites connus dans le MVP.

### Principes generaux
- une simulation repose sur les informations declarees par l'utilisateur ;
- un jour declare ne peut avoir qu'un seul statut principal dans le MVP ;
- le calcul final depend du vehicule, des jours renseignes et des distances associees ;
- les jours de teletravail ne generent jamais de frais kilometriques ;
- le resultat est une estimation exploitable, pedagogique et verifiable.

### Regles de saisie

#### Regle 1 - Domicile obligatoire
Une simulation ne peut pas etre calculee sans adresse de domicile.

#### Regle 2 - Au moins un site de travail
Une simulation doit contenir au moins un site de travail si elle contient au moins un jour sur site.

#### Regle 3 - Vehicule obligatoire
Une simulation ne peut pas etre calculee sans vehicule.

#### Regle 4 - Calendrier journalier
Chaque jour declare doit etre associe a l'un des statuts suivants :
- `site`
- `teletravail`

Le statut `site` doit pointer vers un site de travail existant.

#### Regle 5 - Donnees vehicule minimales
Le vehicule doit inclure :
- un type de vehicule ;
- une date d'achat ;
- une puissance administrative si le type l'exige.

#### Regle 6 - Cohabitation des dates vehicule
Si une date de vente est renseignee :
- elle doit etre posterieure ou egale a la date d'achat ;
- le vehicule ne doit pas etre utilise en dehors de cette periode.

### Regles de validation metier

#### Regle 7 - Un seul statut par jour
Un jour ne peut pas etre a la fois :
- sur site ;
- en teletravail.

#### Regle 8 - Site obligatoire pour un jour sur site
Si `type_jour = site`, alors `site_travail_id` est obligatoire.

#### Regle 9 - Site interdit pour un jour en teletravail
Si `type_jour = teletravail`, alors `site_travail_id` doit etre nul.

#### Regle 10 - Distance nulle en teletravail
Si `type_jour = teletravail`, alors :
- `distance_km = 0`
- `montant_eur = 0`

#### Regle 11 - Compatibilite vehicule / type de bareme
Le bareme applique depend du type de vehicule declare :
- `voiture` -> bareme voiture ;
- `motocyclette` -> bareme motocyclette ;
- `cyclomoteur` -> bareme cyclomoteur ;
- `electrique` -> bareme electrique ou regle electrique a confirmer.

#### Regle 12 - Puissance administrative requise selon le type
- obligatoire pour `voiture` ;
- obligatoire pour `motocyclette` ;
- non obligatoire pour `cyclomoteur` dans le MVP ;
- a confirmer pour `electrique` selon la classification retenue.

### Regles de calcul kilometrique

#### Regle 13 - Distance d'un jour sur site
Pour un jour sur site, le systeme doit :
- identifier le domicile ;
- identifier le site selectionne ;
- recuperer ou calculer la distance entre ces deux points ;
- affecter cette distance au jour concerne.

#### Regle 14 - Hypothese de trajet du MVP
Dans le MVP, un jour sur site correspond a un trajet domicile <-> site.

Point d'attention :
- la regle exacte aller seul ou aller-retour reste a confirmer ;
- tant qu'elle n'est pas tranchee, l'implementation doit isoler cette logique dans une fonction dediee.

#### Regle 15 - Total kilometrique
Le total kilometrique de la simulation est egal a la somme des distances de tous les jours declares.

Formule conceptuelle :
```text
total_km = somme(distance_km de chaque jour)
```

#### Regle 16 - Total par site
Le systeme doit pouvoir calculer le nombre de jours et les kilometres cumules par site.

#### Regle 17 - Total teletravail
Le systeme doit pouvoir calculer le nombre total de jours de teletravail.

### Regles d'application des baremes

#### Regle 18 - Le bareme s'applique au total de distance
Le montant des frais kilometriques est calcule a partir de la distance totale `d` retenue pour la simulation et du bareme correspondant au vehicule.

#### Regle 19 - Bareme voiture
Pour `type_vehicule = voiture`, appliquer :

- `3 CV et moins`
  - si `d <= 5000` -> `d x 0.529`
  - si `5001 <= d <= 20000` -> `(d x 0.316) + 1065`
  - si `d > 20000` -> `d x 0.370`

- `4 CV`
  - si `d <= 5000` -> `d x 0.606`
  - si `5001 <= d <= 20000` -> `(d x 0.340) + 1330`
  - si `d > 20000` -> `d x 0.407`

- `5 CV`
  - si `d <= 5000` -> `d x 0.636`
  - si `5001 <= d <= 20000` -> `(d x 0.357) + 1395`
  - si `d > 20000` -> `d x 0.427`

- `6 CV`
  - si `d <= 5000` -> `d x 0.665`
  - si `5001 <= d <= 20000` -> `(d x 0.374) + 1457`
  - si `d > 20000` -> `d x 0.447`

- `7 CV et plus`
  - si `d <= 5000` -> `d x 0.697`
  - si `5001 <= d <= 20000` -> `(d x 0.394) + 1515`
  - si `d > 20000` -> `d x 0.470`

#### Regle 20 - Bareme motocyclette
Pour `type_vehicule = motocyclette`, appliquer :

- `1 ou 2 CV`
  - si `d <= 3000` -> `d x 0.395`
  - si `3001 <= d <= 6000` -> `(d x 0.099) + 891`
  - si `d > 6000` -> `d x 0.248`

- `3, 4 ou 5 CV`
  - si `d <= 3000` -> `d x 0.468`
  - si `3001 <= d <= 6000` -> `(d x 0.082) + 1158`
  - si `d > 6000` -> `d x 0.275`

- `plus de 5 CV`
  - si `d <= 3000` -> `d x 0.606`
  - si `3001 <= d <= 6000` -> `(d x 0.079) + 1583`
  - si `d > 6000` -> `d x 0.343`

#### Regle 21 - Bareme cyclomoteur
Pour `type_vehicule = cyclomoteur`, appliquer :
- si `d <= 3000` -> `d x 0.315`
- si `3001 <= d <= 6000` -> `(d x 0.079) + 711`
- si `d > 6000` -> `d x 0.198`

#### Regle 22 - Cas electrique
Le cas `electrique` doit etre implemente de maniere configurable.

Position MVP :
- les valeurs actuellement fournies sont identiques au tableau voiture ;
- la regle differenciante exacte doit etre confirmee avant verrouillage final ;
- l'implementation doit isoler cette logique pour pouvoir la modifier facilement.

### Regles de calcul du montant final

#### Regle 23 - Distance de reference `d`
`d` represente la distance totale professionnelle retenue pour la simulation sur la periode consideree.

#### Regle 24 - Arrondi
La politique d'arrondi doit etre centralisee dans une fonction unique.

Recommandation MVP :
- conserver les calculs internes avec precision ;
- arrondir seulement au moment de l'affichage final ou du stockage final decide par le produit.

#### Regle 25 - Resultat de sortie minimal
Le moteur doit produire au minimum :
- `total_jours_declares`
- `total_jours_sur_site`
- `total_jours_teletravail`
- `total_km`
- `bareme_type`
- `bareme_puissance`
- `montant_total_eur`
- `details_calcul`

### Pseudo-code metier de reference

```text
verifier_presence_domicile()
verifier_presence_vehicule()
verifier_coherence_dates_vehicule()
verifier_jours_declares()

pour chaque jour declare:
  si jour.type == teletravail:
    jour.distance_km = 0
    jour.montant_eur = 0
  sinon si jour.type == site:
    verifier_presence_site(jour.site)
    verifier_compatibilite_vehicule(jour.date, vehicule)
    jour.distance_km = calculer_distance(domicile, site)

total_km = somme(jour.distance_km)
montant_total = appliquer_bareme(vehicule, total_km)

retourner resultat(total_km, montant_total, details)
```

### Validations bloquantes
- domicile absent ;
- vehicule absent ;
- type de vehicule absent ;
- puissance administrative absente alors qu'elle est obligatoire ;
- date de vente anterieure a la date d'achat ;
- jour sur site sans site ;
- jour incoherent avec la periode du vehicule.

### Cas limites a gerer proprement
- simulation sans aucun jour declare ;
- tous les jours en teletravail ;
- un seul site de travail ;
- plusieurs sites avec distances differentes ;
- vehicule achete en cours d'annee ;
- vehicule vendu en cours d'annee ;
- distance introuvable entre deux adresses.

### Regles de restitution au frontend
- toujours exposer la formule ou le bareme applique sous une forme lisible ;
- expliquer pourquoi certains jours valent `0 km` ;
- afficher le vehicule et la puissance retenus ;
- signaler toute hypothese de calcul non completement confirmee.

### Decisions techniques recommandees pour Django
- isoler les baremes dans des services ou fichiers de regles ;
- ne pas disperser les formules dans plusieurs endroits du code ;
- centraliser les validations metier importantes dans un service de domaine ;
- separer clairement : validation, calcul de distance, application du bareme, restitution.

### Points a confirmer plus tard
- regle exacte pour l'aller simple ou l'aller-retour ;
- source de calcul des distances ;
- regle exacte applicable aux vehicules electriques ;
- gestion d'un changement de vehicule dans la meme simulation ;
- politique exacte d'arrondi fiscal ;
- gestion des jours partiels et cas particuliers.
