import logging
from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DailyWineSale, PageVisit
from .serializers import DailyWineSaleSerializer, PageVisitSerializer

logger = logging.getLogger(__name__)


class TrackVisitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = PageVisitSerializer(data=request.data)
            if serializer.is_valid():
                forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
                ip = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")
                serializer.save(
                    user_agent=request.META.get("HTTP_USER_AGENT", "")[:500],
                    ip_address=ip or None,
                )
                return Response({"ok": True}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.exception("Error tracking page visit")
            return Response(
                {"detail": "Unable to track visit right now. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VisitStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            thirty_days_ago = timezone.now() - timedelta(days=30)
            qs = PageVisit.objects.filter(timestamp__gte=thirty_days_ago)

            by_day = (
                qs.annotate(date=TruncDate("timestamp"))
                .values("date")
                .annotate(count=Count("id"))
                .order_by("date")
            )

            top_pages = (
                qs.values("path")
                .annotate(count=Count("id"))
                .order_by("-count")[:10]
            )

            total = PageVisit.objects.count()
            today_count = PageVisit.objects.filter(
                timestamp__date=timezone.now().date()
            ).count()
            unique_sessions = (
                qs.exclude(session_id="").values("session_id").distinct().count()
            )

            return Response({
                "total": total,
                "today": today_count,
                "unique_sessions_30d": unique_sessions,
                "by_day": [{"date": str(r["date"]), "count": r["count"]} for r in by_day],
                "top_pages": list(top_pages),
            })
        except Exception as exc:
            logger.exception("Error fetching analytics stats")
            return Response(
                {"detail": "Unable to load analytics at this time. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DailyWineSaleListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DailyWineSaleSerializer

    def get_queryset(self):
        queryset = DailyWineSale.objects.select_related(
            "restaurant",
            "inventory",
            "inventory__wine",
        )
        restaurant_id = self.request.query_params.get("restaurant_id")
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)
        return queryset

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        sale, created = DailyWineSale.objects.get_or_create(
            inventory=validated_data["inventory"],
            sale_date=validated_data["sale_date"],
            defaults={
                "restaurant": validated_data["restaurant"],
                "quantity_sold": validated_data["quantity_sold"],
                "user": self.request.user,
                "notes": validated_data.get("notes", ""),
            },
        )

        if not created:
            sale.quantity_sold += validated_data["quantity_sold"]
            sale.restaurant = validated_data["restaurant"]
            sale.user = self.request.user
            incoming_notes = validated_data.get("notes", "").strip()
            if incoming_notes:
                sale.notes = (
                    f"{sale.notes}\n{incoming_notes}".strip()
                    if sale.notes else incoming_notes
                )
            sale.save(update_fields=["quantity_sold", "restaurant", "user", "notes", "updated_at"])

        serializer.instance = sale
