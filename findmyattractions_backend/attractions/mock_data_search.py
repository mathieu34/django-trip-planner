MOCK_ATTRACTIONS = [
    {
        "id": 1, "name": "Tour Eiffel", "category": "attraction",
        "city": "Paris", "latitude": 48.8584, "longitude": 2.2945,
        "price_level": 3, "rating": 4.6, "num_reviews": 145000, "num_photos": 89000,
        "likes": 5200, "target_profiles": ["touriste"],
    },
    {
        "id": 2, "name": "Musée du Louvre", "category": "attraction",
        "city": "Paris", "latitude": 48.8606, "longitude": 2.3376,
        "price_level": 2, "rating": 4.7, "num_reviews": 98000, "num_photos": 67000,
        "likes": 4800, "target_profiles": ["touriste", "local"],
    },
    {
        "id": 3, "name": "Le Comptoir du Marais", "category": "restaurant",
        "city": "Paris", "latitude": 48.8600, "longitude": 2.3620,
        "price_level": 2, "rating": 4.3, "num_reviews": 1200, "num_photos": 340,
        "likes": 210, "target_profiles": ["local", "touriste"],
    },
    {
        "id": 4, "name": "Hôtel Le Meurice", "category": "hotel",
        "city": "Paris", "latitude": 48.8651, "longitude": 2.3282,
        "price_level": 4, "rating": 4.8, "num_reviews": 3400, "num_photos": 1800,
        "likes": 890, "target_profiles": ["touriste", "professionnel"],
    },
    {
        "id": 5, "name": "Sacré-Cœur", "category": "attraction",
        "city": "Paris", "latitude": 48.8867, "longitude": 2.3431,
        "price_level": 1, "rating": 4.5, "num_reviews": 87000, "num_photos": 52000,
        "likes": 3900, "target_profiles": ["touriste", "local"],
    },
]


def get_all_attractions():
    """
    Point d'intégration unique. Aujourd'hui : mock en mémoire.
    Demain : remplacer par un vrai queryset Attraction.objects.all().values(...)
    """
    return list(MOCK_ATTRACTIONS)