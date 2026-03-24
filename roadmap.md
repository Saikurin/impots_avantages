## Roadmap - impots_avantages

### Vision
Construire une plateforme SaaS modulaire capable de simuler plusieurs avantages fiscaux pour des particuliers, avec une approche progressive : commencer par un premier bundle utile, fiable et pedagogique, puis etendre le produit avantage par avantage.

---

### Phase 0 - Cadrage produit
Objectif : poser des bases claires avant de demarrer l'implementation.

Livrables :
- vision produit formalisee ;
- contexte projet documente ;
- role de l'agent defini ;
- premiere roadmap ;
- perimetre initial du MVP delimite.

Statut : en cours / amorce

---

### Phase 1 - Definition du MVP
Objectif : definir un premier produit simple, coherent et livrable.

Travaux prevus :
- choisir precisement le perimetre du premier bundle ;
- lister les informations a demander a l'utilisateur ;
- definir la saisie de l'adresse domicile et des differents sites de travail ;
- definir la logique de saisie journaliere et de teletravail ;
- definir les regles de calcul minimales pour les frais kilometriques ;
- clarifier les cas lies aux associations couverts dans le MVP ;
- definir le format des resultats affiches ;
- preciser si le MVP fonctionne sans compte utilisateur.

Livrables :
- specification fonctionnelle du MVP ;
- parcours utilisateur du premier bundle ;
- liste des hypotheses et limites fonctionnelles.

---

### Phase 2 - Conception technique initiale
Objectif : poser une architecture solide et evolutive.

Travaux prevus :
- definir l'architecture globale Django + Angular ;
- definir la logique de separation par bundles ;
- preparer la structure des modules backend ;
- definir l'API entre frontend et backend ;
- prevoir la conteneurisation Docker pour le dev et la production ;
- preparer la strategie de deploiement sur VPS.

Livrables :
- schema d'architecture technique ;
- structure initiale du repository ;
- conventions de nommage et d'organisation ;
- premiere base Docker.

---

### Phase 3 - UX/UI foundation
Objectif : definir une interface rassurante, claire et credible.

Travaux prevus :
- definir les couleurs principales du produit ;
- etablir une charte visuelle sobre adaptee a la fiscalite ;
- concevoir les composants de base : boutons, champs, cartes, alertes, blocs de resultat ;
- definir le ton editorial des messages et explications ;
- dessiner le parcours de saisie et de restitution du bundle initial.

Livrables :
- base de design system ;
- lignes directrices UX/UI ;
- maquettes ou wireframes du MVP.

---

### Phase 4 - Developpement du socle applicatif
Objectif : mettre en place les fondations techniques communes.

Travaux prevus :
- initialiser le backend Django ;
- initialiser le frontend Angular ;
- mettre en place Docker Compose ;
- configurer les environnements locaux ;
- preparer la communication API ;
- mettre en place les bases de configuration et de securisation.

Livrables :
- projet backend operationnel ;
- projet frontend operationnel ;
- stack Docker lancable localement ;
- premiere route ou page de verification.

---

### Phase 5 - Bundle 1 : frais kilometriques
Objectif : livrer le premier simulateur metier utilisable.

Travaux prevus :
- creer le bundle backend pour les frais kilometriques ;
- modeliser les donnees necessaires au calcul ;
- gerer plusieurs sites de travail par utilisateur ;
- permettre la saisie jour par jour du site reellement visite ;
- integrer le cas teletravail avec kilometrage nul ;
- calculer automatiquement les distances associees aux jours renseignes ;
- implementer les regles de calcul des frais reels ;
- creer le formulaire guide cote frontend ;
- afficher un resultat clair avec details et explications ;
- gerer les validations, erreurs et cas incomplets.

Livrables :
- bundle fonctionnel frais kilometriques ;
- calcul automatique exploitable ;
- ecran de resultat pedagogique.

---

### Phase 6 - Extension associations
Objectif : integrer les premiers cas lies aux associations dans le meme cadre produit.

Travaux prevus :
- definir les situations associatives reellement couvertes ;
- clarifier les donnees a collecter ;
- implementer les regles metier correspondantes ;
- relier ces cas au moteur de simulation ;
- enrichir les explications utilisateur.

Livrables :
- premier perimetre association traite ;
- calculs ou eligibilites exposes clairement ;
- integration dans l'experience du produit.

---

### Phase 7 - Qualite et fiabilisation
Objectif : s'assurer que le produit inspire confiance avant mise en ligne.

Travaux prevus :
- ajouter des tests sur les regles de calcul ;
- verifier les cas limites metier ;
- relire les contenus explicatifs ;
- tester les parcours frontend sur mobile et desktop ;
- verifier la coherence des messages d'erreur ;
- preparer les mentions de limites et avertissements utiles.

Livrables :
- base de tests backend ;
- parcours critiques verifies ;
- contenu plus robuste et plus rassurant.

---

### Phase 8 - Deploiement MVP
Objectif : rendre le produit accessible dans un premier environnement heberge.

Travaux prevus :
- finaliser les images Docker ;
- configurer le VPS ;
- deployer backend, frontend et services necessaires ;
- configurer le reseau, les variables d'environnement et le domaine ;
- verifier les logs, la disponibilite et le bon fonctionnement general.

Livrables :
- MVP deploye sur VPS ;
- procedure de deploiement documentee ;
- premiere base d'exploitation.

---

### Phase 9 - Evolution produit
Objectif : etendre progressivement la plateforme avec de nouveaux bundles.

Pistes d'evolution :
- dons ;
- emploi a domicile ;
- frais de garde ;
- investissements eligibles ;
- autres reductions, deductions ou credits d'impot.

Travaux prevus :
- prioriser les prochains avantages fiscaux ;
- industrialiser le modele de bundle ;
- mutualiser les composants et services communs ;
- ajouter, si necessaire, la sauvegarde des simulations et les comptes utilisateurs.

---

### Priorites court terme
1. Clarifier le perimetre exact du bundle frais kilometriques
2. Definir les cas associations vraiment inclus au lancement
3. Concevoir l'architecture modulaire backend/frontend
4. Initialiser la stack Django + Angular + Docker
5. Produire un premier MVP testable

---

### Risques a surveiller
- complexite des regles fiscales reelles ;
- perimetre trop large des le debut ;
- manque de clarte sur les cas associations ;
- confusion utilisateur si les resultats ne sont pas assez expliques ;
- difficulte a maintenir les regles dans le temps sans structure modulaire stricte.

---

### Definition de succes du MVP
Le MVP est considere comme reussi si :
- un particulier peut renseigner sa situation simplement ;
- un particulier peut enregistrer son domicile, plusieurs sites de travail et ses jours de teletravail ;
- le bundle frais kilometriques retourne une estimation claire ;
- les explications sont comprehensibles pour un non expert ;
- l'architecture permet d'ajouter facilement un nouveau bundle ensuite ;
- l'application est deployable proprement via Docker sur un VPS.
