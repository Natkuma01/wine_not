from django.conf import settings
from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class SendDemoCredentialsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_sends_demo_credentials_email_and_syncs_demo_user(self):
        response = self.client.post(
            "/api/demo-credentials/",
            {"email": "viewer@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["detail"],
            "Demo credentials sent successfully. Check your email inbox.",
        )

        demo_user = User.objects.get(username=settings.DEMO_CREDENTIAL_USERNAME)
        self.assertTrue(
            demo_user.check_password(settings.DEMO_CREDENTIAL_PASSWORD),
        )

        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ["viewer@example.com"])
        self.assertIn(settings.DEMO_CREDENTIAL_USERNAME, message.body)
        self.assertIn(settings.DEMO_CREDENTIAL_PASSWORD, message.body)

    def test_rejects_missing_email(self):
        response = self.client.post(
            "/api/demo-credentials/",
            {"email": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Email address is required.")
