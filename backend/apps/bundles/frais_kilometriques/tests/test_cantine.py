from decimal import Decimal

from django.test import SimpleTestCase

from apps.bundles.frais_kilometriques.services.cantine import compute_deductible_cantine


class CantineServiceTests(SimpleTestCase):
    def test_cantine_not_deductible_below_threshold(self):
        self.assertEqual(compute_deductible_cantine(Decimal("5.20")), Decimal("0.00"))
        self.assertEqual(compute_deductible_cantine(Decimal("4.90")), Decimal("0.00"))

    def test_cantine_deductible_above_threshold(self):
        self.assertEqual(compute_deductible_cantine(Decimal("8.00")), Decimal("2.80"))
