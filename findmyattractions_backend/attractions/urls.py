from django.urls import path
from .views_search import SearchView

urlpatterns = [
    path("search/", SearchView.as_view()),
]