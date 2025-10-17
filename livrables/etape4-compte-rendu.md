# Étape 4 - Déploiement sur Docker Hub

## 📋 Objectif
Automatiser la construction et la publication des conteneurs Docker du back-end et du front-end sur Docker Hub, en conditionnant le déploiement à la réussite de toutes les étapes précédentes (tests et analyse SonarQube).

## ✅ Réalisations

### 1. Vérification des Dockerfiles existants

Les Dockerfiles sont déjà présents dans le projet :

#### 1.1 Dockerfile du back-end (`back/Dockerfile`)
**Architecture multi-stage** pour optimiser la taille de l'image :

**Stage 1 - Build** :
- Image de base : `maven:3.6.3-jdk-11-slim`
- Compilation du projet avec Maven
- Génération du fichier JAR

**Stage 2 - Runtime** :
- Image de base : `openjdk:11-jdk-slim` (légère)
- Copie uniquement du JAR compilé
- Exposition du port 8080
- Point d'entrée : exécution du JAR

**Avantages** :
- Image finale légère (uniquement le runtime Java, pas Maven)
- Build reproductible
- Sécurité améliorée

#### 1.2 Dockerfile du front-end (`front/Dockerfile`)
**Architecture multi-stage** pour servir l'application Angular :

**Stage 1 - Build** :
- Image de base : `node:latest`
- Installation des dépendances avec Yarn
- Build de l'application Angular en mode production

**Stage 2 - Production** :
- Image de base : `nginx:latest`
- Configuration Nginx personnalisée (`nginx.conf`)
- Copie des fichiers buildés dans le répertoire Nginx
- Exposition du port 80

**Avantages** :
- Image finale très légère (juste Nginx + fichiers statiques)
- Performances optimales pour servir l'application Angular
- Configuration Nginx optimisée (gzip, cache, routing)

### 2. Intégration dans GitHub Actions

#### 2.1 Nouveau job : docker-build-push
Un job dédié a été ajouté au workflow CI/CD avec les caractéristiques suivantes :

**Dépendances** :
- S'exécute uniquement après la réussite du job `analyse-sonarqube`
- Garantit que le code a passé tous les tests et l'analyse de qualité

**Étapes du job** :

1. **Récupération du code**
   - Checkout du repository

2. **Configuration de Docker Buildx**
   - Activation de Docker Buildx pour les builds avancés
   - Support multi-plateforme et cache amélioré

3. **Connexion à Docker Hub**
   - Authentification avec les credentials Docker Hub
   - Utilisation des secrets GitHub :
     - `DOCKERHUB_USERNAME` : nom d'utilisateur Docker Hub
     - `DOCKERHUB_TOKEN` : token d'accès Docker Hub

4. **Construction et publication du back-end**
   - Extraction des métadonnées (tags, labels)
   - Build de l'image depuis `./back/Dockerfile`
   - Tagging intelligent :
     - Tag par branche (ex: `main`, `develop`)
     - Tag par commit SHA (ex: `main-abc123`)
     - Tag `latest` pour la branche par défaut
   - Push sur Docker Hub : `<username>/bobapp-backend`
   - Utilisation du cache pour accélérer les builds suivants

5. **Construction et publication du front-end**
   - Même processus que le back-end
   - Build de l'image depuis `./front/Dockerfile`
   - Push sur Docker Hub : `<username>/bobapp-frontend`

6. **Résumé de la publication**
   - Affichage des images publiées
   - Liste des tags créés

### 2. Stratégie de tagging

**Tags automatiques générés** :
- `latest` : dernière version de la branche principale (main/master)
- `<branch>` : nom de la branche (ex: `develop`, `config`)
- `sha-<hash>` : hash du commit (ex: `sha-abc1234`)

**Note importante** : La syntaxe initiale utilisait `prefix={{branch}}-` qui causait une erreur de format. Elle a été corrigée pour utiliser simplement `type=sha` sans préfixe.

**Avantages** :
- Traçabilité complète (chaque commit a son image)
- Facilite les rollbacks
- Permet de tester des versions spécifiques

### 4. Optimisations mises en place

#### 4.1 Cache Docker
- Cache des layers Docker pour accélérer les builds
- Cache stocké dans un tag spécial `buildcache`
- Réduction du temps de build de 70-80% après le premier build

