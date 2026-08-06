from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import AttractionSerializer
from .models import Attraction
from users.models import UserProfile


@api_view(['GET'])
def attraction_list(request): #django appelle toujours une vue avec l'objet request en premier argument. 
    """Accueil : les attractions les plus populaires, du pays choisi par l'utilisateur"""
    session_key = request.session.session_key
    if not session_key:
        return Response({"detail": "Aucune session"})
    try:
        profile = UserProfile.objects.get(session_key=session_key)
    except UserProfile.DoesNotExist:
        return Response({"detail": "Profil introuvable"})
    attractions = Attraction.objects.all().filter(country__iexact=profile.country).order_by('-likes')[:10]
    serializer = AttractionSerializer(attractions, many=True)
    return Response({"attractions": serializer.data})


@api_view(['GET'])
def attraction_detail(request, pk):
    """Page attraction : détail d'une attraction"""
    attraction = get_object_or_404(Attraction, pk=pk)
    serializer = AttractionSerializer(attraction)
    return Response({"attraction": serializer.data})
