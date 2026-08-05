from rest_framework import serializers
from .models import Category, Attraction, Photo


class CategorySerializer(serializers.ModelSerializer) : 
    class Meta : 
        model = Category 
        fields = '__all__'

class PhotoSerializer(serializers.ModelSerializer) : 
    class Meta : 
        model = Photo
        fields = ['id', 'url']

class AttractionSerializer(serializers.ModelSerializer) : 
    category = CategorySerializer(read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta : 
        model = Attraction
        fields = '__all__'

