from decimal import Decimal

from django.test import Client, TestCase

from apps.bundles.frais_kilometriques.models import (
    JourTravaille,
    SimulationFraisKilometriques,
    Vehicule,
)


class ResultatApiTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.simulation = SimulationFraisKilometriques.objects.create(
            annee_fiscale=2026,
            date_debut_periode="2026-01-01",
            date_fin_periode="2026-12-31",
        )
        self.vehicle_current = Vehicule.objects.create(
            simulation=self.simulation,
            marque="Volkswagen",
            modele="Golf",
            immatriculation="AA-111-AA",
            type_vehicule=Vehicule.TypeVehicule.VOITURE,
            puissance_administrative=7,
            date_achat="2025-11-25",
        )
        self.vehicle_previous = Vehicule.objects.create(
            simulation=self.simulation,
            marque="Peugeot",
            modele="208",
            immatriculation="BB-222-BB",
            type_vehicule=Vehicule.TypeVehicule.VOITURE,
            puissance_administrative=5,
            date_achat="2021-01-10",
            date_vente="2025-11-25",
        )
        JourTravaille.objects.create(
            simulation=self.simulation,
            vehicule=self.vehicle_previous,
            date="2025-03-01",
            type_jour=JourTravaille.TypeJour.SITE,
            distance_km=Decimal("100.00"),
            montant_eur=Decimal("0.00"),
        )
        JourTravaille.objects.create(
            simulation=self.simulation,
            vehicule=self.vehicle_current,
            date="2026-03-01",
            type_jour=JourTravaille.TypeJour.SITE,
            distance_km=Decimal("50.00"),
            montant_eur=Decimal("0.00"),
        )
        JourTravaille.objects.create(
            simulation=self.simulation,
            date="2026-03-02",
            type_jour=JourTravaille.TypeJour.CONGES,
            distance_km=Decimal("0.00"),
            montant_eur=Decimal("0.00"),
        )

    def test_resultat_can_be_filtered_by_year(self):
        response = self.client.get(
            f"/api/bundles/frais-kilometriques/simulations/{self.simulation.id}/resultat?year=2026"
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["filtre"]["year"], 2026)
        self.assertEqual(payload["totaux"]["jours_total"], 2)
        self.assertEqual(payload["totaux"]["jours_site"], 1)
        self.assertEqual(payload["totaux"]["jours_conges"], 1)
        self.assertEqual(payload["totaux"]["total_km"], 50.0)

    def test_resultat_aggregates_amounts_per_vehicle(self):
        response = self.client.get(
            f"/api/bundles/frais-kilometriques/simulations/{self.simulation.id}/resultat"
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload["vehicules"]), 2)
        self.assertAlmostEqual(payload["totaux"]["montant_total_eur"], 98.45, places=2)
