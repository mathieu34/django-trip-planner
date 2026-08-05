# App `attractions`

Gère les données Attraction/Catégorie/Photo, ainsi que les pages Accueil, Recherche et Page attraction.

## Fait jusqu'à présent

- Modèles définis dans `models.py` :
  - `Category` (name, group: restaurant/hotel/attraction)
  - `Attraction` (infos générales, contact, géo, prix, horaires, champs conditionnels selon le type, note/reviews, awards, likes)
  - `Photo` (liée à une Attraction via ForeignKey, stocke une URL)
- App enregistrée dans `INSTALLED_APPS` (`settings.py`)
- Migrations générées et appliquées (`0001_initial.py`)

## À faire

- Enregistrer les modèles dans `admin.py` pour pouvoir ajouter des données de test
- Créer un superuser pour accéder à `/admin/`
- `serializers.py` (DRF) pour exposer les modèles en API JSON
- `views.py` + `urls.py` pour les pages Accueil et Page attraction (Dev 2), Recherche (Dev 3)

## Commandes utiles

Activer l'environnement virtuel avant toute commande `manage.py` (PowerShell) :
```
& "C:\Users\Math34\Mathieu\Projets Ipssi\Ipssi_env\Scripts\Activate.ps1"
```

Depuis `findmyattractions_backend/` (dossier contenant `manage.py`) :

```
# Créer les migrations après une modif de models.py
python manage.py makemigrations attractions

# Appliquer les migrations en base
python manage.py migrate

# Créer un compte admin
python manage.py createsuperuser

# Lancer le serveur de dev
python manage.py runserver
```

## Champs API TripAdvisor -> modèle

On utilise la **Terra API** (moderne, `https://terra.tripadvisor.com/api`, auth via header `X-API-Key`), pas l'ancienne Content API (`api.content.tripadvisor.com`). Import via `python manage.py import_attractions --query "Paris" --category attractions`, voir `attractions/management/commands/import_attractions.py`.

Endpoints utilisés : `GET /locations/search`, `GET /locations/{id}` (détails), `GET /locations/{id}/photos`.

### Limitation connue : `cuisine` et `styles`

Ces deux champs (prévus au cahier des charges pour "Type de cuisine si restaurant" et "Style si hôtel") ont été **retirés du modèle** (migration `0002_remove_attraction_cuisine_remove_attraction_styles`) : la Terra API ne les expose pas du tout, ni sur `/locations/{id}`, ni sur les endpoints catalog (`/catalog/locations/*`) ou geo (`/geos`). C'était disponible sur l'ancienne Content API mais pas sur la nouvelle — pas une limite de notre implémentation, mais du fournisseur de données.

### Limitation connue : suggestions similaires ("Recommendations")

L'endpoint `POST /recommendations/search` (IA, correspond au besoin "Suggestions similaires dans le même quartier" de la page attraction) renvoie `403 Access Denied — API Key does not have access to endpoint` avec notre clé actuelle. C'est un endpoint payant / à accès restreint, non inclus dans le tier gratuit du compte développeur TripAdvisor. Non implémenté pour cette raison — nécessiterait une clé avec ce scope débloqué (ou un upgrade de compte) pour être utilisable.
