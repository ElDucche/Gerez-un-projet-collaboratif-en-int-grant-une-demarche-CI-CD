# 🔧 Guide de Dépannage SonarQube

## Erreur : "Could not find a default branch for project with key 'bobapp'"

### 🔍 Diagnostic

Cette erreur se produit lorsque :
- Le projet `bobapp` n'existe pas encore sur SonarCloud
- Le projet existe mais n'a jamais été analysé (pas de branche par défaut)
- L'organisation ou la clé de projet ne correspondent pas

### ✅ Solution 1 : Créer le projet manuellement (RECOMMANDÉ)

#### Étape 1 : Vérifier votre organisation SonarCloud

1. Allez sur https://sonarcloud.io
2. Connectez-vous avec GitHub
3. Cliquez sur votre profil (en haut à droite) → "My Organizations"
4. **Notez le nom exact de votre organisation** (ex: `guillaume-leduc`, `elducche`, etc.)

#### Étape 2 : Créer le projet

**Option A - Import depuis GitHub (plus simple)** :

1. Sur SonarCloud, cliquez sur "+" → "Analyze new project"
2. Sélectionnez "Import from GitHub"
3. Autorisez SonarCloud à accéder à votre repository
4. Sélectionnez `Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`
5. Cliquez sur "Set Up"
6. SonarCloud créera automatiquement le projet avec :
   - Project Key : généré automatiquement
   - Display Name : nom du repository

**Option B - Création manuelle** :

1. Sur SonarCloud, cliquez sur "+" → "Create new project"
2. Choisissez "Manually"
3. Remplissez :
   - Organization : `guillaume-leduc` (ou votre organisation)
   - Project key : `bobapp`
   - Display name : `BobApp`
4. Cliquez sur "Set Up"

#### Étape 3 : Mettre à jour la configuration

Si votre organisation SonarCloud n'est pas `guillaume-leduc`, vous devez modifier :

1. **Dans `sonar-project.properties`** (racine du projet) :
   ```properties
   # Remplacez par votre organisation
   sonar.organization=VOTRE-ORGANISATION
   ```

2. **Dans `.github/workflows/ci-cd.yml`** (ligne ~218) :
   ```yaml
   sonar-scanner \
     -Dsonar.projectKey=bobapp \
     -Dsonar.organization=VOTRE-ORGANISATION \  # <-- Changez ici
     -Dsonar.projectName=BobApp \
   ```

#### Étape 4 : Si vous avez importé depuis GitHub

Le Project Key généré automatiquement ressemble à `ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`.

Vous devez alors modifier :

1. **Dans `.github/workflows/ci-cd.yml`** :
   ```yaml
   sonar-scanner \
     -Dsonar.projectKey=ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD \
     -Dsonar.organization=VOTRE-ORGANISATION \
   ```

2. **Dans `sonar-project.properties`** :
   ```properties
   sonar.projectKey=ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD
   sonar.organization=VOTRE-ORGANISATION
   ```

### ✅ Solution 2 : Vérifier le token

Si le projet existe mais l'erreur persiste :

1. **Vérifiez que le token est correct** :
   - GitHub → Settings → Secrets → Actions
   - Vérifiez que `SONARQUBE_TOKEN` existe et n'a pas expiré

2. **Générez un nouveau token** :
   - SonarCloud → My Account → Security → Generate Token
   - Type : "Global Analysis Token" ou "Project Analysis Token"
   - Copiez et remplacez dans GitHub Secrets

3. **Vérifiez les permissions** :
   - Le token doit avoir les permissions "Execute Analysis"

### ✅ Solution 3 : Vérifier la configuration du projet

1. **Comparez les configurations** :

   Dans `sonar-project.properties` :
   ```properties
   sonar.projectKey=bobapp
   sonar.organization=guillaume-leduc
   ```

   Dans le workflow GitHub Actions :
   ```yaml
   -Dsonar.projectKey=bobapp \
   -Dsonar.organization=guillaume-leduc \
   ```

   Sur SonarCloud (page du projet → Project Information) :
   - Project Key : `bobapp`
   - Organization : `guillaume-leduc`

2. **Les trois doivent correspondre EXACTEMENT** (sensible à la casse)

### 🔍 Vérification finale

Avant de relancer la pipeline :

- [ ] Le projet existe sur SonarCloud
- [ ] L'organisation correspond dans tous les fichiers
- [ ] La clé de projet correspond dans tous les fichiers
- [ ] Le token `SONARQUBE_TOKEN` est configuré dans GitHub
- [ ] Le token n'a pas expiré

### 🚀 Relancer l'analyse

Une fois tout configuré :

```bash
git add .
git commit -m "Fix SonarQube configuration"
git push origin main
```

Puis vérifiez dans GitHub Actions que le job `analyse-sonarqube` passe ✅

---

## Autres erreurs courantes

### Erreur : "Organization key 'xxx' does not exist"

**Solution** : Votre organisation n'existe pas ou le nom est incorrect
- Vérifiez sur SonarCloud → My Organizations
- Mettez à jour `sonar.organization` partout

### Erreur : "Insufficient privileges"

**Solution** : Votre token n'a pas les bonnes permissions
- Générez un nouveau token avec "Execute Analysis"
- Mettez à jour `SONARQUBE_TOKEN` dans GitHub Secrets

### Erreur : "Project key already exists"

**Solution** : Le projet existe déjà
- Utilisez la clé existante
- OU supprimez le projet sur SonarCloud et recréez-le

---

## 📚 Ressources

- [Documentation SonarCloud](https://docs.sonarcloud.io/)
- [Configurer un projet SonarCloud](https://docs.sonarcloud.io/getting-started/github/)
- [Tokens SonarCloud](https://docs.sonarcloud.io/advanced-setup/user-accounts/)
