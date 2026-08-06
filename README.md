# PlanMyAttractions (*Django trip planner*)

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

Nécessite un `.env` complet (voir `.env.example`) : `TRIPADVISOR_API_KEY`, `SECRET_KEY`, `BASE_URL_TRIPADVISOR_API`.

### Frontend

```powershell
cd findmyattractions_frontend
npm install
npm run dev
```

Ouvre `http://localhost:3000` (port fixé dans `vite.config.js` pour matcher `CORS_ALLOWED_ORIGINS` côté Django — les deux serveurs doivent tourner en même temps).
