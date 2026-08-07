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

**Limite connue de l'API TripAdvisor (`/locations/search`)** : le paramètre `query` de cet endpoint n'est pas un moyen de "parcourir" une zone géographique, c'est une recherche **par nom** (la doc officielle le décrit comme "a textual query, for example a business name or street address"). `country_code`/`geo_name` ne font que restreindre cette recherche par nom à une zone, ils ne remplacent pas le besoin d'un vrai nom à chercher. Une recherche avec `query="France"` chercherait des lieux dont le **nom** contient "France" (un restaurant qui s'appellerait "Chez France", par exemple), pas "les attractions populaires situées en France" — ça ne fonctionne donc que si `query` est un vrai nom de lieu (une ville, par exemple), jamais un nom de pays.

**Limite connue de l'API TripAdvisor (`/locations/nearby`)** : une alternative envisagée un temps pour contourner cette limite. Il n'existe pas non plus de véritable recherche par pays sur cet endpoint : il est conçu pour chercher des activités/lieux à proximité d'un point donné (une recherche de type "autour de moi"), pas pour parcourir un pays entier, et sa zone de recherche est plafonnée à 50 km² (impossible de couvrir un pays entier en un seul appel). Abandonné au profit de `/locations/search`, plus simple et déjà éprouvé, une fois le vrai problème identifié (voir juste en dessous).

**Solution retenue : GeoNames pour la liste des villes.** Puisque `/locations/search` a besoin d'un vrai nom de lieu et que TripAdvisor n'offre aucun moyen de connaître "les grandes villes d'un pays", l'import interroge d'abord l'API externe **GeoNames** (`_geonames_cities` dans `tripadvisor_import.py`) pour obtenir les villes les plus peuplées du pays choisi, puis relance une recherche `/locations/search?query=<ville>` pour chacune. GeoNames est gratuite (compte + activation "Free Web Service" nécessaires, voir `GEONAMES_USERNAME` dans `.env.example`) et couvre les pays du monde entier, ce qui permet à l'import de fonctionner pour n'importe quel pays du sélecteur plutôt qu'une poignée codée en dur.

**Constantes volontairement basses en l'état** (`TOP_N`, `CANDIDATES_SIZE`, `CITIES_PER_COUNTRY` dans `tripadvisor_import.py`) : réglées à des valeurs faibles pour limiter le nombre de requêtes envoyées à TripAdvisor et GeoNames pendant les tests/le développement (chaque import synchrone peut vite représenter plusieurs dizaines d'appels, multipliés par le nombre de villes). À ajuster à la hausse selon les besoins réels (démo, production) une fois le comportement validé.
