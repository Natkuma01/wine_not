from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("inventories", "0007_alter_inventory_unique_together"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="inventory",
            name="profit_margin",
        ),
    ]
