from django.db import models


class Restaurant(models.Model):
    name = models.CharField(max_length = 50)
    address = models.CharField(max_length = 200)
    
    def __str__(self):
        return f"{self.name}"