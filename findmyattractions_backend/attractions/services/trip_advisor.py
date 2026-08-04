import requests
from findmyattractions_backend.settings import TRIPADVISOR_API_KEY, BASE_URL_TRIPADVISOR_API
from .mapper import map_attraction
from attractions.models import Attraction

def sync_attraction(location_id):
    """Récupère une attraction depuis TripAdvisor puis la crée ou la met à jour en base."""
    api_data = get_location_details(location_id)
    attraction_data = map_attraction(api_data)
    attraction, _ = Attraction.objects.update_or_create(tripadvisor_id=attraction_data["tripadvisor_id"],
                                                        defaults=attraction_data
                                                        )
    return attraction

def get_location_details(location_id):
    url = (f"{BASE_URL_TRIPADVISOR_API}locations/{location_id}")
    headers = {
        "accept": "application/json",
        "X-API-Key": TRIPADVISOR_API_KEY
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    return response.json()