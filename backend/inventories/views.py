from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import IsAuthenticated
from .models import Inventory
from .serializers import InventorySerializer

# class InventoryViewSet(viewsets.ModelViewSet):
#     queryset = Inventory.objects.all()
#     serializer_class = InventorySerializer  








## --------------------------------------------------------------------------------------


class StandardInventoryPagination(CursorPagination):
    page_size = 30
    ordering = '-id' # Secure cursor ordering against database records



class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardInventoryPagination

    def get_queryset(self):
        user = self.request.user
        return Inventory.objects.filter(
            restaurant__owner=user
        ).select_related('wine', 'restaurant')
    
    
    
    
