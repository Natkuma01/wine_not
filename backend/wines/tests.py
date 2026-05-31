from django.contrib.auth.models import User
from django.urls import reverse
from django.db import connection
from django.test import utils
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Wine, Grape
from restaurants.models import Restaurant
from inventories.models import Inventory

class WineQueryCountTestCase(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        
        # Create some grapes
        self.grape1 = Grape.objects.create(name="Chardonnay")
        self.grape2 = Grape.objects.create(name="Merlot")
        self.grape3 = Grape.objects.create(name="Cabernet")
        
        # Create some wines with grapes
        self.wine1 = Wine.objects.create(name="Wine A", country="France", wine_type="white", year=2020)
        self.wine1.grapes.add(self.grape1)
        
        self.wine2 = Wine.objects.create(name="Wine B", country="Italy", wine_type="red", year=2021)
        self.wine2.grapes.add(self.grape2, self.grape3)
        
        self.wine3 = Wine.objects.create(name="Wine C", country="USA", wine_type="sparkling", year=2019)
        self.wine3.grapes.add(self.grape1, self.grape3)

        # Create a restaurant and associate wine1 and wine2
        self.restaurant = Restaurant.objects.create(name="Test Restaurant")
        Inventory.objects.create(wine=self.wine1, restaurant=self.restaurant, quantity=5, buying_price=10.00, selling_price=20.00)
        Inventory.objects.create(wine=self.wine2, restaurant=self.restaurant, quantity=3, buying_price=15.00, selling_price=30.00)

    def test_wine_list_query_count_and_pagination(self):
        url = reverse('wines-list')
        
        # Assert that exactly 3 queries are executed (1 for count, 1 for wines slice, 1 for prefetched grapes)
        with self.assertNumQueries(3):
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('results', response.data)
            self.assertEqual(len(response.data['results']), 3)

    def test_wine_list_filtering_by_type(self):
        url = reverse('wines-list')
        response = self.client.get(url, {'wine_type': 'red'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['wine_type'], 'red')

    def test_wine_list_filtering_by_restaurant(self):
        url = reverse('wines-list')
        response = self.client.get(url, {'restaurant_id': self.restaurant.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results), 2)
        wine_ids = [w['id'] for w in results]
        self.assertIn(self.wine1.id, wine_ids)
        self.assertIn(self.wine2.id, wine_ids)
        self.assertNotIn(self.wine3.id, wine_ids)


