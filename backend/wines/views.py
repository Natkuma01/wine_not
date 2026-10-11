from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from .models import Wine, Grape
from .serializers import WineSerializer, GrapeSerializer


from rest_framework.pagination import PageNumberPagination

class WinePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class WineViewSet(viewsets.ModelViewSet):
    serializer_class = WineSerializer
    pagination_class = WinePagination

    def get_queryset(self):
        queryset = Wine.objects.prefetch_related('grapes').all().order_by('id')
        restaurant_id = self.request.query_params.get('restaurant_id')
        if restaurant_id:
            queryset = queryset.filter(inventory__restaurant_id=restaurant_id).distinct()
        
        wine_type = self.request.query_params.get('wine_type')
        if wine_type and wine_type != 'All Types of wines':
            queryset = queryset.filter(wine_type=wine_type)
        
        return queryset

class GrapeViewSet(viewsets.ModelViewSet):
    queryset = Grape.objects.all()
    serializer_class = GrapeSerializer


# class GrapeByWineTypeView(APIView):
#     def get(self, request, wine_type_id):
#         grapes = Grape.objects.filter(wine_type_id=wine_type_id)
#         serializer = GrapeSerializer(grapes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

