from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer
from compilation.models import CompilationItem

# Create your views here.

class CreateUserProfileAPIView(APIView):
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.session.session_key:
            request.session.create()

        session_key = request.session.session_key

        UserProfile.objects.update_or_create(session_key=session_key,defaults=serializer.validated_data)

        return Response(serializer.data)

class CurrentProfileAPIView(APIView):
    def get(self, request):
        session_key = request.session.session_key

        if not session_key:
            return Response({"detail": "Aucune session"},status=404)

        try:
            profile = UserProfile.objects.get(session_key=session_key)

        except UserProfile.DoesNotExist:
            return Response({"detail": "Profil introuvable"},status=404)

        serializer = UserProfileSerializer(profile)

        return Response(serializer.data)


class LogoutAPIView(APIView):
    def post(self, request):
        session_key = request.session.session_key

        if session_key:
            CompilationItem.objects.filter(session_key=session_key).delete()
            UserProfile.objects.filter(session_key=session_key).delete()
        request.session.flush()

        return Response({"message": "Déconnecté"})