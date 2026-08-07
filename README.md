# PlanMyAttractions (*Django trip planner*)

PlanMyAttractions est une application développée avec **Django REST Framework** et **React** permettant de découvrir des attractions touristiques à partir de l'API **TripAdvisor**.

L'utilisateur choisit un **profil** (Local, Touriste ou Professionnel) ainsi qu'un **pays**, puis peut explorer des attractions, effectuer des recherches et créer une compilation personnalisée de son voyage.

## Architecture

Le projet est composé de deux parties :

```
backend/
    users/
    attractions/
    compilation/

frontend/
```

## Lancer l'application

**Environnement Python**
```powershell
python -m venv django_trip_planner_proj_env
.\django_trip_planner_proj_env\Scripts\Activate.ps1 # Windows
pip install -r requirements.txt
```

### Backend

```powershell
cd findmyattractions_backend
python manage.py migrate
python manage.py import_batch --limit 4   # à faire une fois, pour peupler la base
python manage.py runserver
```

Ouvre `http://localhost:8000/admin` pour accéder à l'espace administration du serveur Django.

Nécessite un `.env` complet (voir `.env.example`) : `TRIPADVISOR_API_KEY`, `SECRET_KEY`, `BASE_URL_TRIPADVISOR_API`.

### Frontend

```powershell
cd findmyattractions_frontend
npm install
npm run dev
```

Ouvre `http://localhost:3000` (port fixé dans `vite.config.js` pour matcher `CORS_ALLOWED_ORIGINS` côté Django — les deux serveurs doivent tourner en même temps).

## Import automatique par pays (choix utilisateur)

À la sélection d'un pays sur la Landing page ("Commencer l'exploration"), le backend (`CreateUserProfileAPIView`, `users/views.py`) vérifie si des attractions existent déjà en base pour ce pays :

- **Premier utilisateur à choisir ce pays** : aucune donnée en base → un appel à l'API TripAdvisor est déclenché (`attractions/services/tripadvisor_import.py`) pour l'importer.
- **Reconnexion avec le même pays** (après déconnexion) : des attractions existent déjà → aucun nouvel appel API, les données déjà persistées en SQLite sont réutilisées directement.

Le tri par popularité des carrousels ne se base pas sur un nombre de "likes" (ce concept n'existe pas dans l'API TripAdvisor) mais sur la **note** (critère principal, trié nativement par l'API) puis, à note égale, sur le **nombre d'avis** (départage fait côté backend, l'API ne proposant pas ce critère de tri).

**Limite connue de l'API TripAdvisor (`/locations/search`)** : le paramètre `query` de cet endpoint n'est pas un moyen de "parcourir" une zone géographique, c'est une recherche **par nom** (la doc officielle le décrit comme "a textual query, for example a business name or street address"). `country_code`/`geo_name` ne font que restreindre cette recherche par nom à une zone, ils ne remplacent pas le besoin d'un vrai nom à chercher. Concrètement, une recherche avec `query="France"` cherche des lieux dont le **nom** contient "France" (un restaurant qui s'appellerait "Chez France", par exemple), pas "les attractions populaires situées en France". C'est pour cette raison que l'import n'utilise plus cet endpoint pour couvrir un pays, et se base sur `/locations/nearby` à la place (voir plus bas).

**Limite connue de l'API TripAdvisor (`/locations/nearby`)** : il n'existe pas non plus de véritable recherche par pays côté API. `/locations/nearby` est conçu pour chercher des activités/lieux à proximité d'un point donné (une recherche de type "autour de moi"), pas pour parcourir un pays entier — sa zone de recherche est d'ailleurs plafonnée à 50 km². Le "pays" n'est donc jamais un vrai critère de recherche côté TripAdvisor : c'est uniquement une conséquence du point géographique (bounding box) qu'on choisit nous-mêmes. L'import interroge donc plusieurs bounding box codées en dur, centrées sur les grandes villes de chaque pays couvert par la démo, plutôt qu'une vraie couverture géographique du pays entier.
