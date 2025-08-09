from rest_framework import serializers

from wines.models import Wine
from restaurants.models import Restaurant
from .models import Inventory
from wines.serializers import WineSerializer


class InventorySerializer(serializers.ModelSerializer):
    wine = serializers.PrimaryKeyRelatedField(queryset=Wine.objects.all())
    restaurant = serializers.PrimaryKeyRelatedField(queryset=Restaurant.objects.all())
    wine_name = serializers.CharField(source='wine.name', read_only=True)
    producer = serializers.CharField(source='wine.producer', read_only=True)
    country = serializers.CharField(source='wine.country', read_only=True)
    year = serializers.IntegerField(source='wine.year', read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'
