import math
from itertools import permutations
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CompilationItem
from attractions.models import Attraction


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def total_distance(order):
    total = 0
    for i in range(len(order) - 1):
        a, b = order[i], order[i + 1]
        total += haversine_km(a["latitude"], a["longitude"], b["latitude"], b["longitude"])
    return total


def shortest_route(attractions):
    if len(attractions) <= 1:
        return list(attractions)
    if len(attractions) > 8:
        remaining = list(attractions)
        route = [remaining.pop(0)]
        while remaining:
            last = route[-1]
            nearest = min(remaining, key=lambda a: haversine_km(last["latitude"], last["longitude"], a["latitude"], a["longitude"]))
            route.append(nearest)
            remaining.remove(nearest)
        return route

    best_order, best_distance = None, float("inf")
    for perm in permutations(attractions):
        d = total_distance(perm)
        if d < best_distance:
            best_distance, best_order = d, perm
    return list(best_order)


def get_attraction_data(attraction_id):
    """Point d'intégration unique avec le vrai modèle Attraction."""
    try:
        obj = Attraction.objects.get(pk=attraction_id)
        return {
            "id": obj.id,
            "name": obj.name,
            "latitude": float(obj.latitude) if obj.latitude is not None else None,
            "longitude": float(obj.longitude) if obj.longitude is not None else None,
            "price_level": len(obj.price_level) if obj.price_level else 0,
        }
    except Attraction.DoesNotExist:
        return None


def ensure_session(request):
    """Token custom envoyé via header X-Compilation-Token (voir api.js côté frontend)."""
    token = request.headers.get("X-Compilation-Token")
    if not token:
        import uuid
        token = str(uuid.uuid4())
    return token


class CompilationView(APIView):
    def get(self, request):
        session_key = ensure_session(request)
        sort = request.query_params.get("sort", "added")

        db_items = CompilationItem.objects.filter(session_key=session_key)

        enriched = []
        for item in db_items:
            data = get_attraction_data(item.attraction_id)
            if data:
                enriched.append({"item_id": item.id, "attraction": data})

        if sort == "budget_asc":
            enriched.sort(key=lambda e: e["attraction"]["price_level"] or 0)
        elif sort == "budget_desc":
            enriched.sort(key=lambda e: e["attraction"]["price_level"] or 0, reverse=True)
        elif sort == "distance":
            valid_items = [e for e in enriched if e["attraction"]["latitude"] is not None]
            ordered = shortest_route([e["attraction"] for e in valid_items])
            order_map = {a["id"]: idx for idx, a in enumerate(ordered)}
            enriched.sort(key=lambda e: order_map.get(e["attraction"]["id"], 9999))

        total_budget = sum((e["attraction"]["price_level"] or 0) for e in enriched)
        total_km = None
        if sort == "distance" and len(enriched) > 1:
            valid = [e["attraction"] for e in enriched if e["attraction"]["latitude"] is not None]
            if len(valid) > 1:
                total_km = round(total_distance(valid), 1)

        return Response({
            "token": session_key,
            "items": enriched,
            "total_budget": total_budget,
            "total_distance_km": total_km,
        })

    def post(self, request):
        session_key = ensure_session(request)
        attraction_id = request.data.get("attraction_id")

        if not attraction_id:
            return Response({"detail": "attraction_id requis."}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CompilationItem.objects.get_or_create(
            session_key=session_key, attraction_id=attraction_id
        )
        return Response(
            {"token": session_key, "item_id": item.id, "attraction_id": item.attraction_id},
            status=status.HTTP_201_CREATED,
        )


class CompilationItemDetailView(APIView):
    def delete(self, request, pk):
        session_key = ensure_session(request)
        try:
            item = CompilationItem.objects.get(pk=pk, session_key=session_key)
            item.delete()
            return Response({"token": session_key}, status=status.HTTP_200_OK)
        except CompilationItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)