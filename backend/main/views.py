import logging

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


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

        try:
            User.objects.create_user(username=username, password=password)
        except Exception as exc:
            logger.exception("Failed to create user account")
            return Response(
                {"detail": "Unable to create account at this time. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"detail": "Account created successfully. You can now log in."},
            status=status.HTTP_201_CREATED,
        )


class SendDemoCredentialsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        recipient_email = request.data.get("email", "").strip()

        if not recipient_email:
            return Response(
                {"detail": "Email address is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_email(recipient_email)
        except ValidationError:
            return Response(
                {"detail": "Please enter a valid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        demo_username = settings.DEMO_CREDENTIAL_USERNAME
        demo_password = settings.DEMO_CREDENTIAL_PASSWORD

        demo_user, created = User.objects.get_or_create(username=demo_username)
        demo_user.set_password(demo_password)
        if created and not demo_user.email:
            demo_user.email = recipient_email
        demo_user.save()

        subject = "Your Wine Inventory demo login credentials"
        message = (
            "Thanks for checking out the Wine Inventory portfolio.\n\n"
            "Use the demo credentials below to sign in:\n"
            f"Username: {demo_username}\n"
            f"Password: {demo_password}\n\n"
            "These demo credentials are the same for every viewer."
        )

        try:
            send_mail(
                subject,
                message,
                settings.DEMO_CREDENTIAL_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )
        except Exception:
            logger.exception("Failed to send demo credentials email")
            return Response(
                {
                    "detail": (
                        "Unable to send the demo credentials email right now. "
                        "Please verify the mail server settings and try again."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"detail": "Demo credentials sent successfully. Check your email inbox."},
            status=status.HTTP_200_OK,
        )
