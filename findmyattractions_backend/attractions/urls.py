from django.urls import path
from .views import AttractionDetailAPIView, SyncAttractionAPIView

urlpatterns = [
    path("<int:pk>/",AttractionDetailAPIView.as_view(), name="attraction_detail"),
    path("sync/<str:location_id>/", SyncAttractionAPIView.as_view(), name="attraction_sync"),
]