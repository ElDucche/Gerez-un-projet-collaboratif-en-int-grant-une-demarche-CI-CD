# Instructions pour l'Agent IA - Projet BobApp CI/CD

## Contexte du Projet

Ce projet est un workflow CI/CD pour l'application BobApp d'OpenClassrooms. L'application se compose de :
- **Backend** : Spring Boot (Java 11) dans le dossier `back/`
- **Frontend** : Angular dans le dossier `front/`

## Objectif Principal

Mettre en place un workflow CI/CD complet avec GitHub Actions qui :
1. Valide les tests sur les pull requests
2. Lance les tests et vérifie la qualité du code
3. Génère automatiquement les rapports de couverture
4. Déploie les conteneurs sur Docker Hub

## Architecture du Workflow CI/CD

### Règles de Branches

- **La branche `main` est protégée** : aucun push direct autorisé
- Les contributeurs doivent travailler sur des branches séparées
- Les modifications doivent passer par des Pull Requests

### Pipelines et Déclencheurs

| Pipeline | Déclencheur | Condition |
|----------|-------------|-----------|
| `backend-ci.yml` | Push sur branches (sauf main) | Si `back/**` modifié |
| `frontend-ci.yml` | Push sur branches (sauf main) | Si `front/**` modifié |
| `sonar-analysis.yml` | Après succès de backend-ci OU frontend-ci | workflow_run completed |
| `docker-deploy.yml` | PR mergée sur main | pull_request closed + merged |

### Flux de Travail Standard

```
1. Contributeur crée une branche feature
2. Contributeur modifie back/ → déclenche backend-ci
3. Contributeur modifie front/ → déclenche frontend-ci
4. Si CI réussit → SonarQube analyse le code
5. Contributeur crée une PR vers main
6. PR validée et mergée → docker-deploy build et push sur Docker Hub
```

## Technologies et Outils

### Backend
- Java 11
- Maven
- JaCoCo pour la couverture de code
- Spring Boot

### Frontend
- Node.js 16
- Angular
- Karma pour les tests
- npm pour la gestion des dépendances

### Qualité du Code
- SonarCloud (https://sonarcloud.io)
- Organisation: `elducche`
- Project Key: `ElDucche_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`

### Déploiement
- Docker Hub
- Image combinée (multi-stage build)
- Nginx comme reverse proxy

## KPIs et Quality Gates

Les KPIs à respecter (configurés dans SonarCloud) :
1. **Couverture de code minimale** : seuil à définir
2. **New Blocker Issues** : 0 (aucun nouveau bug bloquant)
3. Autres métriques SonarCloud selon les quality gates

## Secrets GitHub à Configurer

| Secret | Description |
|--------|-------------|
| `SONAR_TOKEN` | Token d'authentification SonarCloud |
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Token d'accès Docker Hub |

## Points de Vigilance

1. **Ne jamais pusher directement sur main** - utiliser des PR
2. **Les tests doivent passer** avant de merger une PR
3. **L'analyse SonarQube doit réussir** pour valider la qualité
4. **Générer les rapports de couverture** pour front ET back
5. **Le déploiement Docker ne se fait QUE si la PR est mergée**

## Structure des Fichiers Importants

```
.github/workflows/
├── backend-ci.yml      # CI pour le backend Java/Spring
├── frontend-ci.yml     # CI pour le frontend Angular
├── sonar-analysis.yml  # Analyse qualité SonarCloud
└── docker-deploy.yml   # Build et push Docker Hub

back/
├── pom.xml             # Configuration Maven + JaCoCo
├── Dockerfile          # Image Docker backend
└── src/                # Code source Java

front/
├── package.json        # Dépendances npm
├── karma.conf.js       # Configuration tests
├── Dockerfile          # Image Docker frontend
└── src/                # Code source Angular

Dockerfile              # Image combinée (racine)
sonar-project.properties # Configuration SonarQube
```

## Commandes Utiles

### Backend
```bash
cd back
mvn clean test                  # Lancer les tests
mvn clean verify               # Tests + couverture JaCoCo
mvn package -DskipTests        # Build du JAR
```

### Frontend
```bash
cd front
npm ci                         # Installer les dépendances
npm test -- --no-watch --code-coverage --browsers=ChromeHeadless
npm run build                  # Build de production
```

### Docker
```bash
docker build -t bobapp .
docker run -p 80:80 -p 8080:8080 bobapp
```

## Livrables Attendus

1. Workflow CI/CD fonctionnel sur GitHub Actions
2. Tests automatisés avec rapports de couverture
3. Analyse SonarCloud configurée
4. Images Docker sur Docker Hub
5. Document explicatif avec :
   - Description des étapes du workflow
   - KPIs proposés
   - Analyse des métriques
   - Analyse des retours utilisateurs (Notes et avis)
