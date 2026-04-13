from django.urls import path

from .views import TrackVisitView, VisitStatsView

urlpatterns = [
    path("track/", TrackVisitView.as_view(), name="track-visit"),
    path("stats/", VisitStatsView.as_view(), name="visit-stats"),
]
