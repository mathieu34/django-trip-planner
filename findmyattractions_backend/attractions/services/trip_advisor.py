import requests
from findmyattractions_backend.settings import TRIPADVISOR_API_KEY, BASE_URL_TRIPADVISOR_API

def get_location_details(location_id):
    url = (f"{BASE_URL_TRIPADVISOR_API}locations/{location_id}")
    headers = {
        "accept": "application/json",
        "X-API-Key": TRIPADVISOR_API_KEY
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    return response.json()