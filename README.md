# Gestion de stocks — Back office

Back office de gestion de stocks réalisé dans le cadre du test technique **Billet Réduc (France Billet)**.

Application full-stack permettant de gérer un catalogue d'articles (alimentaires et non alimentaires), leurs approvisionnements, leurs sorties de stock et leurs inventaires, avec suivi de l'historique des mouvements et calcul du stock vendable.

---

## Sommaire

- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Choix techniques et justifications](#choix-techniques-et-justifications)
- [Règles métier implémentées](#règles-métier-implémentées)
- [Hypothèses retenues](#hypothèses-retenues)
- [Fonctionnalités](#fonctionnalités)
- [Tests](#tests)
- [Comment lancer le projet](#comment-lancer-le-projet)
- [Utilisation de l'IA](#utilisation-de-lia)
- [Temps passé](#temps-passé)
- [Pistes d'évolution](#pistes-dévolution)

---

## Stack technique

**Backend**
- C# / .NET 9
- Entity Framework Core 9 (ORM)
- SQLite (base de données fichier locale)
- Architecture hexagonale / Domain-Driven Design

**Frontend**
- React 18 + TypeScript
- Vite (build)
- Tailwind CSS (styles)
- React Router (navigation)

---

## Architecture

Le projet suit une **architecture hexagonale** structurée en quatre couches, avec les dépendances orientées vers le domaine métier.

```
StockManagement.Domain          → cœur métier (aucune dépendance externe)
StockManagement.Application     → orchestration (Use Cases, DTOs, Mappers)
StockManagement.Infrastructure  → détails techniques (EF Core, SQLite, Repositories)
StockManagement.API             → point d'entrée HTTP (Controllers, Middleware)
frontend/                       → interface React / TypeScript
```

**L'idée centrale : le domaine métier ne dépend de rien.** Ni de la base de données, ni du framework web, ni du frontend. C'est le reste qui dépend du domaine.

### StockManagement.Domain — le cœur

Toute la logique métier pure : règles de gestion des stocks, entités, validations. Ce projet ne référence aucun autre projet et n'importe aucun package externe. Changer SQLite pour PostgreSQL ou ASP.NET pour une autre techno ne modifie pas ce projet d'une ligne.

### StockManagement.Application — l'orchestration

La couche qui coordonne. Les Use Cases décrivent ce que le système peut faire : ajouter un article, approvisionner un stock, faire l'inventaire. Cette couche parle au domaine via les interfaces de Repository — elle ne sait pas comment les données sont stockées.

### StockManagement.Infrastructure — les détails techniques

L'implémentation concrète des interfaces définies dans le domaine : connexion SQLite, Entity Framework Core, requêtes. Changer de base de données ne touche que cette couche.

### StockManagement.API — le point d'entrée

Les Controllers reçoivent les requêtes HTTP et appellent les Use Cases. Une fine couche de traduction entre le monde HTTP et le monde applicatif, sans logique métier.

---

## Choix techniques et justifications

### Architecture hexagonale / DDD

C'est ce que l'énoncé mentionne comme apprécié. Elle isole la logique métier de l'infrastructure et rend le code testable, maintenable et indépendant des choix techniques.

### Building blocks DDD utilisés

**Value Objects** — `EAN13` et `Price`.
`EAN13` est un Value Object car il n'a pas d'identité propre : deux EAN-13 de même valeur sont identiques. Il encapsule la règle de validation (13 chiffres + clé de contrôle) au lieu de la disperser dans le code. `Price` encapsule le prix HT, le taux de TVA et le calcul du TTC (propriété calculée, jamais stockée).

**Entities** — `Article` (abstraite), `FoodArticle`, `NonFoodArticle`, `StockMovement`.
`Article` est abstraite car l'énoncé distingue deux types d'articles avec des règles propres (DLC et TVA variable pour l'alimentaire, packaging et TVA fixe pour le non-alimentaire).

**Factory Methods** — méthodes `Create()` centralisant la validation et le calcul de la TVA selon le type.

**Repository Pattern** — interfaces définies dans le domaine, implémentations dans l'infrastructure (inversion de dépendance).

### Double constructeur pour EF Core

Chaque entité possède deux constructeurs : un constructeur métier avec validation (utilisé par le code applicatif) et un constructeur sans paramètre requis par EF Core pour la réhydratation depuis la base. Ce dernier ne valide rien, car les données lues ont déjà été validées à l'écriture. C'est le pattern standard DDD + ORM.

### Persistance : SQLite + EF Core

SQLite est une base relationnelle en fichier local, sans configuration serveur, qui modélise clairement les relations (un article, ses mouvements). Points techniques notables du `DbContext` :

- `HasConversion` sur `EAN13` — stocke la valeur string du Value Object et le reconstruit à la lecture.
- `OwnsOne` sur `Price` — stocke les propriétés du Value Object directement dans la table Article.
- `HasDiscriminator` (Table-Per-Hierarchy) — stocke `FoodArticle` et `NonFoodArticle` dans une seule table avec une colonne discriminante. Pattern simple et performant pour cet héritage.
- Index unique sur `Reference` — garantit l'unicité de l'EAN-13 au niveau base de données.

### Migrations EF Core

Le projet utilise les migrations EF Core plutôt que `EnsureCreated()`. Cela permet de faire évoluer le schéma de la base sans perte de données — standard en production. La base est créée et migrée automatiquement au démarrage de l'API.

### Sérialisation JSON

- `JsonStringEnumConverter` — les enums transitent en texte lisible (`"OnSite"`) plutôt qu'en indices numériques, en entrée comme en sortie.
- Sérialisation polymorphe (`JsonPolymorphic`) — pour que les propriétés spécifiques aux sous-types (DLC, type de vente, packaging) apparaissent bien dans le JSON.

### Gestion d'erreurs

Des **exceptions métier typées** (`NotFoundException`, `DuplicateReferenceException`) sont levées dans le domaine et mappées vers les codes HTTP appropriés par un **middleware global** : 404 pour une ressource introuvable, 409 pour un conflit d'unicité, 400 pour une donnée invalide, 500 sinon. Les controllers restent ainsi légers et la sémantique métier est séparée de la traduction HTTP.

### Sécurité

- **Injection SQL** : impossible par design. EF Core paramètre automatiquement toutes les requêtes (LINQ, aucun SQL brut).
- **XSS** : React échappe automatiquement tout contenu affiché.
- **Authentification** : volontairement non implémentée, car hors du périmètre de l'énoncé.

### Structure monorepo

Le backend et le frontend cohabitent dans un même dépôt, dans des dossiers séparés. Cette séparation claire back/front respecte le Separation of Concerns au niveau projet et prépare une éventuelle intégration CI/CD séparée (via GitHub Actions, par exemple).

### Frontend : architecture en couches

Le front applique la même logique de séparation des responsabilités que le back :

```
types/       → interfaces TypeScript (miroir des DTOs back)
api/         → services d'appel réseau (isolent le fetch)
hooks/       → logique d'état et de filtrage (isolent la logique)
components/  → composants d'affichage (ne font que présenter)
pages/       → orchestration (assemblent le tout)
```

Points notables : typage strict (aucun `any`), Type Guards pour gérer l'héritage des articles, composants « présentationnels » recevant des callbacks (la logique reste dans les parents), Discriminated Union pour gérer l'état des modales de façon typée.

---

## Règles métier implémentées

| Règle | Implémentation |
|-------|----------------|
| Référence EAN-13 unique | Value Object `EAN13` (validation + checksum) + index unique |
| Prix HT / TTC | Value Object `Price`, TTC calculé selon la TVA |
| Deux types d'articles | Héritage `FoodArticle` / `NonFoodArticle` |
| DLC alimentaire | Propriété `ExpiryDate` |
| Type de vente (sur place / à emporter / les deux) | Enum `SaleType` |
| TVA 5,5 % / 10 % / 20 % | Encapsulée dans les entités selon le type |
| Packaging non-alimentaire (neuf / reconditionné / invendable) | Enum `PackagingLevel` |
| Stock = approvisionnements depuis le dernier inventaire − sorties | Méthode `GetCurrentStock()` |
| Approvisionnement (entrée) | Use Case `SupplyAsync` |
| Inventaire (redéfinition du stock réel) | Use Case `InventoryAsync` |
| Sortie de stock (vente, perte, péremption) | Use Case `ReleaseAsync` |
| Historique des mouvements | Use Case `GetStockHistory` |
| Stock vendable | Exposé dans les DTOs, plafonné à 0 |

### Distinction approvisionnement / inventaire / sortie

- **Approvisionnement** : ajoute au stock (entrée de marchandise).
- **Sortie** : retire du stock, avec un motif (vente, perte/casse, péremption).
- **Inventaire** : redéfinit le stock réel après comptage physique, pour corriger les écarts (pertes, vols, erreurs de saisie).

Le calcul repart du dernier inventaire comme base, puis ajoute les approvisionnements et retire les sorties survenus **depuis** cet inventaire. Le stock vendable est plafonné à 0 (un stock physique ne peut être négatif).

---

## Hypothèses retenues

- **Type de vente « les deux »** : la TVA appliquée est de 10 % (l'énoncé ne tranchant pas ce cas précis, on retient le taux « pour les autres »).
- **Unité de mesure** : chaque article possède une unité (pièce, kilogramme, litre) définie à la création et figée ensuite, car elle caractérise la façon de compter le stock. La contenance par unité (par exemple 400 g par pot) n'est pas modélisée : elle relèverait d'une fiche produit, non de la gestion de stock.
- **Suppression d'article** : supprime l'article et ses mouvements associés.
- **Référence EAN-13** : validée structurellement (13 chiffres + clé de contrôle). L'association à un produit réel via une base externe (type Open Food Facts) n'est pas réalisée, car elle sort du périmètre de la gestion de stock.

---

## Fonctionnalités

- CRUD complet des articles (création, modification, suppression)
- Recherche multi-critères (texte sur nom/référence + filtres par type et par statut de stock)
- Approvisionnement d'un article
- Sortie de stock avec motif (vente, perte, péremption)
- Inventaire d'un article
- Affichage de la liste des articles en tableau triable
- Alertes visuelles (rupture de stock, produit périmé, DLC proche)
- Historique des mouvements par article (page dédiée)
- Affichage du stock vendable avec son unité de mesure

---

## Tests

Le domaine métier fait l'objet de tests unitaires (xUnit), ciblant les règles de gestion critiques. Le domaine étant pur (sans dépendance externe), il se teste sans mock ni infrastructure.

**Couverture :**
- **Calcul du stock** (`GetCurrentStock`) : stock initial, approvisionnement, sorties, inventaire comme nouvelle base, plafonnement à zéro.
- **Validation EAN-13** : codes valides, checksum invalide, format invalide, égalité de Value Objects.
- **Calcul de TVA** : 5,5 % (à emporter), 10 % (sur place et « les deux »), 20 % (non-alimentaire), avec vérification du prix TTC.

Les tests suivent le pattern **Arrange-Act-Assert** et utilisent les tests paramétrés (`Theory`/`InlineData`) pour couvrir plusieurs cas sans duplication.

**Lancer les tests :**

```bash
dotnet test
```

---

## Comment lancer le projet

### Prérequis

- .NET 9 SDK
- Node.js (v20 ou supérieur recommandé)

### Lancement rapide (backend + frontend en une commande)

Un script à la racine permet de lancer les deux serveurs simultanément :

```bash
# Première fois : installer les dépendances (racine + frontend)
npm run install:all

# Lancer le backend et le frontend ensemble
npm run dev
```

> Ce script utilise `concurrently`. Le backend et le frontend peuvent aussi être lancés séparément (voir ci-dessous).

### Backend

Depuis la racine du projet :

```bash
# Restaurer les dépendances et lancer l'API (profil HTTPS)
dotnet run --project StockManagement.API --launch-profile https
```

L'API démarre sur `https://localhost:7042`.
La documentation Swagger est disponible sur `https://localhost:7042/swagger`.
La base de données SQLite est créée et migrée automatiquement au premier lancement.

> Alternativement, le projet peut être lancé depuis Visual Studio en ouvrant `StockManagement.sln` et en démarrant le projet `StockManagement.API`.

### Frontend

Depuis le dossier `frontend/` :

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le front est accessible sur `http://localhost:5173`.

> L'URL de l'API est configurable via la variable d'environnement `VITE_API_BASE_URL` (valeur par défaut : `https://localhost:7042/api`).

---

## Utilisation de l'IA

**IA utilisée :** Claude (Anthropic), via l'interface de chat et Claude Code.

**Usages :**

- **Réflexion d'architecture** — échanges sur les choix structurants (architecture hexagonale, découpage des couches, patterns DDD, pertinence des migrations, gestion d'erreurs typée).
- **Génération de code** — production des classes, composants et configurations, systématiquement relus et compris avant intégration.
- **Débogage** — résolution d'erreurs (sérialisation polymorphe, réhydratation EF Core, configuration CORS, compatibilité des outils de build).
- **Réflexion métier** — discussions sur les règles de gestion de stock (distinction approvisionnement/inventaire/sortie, unité de mesure, stock vendable), pour cadrer un énoncé volontairement ouvert.
- **Veille** — recherches sur les bonnes pratiques d'interfaces de back office de gestion de stock.

L'objectif a été d'utiliser l'IA comme un outil d'accélération et de vérification, en gardant la compréhension et la justification de chaque choix.

---

## Temps passé

Environ **1 à 2 jours** de travail effectif, répartis entre la conception de l'architecture, le développement backend, le développement frontend, et la documentation.

---

## Pistes d'évolution

Réflexions menées pendant le développement, non implémentées volontairement pour garder un périmètre maîtrisé et cohérent :

- **Saisie en masse** — approvisionnement ou inventaire de plusieurs articles simultanément (sélection multiple, endpoint batch, gestion des erreurs partielles).
- **Tableau de bord (KPIs)** — total d'articles, ruptures, valeur totale du stock en euros. La fréquence de rotation nécessiterait un historique de ventes sur une période.
- **Tags de vente cumulables** — modéliser « sur place » et « à emporter » comme deux caractéristiques cumulables plutôt qu'un enum à trois valeurs, ce qui impliquerait une double TVA selon le canal de vente.
- **Stock prévisionnel** — distinct du stock disponible, il intégrerait les commandes fournisseurs attendues et les commandes clients à honorer. Essentiel dans un usage métier réel, mais nécessite un système de commandes hors périmètre.
- **Enrichissement produit** — association de l'EAN-13 à un produit réel via une API externe (Open Food Facts, GS1).
- **CI/CD** — la structure monorepo est prête pour des workflows GitHub Actions séparés backend/frontend.
- **Tests unitaires** — le domaine étant pur (sans dépendance), il se prête particulièrement bien à des tests sur le calcul de stock, la validation EAN-13 et le calcul de TVA.
