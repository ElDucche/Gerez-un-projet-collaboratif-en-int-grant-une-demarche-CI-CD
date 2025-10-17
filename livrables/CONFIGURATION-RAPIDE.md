# 📚 Guide de Configuration CI/CD - Récapitulatif

## 🎯 Vue d'ensemble

Ce document vous guide pour finaliser la configuration de la pipeline CI/CD de BobApp. Tout le code est déjà en place, il ne reste que quelques secrets à configurer sur GitHub.

---

## ✅ Ce qui est déjà fait

- [x] Workflow GitHub Actions complet (`.github/workflows/ci-cd.yml`)
- [x] Configuration SonarQube (`sonar-project.properties`)
- [x] Dockerfiles optimisés (back-end et front-end)
- [x] Tests et rapports de couverture automatisés
- [x] Documentation complète dans `/livrables`

---

## 🔧 Ce qu'il reste à faire (5 minutes)

### Étape 1 : Configurer SonarCloud

1. **Créer un compte SonarCloud**
   - Va sur https://sonarcloud.io
   - Connecte-toi avec ton compte GitHub

2. **Créer le projet "bobapp"**
   - Clique sur "+" → "Analyze new project"
   - **IMPORTANT** : Choisis l'option "Import from GitHub" (recommandé)
   - Sélectionne ton repository `Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`
   - SonarCloud créera automatiquement :
     - Clé du projet : basée sur le nom du repo
     - Organisation : basée sur ton compte GitHub
   - **OU** en manuel :
     - Clé du projet : **`bobapp`**
     - Organisation : **`guillaume-leduc`** (ou ton nom d'organisation)
     - ⚠️ La clé et l'organisation doivent correspondre exactement à celles dans `sonar-project.properties`

3. **Générer un token**
   - Mon compte → Security → Generate Token
   - Nom : "GitHub Actions"
   - Type : "Global Analysis Token"
   - Copie le token (commence par `sqp_...`)

4. **Ajouter le token dans GitHub**
   - Ton repository → Settings → Secrets and variables → Actions
   - New repository secret :
     - Name : `SONAR_TOKEN` (⚠️ Attention au nom exact !)
     - Value : ton token SonarCloud
   - Add secret
   - ⚠️ **IMPORTANT** : Le secret doit être au niveau **Repository secrets**, pas dans un environnement !

📖 **Guide détaillé** : [GUIDE-SONARQUBE-SIMPLIFIE.md](livrables/GUIDE-SONARQUBE-SIMPLIFIE.md)

---

### Étape 2 : Configurer Docker Hub

1. **Créer un compte Docker Hub** (si pas déjà fait)
   - Va sur https://hub.docker.com
   - Crée un compte gratuit
   - Note ton nom d'utilisateur

2. **Générer un Access Token**
   - Mon compte → Security → New Access Token
   - Description : "GitHub Actions BobApp"
   - Permissions : "Read & Write"
   - Copie le token (commence par `dckr_pat_...`)

3. **Ajouter les secrets dans GitHub**
   - Ton repository → Settings → Secrets and variables → Actions
   
   **Premier secret** :
   - New repository secret
   - Name : `DOCKERHUB_USERNAME`
   - Value : ton nom d'utilisateur Docker Hub
   - Add secret
   
   **Deuxième secret** :
   - New repository secret
   - Name : `DOCKERHUB_TOKEN`
   - Value : ton token Docker Hub
   - Add secret

📖 **Guide détaillé** : [GUIDE-DOCKER-HUB-SIMPLIFIE.md](livrables/GUIDE-DOCKER-HUB-SIMPLIFIE.md)

---

## 🚀 Tester le workflow

Une fois les 3 secrets configurés :

1. **Fais un push sur la branche main**
   ```bash
   git add .
   git commit -m "Configure CI/CD pipeline"
   git push origin main
   ```

2. **Vérifie l'exécution**
   - Va sur GitHub → Onglet "Actions"
   - Clique sur le workflow en cours
   - Vérifie que toutes les étapes sont vertes ✅

3. **Consulte les résultats**
   - **SonarQube** : https://sonarcloud.io
   - **Docker Hub** : https://hub.docker.com/u/[ton-username]

---

## 📋 Checklist de configuration

### Secrets GitHub requis

- [ ] `SONAR_TOKEN` - Token d'authentification SonarCloud (⚠️ au niveau repository)
- [ ] `DOCKERHUB_USERNAME` - Nom d'utilisateur Docker Hub
- [ ] `DOCKERHUB_TOKEN` - Token d'accès Docker Hub

### Comptes externes requis

- [ ] Compte SonarCloud (https://sonarcloud.io)
- [ ] Projet "bobapp" créé sur SonarCloud
- [ ] Compte Docker Hub (https://hub.docker.com)

---

## 📊 Workflow CI/CD

Le workflow s'exécute automatiquement à chaque push ou pull request sur `main`, `master` ou `develop`.

```
📝 Push/PR
    ↓
✅ Vérification initiale
    ↓
┌─────────┬─────────┐
↓         ↓         
🧪 Tests  🧪 Tests
   Back      Front
    ↓         ↓
└─────────┴─────────┘
    ↓
🔍 Analyse SonarQube
    ↓
🐳 Build & Push Docker
    ↓
✨ Déployé sur Docker Hub!
```

### Durée totale : ~6-10 minutes

---

## 📚 Documentation complète

### Guides de configuration
- [Guide SonarQube simplifié](livrables/GUIDE-SONARQUBE-SIMPLIFIE.md) - Configuration SonarCloud étape par étape
- [Guide Docker Hub simplifié](livrables/GUIDE-DOCKER-HUB-SIMPLIFIE.md) - Configuration Docker Hub étape par étape

### Comptes-rendus des étapes
- [Étape 1](livrables/etape1-compte-rendu.md) - Configuration du repository et GitHub Actions
- [Étape 2](livrables/etape2-compte-rendu.md) - Tests et rapports de couverture
- [Étape 3](livrables/etape3-compte-rendu.md) - Analyse de qualité avec SonarQube
- [Étape 4](livrables/etape4-compte-rendu.md) - Déploiement sur Docker Hub

### Document final
- [Étape 5 - Document explicatif complet](livrables/etape5-document-explicatif.md) - Vue d'ensemble, KPIs, analyse et recommandations

---

## 🎯 KPIs configurés

| KPI | Seuil | Objectif |
|-----|-------|----------|
| **Code Coverage** | 80% minimum | 85-90% |
| **Bugs Critiques** | 0 | 0 |
| **Vulnérabilités** | 0 (critical/major) | 0 |
| **Dette Technique** | < 5% | < 3% |
| **Temps de Build** | < 10 min | 5-7 min |

---

## ❓ FAQ

### Le workflow ne démarre pas
- Vérifie que tu as bien push sur `main`, `master` ou `develop`
- Vérifie que le fichier `.github/workflows/ci-cd.yml` existe

### Erreur "Could not find a default branch for project with key 'bobapp'"
- **Le projet n'existe pas encore sur SonarCloud !**
- **Solution** : Consulte le guide détaillé → [DEPANNAGE-SONARQUBE.md](DEPANNAGE-SONARQUBE.md)
- Résumé rapide :
  1. Va sur https://sonarcloud.io
  2. Crée le projet en important ton repository GitHub
  3. Note le Project Key généré (peut être différent de `bobapp`)
  4. Mets à jour `sonar-project.properties` et `.github/workflows/ci-cd.yml` si nécessaire

### Erreur "SonarQube token not found" ou HTTP 401
- Vérifie que le secret s'appelle exactement `SONAR_TOKEN` (pas `SONARQUBE_TOKEN`)
- Vérifie que le secret est au niveau **Repository secrets** (pas dans un environnement)
- Vérifie que le token n'a pas expiré
- Vérifie que la clé du projet et l'organisation correspondent à celles de SonarCloud

### Erreur "Docker Hub authentication failed"
- Vérifie les secrets `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN`
- Vérifie que le token a les permissions "Read & Write"

### Les tests échouent
- C'est normal ! Le code initial a probablement des problèmes
- Consulte les logs dans GitHub Actions
- Corrige les erreurs et recommence

---

## 🆘 Support

Si tu rencontres des problèmes :

1. Consulte les guides simplifiés dans `/livrables`
2. Vérifie les logs dans l'onglet "Actions" de GitHub
3. Vérifie que tous les secrets sont bien configurés
4. Consulte la documentation officielle :
   - [GitHub Actions](https://docs.github.com/en/actions)
   - [SonarCloud](https://docs.sonarcloud.io/)
   - [Docker Hub](https://docs.docker.com/docker-hub/)

---

## 🎉 Prochaines étapes

Une fois la CI/CD configurée et fonctionnelle :

1. **Améliorer la couverture de tests** pour atteindre 80%
2. **Corriger les bugs critiques** détectés par SonarQube
3. **Optimiser le workflow** pour réduire le temps de build
4. **Communiquer avec les utilisateurs** sur les améliorations

---

**Bon courage ! La CI/CD va transformer ton processus de développement ! 🚀**
