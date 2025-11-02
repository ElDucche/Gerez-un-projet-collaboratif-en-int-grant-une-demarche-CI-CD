# SonarQube expliqué simplement 🎓

## 🤔 C'est quoi SonarQube ?

Imagine que ton code, c'est comme ta chambre :
- Parfois il y a des jouets qui traînent (bugs)
- Parfois il y a des choses cassées (erreurs)
- Parfois c'est en désordre (code mal écrit)

**SonarQube, c'est comme un inspecteur qui vient vérifier ta chambre** et te dit :
- ✅ "Bravo, c'est bien rangé !"
- ⚠️ "Attention, il y a 3 jouets qui traînent"
- ❌ "Il y a quelque chose de cassé, il faut le réparer"

## 🏗️ Comment ça fonctionne dans notre projet ?

### Étape 1 : Tu écris du code 💻
Tu crées ou modifies du code pour l'application BobApp (le back-end en Java ou le front-end en Angular).

### Étape 2 : Tu envoies ton code sur GitHub 📤
Quand tu fais un `git push`, ton code part sur GitHub.

### Étape 3 : GitHub Actions démarre automatiquement 🤖
GitHub dit : "Oh ! Il y a du nouveau code, je vais le vérifier !"

### Étape 4 : Les tests s'exécutent d'abord 🧪
Avant de vérifier la qualité, on lance tous les tests pour voir si le code fonctionne bien.

### Étape 5 : SonarQube analyse ton code 🔍
C'est là que la magie opère ! SonarQube regarde ton code et cherche :
- 🐛 **Des bugs** : des erreurs qui peuvent faire planter l'application
- 🔒 **Des failles de sécurité** : des portes ouvertes pour les méchants hackers
- 💩 **Du code "sale"** : du code difficile à comprendre ou mal écrit
- 📊 **La couverture de tests** : est-ce que tu as testé ton code ?

### Étape 6 : SonarQube donne une note 📝
À la fin, SonarQube dit :
- "Ton code est super ! Quality Gate : PASSED ✅"
- OU "Ton code a des problèmes. Quality Gate : FAILED ❌"

## 🌐 SonarQube Cloud - Comment ça marche ?

### C'est quoi SonarQube Cloud ?
Au lieu d'installer SonarQube sur ton ordinateur, SonarQube Cloud est **sur Internet**, comme Gmail ou Netflix. C'est plus simple parce que tu n'as rien à installer !

### L'URL du serveur SonarQube Cloud
**Bonne nouvelle : c'est toujours la même !**

Pour SonarQube Cloud, l'URL est **TOUJOURS** :
```
https://sonarcloud.io
```

C'est comme l'adresse d'un site web. C'est là que SonarQube Cloud habite sur Internet !

## 🔑 Ce que tu dois faire pour que ça marche

### 1️⃣ Créer un compte sur SonarCloud (si pas déjà fait)
- Va sur https://sonarcloud.io
- Clique sur "Log in"
- Connecte-toi avec ton compte GitHub

### 2️⃣ Créer un projet sur SonarCloud
1. Une fois connecté, clique sur le bouton **"+"** ou **"Analyze new project"**
2. Choisis ton repository GitHub (celui avec BobApp)
3. SonarCloud va automatiquement générer :
   - Une **clé de projet** basée sur ton repository (ex: `ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`)
   - Une **organisation** basée sur ton compte GitHub (ex: `elducche` en minuscules)
4. **IMPORTANT** : Note bien ces deux valeurs ! Tu devras les utiliser dans la configuration du workflow

### 3️⃣ Obtenir ton Token (ta clé secrète)
Un token, c'est comme une **clé magique** qui permet à GitHub de parler à SonarCloud.

