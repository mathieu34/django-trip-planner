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