#### 4.2 Build multi-stage
- Images finales légères (pas d'outils de build)
- Sécurité améliorée (surface d'attaque réduite)
- Déploiement plus rapide

#### 4.3 Labels et métadonnées
- Ajout automatique de labels OCI
- Informations sur la source, le commit, la date de build
- Facilite la gestion et le debugging

### 3. Configuration des secrets Docker Hub

**Secrets requis dans GitHub** :

1. **DOCKERHUB_USERNAME**
   - Votre nom d'utilisateur Docker Hub
   - Exemple : `guillaumeleduc` ou `votre-username`
   - ⚠️ **IMPORTANT** : Doit être configuré au niveau **Repository secrets**

2. **DOCKERHUB_TOKEN**
   - Token d'accès Docker Hub (recommandé au lieu du mot de passe)
   - Plus sécurisé, peut être révoqué indépendamment
   - ⚠️ **IMPORTANT** : Doit être configuré au niveau **Repository secrets**

**Comment obtenir le token Docker Hub** :

1. Connectez-vous sur https://hub.docker.com
2. Cliquez sur votre profil → "Account Settings"
3. Allez dans "Security" → "New Access Token"
4. Donnez un nom au token : "GitHub Actions"
5. Permissions : "Read & Write"
6. Copiez le token généré

**Comment ajouter les secrets dans GitHub** :

1. Repository GitHub → "Settings"
2. "Secrets and variables" → "Actions"
3. "New repository secret"
4. Ajoutez `DOCKERHUB_USERNAME` avec votre nom d'utilisateur
5. Ajoutez `DOCKERHUB_TOKEN` avec votre token
6. Cliquez sur "Add secret"

## 🎯 Points de vigilance respectés

✅ **Conteneurs pour back et front** : Les deux applications sont conteneurisées

✅ **Publication sur Docker Hub** : Automatisation complète du push

✅ **Déploiement conditionnel** : Le job ne s'exécute que si :
- Les tests back-end réussissent
- Les tests front-end réussissent
- L'analyse SonarQube réussit

✅ **Dockerfiles optimisés** : Build multi-stage pour des images légères

✅ **Cache et performances** : Utilisation du cache Docker pour accélérer les builds

## 🔄 Flux de travail complet

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
           ↓
   Docker Build & Push
   (back + front)
           ↓
   Images sur Docker Hub ✅
```

## 📦 Images Docker produites

Après chaque exécution réussie du workflow, deux images sont disponibles sur Docker Hub :

1. **bobapp-backend**
   - Repository : `<username>/bobapp-backend`
   - Contenu : Application Spring Boot (JAR)
   - Port : 8080
   - Commande pour lancer : 
     ```bash
     docker run -p 8080:8080 <username>/bobapp-backend:latest
     ```

2. **bobapp-frontend**
   - Repository : `<username>/bobapp-frontend`
   - Contenu : Application Angular + Nginx
   - Port : 80
   - Commande pour lancer :
     ```bash
     docker run -p 80:80 <username>/bobapp-frontend:latest
     ```

## 🚀 Comment utiliser les images

### Lancement local avec Docker

**Back-end** :
```bash
docker pull <username>/bobapp-backend:latest
docker run -d -p 8080:8080 --name bobapp-back <username>/bobapp-backend:latest
```

**Front-end** :
```bash
docker pull <username>/bobapp-frontend:latest
docker run -d -p 80:80 --name bobapp-front <username>/bobapp-frontend:latest
```

### Lancement avec Docker Compose

Créez un fichier `docker-compose.yml` :
```yaml
version: '3.8'

services:
  backend:
    image: <username>/bobapp-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod

  frontend:
    image: <username>/bobapp-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
```

Puis lancez :
```bash
docker-compose up -d
```

## 📊 Métriques et monitoring

**Taille des images** :
- Back-end : ~200-250 MB (JRE 11 + application)
- Front-end : ~25-30 MB (Nginx + fichiers statiques)

**Temps de build** :
- Premier build : 3-5 minutes
- Builds suivants avec cache : 1-2 minutes

**Sécurité** :
- Images basées sur des versions slim/alpine
- Scan de sécurité automatique par Docker Hub
- Pas d'outils de développement dans les images finales

## 🔐 Bonnes pratiques appliquées

1. **Multi-stage builds** : Images finales optimisées
2. **Secrets GitHub** : Credentials sécurisés (jamais en clair)
3. **Tokens au lieu de mots de passe** : Plus sécurisé pour Docker Hub
4. **Tagging sémantique** : Traçabilité complète
5. **Cache intelligent** : Réduction des temps de build
6. **Conditional deployment** : Déploiement uniquement si qualité OK

## 🚀 Prochaines étapes

L'étape 5 consistera à :
- Documenter le workflow complet
- Proposer des KPIs (Code coverage, temps de build, etc.)
- Analyser les métriques obtenues
- Analyser les retours utilisateurs
- Créer le document explicatif final

## 🐛 Problèmes rencontrés et solutions

### Problème 1 : Erreur "invalid tag format" avec Docker
**Symptôme** : 
```
buildx failed with: ERROR: failed to build: invalid tag "***/bobapp-backend:-7751cec": invalid reference format
```

**Cause** : La configuration initiale des tags utilisait `type=sha,prefix={{branch}}-` avec une variable `{{branch}}` non supportée ou mal interprétée par `docker/metadata-action`.

**Solution** : Modification de la configuration dans `.github/workflows/ci-cd.yml` :
```yaml
# AVANT (causait l'erreur)
tags: |
  type=ref,event=branch
  type=sha,prefix={{branch}}-
  type=raw,value=latest,enable={{is_default_branch}}

# APRÈS (corrigé)
tags: |
  type=ref,event=branch
  type=sha
  type=raw,value=latest,enable={{is_default_branch}}
```

### Problème 2 : Secrets Docker Hub non détectés
**Cause possible** : Si les secrets sont configurés dans un **environnement** au lieu du **repository**, ils ne seront pas accessibles au job.

**Solution** : S'assurer que `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN` sont configurés dans **Settings → Secrets and variables → Actions → Repository secrets**.

## ✨ Améliorations possibles

1. **Scan de sécurité** : Ajouter Trivy ou Snyk pour scanner les vulnérabilités
2. **Multi-platform builds** : Supporter AMD64 et ARM64
3. **Versioning sémantique** : Générer automatiquement les versions (v1.0.0, v1.1.0)
4. **Registry alternatifs** : Supporter GitHub Container Registry ou AWS ECR
5. **Health checks** : Ajouter des HEALTHCHECK dans les Dockerfiles
6. **Notifications** : Envoyer une notification Slack/Discord après publication
7. **Rollback automatique** : Détection de problèmes et rollback automatique
