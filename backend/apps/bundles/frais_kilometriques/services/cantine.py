import decimal

SEUIL_CANTINE_EUR = decimal.Decimal("5.20")


def compute_deductible_cantine(amount: decimal.Decimal) -> decimal.Decimal:
    deductible = amount - SEUIL_CANTINE_EUR
    if deductible <= 0:
        return decimal.Decimal("0.00")
    return deductible.quantize(decimal.Decimal("0.01"), rounding=decimal.ROUND_HALF_UP)
