# BobApp - Application de Blagues avec CI/CD

BobApp est une application web qui permet aux utilisateurs de lire et partager des blagues du jour.

## 🚀 Pipeline CI/CD Mis en Place

Notre pipeline CI/CD automatisé permet de :
- ✅ Valider les tests unitaires sur chaque pull request
- 🔍 Analyser la qualité du code avec SonarQube
- 📦 Générer automatiquement les rapports de couverture
- 🐳 Déployer les conteneurs sur Docker Hub

### Workflow CI/CD

```
Développeur
    ├── Modifie back/ ou front/
    ├── Push → déclenche CI
    ├── CI + SonarQube réussissent
    ├── Crée PR vers main
    ├── Required checks passent
    └── PR mergée → Docker deploy
```

## 🛠 Technologies

- **Backend** : Spring Boot (Java 11)
- **Frontend** : Angular
- **CI/CD** : GitHub Actions
- **Qualité** : SonarCloud
- **Conteneurs** : Docker Hub

## ▶️ Installation et Lancement Local

### Front-end 

Aller dans le dossier front :
```bash
cd front
```

Installer les dépendances :
```bash
npm install
```

Lancer l'application :
```bash
npm run start
```

### Back-end

Aller dans le dossier back :
```bash
cd back
```

Installer les dépendances :
```bash
mvn clean install
```

Lancer le backend :
```bash
mvn spring-boot:run
```

Lancer les tests :
```bash
mvn clean test
```

## 🐳 Docker

### Frontend
```bash
# Build
docker build -t bobapp-frontend .

# Run
docker run -p 80:80 --name bobapp-frontend -d bobapp-frontend
```

### Backend
```bash
# Build
docker build -t bobapp-backend .

# Run
docker run -p 8080:8080 --name bobapp-backend -d bobapp-backend
```

## 🤝 Contribution

Le projet suit une approche CI/CD stricte :
1. Travailler sur une branche feature
2. Push pour déclencher les tests automatiques
3. Créer une PR vers main après succès des tests
4. La PR est mergée seulement si tous les checks passent

## 📞 Support

Pour tout problème technique ou question, merci de créer une issue sur GitHub.
