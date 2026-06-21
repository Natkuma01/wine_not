from rest_framework import serializers
from .models import PageVisit


class PageVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageVisit
        fields = ["path", "session_id", "referrer"]
