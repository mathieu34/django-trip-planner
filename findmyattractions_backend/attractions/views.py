from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Attraction
from .serializers import AttractionSerializer
from .services.trip_advisor import sync_attraction

# Create your views here.

class AttractionDetailAPIView(RetrieveAPIView):
    """GET /api/attractions/<id>/"""
    queryset = Attraction.objects.all()
    serializer_class = AttractionSerializer


class SyncAttractionAPIView(APIView):
    def get(self, request, location_id):
        attraction = sync_attraction(location_id)
        serializer = AttractionSerializer(attraction)
        return Response(serializer.data)