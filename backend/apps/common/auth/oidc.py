from dataclasses import dataclass

import jwt
from django.conf import settings


class OidcAuthenticationError(Exception):
    pass


@dataclass
class AuthenticatedPrincipal:
    subject: str
    client_id: str
    claims: dict


def authenticate_bearer_token(token: str) -> AuthenticatedPrincipal:
    try:
        signing_key = jwt.PyJWKClient(settings.OIDC_JWKS_URL).get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.OIDC_FRONTEND_ISSUER,
            options={"verify_aud": False},
        )
    except Exception as exc:  # noqa: BLE001
        raise OidcAuthenticationError("Token OAuth invalide.") from exc

    client_id = claims.get("azp") or claims.get("client_id")
    if not client_id or client_id not in settings.OIDC_ALLOWED_CLIENT_IDS:
        raise OidcAuthenticationError("Client OAuth non autorise.")

    subject = claims.get("sub")
    if not subject:
        raise OidcAuthenticationError("Sujet OAuth manquant.")

    return AuthenticatedPrincipal(subject=subject, client_id=client_id, claims=claims)


def extract_bearer_token(authorization_header: str) -> str:
    prefix = "Bearer "
    if not authorization_header or not authorization_header.startswith(prefix):
        raise OidcAuthenticationError("Header Authorization Bearer manquant.")
    return authorization_header[len(prefix) :].strip()
