from django.urls import path
from .views import AttractionDetailAPIView

urlpatterns = [
    path("<int:pk>/",AttractionDetailAPIView.as_view(), name="attraction_detail"),
]