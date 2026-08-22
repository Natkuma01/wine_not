import os
import django
import urllib.request
import urllib.parse
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from wines.models import Wine

def search_wikimedia_image(query):
    # Try a few queries: specific bottle, or just the producer
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "prop": "pageimages",
        "piprop": "original",
        "generator": "search",
        "gsrsearch": query,
        "gsrlimit": 1
    })
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if 'query' in data and 'pages' in data['query']:
                pages = data['query']['pages']
                for page_id in pages:
                    if 'original' in pages[page_id]:
                        image_url = pages[page_id]['original']['source']
                        # Simple check if it might be an image
                        if image_url.lower().endswith(('.png', '.jpg', '.jpeg', '.svg')):
                            return image_url
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return None

def update_images():
    wines = Wine.objects.all()
    default_image_url = "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" # Wine glass default
    
    default_count = 0
    updated_count = 0
    
    for wine in wines:
        # Search queries to try
        queries = [
            f"{wine.name} bottle",
            f"{wine.name} wine",
            f"{wine.producer} wine"
        ]
        
        found_url = None
        for q in queries:
            found_url = search_wikimedia_image(q)
            if found_url:
                break
                
        if found_url:
            wine.imageURL = found_url
            wine.save()
            updated_count += 1
            print(f"[{wine.name}]: Found specific image -> {found_url}")
        else:
            wine.imageURL = default_image_url
            wine.save()
            default_count += 1
            print(f"[{wine.name}]: Not found, using default.")
            
    print(f"\nFinished updating images.")
    print(f"Total specific images found: {updated_count}")
    print(f"Total default images used: {default_count}")

if __name__ == '__main__':
    update_images()
