## Contexte projet - impots_avantages

### Nom de travail
`impots_avantages`

### Resume
`impots_avantages` est un projet de simulateur SaaS destine aux particuliers qui paient des impots. Son objectif est d'aider les utilisateurs a identifier et simuler les avantages fiscaux qu'ils peuvent mobiliser lors de leur declaration d'impots.

Le produit est pense comme une plateforme modulaire organisee par bundles. Chaque bundle correspond a un avantage fiscal ou a une famille d'avantages et embarque ses propres regles, ses ecrans, ses calculs et ses explications.

### Objectif produit
Permettre a un particulier de comprendre rapidement quels avantages fiscaux lui sont potentiellement accessibles et d'obtenir une estimation claire, pedagogique et exploitable avant ou pendant sa declaration d'impots.

### Public cible
- Particuliers imposables
- Utilisateurs non experts de la fiscalite
- Personnes cherchant a optimiser legalement leur declaration d'impots

### Positionnement
Le produit doit se situer entre :
- un outil de simulation pratique ;
- un accompagnement pedagogique ;
- une interface rassurante sur des sujets fiscaux parfois complexes.

### Fonctionnement general
Le projet repose sur une logique de bundles :
- un bundle par avantage fiscal ;
- une logique modulaire pour faciliter l'ajout de nouveaux avantages ;
- une separation claire entre collecte des informations, calculs et restitution des resultats.

### Bundle initial envisage
Le premier bundle concerne les frais kilometriques et certains avantages lies aux associations.

#### Cas couverts au depart
- Utilisation du vehicule personnel pour se rendre au travail
- Calcul automatique des frais reels
- Saisie de l'adresse du domicile
- Saisie d'une ou plusieurs adresses de travail dans le cas de plusieurs sites
- Saisie du vehicule utilise avec son type, sa puissance administrative et sa periode d'utilisation
- Saisie de la date d'achat du vehicule et, le cas echeant, de sa date de vente
- Saisie journaliere du lieu de travail reellement rejoint
- Option teletravail pour les jours travailles sans deplacement
- Calcul automatique des kilometres parcourus selon les trajets effectues
- Application d'un bareme kilometrique selon le type de vehicule et les chevaux fiscaux
- Prise en compte de situations liees aux associations

#### Fonctionnement envisage pour le bundle frais kilometriques
Le bundle frais kilometriques doit permettre a l'utilisateur de declarer :
- son adresse de domicile ;
- une ou plusieurs adresses de travail ;
- le vehicule utilise pour ses trajets professionnels ;
- la date d'achat du vehicule ;
- la date de vente du vehicule si le vehicule a ete cede ;
- la puissance administrative du vehicule quand elle est requise ;
- le type de vehicule : voiture, motocyclette, cyclomoteur, vehicule electrique ;
- pour chaque jour travaille, le site sur lequel il s'est rendu ;
- les jours de teletravail.

Le systeme doit ensuite :
- identifier le trajet domicile -> lieu de travail pour chaque jour concerne ;
- calculer automatiquement les kilometres parcourus ;
- compter 0 kilometre et 0 euro de frais kilometrique pour un jour declare en teletravail ;
- cumuler la distance professionnelle sur la periode concernee ;
- appliquer le bareme kilometrique correspondant au type de vehicule et a sa puissance administrative ;
- preparer une base exploitable pour le calcul des frais reels.

### Vision d'evolution
A terme, l'application doit pouvoir accueillir plusieurs bundles, chacun portant sur un avantage fiscal specifique.

Exemples de direction d'evolution :
- dons et reductions fiscales ;
- emploi a domicile ;
- frais de garde ;
- investissements eligibles ;
- autres situations ouvrant droit a deduction, reduction ou credit d'impot.

### Stack technique cible
- Backend : Django
- Frontend : Angular
- Conteneurisation : Docker
- Hebergement : VPS compatible Docker

### Intentions d'architecture
- Backend Django pour exposer les regles metier, les calculs, l'API et la persistance.
- Frontend Angular pour proposer des parcours guides, dynamiques et pedagogiques.
- Docker pour uniformiser le developpement, les environnements et le deploiement.
- VPS pour un hebergement maitrise et simple a operer.

### Exigences produit
- Interface simple pour un public non expert
- Resultats comprehensibles et expliques
- Structure modulaire par bundle
- Possibilite de faire evoluer les regles et les avantages dans le temps
- Presentation serieuse et rassurante

### Direction UX/UI
L'interface doit reprendre les codes visuels d'un SaaS de confiance dans le domaine financier, administratif ou fiscal.

Principes a respecter :
- palette de couleurs sobre et professionnelle ;
- dominance de bleus, verts doux, gris clairs et neutres lisibles ;
- contraste eleve pour la lisibilite ;
- mise en avant de la clarte plutot que de l'effet marketing ;
- composants qui rassurent : cartes nettes, formulaires guides, indicateurs explicites ;
- messages d'alerte reserves aux points bloquants ou aux risques d'erreur.

### Enjeux clefs
- Transformer des regles fiscales en experiences utilisateur simples ;
- Garder une logique metier suffisamment fiable et explicable ;
- Concevoir un socle technique capable d'accueillir de nombreux bundles ;
- Installer une relation de confiance avec des utilisateurs qui manipulent des donnees sensibles.

### Etat actuel
Le projet est au stade de cadrage initial.

Informations connues a ce jour :
- vision produit definie a haut niveau ;
- premier bundle identifie ;
- stack technique cible choisie ;
- hebergement cible defini ;
- direction visuelle generale definie.

### Points a preciser plus tard
- liste exacte des cas fiscaux couverts par le bundle associations ;
- regles de calcul detaillees pour les frais reels ;
- source et methode de calcul des distances entre adresses ;
- regle exacte a appliquer au cas des vehicules electriques ;
- gestion du changement de vehicule en cours d'annee ;
- gestion des trajets aller-retour, exceptions et jours incomplets ;
- besoin ou non de creation de compte utilisateur ;
- stockage des simulations ;
- niveau de personnalisation des resultats ;
- cadre legal, mentions et limites de responsabilite.
