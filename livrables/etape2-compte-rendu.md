# Étape 2 : Tests et Rapports de Couverture

## Date
16 Octobre 2025

## Objectif
Mettre en place un workflow CI/CD qui exécute automatiquement les tests et génère les rapports de couverture pour le back-end et le front-end.

---

## 📋 Analyse Technique

### Configuration Existante

#### Back-end
- **Tests**: JUnit avec Spring Boot Starter Test
- **Coverage**: Jacoco 0.8.5 déjà configuré dans pom.xml
- **Commande**: `mvn clean test`
- **Rapport généré**: `back/target/site/jacoco/`

#### Front-end
- **Tests**: Jasmine + Karma
- **Coverage**: karma-coverage 2.2.0
- **Commande**: `npm test -- --no-watch --code-coverage --browsers=ChromeHeadless`
- **Rapport généré**: `front/coverage/`

### Points Importants
✅ Jacoco est déjà configuré et génère automatiquement les rapports lors de `mvn test`
✅ Karma-coverage est présent et génère les rapports avec l'option `--code-coverage`
✅ Aucune modification du code source nécessaire (respect des règles du projet d'école)

---

## 🔧 Implémentation

### 1. Job Backend Tests & Coverage

**Dépendance**: Nécessite le succès du job `initial-check`

**Étapes implémentées**:

1. **Checkout du code** : Récupération du repository
2. **Configuration JDK 11** : 
   - Utilisation de `actions/setup-java@v3`
   - Distribution Temurin (OpenJDK)
   - Cache Maven activé pour optimiser les builds
3. **Exécution des tests** :
   - Commande: `mvn clean test` dans le répertoire `./back`
   - Jacoco génère automatiquement le rapport
4. **Vérification du rapport** :
   - Contrôle de la présence du dossier `target/site/jacoco/`
   - Échec du job si le rapport n'est pas généré
5. **Upload du rapport** :
   - Artefact nommé `backend-coverage-report`
   - Rétention de 30 jours
   - Accessible depuis l'onglet Actions de GitHub

### 2. Job Frontend Tests & Coverage

**Dépendance**: Nécessite le succès du job `initial-check`

**Étapes implémentées**:

1. **Checkout du code** : Récupération du repository
2. **Configuration Node.js 16** :
   - Utilisation de `actions/setup-node@v3`
   - Cache npm activé avec `package-lock.json`
3. **Installation des dépendances** :
   - Commande: `npm ci` (installation propre et reproductible)
4. **Exécution des tests** :
   - Commande: `npm test -- --no-watch --code-coverage --browsers=ChromeHeadless`
   - Mode headless pour compatibilité CI/CD
   - Génération automatique du rapport de couverture
5. **Vérification du rapport** :
   - Contrôle de la présence du dossier `coverage/`
   - Échec du job si le rapport n'est pas généré
6. **Upload du rapport** :
   - Artefact nommé `frontend-coverage-report`
   - Rétention de 30 jours
   - Accessible depuis l'onglet Actions de GitHub

---

## ✅ Architecture du Workflow

```
┌─────────────────┐
│ initial-check   │
│   ✓ Validation  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────┐
│Backend│  │Frontend│
│ Tests │  │ Tests │
│   +   │  │   +   │
│Coverage│  │Coverage│
└───────┘  └───────┘
```

**Parallélisation**: Les jobs `test-backend` et `test-frontend` s'exécutent en parallèle après le succès de `initial-check`, optimisant le temps d'exécution.

---

## 📊 Rapports de Couverture Générés

### Back-end (Jacoco)
- **Format**: HTML
- **Localisation**: `back/target/site/jacoco/`
- **Contenu**:
  - index.html (rapport principal)
  - Couverture par package
  - Couverture par classe
  - Métriques détaillées (instructions, branches, lignes, méthodes)

### Front-end (Karma-Coverage)
- **Formats**: HTML, Text-summary (configuration existante)
- **Localisation**: `front/coverage/bobapp/`
- **Contenu**:
  - index.html (rapport principal)
  - Couverture par fichier
  - Statistiques: Statements, Branches, Functions, Lines

---

## 🎯 Validation et Tests

### Points de Contrôle Automatiques

1. **Échec si les tests échouent** : Le job s'arrête immédiatement
2. **Échec si le rapport n'est pas généré** : Vérification explicite après l'exécution
3. **Artefacts sauvegardés** : Disponibles pendant 30 jours pour analyse

### Triggers Configurés

- **Push** sur `main`, `master`, `develop` : Exécution automatique complète
- **Pull Request** : Validation avant merge pour garantir que les tests passent

---

## 📝 Respect des Contraintes du Projet

### ✅ Code Source Non Modifié
- Aucun fichier du back-end modifié
- Aucun fichier du front-end modifié
- Travail exclusivement sur `.github/workflows/`

### ✅ Utilisation des Configurations Existantes
- Jacoco déjà configuré dans pom.xml → utilisé tel quel
- karma-coverage déjà dans package.json → utilisé tel quel
- ChromeHeadless utilisé pour compatibilité CI (pas besoin de Chrome GUI)

---

## 🚀 Prochaines Étapes

### Étape 3 : Analyse Qualité du Code avec Sonar
- Installation et configuration de SonarCloud
- Intégration dans le workflow
- Analyse du back-end et du front-end
- Configuration de sonar.properties

### Points à Prévoir
- Création du projet sur SonarCloud
- Génération du token Sonar
- Configuration des secrets GitHub
- Ajout d'un job `sonar-analysis` dans le workflow

---

## 📦 Modifications Apportées

### Fichiers Modifiés
```
.github/workflows/ci-cd.yml
  ├── Job: test-backend (NOUVEAU)
  └── Job: test-frontend (NOUVEAU)

INSTRUCTIONS.md
  └── Ajout de la règle: Interdiction de modifier le code source

livrables/
  └── etape2-compte-rendu.md (NOUVEAU)
```

---

## 🎯 État d'Avancement

- [x] Étape 1 : Configuration du repository et première GitHub Action
- [x] Étape 2 : Tests et rapports de couverture ✅
- [ ] Étape 3 : Analyse de la qualité du code avec Sonar
- [ ] Étape 4 : Déploiement sur Docker Hub
- [ ] Étape 5 : Documentation et analyse finale

---

## 📈 Bénéfices Apportés

1. **Automatisation complète** : Plus besoin de lancer les tests manuellement
2. **Rapports systématiques** : Couverture générée à chaque push/PR
3. **Visibilité** : Artefacts disponibles dans GitHub Actions pendant 30 jours
4. **Parallélisation** : Back et front testés simultanément (gain de temps)
5. **Sécurité** : Validation automatique des PR avant merge

---

## Validation Requise

Ce compte-rendu nécessite votre validation avant de passer à l'Étape 3 (Analyse Sonar).
