# Étape 3 - Analyse de la Qualité du Code avec SonarQube

## 📋 Objectif
Intégrer SonarQube dans le workflow CI/CD pour analyser la qualité du code du back-end et du front-end, et détecter automatiquement les mauvaises pratiques, la dette technique et la complexité inutile.

## ✅ Réalisations

### 1. Configuration de SonarQube

#### 1.1 Création du fichier sonar-project.properties
Un fichier de configuration `sonar-project.properties` a été créé à la racine du projet pour définir les paramètres d'analyse :

**Caractéristiques principales :**
- **Architecture multi-modules** : configuration séparée pour le back-end (Java) et le front-end (TypeScript/Angular)
- **Clé du projet** : `bobapp`
- **Modules** : `back` et `front`

**Configuration back-end :**
- Langage : Java
- Sources : `src/main/java`
- Tests : `src/test/java`
- Binaires compilés : `target/classes`
- Rapport de couverture Jacoco : `target/site/jacoco/jacoco.xml`
- Rapports JUnit : `target/surefire-reports`

**Configuration front-end :**
- Sources : `src`
- Tests : fichiers `**/*.spec.ts`
- Rapport de couverture LCOV : `coverage/bobapp/lcov.info`
- Exclusions : `node_modules`, `coverage`, `dist`, fichiers de tests

**Exclusions globales :**
- `**/node_modules/**`
- `**/target/**`
- `**/dist/**`
- `**/coverage/**`
- `**/*.spec.ts`

### 2. Intégration dans GitHub Actions

#### 2.1 Nouveau job : analyse-sonarqube
Un job dédié a été ajouté au workflow CI/CD avec les caractéristiques suivantes :

**Dépendances :**
- S'exécute après la réussite des jobs `test-backend` et `test-frontend`
- Garantit que les rapports de couverture sont générés avant l'analyse

**Étapes du job :**

1. **Récupération du code**
   - Utilisation de `actions/checkout@v3`
   - `fetch-depth: 0` pour désactiver les clones superficiels (meilleure analyse)

2. **Configuration de l'environnement**
   - JDK 17 pour SonarScanner
   - Node.js 16 pour le front-end
   - Cache des packages SonarQube

3. **Génération des rapports de couverture**
   - Back-end : `mvn clean verify` (génère Jacoco)
   - Front-end : `npm test` avec coverage

4. **Installation de SonarScanner**
   - Téléchargement de SonarScanner CLI version 5.0.1.3006
   - Configuration du PATH

5. **Exécution de l'analyse**
   - Utilisation des variables d'environnement :
     - `SONARQUBE_TOKEN` : token d'authentification
     - `SONARQUBE_URL` : URL du serveur SonarQube
   - Analyse avec les paramètres du fichier `sonar-project.properties`

6. **Vérification du Quality Gate**
   - Attente de la fin de l'analyse
   - Validation du statut du Quality Gate

### 3. Configuration des secrets GitHub

**Secrets requis :**
- `SONARQUBE_TOKEN` : Token d'authentification SonarQube (déjà configuré)
- `SONARQUBE_URL` : URL du serveur SonarQube

**Comment configurer :**
1. Aller dans Settings > Secrets and variables > Actions
2. Ajouter `SONARQUBE_URL` avec l'URL de votre serveur SonarQube
3. Le `SONARQUBE_TOKEN` est déjà présent dans les variables d'environnement

## 🎯 Points de vigilance respectés

✅ **SonarQube obligatoire** : Intégration complète de SonarQube dans le workflow

✅ **Configuration back et front** : Le fichier `sonar-project.properties` cible explicitement les deux parties :
- Module `back` pour le code Java/Spring Boot
- Module `front` pour le code TypeScript/Angular

✅ **Rapports de couverture** : 
- Jacoco pour le back-end
- LCOV pour le front-end

✅ **Exclusions pertinentes** : 
- Fichiers de dépendances (node_modules, target)
- Fichiers générés (dist, coverage)
- Fichiers de tests

## 📊 Métriques analysées par SonarQube

L'analyse SonarQube fournira les métriques suivantes :

1. **Bugs** : Erreurs de code pouvant causer des dysfonctionnements
2. **Vulnérabilités** : Failles de sécurité potentielles
3. **Code Smells** : Mauvaises pratiques et dette technique
4. **Couverture de code** : Pourcentage de code couvert par les tests
5. **Duplication** : Code dupliqué à refactoriser
6. **Complexité cyclomatique** : Complexité des méthodes et fonctions
7. **Maintenabilité** : Note de facilité de maintenance (A à E)
8. **Fiabilité** : Note de fiabilité (A à E)
9. **Sécurité** : Note de sécurité (A à E)

## 🔄 Flux de travail

```
Initial Check (validation structure)
           ↓
    ┌──────┴──────┐
    ↓             ↓
Tests Back    Tests Front
    ↓             ↓
    └──────┬──────┘
           ↓
   Analyse SonarQube
   (back + front)
           ↓
   Quality Gate Check
```

## 🚀 Prochaines étapes

L'étape 4 consistera à :
- Construire les images Docker pour le back-end et le front-end
- Publier les images sur Docker Hub
- Conditionner le déploiement à la réussite de l'analyse SonarQube

## 📝 Notes techniques

- **Version SonarScanner** : 5.0.1.3006
- **JDK pour SonarScanner** : 17 (requis pour la dernière version)
- **Format des rapports** :
  - Back-end : XML (Jacoco)
  - Front-end : LCOV
- **Architecture** : Multi-modules pour analyse séparée et agrégée

## ✨ Améliorations possibles

1. Ajouter une vérification stricte du Quality Gate avec échec du workflow si non conforme
2. Configurer des Quality Gates personnalisés avec des seuils spécifiques
3. Ajouter des commentaires automatiques sur les PR avec les résultats SonarQube
4. Générer un badge SonarQube dans le README
5. Configurer des alertes par email en cas de détection de vulnérabilités critiques
