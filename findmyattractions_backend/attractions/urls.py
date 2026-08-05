from django.urls import path
from . import views
from .views_search import SearchView

urlpatterns = [
    path('attractions/', views.attraction_list, name='attraction-list'),
    path('attractions/<int:pk>/', views.attraction_detail, name='attraction-detail'),
    path("search/", SearchView.as_view()),
]