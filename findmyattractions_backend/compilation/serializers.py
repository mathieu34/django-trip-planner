from rest_framework import serializers
from .models import CompilationItem


class CompilationItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompilationItem
        fields = ["id", "attraction", "added_at"]