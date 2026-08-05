from django.urls import path

from .views import (CreateUserProfileAPIView, CurrentProfileAPIView, LogoutAPIView)

urlpatterns = [
    path("profile/", CreateUserProfileAPIView.as_view(), name="profile"),
    path("me/", CurrentProfileAPIView.as_view(), name="current_profile"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
]