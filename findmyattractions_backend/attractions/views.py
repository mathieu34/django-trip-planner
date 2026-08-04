from rest_framework.generics import RetrieveAPIView
from .models import Attraction
from .serializers import AttractionSerializer

# Create your views here.

class AttractionDetailAPIView(RetrieveAPIView):
    """GET /api/attractions/<id>/"""
    queryset = Attraction.objects.all()
    serializer_class = AttractionSerializer