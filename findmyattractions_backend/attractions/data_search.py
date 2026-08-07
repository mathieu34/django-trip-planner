from .models import Attraction

def get_all_attractions():
    """
    Récupération des attractions, format cohérent avec ce que
    filters_search.py et views_search.py attendent déjà.
    """
    attractions = Attraction.objects.select_related("category").prefetch_related("photos")
    results = []

    for attraction in attractions:
        results.append({
            "id": attraction.id,
            "name": attraction.name,
            "category__name": attraction.category.name if attraction.category else None,
            "category__group": attraction.category.group if attraction.category else None,
            "city": attraction.city,
            "latitude": attraction.latitude,
            "longitude": attraction.longitude,
            "price_level": attraction.price_level,
            "note_tripadvisor": attraction.note_tripadvisor,
            "nombre_reviews": attraction.nombre_reviews,
            "photo_count": attraction.photo_count,
            "likes": attraction.likes,
            "photos": [
                {"url": photo.url}
                for photo in attraction.photos.all()
            ]
        })
    return results