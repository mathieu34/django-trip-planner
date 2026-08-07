from rest_framework.views import APIView
from rest_framework.response import Response
from .data_search import get_all_attractions
from .filters_search import apply_filters
from users.models import UserProfile

CATEGORY_LABELS = {
    "attraction": "Attractions incontournables",
    "restaurant": "Restaurants populaires",
    "hotel": "Meilleurs hôtels",
}


class SearchView(APIView):
    def get(self, request):
        attractions = get_all_attractions()
        session_key = request.session.session_key
        if not session_key:
            return Response({"detail": "Aucune session"})
        try:
            profile = UserProfile.objects.get(session_key=session_key)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profil introuvable"})
        attractions = [
            attraction
            for attraction in attractions
            if attraction["country"].lower() == profile.country.lower()
        ]
        params = request.query_params
        category = params.get("category")

        if category:
            # Une catégorie précise est choisie : liste plate avec tous les filtres actifs
            results = apply_filters(attractions, params)
            results = sorted(results, key=lambda a: a["likes"] or 0, reverse=True)
            return Response({"results": results, "count": len(results)})

        # Pas de catégorie choisie : on garde le groupement,
        # mais on applique quand même les autres filtres (ville, prix, reviews...) dans chaque section
        sections = []
        for group_key, label in CATEGORY_LABELS.items():
            group_attractions = [a for a in attractions if a["category__group"] == group_key]
            group_filtered = apply_filters(group_attractions, params)
            group_filtered = sorted(group_filtered, key=lambda a: a["likes"] or 0, reverse=True)[:10]
            if group_filtered:
                sections.append({"key": group_key, "label": label, "attractions": group_filtered})

        return Response({"sections": sections})