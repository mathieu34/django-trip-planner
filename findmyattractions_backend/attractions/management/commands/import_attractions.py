import time

import requests
from django.conf import settings
from django.core.management.base import BaseCommand

from attractions.models import Attraction, Category, Photo

BASE_URL = "https://terra.tripadvisor.com/api"

CATEGORY_MAP = {
    "attractions": ("ATTRACTION", "attraction"),
    "hotels": ("HOTEL", "hotel"),
    "restaurants": ("RESTAURANT", "restaurant"),
}


class Command(BaseCommand):
    help = "Importe des attractions depuis la TripAdvisor Terra API vers la base locale."

    def add_arguments(self, parser):
        parser.add_argument("--query", type=str, required=True, help="Texte recherché, ex: Paris")
        parser.add_argument("--geo", type=str, default=None, help="Ville pour restreindre la recherche (geo_name)")
        parser.add_argument(
            "--category",
            type=str,
            default="attractions",
            choices=list(CATEGORY_MAP.keys()),
            help="Catégorie recherchée",
        )
        parser.add_argument("--limit", type=int, default=10, help="Nombre de lieux à importer")

    def headers(self):
        return {"accept": "application/json", "X-API-Key": settings.TRIPADVISOR_API_KEY}

    def handle(self, *args, **options):
        query = options["query"]
        geo_name = options["geo"] or query
        cli_category = options["category"]
        limit = min(options["limit"], 20)  # 'size' max autorisé par l'API

        ta_category, group = CATEGORY_MAP[cli_category]

        params = {
            "query": query,
            "geo_name": geo_name,
            "category": ta_category,
            "locale": "fr-FR",
            "size": limit,
        }

        response = requests.get(f"{BASE_URL}/locations/search", headers=self.headers(), params=params)
        response.raise_for_status()
        results = response.json().get("data", [])

        self.stdout.write(f"{len(results)} lieu(x) trouvé(s) pour '{query}' ({cli_category})")

        category, _ = Category.objects.get_or_create(name=cli_category, defaults={"group": group})

        for item in results:
            location_id = (item.get("location") or {}).get("id")
            if not location_id:
                continue

            self.import_location(location_id, category)
            time.sleep(0.5)  # éviter de dépasser le rate limit de l'API

        self.stdout.write(self.style.SUCCESS("Import terminé."))

    def import_location(self, location_id, category):
        response = requests.get(
            f"{BASE_URL}/locations/{location_id}", headers=self.headers(), params={"locale": "fr-FR"}
        )

        if response.status_code != 200:
            self.stdout.write(self.style.WARNING(f"Détails indisponibles pour {location_id} ({response.status_code})"))
            return

        data = response.json()

        name = self._primary(data.get("names", []))
        description = self._primary(data.get("descriptions", []))
        address = (data.get("addresses") or [{}])[0]
        coordinates = data.get("coordinates") or {}
        phone = next((p.get("value") for p in data.get("phone_numbers", []) if p.get("type") == "phone"), "")
        opening_hours = data.get("opening_hours") or {}
        ratings = (data.get("traveler_ratings") or {}).get("overall") or {}
        urls = data.get("urls") or {}

        attraction, _created = Attraction.objects.update_or_create(
            tripadvisor_id=str(location_id),
            defaults={
                "name": name,
                "description": description,
                "category": category,
                "phone": phone,
                "email": data.get("official_email", "") or "",
                "website": urls.get("official", "") or "",
                "address": address.get("formatted", ""),
                "city": address.get("city", ""),
                "country": address.get("country_name", ""),
                "latitude": coordinates.get("latitude"),
                "longitude": coordinates.get("longitude"),
                "price_level": data.get("price_level", "") or "",
                "horaires": opening_hours.get("periods"),
                "timezone": opening_hours.get("timezone", ""),
                "groupes": data.get("categories"),
                "note_tripadvisor": ratings.get("rating") or 0,
                "nombre_reviews": ratings.get("count") or 0,
                "photo_count": (data.get("photos") or {}).get("total_count") or 0,
                "recompenses": data.get("awards"),
            },
        )

        self.import_photos(attraction, location_id)
        self.stdout.write(f"  - {attraction.name}")

    def import_photos(self, attraction, location_id):
        response = requests.get(
            f"{BASE_URL}/locations/{location_id}/photos", headers=self.headers(), params={"locale": "fr-FR", "size": 10}
        )

        if response.status_code != 200:
            return

        photos = response.json().get("data", [])
        attraction.photos.all().delete()
        for photo in photos:
            url = (photo.get("photo") or {}).get("original_size_url")
            if url:
                Photo.objects.create(attraction=attraction, url=url)

    @staticmethod
    def _primary(items):
        if not items:
            return ""
        for item in items:
            if item.get("primary"):
                return item.get("value", "")
        return items[0].get("value", "")
