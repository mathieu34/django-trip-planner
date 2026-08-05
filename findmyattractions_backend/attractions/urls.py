from django.urls import path
from . import views

urlpatterns = [
    path('', views.attraction_list, name='attraction-list'),
    path('<int:pk>/', views.attraction_detail, name='attraction-detail'),
]


