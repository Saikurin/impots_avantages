## Parcours utilisateur - Bundle frais kilometriques

### Objectif
Definir le parcours utilisateur du bundle `frais kilometriques` ecran par ecran afin de preparer le frontend Angular, les validations metier et la logique de progression du MVP.

### Intention UX
Le parcours doit etre :
- simple a comprendre pour un non expert ;
- progressif ;
- rassurant ;
- structure autour d'etapes courtes ;
- centre sur la clarte du resultat final.

### Logique generale du parcours
Le bundle suit une progression en 6 etapes :
- introduction ;
- domicile ;
- lieux de travail ;
- vehicule ;
- calendrier de travail ;
- resultat.

L'utilisateur doit pouvoir avancer pas a pas, revenir en arriere et reprendre une simulation en brouillon.

### Ecran 1 - Introduction du bundle
Role de l'ecran :
- expliquer a quoi sert la simulation ;
- indiquer les informations qui seront demandees ;
- rassurer l'utilisateur sur le caractere guide du parcours.

Contenu attendu :
- titre clair ;
- courte explication pedagogique ;
- liste simple des informations a preparer : domicile, sites de travail, vehicule, jours sur site et jours de teletravail ;
- bouton `Commencer la simulation`.

Message cle :
- l'utilisateur va obtenir une estimation de ses frais kilometriques a partir de sa situation reelle.

### Ecran 2 - Domicile
Role de l'ecran :
- collecter l'adresse de reference du domicile.

Champs :
- adresse ligne 1 ;
- adresse ligne 2 optionnelle ;
- code postal ;
- ville ;
- pays.

Comportement attendu :
- verification du format minimal des champs ;
- geocodage possible en arriere-plan plus tard ;
- sauvegarde en brouillon a la validation.

Validation minimale :
- adresse obligatoire ;
- code postal obligatoire ;
- ville obligatoire.

Action principale :
- bouton `Continuer`.

### Ecran 3 - Lieux de travail
Role de l'ecran :
- permettre a l'utilisateur d'ajouter un ou plusieurs sites de travail.

Champs pour chaque site :
- nom du site ;
- adresse ligne 1 ;
- adresse ligne 2 optionnelle ;
- code postal ;
- ville ;
- pays.

Comportement attendu :
- l'utilisateur peut ajouter plusieurs sites ;
- l'utilisateur peut modifier ou supprimer un site avant de continuer ;
- au moins un site doit etre cree pour avancer.

Validation minimale :
- un site minimum ;
- adresse complete par site.

Action principale :
- bouton `Ajouter un site` ;
- bouton `Continuer`.

### Ecran 4 - Vehicule
Role de l'ecran :
- collecter les informations necessaires au bareme kilometrique.

Champs :
- nom du vehicule optionnel ;
- type de vehicule ;
- puissance administrative si necessaire ;
- date d'achat ;
- date de vente optionnelle ;
- indicateur ou type permettant d'identifier un vehicule electrique.

Comportement attendu :
- les champs s'adaptent au type de vehicule ;
- la puissance administrative est demandee seulement si utile ;
- la date de vente reste optionnelle ;
- l'utilisateur comprend pourquoi ces informations sont demandees.

Validation minimale :
- type de vehicule obligatoire ;
- date d'achat obligatoire ;
- puissance administrative obligatoire pour voiture et motocyclette ;
- date de vente posterieure a la date d'achat si renseignee.

Messages pedagogiques utiles :
- la puissance administrative sert a appliquer le bon bareme ;
- les jours de teletravail ne generent aucun frais kilometrique.

Action principale :
- bouton `Continuer`.

### Ecran 5 - Calendrier de travail
Role de l'ecran :
- permettre a l'utilisateur de declarer, jour par jour, le site reellement rejoint ou le teletravail.

Structure recommandee :
- choix d'une periode ;
- vue calendrier ou liste journaliere ;
- selection rapide par jour.

Choix possibles pour chaque jour :
- site 1 ;
- site 2 ;
- site N ;
- teletravail ;
- non renseigne.

Comportement attendu :
- l'utilisateur peut renseigner les jours un par un ;
- l'utilisateur peut changer facilement un statut ;
- un jour en teletravail force `0 km` et `0 EUR` ;
- un jour sur site selectionne automatiquement le trajet domicile <-> site ;
- la simulation peut afficher un recapitulatif en temps reel.

Validation minimale :
- au moins un jour renseigne avant calcul final ;
- impossible d'avoir a la fois un site et teletravail sur un meme jour dans le MVP.

Elements d'aide UX :
- compteur de jours renseignes ;
- compteur de jours teletravail ;
- compteur de jours par site ;
- estimation provisoire des kilometres.

Action principale :
- bouton `Voir mon resultat`.

### Ecran 6 - Resultat de simulation
Role de l'ecran :
- restituer le resultat de maniere lisible, pedagogique et rassurante.

Informations a afficher :
- annee ou periode simulee ;
- domicile et sites utilises ;
- vehicule retenu ;
- type de bareme applique ;
- nombre total de jours declares ;
- nombre de jours sur site ;
- nombre de jours en teletravail ;
- total kilometrique ;
- estimation des frais reels ;
- detail du calcul par grandes categories.

Explications a afficher :
- rappel qu'un jour de teletravail vaut `0 km` ;
- rappel du vehicule et de la puissance administrative utilises ;
- rappel que l'estimation depend des informations renseignees ;
- mention des limites ou hypotheses de calcul si necessaire.

Actions possibles :
- bouton `Modifier mes informations` ;
- bouton `Recalculer` ;
- bouton `Commencer un autre bundle` plus tard.

### Ecran 7 - Recapitulatif editable
Ce n'est pas forcement un ecran separe dans le MVP, mais il est utile de prevoir un recapitulatif global editable.

Il doit permettre a l'utilisateur de revoir rapidement :
- son domicile ;
- ses sites de travail ;
- son vehicule ;
- son calendrier ;
- son resultat actuel.

### Etats systeme a prevoir dans le frontend
- brouillon vide ;
- brouillon en cours ;
- simulation complete mais non calculee ;
- calcul en cours ;
- resultat disponible ;
- erreur de calcul ou donnees incoherentes.

### Validations transverses
- impossible de calculer sans domicile ;
- impossible de calculer sans vehicule ;
- impossible de calculer sans au moins un site si des jours sur site existent ;
- impossible d'utiliser un vehicule en dehors de sa periode de possession ;
- impossible d'avoir une date de vente anterieure a la date d'achat ;
- impossible de laisser un jour dans un etat ambigu entre site et teletravail.

### Messages d'erreur a prevoir
- `Veuillez renseigner votre domicile.`
- `Ajoutez au moins un lieu de travail.`
- `Veuillez renseigner un vehicule pour appliquer le bareme kilometrique.`
- `La date de vente doit etre posterieure a la date d'achat.`
- `Chaque jour doit etre associe soit a un site, soit au teletravail.`
- `Le vehicule selectionne n'est pas coherent avec la date du trajet.`

### Opportunites d'amelioration UX plus tard
- saisie par semaine ou par mois ;
- duplication de planning ;
- pre-remplissage des jours recurrents ;
- import de calendrier ;
- visualisation detaillee par site ;
- gestion du changement de vehicule sur l'annee.

### Recommandation MVP
Pour un premier jet simple et robuste :
- faire un wizard en etapes ;
- sauvegarder automatiquement a chaque etape ;
- limiter l'interface a un vehicule principal ;
- proposer une saisie jour par jour explicite avant d'ajouter des automatisations ;
- mettre l'accent sur la clarte du resultat final plutot que sur des optimisations d'usage trop precoces.
