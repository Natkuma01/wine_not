from rest_framework import serializers

from wines.models import Wine
from restaurants.models import Restaurant
from .models import Inventory
from wines.serializers import WineSerializer


# class InventorySerializer(serializers.ModelSerializer):
#     wine = serializers.PrimaryKeyRelatedField(queryset=Wine.objects.all())
#     restaurant = serializers.PrimaryKeyRelatedField(queryset=Restaurant.objects.all())
#     wine_name = serializers.CharField(source='wine.name', read_only=True)
#     producer = serializers.CharField(source='wine.producer', read_only=True)
#     country = serializers.CharField(source='wine.country', read_only=True)
#     year = serializers.IntegerField(source='wine.year', read_only=True)
#     profit_margin = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)

#     class Meta:
#         model = Inventory
#         fields = '__all__'







## -----------------------------------------------------------------------------

class InventorySerializer(serializers.ModelSerializer):
    wine_name = serializers.CharField(source='wine.name', read_only=True)           
    producer = serializers.CharField(source='wine.producer', read_only=True)        
    country = serializers.CharField(source='wine.country', read_only=True)          
    year = serializers.IntegerField(source='wine.year', read_only=True)             
    
    
    computed_profit_margin = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = [
            'id', 'wine', 'restaurant', 'quantity', 'buying_price', 
            'selling_price', 'wine_name', 'producer', 'country', 
            'year', 'computed_profit_margin'
        ]

    def get_computed_profit_margin(self, obj):
        if obj.buying_price > 0:
            margin = ((obj.selling_price - obj.buying_price) / obj.buying_price) * 100
            return round(margin, 2)
        return 0.00