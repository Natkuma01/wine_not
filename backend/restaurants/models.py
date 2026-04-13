from django.db import models


class Restaurant(models.Model):
    name = models.CharField(max_length=50)
    street_number = models.CharField(max_length=20, blank=True, default='')
    street_name = models.CharField(max_length=100, blank=True, default='')
    floor_unit = models.CharField(max_length=50, blank=True, default='')
    postal_code = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=2, blank=True, default='')

    def __str__(self):
        return f"{self.name}"