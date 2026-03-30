from django.conf import settings
from django.http import JsonResponse

from .oidc import OidcAuthenticationError, authenticate_bearer_token, extract_bearer_token


class ApiBearerTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/bundles/"):
            if settings.OIDC_BYPASS_AUTH:
                return self.get_response(request)
            try:
                token = extract_bearer_token(request.headers.get("Authorization", ""))
                principal = authenticate_bearer_token(token)
            except OidcAuthenticationError as exc:
                return JsonResponse({"detail": str(exc)}, status=401)

            request.oauth_principal = principal

        return self.get_response(request)
