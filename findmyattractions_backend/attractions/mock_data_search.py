from .models import Attraction

def get_all_attractions():
    """
    Ancien mock remplacé par une vraie requête DB.
    Utilise .values() pour renvoyer des dicts, cohérent avec ce que
    filters_search.py et views_search.py attendent déjà.
    """
    return list(
        Attraction.objects.select_related("category").values(
            "id",
            "name",
            "category__name",
            "category__group",
            "city",
            "latitude",
            "longitude",
            "price_level",
            "note_tripadvisor",
            "nombre_reviews",
            "photo_count",
            "likes",
        )
    )