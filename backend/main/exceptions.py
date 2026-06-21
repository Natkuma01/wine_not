import logging

from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Transform DRF exceptions into consistent JSON responses."""
    response = exception_handler(exc, context)
    if response is not None:
        data = response.data
        if isinstance(data, dict):
            if "detail" in data:
                response.data = {"message": str(data["detail"])}
            else:
                response.data = {"message": data}
        else:
            response.data = {"message": str(data)}
        return response

    logger.exception("Unhandled API exception", exc_info=exc)
    return Response(
        {"message": "A server error occurred. Please try again later."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
