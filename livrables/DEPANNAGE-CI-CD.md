# 🔧 Guide de Dépannage CI/CD - BobApp

Ce document récapitule tous les problèmes rencontrés lors de la mise en place de la pipeline CI/CD et leurs solutions.

## 📋 Table des matières

1. [Problèmes SonarCloud](#problèmes-sonarcloud)
2. [Problèmes Docker](#problèmes-docker)
3. [Problèmes de Secrets GitHub](#problèmes-de-secrets-github)
4. [Checklist de vérification](#checklist-de-vérification)

---

## 🔍 Problèmes SonarCloud

### Erreur : HTTP 401 - Unauthorized

**Symptôme** :
```
Error 401 on https://sonarcloud.io/api/ce/submit?projectKey=...
```

**Causes possibles** :
1. Le secret GitHub est mal nommé
2. Le token SonarCloud a expiré
3. Le secret est dans un environnement au lieu du repository
4. La clé du projet ou l'organisation ne correspond pas

**Solutions** :

#### Solution 1 : Vérifier le nom du secret
Le secret doit s'appeler exactement `SONAR_TOKEN` (pas `SONARQUBE_TOKEN`).

**Vérification** :
1. Va dans Settings → Secrets and variables → Actions
2. Vérifie que le secret s'appelle `SONAR_TOKEN`
3. Si ce n'est pas le cas, supprime-le et recrée-le avec le bon nom

#### Solution 2 : Vérifier l'emplacement du secret
Le secret doit être au niveau **Repository secrets**, pas dans un environnement.

**Vérification** :
1. Settings → Secrets and variables → Actions
2. Regarde la section **Repository secrets** (pas "Environment secrets")
3. Le secret `SONAR_TOKEN` doit apparaître dans cette liste

#### Solution 3 : Générer un nouveau token
Si le token a expiré ou ne fonctionne pas :

1. Va sur https://sonarcloud.io
2. Mon compte → Security
3. Révoque l'ancien token si nécessaire
4. Generate Token :
   - Name : "GitHub Actions"
   - Type : "Global Analysis Token"
   - Expiration : "No expiration" (recommandé) ou 90 jours
5. Copie le nouveau token
6. Mets à jour le secret dans GitHub

#### Solution 4 : Vérifier la configuration du projet
La clé du projet et l'organisation doivent correspondre à celles de SonarCloud.

**Dans `back/pom.xml`** :
```xml
<properties>
    <sonar.organization>elducche</sonar.organization>
    <sonar.host.url>https://sonarcloud.io</sonar.host.url>
</properties>
```

**Dans `.github/workflows/ci-cd.yml`** (ligne ~193) :
```bash
mvn -B org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
  -Dsonar.projectKey=ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD
```

**Dans `.github/workflows/ci-cd.yml`** (ligne ~207) :
```bash
sonar-scanner \
  -Dsonar.projectKey=ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD \
  -Dsonar.organization=elducche \
  ...
```

**Vérification sur SonarCloud** :
1. Va sur https://sonarcloud.io
2. Clique sur ton projet
3. Project Settings → General
4. Note le "Project Key" et "Organization Key"
5. Assure-toi qu'ils correspondent exactement aux valeurs dans le code

---

## 🐳 Problèmes Docker

### Erreur : Invalid tag format

**Symptôme** :
```
buildx failed with: ERROR: failed to build: invalid tag "***/bobapp-backend:-7751cec": invalid reference format
```

**Cause** :
La configuration des tags Docker utilisait une syntaxe incompatible : `type=sha,prefix={{branch}}-`

**Solution** :
Modifier `.github/workflows/ci-cd.yml` aux lignes 250-254 et 270-274 :

```yaml
# AVANT (incorrect)
- name: Extraction des métadonnées pour le back-end
  id: meta-backend
  uses: docker/metadata-action@v4
  with:
    images: ${{ secrets.DOCKERHUB_USERNAME }}/bobapp-backend
    tags: |
      type=ref,event=branch
      type=sha,prefix={{branch}}-
      type=raw,value=latest,enable={{is_default_branch}}

# APRÈS (correct)
- name: Extraction des métadonnées pour le back-end
  id: meta-backend
  uses: docker/metadata-action@v4
  with:
    images: ${{ secrets.DOCKERHUB_USERNAME }}/bobapp-backend
    tags: |
      type=ref,event=branch
      type=sha
      type=raw,value=latest,enable={{is_default_branch}}
```

**Appliquer la même correction pour le front-end.**

### Erreur : Authentication failed to Docker Hub

**Symptôme** :
```
Error: failed to authorize: authentication required
```

**Causes possibles** :
1. Les secrets `DOCKERHUB_USERNAME` ou `DOCKERHUB_TOKEN` sont mal configurés
2. Le token Docker Hub a expiré ou a été révoqué
3. Les secrets sont dans un environnement au lieu du repository

**Solutions** :

#### Solution 1 : Vérifier les secrets
1. Settings → Secrets and variables → Actions → Repository secrets
2. Vérifie que ces deux secrets existent :
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
3. Vérifie qu'ils sont dans **Repository secrets**, pas dans un environnement

#### Solution 2 : Générer un nouveau token Docker Hub
1. Va sur https://hub.docker.com
2. Mon compte → Security → Access Tokens
3. New Access Token :
   - Description : "GitHub Actions BobApp"
   - Access permissions : "Read & Write"
4. Copie le token généré
5. Mets à jour le secret `DOCKERHUB_TOKEN` dans GitHub

---

## 🔐 Problèmes de Secrets GitHub

### Les secrets sont dans un environnement au lieu du repository

**Symptôme** :
Le workflow échoue avec des erreurs d'authentification alors que les secrets semblent configurés.

**Diagnostic** :
1. Va dans Settings → Secrets and variables → Actions
2. Vérifie s'il y a une section **Environment secrets** avec des secrets
3. Vérifie la section **Repository secrets**

**Problème** :
Si les secrets sont uniquement dans un environnement (ex: "bobapp"), le workflow ne pourra pas y accéder à moins de spécifier explicitement l'environnement.

**Solution** :
Les secrets doivent être au niveau **Repository secrets** :

1. Note les valeurs des secrets dans l'environnement (tu ne pourras pas les revoir)
2. Va dans **Repository secrets**
3. Crée les secrets suivants :
   - `SONAR_TOKEN` : token SonarCloud
   - `DOCKERHUB_USERNAME` : username Docker Hub
   - `DOCKERHUB_TOKEN` : token Docker Hub
4. (Optionnel) Supprime les secrets de l'environnement pour éviter la confusion

### Nom de secret incorrect

**Symptôme** :
Le workflow dit que le secret n'existe pas, alors qu'il est configuré.

**Causes** :
- Le nom du secret dans le code ne correspond pas au nom dans GitHub
- Faute de frappe (majuscules/minuscules, underscore manquant, etc.)

**Solutions** :

| Service | Nom CORRECT du secret | Noms INCORRECTS courants |
|---------|----------------------|--------------------------|
| SonarCloud | `SONAR_TOKEN` | `SONARQUBE_TOKEN`, `SONARCLOUD_TOKEN`, `SONAR_CLOUD_TOKEN` |
| Docker Hub (user) | `DOCKERHUB_USERNAME` | `DOCKER_USERNAME`, `DOCKER_HUB_USERNAME` |
| Docker Hub (token) | `DOCKERHUB_TOKEN` | `DOCKER_TOKEN`, `DOCKER_HUB_TOKEN`, `DOCKERHUB_PASSWORD` |

**Vérification dans le workflow** :
Cherche dans `.github/workflows/ci-cd.yml` :
- Ligne ~189 : `SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}`
- Ligne ~243 : `username: ${{ secrets.DOCKERHUB_USERNAME }}`
- Ligne ~244 : `password: ${{ secrets.DOCKERHUB_TOKEN }}`

Les noms dans `${{ secrets.XXX }}` doivent correspondre EXACTEMENT aux noms dans GitHub.

---

## ✅ Checklist de vérification

### Avant de lancer la pipeline

- [ ] **SonarCloud configuré**
  - [ ] Compte créé sur https://sonarcloud.io
  - [ ] Projet importé depuis GitHub
  - [ ] Token généré (commence par `sqp_`)
  - [ ] Secret `SONAR_TOKEN` ajouté dans GitHub (Repository secrets)
  - [ ] Organisation et clé du projet dans le code correspondent à SonarCloud

- [ ] **Docker Hub configuré**
  - [ ] Compte créé sur https://hub.docker.com
  - [ ] Token généré avec permissions "Read & Write"
  - [ ] Secret `DOCKERHUB_USERNAME` ajouté dans GitHub (Repository secrets)
  - [ ] Secret `DOCKERHUB_TOKEN` ajouté dans GitHub (Repository secrets)

- [ ] **Configuration du workflow**
  - [ ] Fichier `.github/workflows/ci-cd.yml` présent
  - [ ] Tags Docker corrigés (pas de `prefix={{branch}}-`)
  - [ ] Organisation et clé SonarCloud correctes dans le workflow

- [ ] **Fichiers de configuration**
  - [ ] `sonar-project.properties` présent à la racine
  - [ ] `back/pom.xml` contient les propriétés SonarCloud
  - [ ] Dockerfiles présents dans `back/` et `front/`

### Après l'exécution du workflow

- [ ] Job "Initial Check" : ✅ Réussi
- [ ] Job "Backend Tests & Coverage" : ✅ Réussi
- [ ] Job "Frontend Tests & Coverage" : ✅ Réussi
- [ ] Job "Analyse SonarQube" : ✅ Réussi
- [ ] Job "Construction et Publication Docker" : ✅ Réussi

### Vérification des résultats

- [ ] Rapport SonarCloud disponible sur https://sonarcloud.io
- [ ] Images Docker publiées sur https://hub.docker.com
- [ ] Quality Gate SonarCloud : PASSED
- [ ] Artifacts (rapports de couverture) téléchargeables sur GitHub Actions

---

## 🔄 Procédure de correction en cas d'erreur

### 1. Identifier le job en échec
Va dans GitHub → Actions → Clique sur l'exécution échouée → Identifie le job rouge.

### 2. Consulter les logs
Clique sur le job en échec → Développe les étapes → Lis les messages d'erreur.

### 3. Diagnostiquer avec ce guide
Cherche le message d'erreur dans ce document et applique la solution correspondante.

### 4. Corriger et relancer
- **Si correction de code** : Commit et push les modifications
- **Si secrets manquants** : Ajoute-les dans GitHub Settings
- **Si correction du workflow** : Commit et push `.github/workflows/ci-cd.yml`
- **Pour relancer manuellement** : GitHub Actions → Re-run jobs

### 5. Vérifier la correction
Attends que le workflow se termine et vérifie que tous les jobs sont verts ✅.

---

## 📞 Support

Si tu rencontres un problème non documenté ici :

1. **Consulte les logs détaillés** dans GitHub Actions
2. **Vérifie la documentation officielle** :
   - [GitHub Actions](https://docs.github.com/en/actions)
   - [SonarCloud](https://docs.sonarcloud.io/)
   - [Docker](https://docs.docker.com/)
3. **Cherche l'erreur exacte** sur Google ou Stack Overflow
4. **Documente ta solution** et ajoute-la à ce guide !

---

## 📝 Résumé des corrections appliquées

### Corrections SonarCloud
- ✅ Nom du secret : `SONAR_TOKEN` (pas `SONARQUBE_TOKEN`)
- ✅ Secret au niveau **Repository** (pas environnement)
- ✅ Organisation en minuscules dans le code (`elducche`)
- ✅ Clé du projet correspondant au repository GitHub

### Corrections Docker
- ✅ Tags corrigés : suppression de `prefix={{branch}}-`
- ✅ Secrets Docker Hub au niveau **Repository**
- ✅ Nom des secrets : `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN`

### Corrections Workflow
- ✅ Version `actions/upload-artifact@v4` (v3 dépréciée)
- ✅ Configuration Maven pour SonarQube dans `pom.xml`
- ✅ Analyse SonarQube avec Maven pour le back-end
- ✅ Analyse SonarQube avec CLI Scanner pour le front-end

---

**Date de dernière mise à jour** : 17 octobre 2025

**Version du workflow** : v1.0 (fonctionnel)
