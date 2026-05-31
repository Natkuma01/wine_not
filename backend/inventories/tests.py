from django.contrib.auth.models import User
from django.urls import reverse
from django.db import connection
from django.test import utils
from rest_framework import status
from rest_framework.test import APITestCase
from wines.models import Wine
from restaurants.models import Restaurant
from .models import Inventory

class InventoryQueryCountTestCase(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        
        # Create some test data
        self.restaurant1 = Restaurant.objects.create(name="Restaurant A")
        self.restaurant2 = Restaurant.objects.create(name="Restaurant B")
        
        self.wine1 = Wine.objects.create(name="Wine 1", country="France", wine_type="red", year=2020)
        self.wine2 = Wine.objects.create(name="Wine 2", country="Italy", wine_type="white", year=2021)
        self.wine3 = Wine.objects.create(name="Wine 3", country="USA", wine_type="sparkling", year=2019)
        
        # Create inventories
        self.inv1 = Inventory.objects.create(wine=self.wine1, restaurant=self.restaurant1, quantity=10, buying_price=15.00, selling_price=30.00)
        self.inv2 = Inventory.objects.create(wine=self.wine2, restaurant=self.restaurant1, quantity=5, buying_price=20.00, selling_price=45.00)
        self.inv3 = Inventory.objects.create(wine=self.wine3, restaurant=self.restaurant2, quantity=12, buying_price=25.00, selling_price=50.00)

    def test_inventory_list_query_count(self):
        url = reverse('inventories-list')
        
        # Assert that exactly 1 query is executed
        with self.assertNumQueries(1):
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 3)

