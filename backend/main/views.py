from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(APIView):
    """Create a new user. No authentication required."""
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username:
            return Response(
                {"detail": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not password:
            return Response(
                {"detail": "Password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(password) < 6:
            return Response(
                {"detail": "Password must be at least 6 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "A user with that username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        User.objects.create_user(username=username, password=password)
        return Response(
            {"detail": "Account created successfully. You can now log in."},
            status=status.HTTP_201_CREATED,
        )
