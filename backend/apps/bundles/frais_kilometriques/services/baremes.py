from decimal import ROUND_HALF_UP, Decimal

from apps.bundles.frais_kilometriques.models import Vehicule


def _to_decimal(value: str) -> Decimal:
    return Decimal(value)


def _round_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _apply_voiture_bareme(distance_km: Decimal, puissance: int) -> tuple[Decimal, str]:
    if puissance <= 3:
        if distance_km <= 5000:
            return _round_money(distance_km * _to_decimal("0.529")), "d x 0.529"
        if distance_km <= 20000:
            return _round_money((distance_km * _to_decimal("0.316")) + _to_decimal("1065")), "(d x 0.316) + 1065"
        return _round_money(distance_km * _to_decimal("0.370")), "d x 0.370"

    if puissance == 4:
        if distance_km <= 5000:
            return _round_money(distance_km * _to_decimal("0.606")), "d x 0.606"
        if distance_km <= 20000:
            return _round_money((distance_km * _to_decimal("0.340")) + _to_decimal("1330")), "(d x 0.340) + 1330"
        return _round_money(distance_km * _to_decimal("0.407")), "d x 0.407"

    if puissance == 5:
        if distance_km <= 5000:
            return _round_money(distance_km * _to_decimal("0.636")), "d x 0.636"
        if distance_km <= 20000:
            return _round_money((distance_km * _to_decimal("0.357")) + _to_decimal("1395")), "(d x 0.357) + 1395"
        return _round_money(distance_km * _to_decimal("0.427")), "d x 0.427"

    if puissance == 6:
        if distance_km <= 5000:
            return _round_money(distance_km * _to_decimal("0.665")), "d x 0.665"
        if distance_km <= 20000:
            return _round_money((distance_km * _to_decimal("0.374")) + _to_decimal("1457")), "(d x 0.374) + 1457"
        return _round_money(distance_km * _to_decimal("0.447")), "d x 0.447"

    if distance_km <= 5000:
        return _round_money(distance_km * _to_decimal("0.697")), "d x 0.697"
    if distance_km <= 20000:
        return _round_money((distance_km * _to_decimal("0.394")) + _to_decimal("1515")), "(d x 0.394) + 1515"
    return _round_money(distance_km * _to_decimal("0.470")), "d x 0.470"


def _apply_moto_bareme(distance_km: Decimal, puissance: int) -> tuple[Decimal, str]:
    if puissance <= 2:
        if distance_km <= 3000:
            return _round_money(distance_km * _to_decimal("0.395")), "d x 0.395"
        if distance_km <= 6000:
            return _round_money((distance_km * _to_decimal("0.099")) + _to_decimal("891")), "(d x 0.099) + 891"
        return _round_money(distance_km * _to_decimal("0.248")), "d x 0.248"

    if puissance <= 5:
        if distance_km <= 3000:
            return _round_money(distance_km * _to_decimal("0.468")), "d x 0.468"
        if distance_km <= 6000:
            return _round_money((distance_km * _to_decimal("0.082")) + _to_decimal("1158")), "(d x 0.082) + 1158"
        return _round_money(distance_km * _to_decimal("0.275")), "d x 0.275"

    if distance_km <= 3000:
        return _round_money(distance_km * _to_decimal("0.606")), "d x 0.606"
    if distance_km <= 6000:
        return _round_money((distance_km * _to_decimal("0.079")) + _to_decimal("1583")), "(d x 0.079) + 1583"
    return _round_money(distance_km * _to_decimal("0.343")), "d x 0.343"


def _apply_cyclo_bareme(distance_km: Decimal) -> tuple[Decimal, str]:
    if distance_km <= 3000:
        return _round_money(distance_km * _to_decimal("0.315")), "d x 0.315"
    if distance_km <= 6000:
        return _round_money((distance_km * _to_decimal("0.079")) + _to_decimal("711")), "(d x 0.079) + 711"
    return _round_money(distance_km * _to_decimal("0.198")), "d x 0.198"


def apply_bareme(*, vehicule: Vehicule | None, total_km: Decimal) -> dict:
    if vehicule is None:
        return {
            "bareme_type": None,
            "bareme_puissance": None,
            "formule": None,
            "montant_total_eur": Decimal("0.00"),
        }

    if vehicule.type_vehicule in {Vehicule.TypeVehicule.VOITURE, Vehicule.TypeVehicule.ELECTRIQUE}:
        montant, formule = _apply_voiture_bareme(total_km, vehicule.puissance_administrative)
    elif vehicule.type_vehicule == Vehicule.TypeVehicule.MOTOCYCLETTE:
        montant, formule = _apply_moto_bareme(total_km, vehicule.puissance_administrative)
    else:
        montant, formule = _apply_cyclo_bareme(total_km)

    return {
        "bareme_type": vehicule.type_vehicule,
        "bareme_puissance": vehicule.puissance_administrative,
        "formule": formule,
        "montant_total_eur": montant,
    }
