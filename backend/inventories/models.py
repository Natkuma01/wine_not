from django.db import models


class Inventory(models.Model):
    wine = models.ForeignKey(
        'wines.Wine',
        on_delete=models.CASCADE,
        related_name='inventory',
        db_index=True,
    )
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='inventory',
        db_index=True,
    )
    quantity = models.PositiveIntegerField(default=0)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        wine = self.__dict__.get('wine')
        restaurant = self.__dict__.get('restaurant')
        wine_name = wine.name if wine else f"Wine {self.wine_id}"
        restaurant_name = restaurant.name if restaurant else f"Restaurant {self.restaurant_id}"
        return f"Inventory for {wine_name} at {restaurant_name}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['wine', 'restaurant'],
                name='unique_inventory_wine_restaurant',
            ),
        ]
        indexes = [
            models.Index(
                fields=['restaurant', 'wine'],
                name='inventory_restaurant_wine_idx',
            ),
        ]

