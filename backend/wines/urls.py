from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WineViewSet, GrapeViewSet


router = DefaultRouter()
router.register('wines', WineViewSet, basename='wines')
router.register('grapes', GrapeViewSet, basename='grapes')


urlpatterns = [
    path('', include(router.urls)),
]