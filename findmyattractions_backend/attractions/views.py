from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import AttractionSerializer
from .models import Attraction
from users.models import UserProfile

GROUP_LABELS = {
    'attraction': 'Attractions',
    'restaurant': 'Restaurants',
    'hotel': 'Hôtels',
}

PROFILE_GROUPS = {
    'Local': ['attraction', 'restaurant'],
    'Touriste': ['attraction', 'restaurant', 'hotel'],
    'Professionnel': ['hotel', 'restaurant'],
}


@api_view(['GET'])
def attraction_list(request): #django appelle toujours une vue avec l'objet request en premier argument. 
    """Accueil : les attractions les plus populaires, du pays choisi par l'utilisateur, 
    un carrousel par catégorie selon le profil"""
    session_key = request.session.session_key
    if not session_key:
        return Response({"detail": "Aucune session"})
    try:
        profile = UserProfile.objects.get(session_key=session_key)
    except UserProfile.DoesNotExist:
        return Response({"detail": "Profil introuvable"})

    base_qs = Attraction.objects.filter(country__iexact=profile.country)
    #attractions = Attraction.objects.all().filter(country__iexact=profile.country).order_by('-likes')[:10]
    groups = PROFILE_GROUPS.get(profile.profile_type)

    #cree 2 ou 3 carrousels en frontend, key (group depend de models), label, aucune dependance poour structurer le json
    sections = []
    for group in groups:
        items = base_qs.filter(category__group=group).order_by('-likes')[:10]
        sections.append({
            "key": group,
            "label": GROUP_LABELS[group],
            "attractions": AttractionSerializer(items, many=True).data,
        })

    return Response({"sections": sections})

@api_view(['GET'])
def attraction_detail(request, pk):
    """Page attraction : détail d'une attraction"""
    attraction = get_object_or_404(Attraction, pk=pk)
    serializer = AttractionSerializer(attraction)
    return Response({"attraction": serializer.data})
