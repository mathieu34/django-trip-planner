from django.urls import path
from .views import CompilationView, CompilationItemDetailView

urlpatterns = [
    path("compilation/", CompilationView.as_view()),
    path("compilation/<int:pk>/", CompilationItemDetailView.as_view()),
]