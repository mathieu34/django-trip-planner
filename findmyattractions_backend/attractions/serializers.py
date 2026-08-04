from rest_framework import serializers
from .models import Attraction, Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["url"]

class AttractionSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    class Meta:
        model = Attraction
        fields = "__all__"

    def get_category(self, obj):
        if obj.category is None:
            return None

        return {
            "id": obj.category.id,
            "name": obj.category.name,
            "group": obj.category.group,
        }