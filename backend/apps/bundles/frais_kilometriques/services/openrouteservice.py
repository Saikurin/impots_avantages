import json
from dataclasses import dataclass
from decimal import Decimal
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings


class OpenRouteServiceError(Exception):
    pass


@dataclass
class GeocodedPoint:
    latitude: Decimal
    longitude: Decimal
    raw: dict[str, Any]


@dataclass
class RouteDistance:
    distance_km: Decimal
    distance_aller_retour_km: Decimal
    duree_secondes: int
    source: str
    raw: dict[str, Any]


def _get_headers() -> dict[str, str]:
    api_key = settings.OPENROUTESERVICE_API_KEY
    if not api_key:
        raise OpenRouteServiceError("OPENROUTESERVICE_API_KEY manquante.")
    return {
        "Authorization": api_key,
        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        "Content-Type": "application/json; charset=utf-8",
    }


def geocode_address(address: str) -> GeocodedPoint:
    params = urlencode({"text": address, "size": 1})
    url = f"{settings.OPENROUTESERVICE_BASE_URL}/geocode/search?{params}"
    request = Request(url, headers=_get_headers(), method="GET")

    with urlopen(request, timeout=15) as response:
        payload = json.loads(response.read().decode("utf-8"))

    features = payload.get("features") or []
    if not features:
        raise OpenRouteServiceError("Aucun resultat de geocodage pour cette adresse.")

    coordinates = features[0]["geometry"]["coordinates"]
    longitude, latitude = coordinates[0], coordinates[1]
    return GeocodedPoint(
        latitude=Decimal(str(latitude)),
        longitude=Decimal(str(longitude)),
        raw=payload,
    )


def get_route_distance(*, start_latitude: Decimal, start_longitude: Decimal, end_latitude: Decimal, end_longitude: Decimal) -> RouteDistance:
    url = f"{settings.OPENROUTESERVICE_BASE_URL}/v2/directions/driving-car"
    body = json.dumps(
        {
            "coordinates": [
                [float(start_longitude), float(start_latitude)],
                [float(end_longitude), float(end_latitude)],
            ]
        }
    ).encode("utf-8")
    request = Request(url, data=body, headers=_get_headers(), method="POST")

    with urlopen(request, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))

    routes = payload.get("routes") or []
    if not routes:
        raise OpenRouteServiceError("Aucun itineraire retourne par OpenRouteService.")

    summary = routes[0].get("summary") or {}
    distance_km = Decimal(str(summary.get("distance", 0))) / Decimal("1000")
    duree_secondes = int(summary.get("duration", 0))

    return RouteDistance(
        distance_km=distance_km.quantize(Decimal("0.01")),
        distance_aller_retour_km=(distance_km * Decimal("2")).quantize(Decimal("0.01")),
        duree_secondes=duree_secondes,
        source="openrouteservice",
        raw=payload,
    )
