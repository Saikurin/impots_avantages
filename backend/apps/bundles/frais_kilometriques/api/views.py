import json
from datetime import date
from decimal import Decimal

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.bundles.frais_kilometriques.models import (
    AdresseDomicile,
    DistanceTrajet,
    JourTravaille,
    SimulationFraisKilometriques,
    SiteTravail,
    Vehicule,
)
from apps.bundles.frais_kilometriques.services.baremes import apply_bareme
from apps.bundles.frais_kilometriques.services.distances import (
    geocode_domicile_if_needed,
    geocode_site_if_needed,
    get_or_compute_distance,
)
from apps.bundles.frais_kilometriques.services.imports import (
    ImportFraisKilometriquesError,
    import_calendar_xlsx,
)
from apps.bundles.frais_kilometriques.services.openrouteservice import OpenRouteServiceError


def _serialize_simulation(simulation: SimulationFraisKilometriques) -> dict:
    return {
        "id": simulation.id,
        "annee_fiscale": simulation.annee_fiscale,
        "date_debut_periode": simulation.date_debut_periode.isoformat(),
        "date_fin_periode": simulation.date_fin_periode.isoformat(),
        "statut": simulation.statut,
        "has_domicile": hasattr(simulation, "domicile"),
        "sites_count": simulation.sites_travail.count(),
        "vehicules_count": simulation.vehicules.count(),
        "jours_count": simulation.jours_travailles.count(),
        "created_at": simulation.created_at.isoformat(),
        "updated_at": simulation.updated_at.isoformat(),
    }


def _get_owner_sub(request: HttpRequest) -> str | None:
    principal = getattr(request, "oauth_principal", None)
    if principal is None:
        return None
    return principal.subject


def _get_simulations_queryset(request: HttpRequest):
    owner_sub = _get_owner_sub(request)
    queryset = SimulationFraisKilometriques.objects.all()
    if owner_sub is not None:
        queryset = queryset.filter(owner_sub=owner_sub)
    return queryset


def _get_simulation_or_none(request: HttpRequest, simulation_id: int):
    return _get_simulations_queryset(request).filter(id=simulation_id).first()


def _serialize_domicile(domicile: AdresseDomicile) -> dict:
    return {
        "id": domicile.id,
        "libelle": domicile.libelle,
        "adresse_ligne_1": domicile.adresse_ligne_1,
        "adresse_ligne_2": domicile.adresse_ligne_2,
        "code_postal": domicile.code_postal,
        "ville": domicile.ville,
        "pays": domicile.pays,
        "latitude": float(domicile.latitude) if domicile.latitude is not None else None,
        "longitude": float(domicile.longitude) if domicile.longitude is not None else None,
        "created_at": domicile.created_at.isoformat(),
        "updated_at": domicile.updated_at.isoformat(),
    }


def _serialize_site(site: SiteTravail) -> dict:
    return {
        "id": site.id,
        "nom": site.nom,
        "adresse_ligne_1": site.adresse_ligne_1,
        "adresse_ligne_2": site.adresse_ligne_2,
        "code_postal": site.code_postal,
        "ville": site.ville,
        "pays": site.pays,
        "latitude": float(site.latitude) if site.latitude is not None else None,
        "longitude": float(site.longitude) if site.longitude is not None else None,
        "actif": site.actif,
        "created_at": site.created_at.isoformat(),
        "updated_at": site.updated_at.isoformat(),
    }


def _serialize_distance(distance: DistanceTrajet) -> dict:
    return {
        "id": distance.id,
        "distance_km": float(distance.distance_km),
        "distance_aller_retour_km": float(distance.distance_aller_retour_km),
        "duree_secondes": distance.duree_secondes,
        "source_calcul": distance.source_calcul,
        "site_travail_id": distance.site_travail_id,
        "adresse_domicile_id": distance.adresse_domicile_id,
        "date_calcul": distance.date_calcul.isoformat(),
    }


