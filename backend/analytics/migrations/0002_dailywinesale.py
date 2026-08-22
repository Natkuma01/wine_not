from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ("inventories", "0009_alter_inventory_unique_together_and_more"),
        ("restaurants", "0002_update_restaurant_address_fields"),
        ("analytics", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="DailyWineSale",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("sale_date", models.DateField(db_index=True)),
                ("quantity_sold", models.PositiveIntegerField()),
                ("notes", models.TextField(blank=True, default="")),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "inventory",
                    models.ForeignKey(
                        db_index=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="daily_sales",
                        to="inventories.inventory",
                    ),
                ),
                (
                    "restaurant",
                    models.ForeignKey(
                        db_index=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="daily_wine_sales",
                        to="restaurants.restaurant",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="daily_wine_sales",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-sale_date", "-updated_at", "-id"],
            },
        ),
        migrations.AddConstraint(
            model_name="dailywinesale",
            constraint=models.UniqueConstraint(
                fields=("inventory", "sale_date"),
                name="unique_daily_sale_per_inventory_date",
            ),
        ),
        migrations.AddIndex(
            model_name="dailywinesale",
            index=models.Index(
                fields=["restaurant", "sale_date"],
                name="daily_sale_restaurant_date_idx",
            ),
        ),
    ]
