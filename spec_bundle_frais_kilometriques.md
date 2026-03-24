## Specification - Bundle frais kilometriques

### Objectif
Permettre a un utilisateur de simuler ses frais kilometriques lies a ses trajets professionnels domicile-travail, y compris lorsqu'il travaille sur plusieurs sites, et de preparer une estimation exploitable pour les frais reels.

### Public vise
- particuliers imposables ;
- utilisateurs se deplacant avec leur vehicule personnel pour aller travailler ;
- utilisateurs pouvant alterner entre plusieurs sites de travail et des jours de teletravail.

### Perimetre MVP
Le MVP couvre :
- la saisie d'une adresse de domicile ;
- la saisie d'une ou plusieurs adresses de travail ;
- la saisie d'un vehicule avec ses caracteristiques fiscales ;
- la saisie d'une date d'achat et d'une date de vente si applicable ;
- la declaration journaliere du site de travail effectivement rejoint ;
- la declaration de jours de teletravail ;
- le calcul automatique des kilometres parcourus ;
- l'application d'un bareme kilometrique selon le type de vehicule ;
- la production d'un resultat lisible servant de base au calcul des frais reels.

Le MVP ne couvre pas encore explicitement :
- les trajets multi-etapes dans une meme journee ;
- les deplacements exceptionnels hors domicile-travail standard ;
- les cas avances de remboursement employeur ;
- l'integration complete des regles associations dans ce document.

### Donnees a collecter

#### 1. Domicile
- adresse complete du domicile.

#### 2. Lieux de travail
- un ou plusieurs sites de travail ;
- un libelle pour chaque site si necessaire ;
- l'adresse complete de chaque site.

#### 3. Calendrier de travail
Pour chaque jour renseigne, l'utilisateur doit pouvoir indiquer :
- site A ;
- site B ;
- site C ;
- teletravail.

Chaque jour doit correspondre a un seul statut principal dans le MVP.

#### 4. Vehicule
Pour chaque vehicule utilise dans la simulation, il faut pouvoir renseigner :
- type de vehicule ;
- puissance administrative quand elle existe ;
- date d'achat ;
- date de vente si le vehicule n'est plus detenu ;
- indicateur permettant d'identifier un vehicule electrique si une regle specifique s'applique.

Types de vehicules cibles dans le bundle :
- voiture ;
- motocyclette ;
- cyclomoteur ;
- vehicule electrique.

### Logique fonctionnelle

#### Cas 1 - Jour sur site
Si l'utilisateur indique qu'il a travaille sur un site donne :
- l'application identifie le domicile ;
- l'application identifie le site selectionne ;
- l'application calcule la distance associee a ce trajet ;
- cette distance alimente le total kilometrique.

#### Cas 1 bis - Periode de possession du vehicule
Le moteur de calcul doit verifier que le vehicule est coherent avec la periode simulee :
- un vehicule achete en cours d'annee ne doit pas etre applique avant sa date d'achat ;
- un vehicule vendu en cours d'annee ne doit plus etre applique apres sa date de vente ;
- si plusieurs vehicules existent sur une meme annee, les jours doivent pouvoir etre rattaches au bon vehicule dans une version evoluee du bundle.

#### Cas 2 - Jour en teletravail
Si l'utilisateur indique teletravail :
- aucun trajet n'est compte ;
- le kilometrage du jour est de 0 ;
- le montant kilometrique du jour est de 0 euro.

### Hypothese MVP de calcul
Dans le MVP, le moteur doit pouvoir s'appuyer sur une logique simple :
- un jour travaille sur site genere un trajet domicile <-> site ;
- un jour en teletravail ne genere aucun trajet ;
- le total des kilometres est calcule a partir de l'ensemble des jours saisis ;
- le montant est calcule a partir du bareme correspondant au vehicule declare.

La methode exacte de calcul de distance et la gestion fine de l'aller-retour devront etre confirmees dans les regles metier detaillees.

### Baremes kilometriques a integrer

