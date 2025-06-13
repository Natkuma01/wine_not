from rest_framework import serializers
from .models import Wine, Grape


class GrapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grape
        fields = [
            'id',
            'name',
        ]


class WineSerializer(serializers.ModelSerializer):
    grapes = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=Grape.objects.all()
    )

    class Meta:
        model = Wine
        fields = '__all__'

# handle many-to-many relationship
    def create(self, validated_data):
        grapes = validated_data.pop('grapes', [])
        wine = Wine.objects.create(**validated_data)
        wine.grapes.set(grapes)
        return wine

    def update(self, instance, validated_data):
        grapes = validated_data.pop('grapes', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if grapes is not None:
            instance.grapes.set(grapes)
        return instance

