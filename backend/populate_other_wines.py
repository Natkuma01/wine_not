import os
import django
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from restaurants.models import Restaurant
from wines.models import Wine, Grape
from inventories.models import Inventory

def populate_other_wines():
    restaurants = list(Restaurant.objects.all())
    print(f"Found {len(restaurants)} restaurants.")

    # Grapes
    chardonnay, _ = Grape.objects.get_or_create(name='Chardonnay')
    pinot_noir, _ = Grape.objects.get_or_create(name='Pinot Noir')
    glera, _ = Grape.objects.get_or_create(name='Glera')
    semillon, _ = Grape.objects.get_or_create(name='Sémillon')
    furmint, _ = Grape.objects.get_or_create(name='Furmint')
    pinot_gris, _ = Grape.objects.get_or_create(name='Pinot Gris')
    ribolla_gialla, _ = Grape.objects.get_or_create(name='Ribolla Gialla')

    wines_data = [
        # 5 Sparkling Wines
        {
            "name": "Dom Pérignon Vintage", "producer": "Moët & Chandon", 
            "country": "France", "region": "Champagne", "year": 2013, "wine_type": "sparkling",
            "imageURL": "https://images.unsplash.com/photo-1590272456421-2e6509f6e66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Complex, brioche, and crisp acidity.", "grape": chardonnay
        },
        {
            "name": "Cristal Brut", "producer": "Louis Roederer", 
            "country": "France", "region": "Champagne", "year": 2014, "wine_type": "sparkling",
            "imageURL": "https://images.unsplash.com/photo-1601334969446-0b1a03e639de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Elegant, fine bubbles, citrus notes.", "grape": pinot_noir
        },
        {
            "name": "Prosecco Superiore", "producer": "Bisol", 
            "country": "Italy", "region": "Veneto", "year": 2021, "wine_type": "sparkling",
            "imageURL": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Fresh, floral, and fruity.", "grape": glera
        },
        {
            "name": "Franciacorta Cuvée Prestige", "producer": "Ca' del Bosco", 
            "country": "Italy", "region": "Lombardy", "year": 2019, "wine_type": "sparkling",
            "imageURL": "https://images.unsplash.com/photo-1582236544078-75217fc35aeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Rich, creamy texture with biscuit notes.", "grape": chardonnay
        },
        {
            "name": "Cava Gran Reserva", "producer": "Gramona", 
            "country": "Spain", "region": "Penedès", "year": 2015, "wine_type": "sparkling",
            "imageURL": "https://images.unsplash.com/photo-1627956973347-16788db32bc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Toasted almond, baked apple, vibrant.", "grape": chardonnay
        },
        
        # 2 Dessert Wines
        {
            "name": "Château d'Yquem", "producer": "Château d'Yquem", 
            "country": "France", "region": "Sauternes", "year": 2009, "wine_type": "dessert",
            "imageURL": "https://images.unsplash.com/photo-1632709670114-6ba141940989?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Luscious, apricot, honey, and saffron.", "grape": semillon
        },
        {
            "name": "Tokaji Aszú 5 Puttonyos", "producer": "Royal Tokaji", 
            "country": "Hungary", "region": "Tokaj", "year": 2016, "wine_type": "dessert",
            "imageURL": "https://images.unsplash.com/photo-1572913017567-02f06497cecd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Sweet, marmalade, and vibrant acidity.", "grape": furmint
        },

        # 2 Orange Wines
        {
            "name": "Radikon Ribolla Gialla", "producer": "Radikon", 
            "country": "Italy", "region": "Friuli", "year": 2014, "wine_type": "orange",
            "imageURL": "https://images.unsplash.com/photo-1624021237937-23fce23ba567?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Tannic, dried fruit, complex and earthy.", "grape": ribolla_gialla
        },
        {
            "name": "Gravner Breg Anfora", "producer": "Gravner", 
            "country": "Italy", "region": "Friuli", "year": 2011, "wine_type": "orange",
            "imageURL": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Amber, deep savory notes, long finish.", "grape": pinot_gris
        }
    ]

    wines = []
    for data in wines_data:
        grape = data.pop("grape")
        wine, _ = Wine.objects.get_or_create(**data)
        wine.grapes.add(grape)
        wines.append(wine)
    print(f"Created {len(wines)} new wines (5 sparkling, 2 dessert, 2 orange).")

    # Create inventory for each restaurant
    for rest in restaurants:
        for wine in wines:
            # Different base price ranges depending on type
            if wine.wine_type == "sparkling":
                buying = Decimal(random.randint(30, 200))
            elif wine.wine_type == "dessert":
                buying = Decimal(random.randint(50, 300))
            else: # orange
                buying = Decimal(random.randint(25, 80))
            
            selling = buying * Decimal(random.uniform(2.5, 4.0))
            selling = round(selling, 2)
            margin = round(((selling - buying) / selling) * 100, 2)
            Inventory.objects.update_or_create(
                restaurant=rest,
                wine=wine,
                defaults={
                    "quantity": random.randint(5, 40),
                    "buying_price": buying,
                    "selling_price": selling,
                    "profit_margin": margin
                }
            )
    print(f"Inventory created for {len(restaurants)} restaurants with {len(wines)} new wines.")

if __name__ == '__main__':
    populate_other_wines()
