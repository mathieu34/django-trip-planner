import time

import requests
from django.conf import settings

from attractions.models import Attraction, Category, Photo

BASE_URL = "https://terra.tripadvisor.com/api"

CATEGORY_MAP = {
    "attractions": ("ATTRACTION", "attraction"),
    "hotels": ("HOTEL", "hotel"),
    "restaurants": ("RESTAURANT", "restaurant"),
}

TOP_N = 2
CANDIDATES_SIZE = 3  # taille max autorisée par l'API pour une page de résultats

# /locations/nearby refuse toute bounding box de plus de 50 km² : impossible de
# couvrir un pays entier avec cet endpoint. On interroge donc plusieurs petites
# zones (~30 km² chacune), une par grande ville, et on agrège les résultats —
# liste volontairement limitée pour la démo, pas exhaustive.
CITY_CENTERS = {
    "France": [
        (48.8566, 2.3522),    # Paris
        (45.7640, 4.8357),    # Lyon
        (44.8378, -0.5792),   # Bordeaux
        (43.2965, 5.3698),    # Marseille
    ],
    "Italy": [
        (41.9028, 12.4964),   # Rome
        (45.4642, 9.1900),    # Milan
    ],
    "Spain": [
        (40.4168, -3.7038),   # Madrid
        (41.3874, 2.1686),    # Barcelone
    ],
    "United Kingdom": [
        (51.5074, -0.1278),   # Londres
        (53.4808, -2.2426),   # Manchester
    ],
    "Germany": [
        (52.5200, 13.4050),   # Berlin
        (48.1351, 11.5820),   # Munich
    ],
    "United States": [
        (40.7128, -74.0060),  # New York
        (34.0522, -118.2437),  # Los Angeles
    ],
}

# Demi-côté de chaque bounding box en degrés (~5.5 km de côté, ~30 km² < limite API de 50 km²)
BBOX_DELTA_DEG = 0.025


def _headers():
    return {"accept": "application/json", "X-API-Key": settings.TRIPADVISOR_API_KEY}


def _bounding_boxes(country_name):
    centers = CITY_CENTERS.get(country_name)
    if not centers:
        return []
    return [
        (lat - BBOX_DELTA_DEG, lon - BBOX_DELTA_DEG, lat + BBOX_DELTA_DEG, lon + BBOX_DELTA_DEG)
        for lat, lon in centers
    ]


def _primary(items):
    if not items:
        return ""
    for item in items:
        if item.get("primary"):
            return item.get("value", "")
    return items[0].get("value", "")


def _search_nearby(bbox, ta_category, size):
    sw_lat, sw_lon, ne_lat, ne_lon = bbox
    params = {
        "sw_lat": sw_lat,
        "sw_lon": sw_lon,
        "ne_lat": ne_lat,
        "ne_lon": ne_lon,
        "category": ta_category,
        "sort": "rating,desc",
        "size": size,
        "locale": "fr-FR",
    }
    response = requests.get(f"{BASE_URL}/locations/nearby", headers=_headers(), params=params)
    response.raise_for_status()
    return response.json().get("data", [])


def _rating_and_reviews(detail):
    ratings = (detail.get("traveler_ratings") or {}).get("overall") or {}
    return (ratings.get("rating") or 0, ratings.get("count") or 0)


def _fetch_detail(location_id):
    response = requests.get(
        f"{BASE_URL}/locations/{location_id}", headers=_headers(), params={"locale": "fr-FR"}
    )
    if response.status_code != 200:
        return None
    return response.json()


def _fetch_photos(location_id):
    response = requests.get(
        f"{BASE_URL}/locations/{location_id}/photos",
        headers=_headers(),
        params={"locale": "fr-FR", "size": 10},
    )
    if response.status_code != 200:
        return []
    return response.json().get("data", [])


