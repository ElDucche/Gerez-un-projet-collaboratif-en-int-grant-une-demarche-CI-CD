# Protection de la Branche Principale

## 📋 Règles de Protection Activées

La branche `main` est maintenant **protégée** pour garantir la qualité du code et l'intégrité de la pipeline CI/CD.

### ✅ Règles Obligatoires

1. **Pull Request Obligatoire**
   - ❌ Push direct interdit sur `main`
   - ✅ Toutes les modifications doivent passer par une Pull Request

2. **Revue de Code Requise**
   - Minimum **1 approbation** requise
   - Les anciennes approbations sont invalidées si nouveaux commits

3. **CI/CD Obligatoire**
   
   Les 3 workflows suivants doivent **PASSER** avant merge:
   - ✅ **Backend CI** - Tests backend + couverture
   - ✅ **Frontend CI** - Tests frontend + build
   - ✅ **SonarQube Analysis** - Analyse qualité du code

4. **Protection Stricte**
   - ❌ Force push interdit
   - ❌ Suppression de la branche interdite
   - ✅ Appliqué même aux administrateurs

## 🔄 Workflow de Contribution

### 1. Créer une Branche

\`\`\`bash
git checkout -b feature/ma-nouvelle-fonctionnalite
\`\`\`

### 2. Développer et Committer

\`\`\`bash
# Faire vos modifications
git add .
git commit -m "feat: ajouter ma nouvelle fonctionnalité"
\`\`\`

### 3. Pousser la Branche

\`\`\`bash
git push origin feature/ma-nouvelle-fonctionnalite
\`\`\`

### 4. Créer une Pull Request

\`\`\`bash
gh pr create --title "feat: ma nouvelle fonctionnalité" --body "Description..."
\`\`\`

Ou via l'interface GitHub: https://github.com/ElDucche/Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD/pulls

### 5. Attendre la Validation

La PR sera mergeable uniquement si:

- ✅ Backend CI passe (si fichiers `back/**` modifiés)
- ✅ Frontend CI passe (si fichiers `front/**` modifiés)  
- ✅ SonarQube Analysis passe
- ✅ 1 approbation reçue

### 6. Merger

Une fois tous les checks verts et l'approbation reçue:

\`\`\`bash
gh pr merge <numero> --merge
\`\`\`

Ou via le bouton "Merge" sur GitHub.

### 7. Déploiement Automatique

Après le merge, le workflow **Docker Build & Push** se déclenche automatiquement:
- ✅ Build de l'image Docker
- ✅ Smoke tests (60s)
- ✅ Publication sur Docker Hub (si tests OK)

## 🚫 Ce Qui Est Interdit

\`\`\`bash
# ❌ Push direct sur main
git push origin main
# Erreur: Protected branch update failed

# ❌ Force push
git push --force origin main
# Erreur: Protected branch hook declined

# ❌ Suppression de la branche
git push origin --delete main
# Erreur: Protected branch cannot be deleted
\`\`\`

## 🔧 Configuration Technique

Les règles sont configurées via l'API GitHub:

\`\`\`json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Backend CI",
      "Frontend CI",
      "SonarQube Analysis"
    ]
  },
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "enforce_admins": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
\`\`\`

## 📊 Avantages

✅ **Qualité Garantie** - Tous les commits passent par la CI/CD  
✅ **Revue Systématique** - Chaque changement est revu  
✅ **Historique Propre** - Pas de force push accidentel  
✅ **Déploiement Sûr** - Smoke tests avant Docker Hub  
✅ **Traçabilité** - Toutes les modifications via PR

## 🆘 Contourner les Protections (Admin uniquement)

En cas d'urgence, les administrateurs peuvent temporairement désactiver les protections:

\`\`\`bash
# Désactiver
gh api -X DELETE repos/:owner/:repo/branches/main/protection

# Réactiver
gh api -X PUT repos/:owner/:repo/branches/main/protection --input branch-protection.json
\`\`\`

⚠️ **À utiliser avec précaution!**

## 📚 Références

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Pull Request Reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)

---

**Date de configuration:** Novembre 2025  
**Maintenu par:** Équipe DevOps
