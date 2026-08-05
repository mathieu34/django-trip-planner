from django.urls import path

from .views import (CreateUserProfileAPIView, CurrentProfileAPIView, LogoutAPIView, ProfileChoicesAPIView, CountryListAPIView, csrf)

urlpatterns = [
    path("csrf/", csrf, name="csrf"),
    path("profiles/", ProfileChoicesAPIView.as_view(), name="profiles"),
    path("countries/", CountryListAPIView.as_view(),  name="countries"),
    path("profile/", CreateUserProfileAPIView.as_view(), name="profile"),
    path("me/", CurrentProfileAPIView.as_view(), name="current_profile"),
    path("logout/", LogoutAPIView.as_view(), name="logout"), 
]