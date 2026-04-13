from django.db import models


class PageVisit(models.Model):
    path = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=64, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    referrer = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-timestamp"]
