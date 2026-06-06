from rest_framework import serializers
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

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
    wine_type = serializers.CharField(source='wine.wine_type', read_only=True)
    profit_margin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'

    def get_profit_margin(self, obj):
        try:
            buying = obj.buying_price
            selling = obj.selling_price
            if selling is None or selling == 0:
                return None
            # compute ((selling - buying) / selling) * 100
            margin = (Decimal(selling) - Decimal(buying)) / Decimal(selling) * Decimal(100)
            return margin.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        except (InvalidOperation, TypeError, AttributeError):
            return None
