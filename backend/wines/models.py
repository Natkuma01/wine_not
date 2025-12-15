from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Wine(models.Model):
    name = models.CharField(max_length=100)
    producer = models.CharField(null=True, blank=True, max_length=100)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True, null=True)
    imageURL = models.URLField(max_length=500, blank=True, null=True)
    notes = models.TextField(max_length=2000, blank=True, null=True)
    year = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MaxValueValidator (9999),
            MinValueValidator(1000)
        ]
    )
    TYPE_CHOICES = (
        ('white', 'white'),
        ('red', 'red'),
        ('sparkling', 'sparkling'),
        ('orange', 'orange'),
        ('dessert', 'dessert'),
    )
    wine_type = models.CharField(max_length=20, choices=TYPE_CHOICES, null=True) 
    grapes = models.ManyToManyField('Grape', related_name='wines')      # allow user to add more than 1 grape

    def __str__(self):
        return f"{self.name} ({self.year})"


class Grape(models.Model):
    name = models.CharField(max_length=20)      # 'name' use in WineTypeSerializer slug_field

    def __str__(self):
        return self.name

    

