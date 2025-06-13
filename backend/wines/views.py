from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from .models import Wine, Grape
from .serializers import WineSerializer, GrapeSerializer


class WineViewSet(viewsets.ModelViewSet):
    queryset = Wine.objects.all()
    serializer_class = WineSerializer

class GrapeViewSet(viewsets.ModelViewSet):
    queryset = Grape.objects.all()
    serializer_class = GrapeSerializer


# class GrapeByWineTypeView(APIView):
#     def get(self, request, wine_type_id):
#         grapes = Grape.objects.filter(wine_type_id=wine_type_id)
#         serializer = GrapeSerializer(grapes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

