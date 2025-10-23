# Guide Docker Hub - Configuration Simple 🐳

## 🤔 C'est quoi Docker Hub ?

Docker Hub, c'est comme le **Play Store ou l'App Store, mais pour les conteneurs Docker**.

Au lieu de télécharger des applications sur ton téléphone, tu télécharges (ou publies) des **images Docker** qui contiennent ton application.

## 🎯 Ce que tu dois faire (3 étapes simples)

### 1️⃣ Créer un compte Docker Hub (gratuit)

1. Va sur https://hub.docker.com
2. Clique sur "Sign Up"
3. Crée un compte (c'est gratuit !)
4. Note bien ton **nom d'utilisateur** (tu en auras besoin)

Exemple : Si tu choisis `guillaumeleduc`, ce sera ton nom d'utilisateur Docker Hub.

### 2️⃣ Créer un Token (clé d'accès)

Un token, c'est comme une **clé** qui permet à GitHub de publier des images sur ton compte Docker Hub.

**Comment créer le token :**

1. Connecte-toi sur https://hub.docker.com
2. Clique sur ton profil (en haut à droite)
3. Clique sur **"Account Settings"**
4. Dans le menu de gauche, clique sur **"Security"**
5. Clique sur **"New Access Token"**
6. Remplis :
   - **Token description** : "GitHub Actions BobApp"
   - **Access permissions** : "Read & Write"
7. Clique sur **"Generate"**
8. **IMPORTANT** : Copie le token tout de suite ! Il ne s'affichera qu'une seule fois !

Le token ressemble à ça : `dckr_pat_abcdefghijklmnopqrstuvwxyz123456`

### 3️⃣ Ajouter le token dans GitHub

Maintenant, donne cette clé à GitHub :

1. Va sur ton repository GitHub
2. Clique sur **"Settings"** (en haut du repository)
3. Dans le menu de gauche, clique sur **"Secrets and variables"** → **"Actions"**
4. Clique sur **"New repository secret"**

**Premier secret - Nom d'utilisateur :**
- **Name** : `DOCKERHUB_USERNAME`
- **Value** : ton nom d'utilisateur Docker Hub (ex: `guillaumeleduc`)
- Clique sur **"Add secret"**

**Deuxième secret - Token :**
- Clique encore sur **"New repository secret"**
- **Name** : `DOCKERHUB_TOKEN`
- **Value** : colle le token Docker Hub que tu as copié
- Clique sur **"Add secret"**

## ✅ C'est tout !

Maintenant, chaque fois que tu fais un `git push` et que tous les tests passent, GitHub va automatiquement :

1. 🏗️ Construire une image Docker pour le back-end
2. 🏗️ Construire une image Docker pour le front-end
3. 📤 Publier les deux images sur ton Docker Hub

## 📦 Où trouver tes images ?

Après le premier push réussi, tes images seront disponibles sur :

- **Back-end** : `https://hub.docker.com/r/<ton-username>/bobapp-backend`
- **Front-end** : `https://hub.docker.com/r/<ton-username>/bobapp-frontend`

Tu pourras les voir dans ton tableau de bord Docker Hub !

## 🚀 Comment utiliser tes images ?

### Pour tester en local

**Lancer le back-end :**
```bash
docker run -p 8080:8080 <ton-username>/bobapp-backend:latest
```

**Lancer le front-end :**
```bash
docker run -p 80:80 <ton-username>/bobapp-frontend:latest
```

Puis ouvre ton navigateur :
- Front-end : http://localhost
- Back-end : http://localhost:8080

## 🔍 Comment vérifier que ça marche ?

Après avoir configuré les secrets et fait un `git push` :

1. Va sur ton repository GitHub
2. Clique sur l'onglet **"Actions"**
3. Clique sur le workflow en cours d'exécution
4. Regarde les étapes :
   - ✅ Tests back-end
   - ✅ Tests front-end
   - ✅ Analyse SonarQube
   - ✅ Construction et publication Docker ← C'est ici !

Si tout est vert ✅, c'est bon ! Tes images sont sur Docker Hub !

## ❓ Questions fréquentes

### "Je n'ai pas de compte Docker Hub"
Pas de problème ! Va sur https://hub.docker.com et crée-en un gratuitement en 2 minutes.

### "Mon token a expiré"
Retourne dans Docker Hub → Account Settings → Security → Génère un nouveau token et remplace-le dans GitHub.

### "Combien d'images je peux publier gratuitement ?"
Avec un compte gratuit Docker Hub :
- Nombre d'images **publiques** : **illimité** 🎉
- Nombre d'images **privées** : 1 seule
- Pulls (téléchargements) : 200 par 6 heures

Pour notre projet (images publiques), c'est parfait !

### "C'est quoi la différence entre 'latest' et les autres tags ?"
- `latest` = La dernière version de la branche principale (main)
- `main-abc123` = Version précise avec le hash du commit
- `develop` = Dernière version de la branche develop

Utilise `latest` pour avoir toujours la dernière version stable.

### "Mes images sont publiques, tout le monde peut les voir ?"
Oui, avec un compte gratuit, tes images sont publiques par défaut. C'est parfait pour des projets d'école ou open-source !

Si tu veux des images privées, il faut un compte payant Docker Hub (5$/mois).

## 📝 Liste de contrôle rapide

Pour être sûr que tout est configuré :

- [ ] J'ai un compte Docker Hub
- [ ] J'ai créé un token Docker Hub avec les droits "Read & Write"
- [ ] J'ai copié le token quelque part
- [ ] J'ai ajouté le secret `DOCKERHUB_USERNAME` dans GitHub
- [ ] J'ai ajouté le secret `DOCKERHUB_TOKEN` dans GitHub

Si tu as coché les 5 cases, c'est bon ! 🎉

## 🎉 Résumé ultra-simple

1. **Compte Docker Hub** = Gratuit sur hub.docker.com
2. **Token** = Clé d'accès à créer dans les paramètres Docker Hub
3. **2 secrets GitHub** = `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN`
4. **Ça marche tout seul** = À chaque push, les images sont publiées automatiquement !

C'est comme avoir un robot qui emballe et publie ton application automatiquement à chaque fois que tu fais un changement ! 🤖📦