#### Voitures
| Puissance administrative | Jusqu'a 5 000 km | De 5 001 a 20 000 km | Au-dela de 20 000 km |
| --- | --- | --- | --- |
| 3 CV et moins | d x 0,529 | (d x 0,316) + 1 065 | d x 0,370 |
| 4 CV | d x 0,606 | (d x 0,340) + 1 330 | d x 0,407 |
| 5 CV | d x 0,636 | (d x 0,357) + 1 395 | d x 0,427 |
| 6 CV | d x 0,665 | (d x 0,374) + 1 457 | d x 0,447 |
| 7 CV et plus | d x 0,697 | (d x 0,394) + 1 515 | d x 0,470 |

Exemple de reference :
- pour 4 000 km parcourus avec un vehicule de 5 CV, le montant estime est de 2 544 EUR selon la formule `4 000 x 0,636`.

#### Motocyclettes
| Puissance administrative | Jusqu'a 3 000 km | De 3 001 a 6 000 km | Au-dela de 6 000 km |
| --- | --- | --- | --- |
| 1 ou 2 CV | d x 0,395 | (d x 0,099) + 891 | d x 0,248 |
| 3, 4 ou 5 CV | d x 0,468 | (d x 0,082) + 1 158 | d x 0,275 |
| Plus de 5 CV | d x 0,606 | (d x 0,079) + 1 583 | d x 0,343 |

#### Cyclomoteurs
| Distance | Formule |
| --- | --- |
| Jusqu'a 3 000 km | d x 0,315 |
| De 3 001 a 6 000 km | (d x 0,079) + 711 |
| Au-dela de 6 000 km | d x 0,198 |

#### Vehicules electriques
La regle electrique doit etre documentee explicitement dans le produit. A ce stade, les valeurs fournies correspondent au tableau ci-dessous, mais la regle differenciante exacte reste a confirmer avant implementation definitive.

| Puissance administrative | De 0 a 5 000 km | De 5 001 a 20 000 km | Plus de 20 000 km |
| --- | --- | --- | --- |
| 3 CV et moins | d x 0,529 | (d x 0,316) + 1 065 | d x 0,370 |
| 4 CV | d x 0,606 | (d x 0,340) + 1 330 | d x 0,407 |
| 5 CV | d x 0,636 | (d x 0,357) + 1 395 | d x 0,427 |
| 6 CV | d x 0,665 | (d x 0,374) + 1 457 | d x 0,447 |
| 7 CV et plus | d x 0,697 | (d x 0,394) + 1 515 | d x 0,470 |

### Resultats attendus
Le bundle doit afficher au minimum :
- le nombre de jours saisis ;
- le nombre de jours en teletravail ;
- le nombre de jours par site ;
- le vehicule retenu pour le calcul ;
- le type de bareme applique ;
- le total kilometrique estime ;
- une estimation des frais reels associes ;
- un detail explicatif du calcul.

### Attentes UX
- formulaire simple et guide ;
- possibilite d'ajouter plusieurs sites sans friction ;
- saisie journaliere lisible ;
- distinction visuelle nette entre jours sur site et teletravail ;
- resultats pedagogiques et rassurants.

### Regles de gestion a confirmer
- source de calcul des distances entre adresses ;
- prise en compte exacte de l'aller seul ou de l'aller-retour ;
- rattachement des jours au bon vehicule en cas de changement en cours d'annee ;
- regle exacte applicable aux vehicules electriques ;
- gestion des jours non travailles ;
- gestion des conges, absences et jours partiels ;
- gestion de cas ou plusieurs sites sont visites dans une meme journee.

### Structure metier suggeree
Le bundle peut etre structure autour des objets suivants :
- domicile utilisateur ;
- site de travail ;
- vehicule ;
- jour de declaration ;
- calcul kilometrique ;
- restitution de simulation.

### Critere de succes
Le bundle est reussi si un utilisateur peut :
- enregistrer facilement son domicile ;
- enregistrer plusieurs lieux de travail ;
- renseigner les caracteristiques fiscales de son vehicule ;
- indiquer jour par jour ou il a travaille ;
- signaler ses jours de teletravail ;
- obtenir automatiquement un total kilometrique et un montant clair et comprehensible.