def _serialize_vehicule(vehicule: Vehicule) -> dict:
    return {
        "id": vehicule.id,
        "marque": vehicule.marque,
        "modele": vehicule.modele,
        "immatriculation": vehicule.immatriculation,
        "type_vehicule": vehicule.type_vehicule,
        "puissance_administrative": vehicule.puissance_administrative,
        "date_achat": vehicule.date_achat.isoformat() if vehicule.date_achat else None,
        "date_vente": vehicule.date_vente.isoformat() if vehicule.date_vente else None,
        "actif": vehicule.actif,
        "created_at": vehicule.created_at.isoformat(),
        "updated_at": vehicule.updated_at.isoformat(),
    }


def _serialize_jour(jour: JourTravaille) -> dict:
    return {
        "id": jour.id,
        "date": jour.date.isoformat(),
        "type_jour": jour.type_jour,
        "site_travail_id": jour.site_travail_id,
        "vehicule_id": jour.vehicule_id,
        "distance_km": float(jour.distance_km),
        "montant_eur": float(jour.montant_eur),
        "commentaire": jour.commentaire,
        "created_at": jour.created_at.isoformat(),
        "updated_at": jour.updated_at.isoformat(),
    }


def _serialize_resultat(simulation: SimulationFraisKilometriques, *, year: int | None = None) -> dict:
    jours_queryset = simulation.jours_travailles.all()
    if year is not None:
        jours_queryset = jours_queryset.filter(date__year=year)

    jours = list(jours_queryset)
    total_jours = len(jours)
    jours_site = [jour for jour in jours if jour.type_jour == JourTravaille.TypeJour.SITE]
    jours_teletravail = [jour for jour in jours if jour.type_jour == JourTravaille.TypeJour.TELETRAVAIL]
    jours_conges = [jour for jour in jours if jour.type_jour == JourTravaille.TypeJour.CONGES]
    total_km_decimal = sum((jour.distance_km for jour in jours), Decimal("0.00"))
    total_km = round(float(total_km_decimal), 2)

    details_vehicules = []
    montant_total = Decimal("0.00")
    for vehicule in simulation.vehicules.order_by("created_at"):
        jours_vehicule = [jour for jour in jours_site if jour.vehicule_id == vehicule.id]
        total_km_vehicule = sum((jour.distance_km for jour in jours_vehicule), Decimal("0.00"))
        bareme = apply_bareme(vehicule=vehicule, total_km=total_km_vehicule)
        montant_total += bareme["montant_total_eur"]
        details_vehicules.append(
            {
                "vehicule": _serialize_vehicule(vehicule),
                "jours_site": len(jours_vehicule),
                "total_km": round(float(total_km_vehicule), 2),
                "bareme_type": bareme["bareme_type"],
                "bareme_puissance": bareme["bareme_puissance"],
                "formule": bareme["formule"],
                "montant_total_eur": float(bareme["montant_total_eur"]),
            }
        )

    return {
        "simulation": _serialize_simulation(simulation),
        "filtre": {
            "year": year,
            "available_years": sorted({jour.date.year for jour in simulation.jours_travailles.all()}),
        },
        "totaux": {
            "jours_total": total_jours,
            "jours_site": len(jours_site),
            "jours_teletravail": len(jours_teletravail),
            "jours_conges": len(jours_conges),
            "total_km": total_km,
            "montant_total_eur": float(montant_total),
        },
        "vehicules": details_vehicules,
        "jours": [_serialize_jour(jour) for jour in jours],
    }


@require_http_methods(["GET"])
def bundle_placeholder(request: HttpRequest) -> JsonResponse:
    return JsonResponse(
        {
            "bundle": "frais_kilometriques",
            "status": "ready",
            "message": "Le premier bundle backend est pret a etre implemente.",
        }
    )


