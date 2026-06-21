from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='restaurant',
            name='address',
        ),
        migrations.AddField(
            model_name='restaurant',
            name='street_number',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='street_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='floor_unit',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='postal_code',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='city',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='state',
            field=models.CharField(blank=True, default='', max_length=2),
        ),
    ]
