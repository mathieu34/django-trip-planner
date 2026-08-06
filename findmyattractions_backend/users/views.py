from rest_framework.views import APIView
from rest_framework.response import Response
from compilation.models import CompilationItem
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from .data.countries import COUNTRIES
from .models import UserProfile, ProfileType
from .serializers import UserProfileSerializer

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
            return Response({"detail": "Aucune session"})

        try:
            profile = UserProfile.objects.get(session_key=session_key)

        except UserProfile.DoesNotExist:
            return Response({"detail": "Profil introuvable"})

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

class ProfileChoicesAPIView(APIView):
    def get(self, request):
        data = []
        icons = {
            "Local": "🏠",
            "Touriste": "🎒",
            "Professionnel": "💼",
        }
        for value, label in ProfileType.choices:
            data.append({
                "value": value,
                "label": label,
                "icon": icons.get(value, "🌍"),
            })
        return Response(data)

class CountryListAPIView(APIView):
    def get(self, request):
        return Response(COUNTRIES)

@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})