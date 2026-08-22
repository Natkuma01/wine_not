from rest_framework import serializers
from .models import DailyWineSale, PageVisit
from inventories.models import Inventory


class PageVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageVisit
        fields = ["path", "session_id", "referrer"]


class DailyWineSaleSerializer(serializers.ModelSerializer):
    inventory = serializers.PrimaryKeyRelatedField(queryset=Inventory.objects.select_related("wine", "restaurant"))
    wine_name = serializers.CharField(source="inventory.wine.name", read_only=True)
    producer = serializers.CharField(source="inventory.wine.producer", read_only=True)
    year = serializers.IntegerField(source="inventory.wine.year", read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = DailyWineSale
        fields = [
            "id",
            "restaurant",
            "inventory",
            "sale_date",
            "quantity_sold",
            "user",
            "username",
            "notes",
            "wine_name",
            "producer",
            "year",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "username", "wine_name", "producer", "year", "updated_at"]

    def validate(self, attrs):
        restaurant = attrs.get("restaurant") or getattr(self.instance, "restaurant", None)
        inventory = attrs.get("inventory") or getattr(self.instance, "inventory", None)

        if restaurant and inventory and inventory.restaurant_id != restaurant.id:
            raise serializers.ValidationError(
                {"inventory": "Selected wine bottle does not belong to this restaurant."}
            )

        quantity_sold = attrs.get("quantity_sold")
        if quantity_sold is not None and quantity_sold <= 0:
            raise serializers.ValidationError(
                {"quantity_sold": "Quantity sold must be greater than zero."}
            )

        return attrs