**Comment l'obtenir :**
1. Sur SonarCloud, va dans ton profil (en haut à droite)
2. Clique sur **"My Account"**
3. Clique sur l'onglet **"Security"**
4. Dans la section **"Generate Tokens"** :
   - Donne un nom à ton token (exemple : "GitHub Actions")
   - Choisis le type : **"Global Analysis Token"** ou **"User Token"**
   - Choisis une expiration (par exemple : 90 jours ou "No expiration" pour qu'il ne expire jamais)
   - Clique sur **"Generate"**
5. **IMPORTANT** : Copie ce token tout de suite ! Il ne s'affichera qu'une seule fois !

Ton token ressemble à ça : `sqp_1234567890abcdefghijklmnopqrstuvwxyz`

### 4️⃣ Mettre le Token dans GitHub
Maintenant, il faut donner cette clé magique à GitHub :

1. Va sur ton repository GitHub
2. Clique sur **"Settings"** (en haut)
3. Dans le menu de gauche, clique sur **"Secrets and variables"** → **"Actions"**
4. Clique sur **"New repository secret"**
5. Remplis :
   - **Name** : `SONAR_TOKEN` (⚠️ Attention au nom exact !)
   - **Value** : colle ton token SonarCloud
6. Clique sur **"Add secret"**

### 5️⃣ Vérifier la configuration dans le code
L'URL de SonarCloud (`https://sonarcloud.io`) est déjà configurée, mais tu dois vérifier que ton organisation et la clé du projet correspondent à celles générées par SonarCloud :

**Dans `back/pom.xml`** :
```xml
<properties>
    <sonar.organization>elducche</sonar.organization>
    <sonar.host.url>https://sonarcloud.io</sonar.host.url>
</properties>
```

**Dans `.github/workflows/ci-cd.yml`** :
- Ligne ~193 : `-Dsonar.projectKey=ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`
- Ligne ~207 : `-Dsonar.organization=elducche`

Si ces valeurs ne correspondent pas à celles de ton projet SonarCloud, modifie-les !

## ✅ C'est tout ! Maintenant ça marche automatiquement

Quand tu fais un `git push`, voici ce qui se passe :

```
Tu push ton code
       ↓
GitHub Actions démarre
       ↓
Tests du back-end ✅
       ↓
Tests du front-end ✅
       ↓
SonarQube analyse le code 🔍
       ↓
SonarQube envoie les résultats sur SonarCloud.io
       ↓
Tu peux voir les résultats sur le site SonarCloud !
```

## 📱 Comment voir les résultats ?

1. Va sur https://sonarcloud.io
2. Connecte-toi
3. Clique sur ton projet **"bobapp"**
4. Tu verras un tableau de bord avec :
   - 🐛 Le nombre de bugs
   - 🔒 Les vulnérabilités
   - 💩 Les "code smells" (mauvaises pratiques)
   - 📊 La couverture de tests
   - ⭐ Une note globale (A, B, C, D, E)

## 🎯 Ce qui est dans notre configuration

### Le fichier `sonar-project.properties`
C'est comme une **liste de courses** pour SonarQube. On lui dit :
- "Regarde le dossier `back` pour le code Java"
- "Regarde le dossier `front` pour le code TypeScript"
- "Ignore les dossiers `node_modules` et `target` (ce sont juste des outils)"

### Le workflow GitHub Actions
C'est comme une **recette de cuisine**. On dit à GitHub :
1. Prends le code
2. Lance les tests
3. Télécharge l'outil SonarScanner
4. Envoie le code à SonarCloud pour analyse
5. Attends le résultat

## ❓ Questions fréquentes

### "Je n'ai pas de token SONARQUBE_TOKEN dans mes variables d'environnement"
Pas de souci ! Tu dois le créer sur SonarCloud (étape 3️⃣ ci-dessus) puis le mettre dans GitHub (étape 4️⃣).

### "Ça ne marche pas, j'ai une erreur"
Vérifie que :
- ✅ Ton token est bien valide (pas expiré)
- ✅ Tu as créé le projet sur SonarCloud en important ton repository GitHub
- ✅ La clé du projet dans le workflow correspond à celle générée par SonarCloud
- ✅ Ton organisation dans le workflow correspond à celle de SonarCloud (en minuscules)
- ✅ Le secret `SONAR_TOKEN` (pas `SONARQUBE_TOKEN` !) est bien configuré dans GitHub
- ✅ Le secret est configuré au niveau du **repository** (pas dans un environnement)

### "C'est quoi la différence entre SonarQube et SonarCloud ?"
- **SonarQube** = Version que tu installes sur ton ordinateur ou un serveur
- **SonarCloud** = Version en ligne, sur Internet (plus simple !)

C'est comme la différence entre installer Word sur ton PC ou utiliser Google Docs !

### "Est-ce que c'est gratuit ?"
SonarCloud est **gratuit pour les projets publics** sur GitHub ! Si ton repository est privé, il faut payer.

## 🎉 Résumé super simple

1. **SonarCloud.io** = Le site web où SonarQube analyse ton code
2. **Organisation** = `guillaume-leduc` (déjà configuré dans le workflow)
3. **URL** = `https://sonarcloud.io` (déjà configuré dans le workflow)
4. **Token** = Ta clé secrète (à créer sur SonarCloud et mettre dans GitHub avec le nom `SONARQUBE_TOKEN`)
5. **Ça marche tout seul** = Plus besoin de faire quoi que ce soit après avoir ajouté le token !

Chaque fois que tu push du code, SonarQube vérifie si c'est du bon code ou s'il y a des problèmes à corriger. C'est comme avoir un prof qui corrige ton devoir automatiquement ! 📚✨

---

## 📝 Liste de contrôle rapide

Pour être sûr que tout est bien configuré, vérifie ces 5 choses :

- [ ] J'ai un compte sur SonarCloud.io connecté à mon GitHub
- [ ] J'ai créé le projet sur SonarCloud en important mon repository GitHub
- [ ] J'ai noté la clé du projet et l'organisation générées par SonarCloud
- [ ] J'ai généré un token sur SonarCloud et copié quelque part
- [ ] J'ai ajouté le secret `SONAR_TOKEN` dans GitHub Settings → Secrets and variables → Actions (au niveau repository)
- [ ] J'ai vérifié que les valeurs dans `pom.xml` et le workflow correspondent à celles de SonarCloud

Si tu as coché les 6 cases, c'est bon ! 🎉

## 🐛 Problèmes courants résolus

### Erreur : "invalid tag format" lors du build Docker
**Symptôme** : Le job Docker échoue avec un message comme `invalid tag "***/bobapp-backend:-7751cec"`

**Cause** : La configuration des tags Docker utilisait une syntaxe incompatible (`prefix={{branch}}-`)

**Solution** : Dans `.github/workflows/ci-cd.yml`, les tags ont été corrigés :
```yaml
tags: |
  type=ref,event=branch
  type=sha
  type=raw,value=latest,enable={{is_default_branch}}
```
(Suppression du préfixe `{{branch}}-` qui causait l'erreur)

### Erreur : HTTP 401 avec SonarCloud
**Symptôme** : Le job SonarQube échoue avec "Error 401 on https://sonarcloud.io"

**Causes possibles** :
1. Le secret est nommé `SONARQUBE_TOKEN` au lieu de `SONAR_TOKEN`
2. Le token a expiré
3. Le secret est configuré dans un environnement au lieu du repository

**Solution** :
- Vérifier que le secret s'appelle exactement `SONAR_TOKEN`
- Vérifier que le secret est au niveau **repository** (Settings → Secrets and variables → Actions → Repository secrets)
- Générer un nouveau token si besoin
