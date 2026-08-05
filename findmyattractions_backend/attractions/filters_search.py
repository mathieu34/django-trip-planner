import math


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def apply_filters(attractions, params):
    results = list(attractions)

    category = params.get("category")
    if category:
        results = [a for a in results if a["category"] == category]

    city = params.get("city")
    if city:
        results = [a for a in results if city.lower() in a["city"].lower()]

    price_level = params.get("price_level")
    if price_level:
        results = [a for a in results if a["price_level"] == int(price_level)]

    min_reviews = params.get("min_reviews")
    if min_reviews:
        results = [a for a in results if a["num_reviews"] >= int(min_reviews)]

    min_photos = params.get("min_photos")
    if min_photos:
        results = [a for a in results if a["num_photos"] >= int(min_photos)]

    profile = params.get("profile")
    if profile:
        results = [a for a in results if profile in a.get("target_profiles", [])]

    lat, lon, radius = params.get("lat"), params.get("lon"), params.get("radius")
    if lat and lon and radius:
        lat, lon, radius = float(lat), float(lon), float(radius)
        results = [
            a for a in results
            if haversine_km(lat, lon, a["latitude"], a["longitude"]) <= radius
        ]

    return results