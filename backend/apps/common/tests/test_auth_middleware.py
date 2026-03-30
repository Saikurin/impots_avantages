from unittest.mock import patch

from django.test import Client, TestCase, override_settings

from apps.bundles.frais_kilometriques.models import SimulationFraisKilometriques


class ApiAuthMiddlewareTests(TestCase):
    def test_bundle_api_requires_bearer_token(self):
        client = Client()

        response = client.get("/api/bundles/frais-kilometriques/simulations")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Header Authorization Bearer manquant.")


@override_settings(OIDC_BYPASS_AUTH=False)
class ApiOwnershipTests(TestCase):
    def test_user_cannot_read_other_user_simulation(self):
        client = Client()
        simulation = SimulationFraisKilometriques.objects.create(
            owner_sub="owner-a",
            annee_fiscale=2026,
            date_debut_periode="2026-01-01",
            date_fin_periode="2026-12-31",
        )

        class Principal:
            subject = "owner-b"

        with patch("apps.common.auth.middleware.extract_bearer_token", return_value="fake-token"), patch(
            "apps.common.auth.middleware.authenticate_bearer_token",
            return_value=Principal(),
        ):
            response = client.get(f"/api/bundles/frais-kilometriques/simulations/{simulation.id}")

        self.assertEqual(response.status_code, 404)