def _save_attraction(location_id, detail, category):
    name = _primary(detail.get("names", []))
    description = _primary(detail.get("descriptions", []))
    address = (detail.get("addresses") or [{}])[0]
    coordinates = detail.get("coordinates") or {}
    phone = next(
        (p.get("value") for p in detail.get("phone_numbers", []) if p.get("type") == "phone"), ""
    )
    opening_hours = detail.get("opening_hours") or {}
    ratings = (detail.get("traveler_ratings") or {}).get("overall") or {}
    urls = detail.get("urls") or {}

    attraction, _created = Attraction.objects.update_or_create(
        tripadvisor_id=str(location_id),
        defaults={
            "name": name,
            "description": description,
            "category": category,
            "phone": phone,
            "email": detail.get("official_email", "") or "",
            "website": urls.get("official", "") or "",
            "address": address.get("formatted", ""),
            "city": address.get("city", ""),
            "country": address.get("country_name", ""),
            "latitude": coordinates.get("latitude"),
            "longitude": coordinates.get("longitude"),
            "price_level": detail.get("price_level", "") or "",
            "horaires": opening_hours.get("periods"),
            "timezone": opening_hours.get("timezone", ""),
            "groupes": detail.get("categories"),
            "note_tripadvisor": ratings.get("rating") or 0,
            "nombre_reviews": ratings.get("count") or 0,
            "photo_count": (detail.get("photos") or {}).get("total_count") or 0,
            "recompenses": detail.get("awards"),
        },
    )

    attraction.photos.all().delete()
    for photo in _fetch_photos(location_id):
        url = (photo.get("photo") or {}).get("original_size_url")
        if url:
            Photo.objects.create(attraction=attraction, url=url)

    return attraction


def import_top_rated(country_name, cli_category="attractions", top_n=TOP_N, claimed_ids=None):
    """Importe les `top_n` lieux d'un pays et d'une catégorie, triés par note
    décroissante puis, à note égale, par nombre d'avis décroissant.

    /locations/nearby (sort=rating,desc) fournit le tri primaire par note,
    interrogé sur plusieurs petites bounding box (une par grande ville du
    pays, limite API de 50 km² oblige) puis agrégé. Le nombre d'avis n'étant
    pas un critère de tri disponible côté API, le départage se fait localement
    sur l'ensemble des candidats trouvés.

    `claimed_ids` : IDs TripAdvisor déjà attribués à une autre catégorie lors
    d'un même import multi-catégories. Un même lieu peut être renvoyé par
    TripAdvisor pour plusieurs `category` de recherche (ex: un hôtel avec
    restaurant sur place) ; comme `tripadvisor_id` est unique en base, un lieu
    déjà pris par une catégorie précédente est ignoré ici plutôt que de lui
    écraser sa catégorie."""
    if claimed_ids is None:
        claimed_ids = set()

    bboxes = _bounding_boxes(country_name)
    if not bboxes:
        return []

    ta_category, group = CATEGORY_MAP[cli_category]
    category, _ = Category.objects.get_or_create(name=cli_category, defaults={"group": group})

    seen_ids = set()
    details = []
    for bbox in bboxes:
        nearby_results = _search_nearby(bbox, ta_category, CANDIDATES_SIZE)
        for item in nearby_results:
            location_id = (item.get("location") or {}).get("id")
            if not location_id or location_id in seen_ids or location_id in claimed_ids:
                continue
            seen_ids.add(location_id)
            detail = _fetch_detail(location_id)
            time.sleep(0.5)  # éviter de dépasser le rate limit de l'API
            if detail is not None:
                details.append((location_id, detail))

    details.sort(key=lambda pair: _rating_and_reviews(pair[1]), reverse=True)

    kept = details[:top_n]
    claimed_ids.update(location_id for location_id, _detail in kept)

    return [
        _save_attraction(location_id, detail, category)
        for location_id, detail in kept
    ]


def import_top_rated_all_categories(country_name, top_n=TOP_N):
    """Importe les `top_n` lieux les mieux notés pour chacune des 3 catégories
    (attractions/hotels/restaurants) d'un pays donné. Un même lieu TripAdvisor
    n'est retenu que par la première catégorie qui le trouve (voir `claimed_ids`
    dans `import_top_rated`)."""
    claimed_ids = set()
    results = {}
    for cli_category in CATEGORY_MAP:
        results[cli_category] = import_top_rated(country_name, cli_category, top_n, claimed_ids)
    return results
