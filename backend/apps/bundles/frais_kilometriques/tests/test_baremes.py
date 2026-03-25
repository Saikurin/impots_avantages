from decimal import Decimal

from django.test import SimpleTestCase

from apps.bundles.frais_kilometriques.models import Vehicule
from apps.bundles.frais_kilometriques.services.baremes import apply_bareme


class BaremesServiceTests(SimpleTestCase):
    def build_vehicle(self, *, vehicle_type: str, puissance: int) -> Vehicule:
        return Vehicule(
            type_vehicule=vehicle_type,
            puissance_administrative=puissance,
            marque="Test",
            modele="Modele",
            immatriculation="AA-123-AA",
        )

    def test_voiture_5cv_under_5000_uses_first_formula(self):
        vehicle = self.build_vehicle(vehicle_type=Vehicule.TypeVehicule.VOITURE, puissance=5)

        result = apply_bareme(vehicule=vehicle, total_km=Decimal("4000"))

        self.assertEqual(result["formule"], "d x 0.636")
        self.assertEqual(result["montant_total_eur"], Decimal("2544.00"))

    def test_voiture_5cv_between_5001_and_20000_uses_second_formula(self):
        vehicle = self.build_vehicle(vehicle_type=Vehicule.TypeVehicule.VOITURE, puissance=5)

        result = apply_bareme(vehicule=vehicle, total_km=Decimal("6000"))

        self.assertEqual(result["formule"], "(d x 0.357) + 1395")
        self.assertEqual(result["montant_total_eur"], Decimal("3537.00"))

    def test_voiture_7cv_over_20000_uses_third_formula(self):
        vehicle = self.build_vehicle(vehicle_type=Vehicule.TypeVehicule.VOITURE, puissance=7)

        result = apply_bareme(vehicule=vehicle, total_km=Decimal("21000"))

        self.assertEqual(result["formule"], "d x 0.470")
        self.assertEqual(result["montant_total_eur"], Decimal("9870.00"))

    def test_cyclomoteur_uses_specific_formula(self):
        vehicle = self.build_vehicle(vehicle_type=Vehicule.TypeVehicule.CYCLOMOTEUR, puissance=1)

        result = apply_bareme(vehicule=vehicle, total_km=Decimal("4000"))

        self.assertEqual(result["formule"], "(d x 0.079) + 711")
        self.assertEqual(result["montant_total_eur"], Decimal("1027.00"))
