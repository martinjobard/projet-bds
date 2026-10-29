# 🏆 BDS TELECOM Nancy - Plateforme Web du Bureau des Sports

Plateforme web complète et moderne pour le Bureau des Sports (BDS) de **TELECOM Nancy**, conçue pour faciliter le développement de l'association, la vie sportive étudiante et l'administration quotidienne.

---

## ⚡ Fonctionnalités Clés

1. **📦 Gestion des Emprunts de Matériel**
   - Catalogue de matériel sportif (ballons de volley, basket, foot, chasubles, raquettes de badminton, tables de ping-pong, sifflets, pompes...).
   - Affichage du **prix de rachat en cas de perte ou dégradation** pour chaque équipement (à la place de caution).
   - Formulaire de réservation rapide réservé aux étudiants TELECOM Nancy avec **validation obligatoire de l'adresse `@telecomnancy.net`**.
   - Espace étudiant permettant de suivre l'avancement de ses demandes (En attente, Validé, Restitué).
   - Validation en 1 clic par le bureau avec ajustement automatique des stocks.

2. **🏐 Matchs Universitaires FFSU & Équipes TELECOM Nancy**
   - **2 catégories distinctes** : Sports **Collectifs** et Sports **Individuels**.
   - **Genres officiels** : **Mixte** et **Féminin** (conformément au règlement FFSU).
   - **Onglet dédié "Nos Équipes TELECOM Nancy"** : présentation de l'ensemble de nos équipes (**Volley 1**, **Volley 2**, **Volley 3**, **Volley F**, **Basket 1**, **Basket F**, **Foot 1**, **Rugby**, **Handball**, **Badminton Indiv**...).
   - **Fiche équipe & historique des rencontres** : calendrier complet des matchs passés et à venir, scores et victoires pour chaque équipe.
   - Calendrier global avec filtres par sport, type (collectif/individuel), genre (mixte/féminin) et équipe.

3. **🥇 Palmarès des Tournois Inter-Écoles (TOSS, Coupe de l'X...)**
   - Fiches récapitulatives des grands tournois étudiants (TOSS à CentraleSupélec, Coupe de l'X...).
   - Classement général de l'école et médailles par sport (Or 🥇, Argent 🥈, Bronze 🥉).
   - Résumés des matchs et parcours des délégations TELECOM Nancy.

4. **🏃 Agenda des Événements Sportifs à Nancy**
   - Calendrier des grandes courses et fêtes étudiantes nancéiennes : **Blablarun**, **24 Heures de Stan**, **Semi-Marathon du Grand Nancy**, **Nuit du Volley SUAPS**...
   - Tarifs négociés BDS et liens d'inscription directs.

5. **🛡️ Espace Administrateur Bureau BDS (Back-Office Ultra Ergonomique)**
   - Accès protégé par mot de passe bureau partagé (`bds2026` par défaut).
   - Tableau de bord avec indicateurs clés (demandes en attente, matériels empruntés, équipes enregistrées, prochains matchs).
   - Gestion CRUD intégrale sans toucher au code :
     - Validation / Rejet / Restitution des emprunts de matériel
     - Ajout, modification et suppression d'équipements sportifs avec prix de rachat
     - Gestion des équipes TELECOM Nancy (création, capitaines, descriptions)
     - Programmation de matchs et saisie des scores FFSU
     - Création de tournois et ajout de résultats médaillés
     - Ajout et mise à jour des événements à Nancy

---

## 🎨 Personnalisation du Thème & du Logo

Dès que vous aurez votre logo et vos couleurs d'école :

1. **Logo** : Déposez votre image dans `frontend/public/` (ex: `logo.png`).
2. **Couleurs de l'école** : Ouvrez `frontend/src/index.css` et modifiez les deux variables en haut du fichier :
   ```css
   :root {
     --primary-hue: 224; /* Teinte principale (bleu, vert, rouge...) */
     --accent-hue: 24;   /* Teinte d'accentuation (orange, jaune, rose...) */
   }
   ```
   Tout le site s'adaptera instantanément avec dégradés, lueurs et badges harmonisés.

---

## 🚀 Démarrage Rapide

### Lancer toute l'application (script 1 clic)
```bash
./start.sh
```

### Ou lancer séparément :
- **Backend FastAPI** :
  ```bash
  cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
  ```
- **Frontend React (Vite)** :
  ```bash
  cd frontend && npm run dev
  ```
- Application Web : [http://localhost:5173](http://localhost:5173)
- API Swagger interactive : [http://localhost:8000/docs](http://localhost:8000/docs)
- Mot de passe Bureau BDS : **`bds2026`**
