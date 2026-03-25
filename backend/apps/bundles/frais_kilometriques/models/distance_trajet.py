from django.db import models


class DistanceTrajet(models.Model):
    simulation = models.ForeignKey(
        "frais_kilometriques.SimulationFraisKilometriques",
        on_delete=models.CASCADE,
        related_name="distances_trajet",
    )
    adresse_domicile = models.ForeignKey(
        "frais_kilometriques.AdresseDomicile",
        on_delete=models.CASCADE,
        related_name="distances_trajet",
    )
    site_travail = models.ForeignKey(
        "frais_kilometriques.SiteTravail",
        on_delete=models.CASCADE,
        related_name="distances_trajet",
    )
    distance_km = models.DecimalField(max_digits=10, decimal_places=2)
    distance_aller_retour_km = models.DecimalField(max_digits=10, decimal_places=2)
    duree_secondes = models.PositiveIntegerField(default=0)
    source_calcul = models.CharField(max_length=64, default="openrouteservice")
    date_calcul = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["simulation", "adresse_domicile", "site_travail"],
                name="unique_distance_par_trajet",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.adresse_domicile_id}->{self.site_travail_id}: {self.distance_km} km"
