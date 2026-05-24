from django.contrib.auth.models import Group, User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(APIView):
    """Create a new user. Only admin users may create accounts."""
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if not request.user.is_superuser and not request.user.groups.filter(name="admin").exists():
            return Response(
                {"detail": "Only admins can create new accounts."},
                status=status.HTTP_403_FORBIDDEN,
            )

        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")
        email = request.data.get("email", "").strip()
        role = request.data.get("role", "").strip().lower()

        if not username:
            return Response(
                {"detail": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not email:
            return Response(
                {"detail": "Email is required."},
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
        if role not in ["admin", "staffs"]:
            return Response(
                {"detail": "Role must be either 'admin' or 'staffs'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "A user with that username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "A user with that email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(username=username, password=password, email=email)
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)
        user.save()

        return Response(
            {"detail": "Account created successfully. You can now log in."},
            status=status.HTTP_201_CREATED,
        )


class CurrentUserView(APIView):
    """Return the currently authenticated user's profile data."""
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = request.user
        role = "admin" if user.is_superuser or user.groups.filter(name="admin").exists() else "staffs"
        return Response(
            {
                "username": user.username,
                "email": user.email,
                "role": role,
            }
        )

    def patch(self, request: Request) -> Response:
        user = request.user
        role = "admin" if user.is_superuser or user.groups.filter(name="admin").exists() else "staffs"
        email = request.data.get("email", "").strip()

        if user.email:
            return Response(
                {"detail": "Email cannot be changed once set."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"detail": "Email is not valid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "A user with that email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.email = email
        user.save()

        return Response(
            {
                "username": user.username,
                "email": user.email,
                "role": role,
            }
        )
