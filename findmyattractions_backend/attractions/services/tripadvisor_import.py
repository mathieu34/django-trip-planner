import time

import requests
from django.conf import settings

from attractions.models import Attraction, Category, Photo
from users.data.countries import COUNTRIES

BASE_URL = "https://terra.tripadvisor.com/api"
GEONAMES_URL = "http://api.geonames.org/searchJSON"

CATEGORY_MAP = {
    "attractions": ("ATTRACTION", "attraction"),
    "hotels": ("HOTEL", "hotel"),
    "restaurants": ("RESTAURANT", "restaurant"),
}

TOP_N = 2
CANDIDATES_SIZE = 3  # nombre de résultats demandés par ville et par catégorie
CITIES_PER_COUNTRY = 3  # nombre de grandes villes récupérées via GeoNames par pays


def _headers():
    return {"accept": "application/json", "X-API-Key": settings.TRIPADVISOR_API_KEY}


def _country_code(country_name):
    for country in COUNTRIES:
        if country["value"].lower() == country_name.lower():
            return country["code"]
    return None


def _geonames_cities(country_code, max_cities=CITIES_PER_COUNTRY):
    """Grandes villes d'un pays (triées par population) via GeoNames — pas de
    bounding box, juste des noms de villes réutilisables tels quels par
    /locations/search côté TripAdvisor."""
    params = {
        "country": country_code,
        "featureClass": "P",
        "orderby": "population",
        "maxRows": max_cities,
        "username": settings.GEONAMES_USERNAME,
    }
    response = requests.get(GEONAMES_URL, params=params)
    response.raise_for_status()
    data = response.json()
    return [item["name"] for item in data.get("geonames", []) if item.get("name")]


def _primary(items):
    if not items:
        return ""
    for item in items:
        if item.get("primary"):
            return item.get("value", "")
    return items[0].get("value", "")


def _search_by_city(city_name, ta_category, size):
    params = {
        "query": city_name,
        "geo_name": city_name,
        "category": ta_category,
        "locale": "fr-FR",
        "size": size,
    }
    response = requests.get(f"{BASE_URL}/locations/search", headers=_headers(), params=params)
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

    Les grandes villes du pays sont récupérées via GeoNames (`_geonames_cities`),
    puis chacune est interrogée sur `/locations/search?query=<ville>` côté
    TripAdvisor (recherche par nom, pas de bounding box) ; les candidats de
    toutes les villes sont agrégés avant le tri, aucun des deux critères
    (note, avis) n'étant proposé nativement par cet endpoint.

    `claimed_ids` : IDs TripAdvisor déjà attribués à une autre catégorie lors
    d'un même import multi-catégories. Un même lieu peut être renvoyé par
    TripAdvisor pour plusieurs `category` de recherche (ex: un hôtel avec
    restaurant sur place) ; comme `tripadvisor_id` est unique en base, un lieu
    déjà pris par une catégorie précédente est ignoré ici plutôt que de lui
    écraser sa catégorie."""
    if claimed_ids is None:
        claimed_ids = set()

    country_code = _country_code(country_name)
    if not country_code:
        return []

    cities = _geonames_cities(country_code)
    if not cities:
        return []

    ta_category, group = CATEGORY_MAP[cli_category]
    category, _ = Category.objects.get_or_create(name=cli_category, defaults={"group": group})

    seen_ids = set()
    details = []
    for city in cities:
        results = _search_by_city(city, ta_category, CANDIDATES_SIZE)
        for item in results:
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
