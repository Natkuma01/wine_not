from django.db import models
from django.conf import settings


class DailyWineSale(models.Model):
    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="daily_wine_sales",
        db_index=True,
    )
    inventory = models.ForeignKey(
        "inventories.Inventory",
        on_delete=models.CASCADE,
        related_name="daily_sales",
        db_index=True,
    )
    sale_date = models.DateField(db_index=True)
    quantity_sold = models.PositiveIntegerField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="daily_wine_sales",
    )
    notes = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-sale_date", "-updated_at", "-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["inventory", "sale_date"],
                name="unique_daily_sale_per_inventory_date",
            ),
        ]
        indexes = [
            models.Index(
                fields=["restaurant", "sale_date"],
                name="daily_sale_restaurant_date_idx",
            ),
        ]

    def __str__(self):
        return f"Sale for inventory {self.inventory_id} on {self.sale_date}"


class PageVisit(models.Model):
    path = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=64, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    referrer = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-timestamp"]