@csrf_exempt
@require_http_methods(["GET", "POST", "DELETE"])
def simulations_collection(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        simulations = _get_simulations_queryset(request)[:20]
        return JsonResponse(
            {
                "items": [_serialize_simulation(simulation) for simulation in simulations],
            }
        )

    if request.method == "DELETE":
        payload = json.loads(request.body or "{}") if request.body else {}
        simulation_ids = payload.get("simulation_ids") or []
        if not isinstance(simulation_ids, list) or not simulation_ids:
            return JsonResponse(
                {"detail": "Le champ simulation_ids est obligatoire."},
                status=400,
            )

        deleted_count, _ = _get_simulations_queryset(request).filter(id__in=simulation_ids).delete()
        return JsonResponse({"deleted_count": deleted_count}, status=200)

    payload = json.loads(request.body or "{}") if request.body else {}
    current_year = date.today().year
    annee_fiscale = payload.get("annee_fiscale", current_year)
    date_debut_value = payload.get("date_debut_periode", f"{annee_fiscale}-01-01")
    date_fin_value = payload.get("date_fin_periode", f"{annee_fiscale}-12-31")

    date_debut = date.fromisoformat(date_debut_value)
    date_fin = date.fromisoformat(date_fin_value)

    simulation = SimulationFraisKilometriques.objects.create(
        owner_sub=_get_owner_sub(request) or "dev-bypass",
        annee_fiscale=annee_fiscale,
        date_debut_periode=date_debut,
        date_fin_periode=date_fin,
    )
    return JsonResponse(_serialize_simulation(simulation), status=201)


@csrf_exempt
@require_http_methods(["GET", "DELETE"])
def simulation_detail(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if request.method == "DELETE":
        simulation.delete()
        return JsonResponse({"deleted": True}, status=200)

    return JsonResponse(_serialize_simulation(simulation))


@csrf_exempt
@require_http_methods(["GET", "POST"])
def simulation_domicile(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if request.method == "GET":
        if not hasattr(simulation, "domicile"):
            return JsonResponse({"detail": "Domicile introuvable."}, status=404)
        return JsonResponse(_serialize_domicile(simulation.domicile))

    payload = json.loads(request.body or "{}") if request.body else {}

    adresse_ligne_1 = (payload.get("adresse_ligne_1") or "").strip()
    code_postal = (payload.get("code_postal") or "").strip()
    ville = (payload.get("ville") or "").strip()

    if not adresse_ligne_1 or not code_postal or not ville:
        return JsonResponse(
            {
                "detail": "Les champs adresse_ligne_1, code_postal et ville sont obligatoires.",
            },
            status=400,
        )

    domicile, _ = AdresseDomicile.objects.update_or_create(
        simulation=simulation,
        defaults={
            "libelle": (payload.get("libelle") or "").strip(),
            "adresse_ligne_1": adresse_ligne_1,
            "adresse_ligne_2": (payload.get("adresse_ligne_2") or "").strip(),
            "code_postal": code_postal,
            "ville": ville,
            "pays": (payload.get("pays") or "France").strip() or "France",
        },
    )

    try:
        domicile = geocode_domicile_if_needed(domicile)
    except OpenRouteServiceError:
        pass

    return JsonResponse(_serialize_domicile(domicile), status=201)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def simulation_sites(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "items": [_serialize_site(site) for site in simulation.sites_travail.all()],
            }
        )

    payload = json.loads(request.body or "{}") if request.body else {}

    nom = (payload.get("nom") or "").strip()
    adresse_ligne_1 = (payload.get("adresse_ligne_1") or "").strip()
    code_postal = (payload.get("code_postal") or "").strip()
    ville = (payload.get("ville") or "").strip()

    if not nom or not adresse_ligne_1 or not code_postal or not ville:
        return JsonResponse(
            {
                "detail": "Les champs nom, adresse_ligne_1, code_postal et ville sont obligatoires.",
            },
            status=400,
        )

    site = SiteTravail.objects.create(
        simulation=simulation,
        nom=nom,
        adresse_ligne_1=adresse_ligne_1,
        adresse_ligne_2=(payload.get("adresse_ligne_2") or "").strip(),
        code_postal=code_postal,
        ville=ville,
        pays=(payload.get("pays") or "France").strip() or "France",
    )

    try:
        site = geocode_site_if_needed(site)
    except OpenRouteServiceError:
        pass

    return JsonResponse(_serialize_site(site), status=201)


@csrf_exempt
@require_http_methods(["DELETE"])
def simulation_site_detail(request: HttpRequest, simulation_id: int, site_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    site = simulation.sites_travail.filter(id=site_id).first()
    if site is None:
        return JsonResponse({"detail": "Site introuvable."}, status=404)

    site.delete()
    return HttpResponse(status=204)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def simulation_vehicules(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "items": [_serialize_vehicule(vehicule) for vehicule in simulation.vehicules.all()],
            }
        )

    payload = json.loads(request.body or "{}") if request.body else {}
    marque = (payload.get("marque") or "").strip()
    modele = (payload.get("modele") or "").strip()
    immatriculation = (payload.get("immatriculation") or "").strip().upper()
    puissance_administrative = payload.get("puissance_administrative")
    type_vehicule = (payload.get("type_vehicule") or "voiture").strip()

    if not marque or not modele or not immatriculation or not puissance_administrative:
        return JsonResponse(
            {
                "detail": "Les champs marque, modele, immatriculation et puissance_administrative sont obligatoires.",
            },
            status=400,
        )

    date_achat_value = payload.get("date_achat")
    date_vente_value = payload.get("date_vente")

    date_achat = date.fromisoformat(date_achat_value) if date_achat_value else None
    date_vente = date.fromisoformat(date_vente_value) if date_vente_value else None

    if date_achat and date_vente and date_vente < date_achat:
        return JsonResponse(
            {"detail": "La date de vente doit etre posterieure ou egale a la date d'achat."},
            status=400,
        )

    vehicule = Vehicule.objects.create(
        simulation=simulation,
        marque=marque,
        modele=modele,
        immatriculation=immatriculation,
        type_vehicule=type_vehicule,
        puissance_administrative=int(puissance_administrative),
        date_achat=date_achat,
        date_vente=date_vente,
    )

    return JsonResponse(_serialize_vehicule(vehicule), status=201)


@csrf_exempt
@require_http_methods(["DELETE"])
def simulation_vehicule_detail(request: HttpRequest, simulation_id: int, vehicule_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    vehicule = simulation.vehicules.filter(id=vehicule_id).first()
    if vehicule is None:
        return JsonResponse({"detail": "Vehicule introuvable."}, status=404)

    vehicule.delete()
    return HttpResponse(status=204)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def simulation_calendrier(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "items": [_serialize_jour(jour) for jour in simulation.jours_travailles.select_related("site_travail", "vehicule")],
            }
        )

    payload = json.loads(request.body or "{}") if request.body else {}
    date_value = payload.get("date")
    type_jour = (payload.get("type_jour") or "").strip()
    site_travail_id = payload.get("site_travail_id")
    vehicule_id = payload.get("vehicule_id")
    commentaire = (payload.get("commentaire") or "").strip()

    if not date_value or type_jour not in {JourTravaille.TypeJour.SITE, JourTravaille.TypeJour.TELETRAVAIL, JourTravaille.TypeJour.CONGES}:
        return JsonResponse({"detail": "Les champs date et type_jour sont obligatoires."}, status=400)

    jour_date = date.fromisoformat(date_value)
    site = None
    vehicule = None
    distance_km = 0
    montant_eur = 0

    if vehicule_id and type_jour != JourTravaille.TypeJour.CONGES:
        vehicule = simulation.vehicules.filter(id=vehicule_id).first()
        if vehicule is None:
            return JsonResponse({"detail": "Vehicule introuvable pour cette simulation."}, status=400)
        if vehicule.date_achat and jour_date < vehicule.date_achat:
            return JsonResponse({"detail": "Le vehicule ne peut pas etre utilise avant sa date d'achat."}, status=400)
        if vehicule.date_vente and jour_date > vehicule.date_vente:
            return JsonResponse({"detail": "Le vehicule ne peut pas etre utilise apres sa date de vente."}, status=400)

    if type_jour == JourTravaille.TypeJour.SITE:
        if not hasattr(simulation, "domicile"):
            return JsonResponse({"detail": "Le domicile est obligatoire avant de calculer un jour sur site."}, status=400)
        if not site_travail_id:
            return JsonResponse({"detail": "Un site est obligatoire pour un jour sur site."}, status=400)
        site = simulation.sites_travail.filter(id=site_travail_id).first()
        if site is None:
            return JsonResponse({"detail": "Site introuvable pour cette simulation."}, status=400)
        try:
            distance = get_or_compute_distance(domicile=simulation.domicile, site=site)
        except OpenRouteServiceError as exc:
            return JsonResponse({"detail": str(exc)}, status=400)
        distance_km = distance.distance_aller_retour_km
    else:
        site = None

    if type_jour == JourTravaille.TypeJour.CONGES:
        vehicule = None

    jour, _ = JourTravaille.objects.update_or_create(
        simulation=simulation,
        date=jour_date,
        defaults={
            "type_jour": type_jour,
            "site_travail": site,
            "vehicule": vehicule,
            "distance_km": distance_km,
            "montant_eur": montant_eur,
            "commentaire": commentaire,
        },
    )

    return JsonResponse(_serialize_jour(jour), status=201)


@csrf_exempt
@require_http_methods(["DELETE"])
def simulation_calendrier_detail(request: HttpRequest, simulation_id: int, jour_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    jour = simulation.jours_travailles.filter(id=jour_id).first()
    if jour is None:
        return JsonResponse({"detail": "Jour introuvable."}, status=404)

    jour.delete()
    return HttpResponse(status=204)


@csrf_exempt
@require_http_methods(["POST"])
def simulation_distance_site(request: HttpRequest, simulation_id: int, site_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if not hasattr(simulation, "domicile"):
        return JsonResponse({"detail": "Domicile introuvable pour cette simulation."}, status=400)

    site = simulation.sites_travail.filter(id=site_id).first()
    if site is None:
        return JsonResponse({"detail": "Site introuvable pour cette simulation."}, status=404)

    try:
        distance = get_or_compute_distance(domicile=simulation.domicile, site=site)
    except OpenRouteServiceError as exc:
        return JsonResponse({"detail": str(exc)}, status=400)

    return JsonResponse(_serialize_distance(distance), status=201)


@csrf_exempt
@require_http_methods(["POST"])
def simulation_import_calendrier(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    upload = request.FILES.get("file")
    if upload is None:
        return JsonResponse({"detail": "Le fichier Excel est obligatoire."}, status=400)

    if not upload.name.lower().endswith(".xlsx"):
        return JsonResponse({"detail": "Seuls les fichiers .xlsx sont supportes."}, status=400)

    try:
        result = import_calendar_xlsx(simulation=simulation, file_bytes=upload.read())
    except ImportFraisKilometriquesError as exc:
        return JsonResponse({"detail": str(exc)}, status=400)

    return JsonResponse(result, status=201)


@require_http_methods(["GET"])
def simulation_resultat(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    year_param = request.GET.get("year")
    year = None
    if year_param:
        try:
            year = int(year_param)
        except ValueError:
            return JsonResponse({"detail": "Le parametre year doit etre un entier."}, status=400)

    return JsonResponse(_serialize_resultat(simulation, year=year))


@csrf_exempt
@require_http_methods(["POST"])
def simulation_recalculer(request: HttpRequest, simulation_id: int) -> JsonResponse:
    simulation = _get_simulation_or_none(request, simulation_id)
    if simulation is None:
        return JsonResponse({"detail": "Simulation introuvable."}, status=404)

    if not hasattr(simulation, "domicile"):
        return JsonResponse({"detail": "Le domicile est requis pour recalculer la simulation."}, status=400)

    recalculated = 0
    for jour in simulation.jours_travailles.select_related("site_travail", "vehicule"):
        if jour.type_jour != JourTravaille.TypeJour.SITE:
            if jour.distance_km != 0 or jour.montant_eur != 0:
                jour.distance_km = 0
                jour.montant_eur = 0
                jour.save(update_fields=["distance_km", "montant_eur", "updated_at"])
            continue

        if jour.site_travail is None:
            continue

        if jour.vehicule is None:
            continue

        if jour.vehicule.date_achat and jour.date < jour.vehicule.date_achat:
            continue
        if jour.vehicule.date_vente and jour.date > jour.vehicule.date_vente:
            continue

        try:
            distance = get_or_compute_distance(domicile=simulation.domicile, site=jour.site_travail)
        except OpenRouteServiceError as exc:
            return JsonResponse({"detail": str(exc)}, status=400)

        jour.distance_km = distance.distance_aller_retour_km
        jour.montant_eur = 0
        jour.save(update_fields=["distance_km", "montant_eur", "updated_at"])
        recalculated += 1

    return JsonResponse(
        {
            "detail": "Simulation recalculee.",
            "recalculated_days": recalculated,
            "resultat": _serialize_resultat(simulation),
        },
        status=200,
    )
