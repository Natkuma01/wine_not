import os
import django
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from restaurants.models import Restaurant
from wines.models import Wine, Grape
from inventories.models import Inventory

def populate_reds():
    # Get restaurants
    restaurants = list(Restaurant.objects.all())
    print(f"Found {len(restaurants)} restaurants.")

    # 1. Ensure grapes exist
    cabernet_sauvignon, _ = Grape.objects.get_or_create(name='Cabernet Sauvignon')
    pinot_noir, _ = Grape.objects.get_or_create(name='Pinot Noir')
    sangiovese, _ = Grape.objects.get_or_create(name='Sangiovese')
    syrah, _ = Grape.objects.get_or_create(name='Syrah')

    # 10 red wines from 5 different regions
    # Regions: Bordeaux, Burgundy, Tuscany, Rhône Valley, Napa Valley
    wines_data = [
        {
            "name": "Château Margaux", "producer": "Château Margaux", 
            "country": "France", "region": "Bordeaux", "year": 2015, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Elegant, complex with dark fruits and floral notes.", "grape": cabernet_sauvignon
        },
        {
            "name": "Château Latour", "producer": "Château Latour", 
            "country": "France", "region": "Bordeaux", "year": 2010, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Powerful, structured with cassis and cedar.", "grape": cabernet_sauvignon
        },
        {
            "name": "La Tâche Grand Cru", "producer": "Domaine de la Romanée-Conti", 
            "country": "France", "region": "Burgundy", "year": 2017, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Aromatic, spicy, and deeply concentrated.", "grape": pinot_noir
        },
        {
            "name": "Musigny Grand Cru", "producer": "Domaine Comte Georges de Vogüé", 
            "country": "France", "region": "Burgundy", "year": 2019, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1566367576974-98ce4ff4b0d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Silky texture, red berries, and floral.", "grape": pinot_noir
        },
        {
            "name": "Tignanello", "producer": "Marchesi Antinori", 
            "country": "Italy", "region": "Tuscany", "year": 2018, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1559564114-0e31846b0a88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Rich, cherries, vanilla, and spice.", "grape": sangiovese
        },
        {
            "name": "Sassicaia", "producer": "Tenuta San Guido", 
            "country": "Italy", "region": "Tuscany", "year": 2019, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Refined, dark plum, herbs, and tobacco.", "grape": cabernet_sauvignon
        },
        {
            "name": "Hermitage La Chapelle", "producer": "Paul Jaboulet Aîné", 
            "country": "France", "region": "Rhône Valley", "year": 2015, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Dense, blackberry, pepper, and smoke.", "grape": syrah
        },
        {
            "name": "Côte-Rôtie La Landonne", "producer": "E. Guigal", 
            "country": "France", "region": "Rhône Valley", "year": 2016, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1623592682977-80252b474bb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Intense, dark fruit, olives, and roasted meat.", "grape": syrah
        },
        {
            "name": "Opus One", "producer": "Opus One Winery", 
            "country": "USA", "region": "Napa Valley", "year": 2018, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1614316047535-9610191ed4e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Lush, dark cherry, cocoa, and velvety tannins.", "grape": cabernet_sauvignon
        },
        {
            "name": "Dominus", "producer": "Dominus Estate", 
            "country": "USA", "region": "Napa Valley", "year": 2018, "wine_type": "red",
            "imageURL": "https://images.unsplash.com/photo-1596738914856-787f0b2fcfdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            "notes": "Structured, black plum, tobacco, and earth.", "grape": cabernet_sauvignon
        }
    ]

    wines = []
    for data in wines_data:
        grape = data.pop("grape")
        wine, _ = Wine.objects.get_or_create(**data)
        wine.grapes.add(grape)
        wines.append(wine)
    print(f"Created {len(wines)} red wines.")

    # 4. Create inventory for each restaurant for each wine
    for rest in restaurants:
        for wine in wines:
            # Create inventory
            buying = Decimal(random.randint(40, 250))
            selling = buying * Decimal(random.uniform(2.5, 4.0)) # typical restaurant markup
            selling = round(selling, 2)
            margin = round(((selling - buying) / selling) * 100, 2)
            Inventory.objects.update_or_create(
                restaurant=rest,
                wine=wine,
                defaults={
                    "quantity": random.randint(5, 50),
                    "buying_price": buying,
                    "selling_price": selling,
                    "profit_margin": margin
                }
            )
    print(f"Inventory created for {len(restaurants)} restaurants with {len(wines)} red wines.")

if __name__ == '__main__':
    populate_reds()
