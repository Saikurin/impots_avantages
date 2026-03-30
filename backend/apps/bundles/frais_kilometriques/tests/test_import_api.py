from io import BytesIO
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase, override_settings
from openpyxl import Workbook

from apps.bundles.frais_kilometriques.models import (
    AdresseDomicile,
    SimulationFraisKilometriques,
    SiteTravail,
    Vehicule,
)


@override_settings(OIDC_BYPASS_AUTH=True)
class ImportApiTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.simulation = SimulationFraisKilometriques.objects.create(
            owner_sub="test-owner",
            annee_fiscale=2026,
            date_debut_periode="2026-01-01",
            date_fin_periode="2026-12-31",
        )
        AdresseDomicile.objects.create(
            simulation=self.simulation,
            adresse_ligne_1="10 rue de la Republique",
            code_postal="75001",
            ville="Paris",
            pays="France",
        )
        SiteTravail.objects.create(
            simulation=self.simulation,
            nom="Siege",
            adresse_ligne_1="1 avenue de France",
            code_postal="75013",
            ville="Paris",
            pays="France",
        )
        Vehicule.objects.create(
            simulation=self.simulation,
            marque="Peugeot",
            modele="208",
            immatriculation="AB-123-CD",
            type_vehicule=Vehicule.TypeVehicule.VOITURE,
            puissance_administrative=5,
            date_achat="2021-01-01",
        )

    def test_import_calendar_xlsx_creates_days(self):
        workbook = Workbook()
        sheet = workbook.active
        sheet.append(["date", "nom du site", "plaque d'immatriculation"])
        sheet.append(["2026-03-20", "Siege", "AB-123-CD"])

        buffer = BytesIO()
        workbook.save(buffer)
        upload = SimpleUploadedFile(
            "import.xlsx",
            buffer.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

        class FakeDistance:
            distance_aller_retour_km = 42.5

        with patch(
            "apps.bundles.frais_kilometriques.services.imports.get_or_compute_distance",
            return_value=FakeDistance(),
        ):
            response = self.client.post(
                f"/api/bundles/frais-kilometriques/simulations/{self.simulation.id}/calendrier/import",
                {"file": upload},
            )

        self.assertEqual(response.status_code, 201)
        payload = response.json()
        self.assertEqual(payload["imported"], 1)
        self.assertEqual(payload["updated"], 0)
        self.assertEqual(payload["errors"], [])

    def test_import_calendar_xlsx_reports_unknown_site(self):
        workbook = Workbook()
        sheet = workbook.active
        sheet.append(["date", "nom du site", "plaque d'immatriculation"])
        sheet.append(["2026-03-20", "Site inconnu", "AB-123-CD"])

        buffer = BytesIO()
        workbook.save(buffer)
        upload = SimpleUploadedFile(
            "import.xlsx",
            buffer.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

        response = self.client.post(
            f"/api/bundles/frais-kilometriques/simulations/{self.simulation.id}/calendrier/import",
            {"file": upload},
        )

        self.assertEqual(response.status_code, 201)
        payload = response.json()
        self.assertEqual(payload["imported"], 0)
        self.assertEqual(payload["updated"], 0)
        self.assertEqual(payload["errors"][0]["row"], 2)
