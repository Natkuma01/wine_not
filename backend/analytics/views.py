from datetime import datetime, timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PageVisit
from .serializers import PageVisitSerializer


class TrackVisitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
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


class VisitStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        thirty_days_ago = datetime.now() - timedelta(days=30)
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
            timestamp__date=datetime.now().date()
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
