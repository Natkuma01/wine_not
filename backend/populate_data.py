import os
import django
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from django.contrib.auth.models import User
from restaurants.models import Restaurant
from wines.models import Wine, Grape
from inventories.models import Inventory

def populate():
    # 1. Create or get user
    user, created = User.objects.get_or_create(username='nataliechan')
    if created:
        user.set_password('1234567')
        user.save()
        print("User nataliechan created.")
    else:
        user.set_password('1234567')
        user.save()
        print("User nataliechan updated.")
    
    # 2. Create 5 restaurants
    restaurants_data = [
        {
            "name": "Le Bernardin",
            "street_number": "214",
            "street_name": "West 52nd Street",
            "floor_unit": "Floor 2",
            "postal_code": 10019,
            "city": "New York",
            "state": "NY",
        },
        {
            "name": "The French Laundry",
            "street_number": "6488",
            "street_name": "Washington Street",
            "floor_unit": "Suite B",
            "postal_code": 94599,
            "city": "Yountville",
            "state": "CA",
        },
        {
            "name": "Osteria Francescana",
            "street_number": "18",
            "street_name": "Via San Pietro",
            "floor_unit": "Floor 1",
            "postal_code": 41121,
            "city": "Modena",
            "state": "IT",
        },
        {
            "name": "Noma",
            "street_number": "84",
            "street_name": "Refshalevej",
            "floor_unit": "Building 2",
            "postal_code": 1432,
            "city": "Copenhagen",
            "state": "DK",
        },
        {
            "name": "Gaggan",
            "street_number": "61",
            "street_name": "Soi Langsuan",
            "floor_unit": "Unit 5",
            "postal_code": 10330,
            "city": "Bangkok",
            "state": "TH",
        },
    ]
    
    restaurants = []
    for data in restaurants_data:
        restaurant, _ = Restaurant.objects.update_or_create(
            name=data["name"],
            defaults={
                "street_number": data["street_number"],
                "street_name": data["street_name"],
                "floor_unit": data["floor_unit"],
                "postal_code": data["postal_code"],
                "city": data["city"],
                "state": data["state"],
            },
        )
        restaurants.append(restaurant)
    print(f"Created {len(restaurants)} restaurants.")

    # 3. Ensure grapes exist
    chardonnay, _ = Grape.objects.get_or_create(name='Chardonnay')
    sauvignon_blanc, _ = Grape.objects.get_or_create(name='Sauvignon Blanc')
    riesling, _ = Grape.objects.get_or_create(name='Riesling')

    # 10 white wines from 5 different regions
    # Regions: Burgundy, Bordeaux, Mosel, Marlborough, Napa Valley
    wines_data = [
        {
            "name": "Montrachet Grand Cru", "producer": "Domaine de la Romanée-Conti", 
            "country": "France", "region": "Burgundy", "year": 2018, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjB3aW5lJTIwYm90dGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
            "notes": "Complex, rich, and elegant.", "grape": chardonnay
        },
        {
            "name": "Chablis Grand Cru Les Clos", "producer": "William Fèvre", 
            "country": "France", "region": "Burgundy", "year": 2020, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Crisp, mineral-driven with citrus notes.", "grape": chardonnay
        },
        {
            "name": "Château Haut-Brion Blanc", "producer": "Château Haut-Brion", 
            "country": "France", "region": "Bordeaux", "year": 2019, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1596738914856-787f0b2fcfdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Full-bodied with notes of honey and grapefruit.", "grape": sauvignon_blanc
        },
        {
            "name": "Pape Clément Blanc", "producer": "Château Pape Clément", 
            "country": "France", "region": "Bordeaux", "year": 2017, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1623592682977-80252b474bb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Aromatic, rich texture.", "grape": sauvignon_blanc
        },
        {
            "name": "Scharzhofberger Riesling Auslese", "producer": "Egon Müller", 
            "country": "Germany", "region": "Mosel", "year": 2015, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1624021237937-23fce23ba567?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Sweet, vibrant acidity.", "grape": riesling
        },
        {
            "name": "Wehlener Sonnenuhr Spätlese", "producer": "Joh. Jos. Prüm", 
            "country": "Germany", "region": "Mosel", "year": 2021, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1554556485-613d96924bf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Fruity and delicate.", "grape": riesling
        },
        {
            "name": "Cloudy Bay Sauvignon Blanc", "producer": "Cloudy Bay", 
            "country": "New Zealand", "region": "Marlborough", "year": 2022, "wine_type": "white",
            "imageURL": "https://plus.unsplash.com/premium_photo-1661665495574-e8b919d7d4c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Vibrant passionfruit and lime.", "grape": sauvignon_blanc
        },
        {
            "name": "Greywacke Wild Sauvignon", "producer": "Greywacke", 
            "country": "New Zealand", "region": "Marlborough", "year": 2020, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1619477025816-11f8b656bdfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Textured and complex.", "grape": sauvignon_blanc
        },
        {
            "name": "Kongsgaard Chardonnay", "producer": "Kongsgaard", 
            "country": "USA", "region": "Napa Valley", "year": 2019, "wine_type": "white",
            "imageURL": "https://plus.unsplash.com/premium_photo-1661665219973-c353ce00c6d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Intense, savory and rich.", "grape": chardonnay
        },
        {
            "name": "Hyde Vineyard Chardonnay", "producer": "HDV", 
            "country": "USA", "region": "Napa Valley", "year": 2021, "wine_type": "white",
            "imageURL": "https://images.unsplash.com/photo-1596738914856-787f0b2fcfdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Bright acidity with stone fruit.", "grape": chardonnay
        }
    ]

    wines = []
    for data in wines_data:
        grape = data.pop("grape")
        wine, _ = Wine.objects.get_or_create(**data)
        wine.grapes.add(grape)
        wines.append(wine)
    print(f"Created {len(wines)} wines.")

    # 4. Create inventory for each restaurant for each wine
    for rest in restaurants:
        for wine in wines:
            # Create inventory
            buying = Decimal(random.randint(20, 100))
            selling = buying * Decimal(random.uniform(2.5, 4.0)) # typical restaurant markup
            selling = round(selling, 2)
            margin = round(((selling - buying) / selling) * 100, 2)
            Inventory.objects.update_or_create(
                restaurant=rest,
                wine=wine,
                defaults={
                    "quantity": random.randint(10, 100),
                    "buying_price": buying,
                    "selling_price": selling,
                    "profit_margin": margin
                }
            )
    print(f"Inventory created for all {len(restaurants)} restaurants with {len(wines)} wines.")

if __name__ == '__main__':
    populate()
