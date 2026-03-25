from apps.bundles.frais_kilometriques.models import AdresseDomicile, DistanceTrajet, SiteTravail
from apps.bundles.frais_kilometriques.services.openrouteservice import (
    OpenRouteServiceError,
    geocode_address,
    get_route_distance,
)


def build_full_address(*, adresse_ligne_1: str, adresse_ligne_2: str, code_postal: str, ville: str, pays: str) -> str:
    parts = [adresse_ligne_1, adresse_ligne_2, code_postal, ville, pays]
    return ", ".join(part.strip() for part in parts if part and part.strip())


def geocode_domicile_if_needed(domicile: AdresseDomicile) -> AdresseDomicile:
    if domicile.latitude is not None and domicile.longitude is not None:
        return domicile

    point = geocode_address(
        build_full_address(
            adresse_ligne_1=domicile.adresse_ligne_1,
            adresse_ligne_2=domicile.adresse_ligne_2,
            code_postal=domicile.code_postal,
            ville=domicile.ville,
            pays=domicile.pays,
        )
    )
    domicile.latitude = point.latitude
    domicile.longitude = point.longitude
    domicile.save(update_fields=["latitude", "longitude", "updated_at"])
    return domicile


def geocode_site_if_needed(site: SiteTravail) -> SiteTravail:
    if site.latitude is not None and site.longitude is not None:
        return site

    point = geocode_address(
        build_full_address(
            adresse_ligne_1=site.adresse_ligne_1,
            adresse_ligne_2=site.adresse_ligne_2,
            code_postal=site.code_postal,
            ville=site.ville,
            pays=site.pays,
        )
    )
    site.latitude = point.latitude
    site.longitude = point.longitude
    site.save(update_fields=["latitude", "longitude", "updated_at"])
    return site


def get_or_compute_distance(*, domicile: AdresseDomicile, site: SiteTravail) -> DistanceTrajet:
    cached = DistanceTrajet.objects.filter(
        simulation=domicile.simulation,
        adresse_domicile=domicile,
        site_travail=site,
    ).first()
    if cached is not None:
        return cached

    domicile = geocode_domicile_if_needed(domicile)
    site = geocode_site_if_needed(site)

    if domicile.latitude is None or domicile.longitude is None or site.latitude is None or site.longitude is None:
        raise OpenRouteServiceError("Coordonnees GPS manquantes pour calculer la distance.")

    route = get_route_distance(
        start_latitude=domicile.latitude,
        start_longitude=domicile.longitude,
        end_latitude=site.latitude,
        end_longitude=site.longitude,
    )

    return DistanceTrajet.objects.create(
        simulation=domicile.simulation,
        adresse_domicile=domicile,
        site_travail=site,
        distance_km=route.distance_km,
        distance_aller_retour_km=route.distance_aller_retour_km,
        duree_secondes=route.duree_secondes,
        source_calcul=route.source,
    )
