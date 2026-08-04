from attractions.models import Category

def map_attraction(data):
    return {
        "tripadvisor_id": data["location_id"],
        "name": data.get("name", ""),
        "description": data.get("description", ""),
        "phone": data.get("phone", ""),
        "email": data.get("email", ""),
        "website": data.get("website", ""),
        "address": data.get("address_obj", {}).get("address_string", ""),
        "city": data.get("address_obj", {}).get("city", ""),
        "country": data.get("address_obj", {}).get("country", ""),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "price_level": data.get("price_level", ""),
        "note_tripadvisor": float(data.get("rating", 0)),
        "nombre_reviews": int(data.get("num_reviews", 0)),
        "photo_count": int(data.get("photo_count", 0)),
        "horaires": data.get("hours"),
        "timezone": data.get("timezone", ""),
        "cuisine": data.get("cuisine"),
        "styles": data.get("styles"),
        "groupes": data.get("groups"),
        "recompenses": data.get("awards"),
        "category": get_category(data),
    }

def get_category(api_data):
    """Retourne (ou crée) une Category à partir des données TripAdvisor.
    Exemple API :
    {
        "category": {"name": "restaurant"},
        "subcategory": [
            {"name": "Italian"},
            {"name": "Pizza"}
        ]
    }
    """

    category = api_data.get("category", {})
    subcategories = api_data.get("subcategory", [])

    group = category.get("name", "").lower()

    # On ne garde que les groupes connus
    if group not in ["restaurant", "hotel", "attraction"]:
        group = "attraction"

    # On prend la première sous-catégorie si disponible
    if subcategories:
        name = subcategories[0].get("name", "Autre")
    else:
        name = "Autre"

    obj, created = Category.objects.get_or_create(name=name, defaults={"group": group},)

    # Si la catégorie existe déjà mais avec un mauvais groupe
    if obj.group != group:
        obj.group = group
        obj.save()

    return obj