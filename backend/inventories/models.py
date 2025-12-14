from django.db import models


class Inventory(models.Model):
    wine = models.ForeignKey('wines.Wine', on_delete=models.CASCADE, related_name='inventory')
    restaurant = models.ForeignKey('restaurants.Restaurant', on_delete=models.CASCADE, related_name='inventory')
    image = models.URLField(null=True, blank=True)          # image get from Wine model, this field may be not needed
    quantity = models.PositiveIntegerField(default=0)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    profit_margin = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    
    def __str__(self):
        return f"Inventory for {self.wine.name} at {self.restaurant.name}"

        class Meta:
            unique_together = ('wine', 'restaurant')

