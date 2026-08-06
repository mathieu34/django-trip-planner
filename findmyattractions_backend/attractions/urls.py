from django.urls import path
from . import views
from .views_search import SearchView

urlpatterns = [
    path('', views.attraction_list, name='attraction-list'),
    path('<int:pk>/', views.attraction_detail, name='attraction-detail'),
    path("search/", SearchView.as_view()),
]