from django.urls import path
from . import views

urlpatterns = [
    path('attractions/', views.attraction_list, name='attraction-list'),
    path('attractions/<int:pk>/', views.attraction_detail, name='attraction-detail'),
]


