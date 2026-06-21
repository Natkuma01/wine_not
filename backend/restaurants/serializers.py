from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = (
            'id',
            'name',
            'street_number',
            'street_name',
            'floor_unit',
            'postal_code',
            'city',
            'state',
        )
