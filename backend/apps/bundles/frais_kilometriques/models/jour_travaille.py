from django.db import models


class JourTravaille(models.Model):
    class TypeJour(models.TextChoices):
        SITE = "site", "Site"
        TELETRAVAIL = "teletravail", "Teletravail"
        CONGES = "conges", "Conges"

    simulation = models.ForeignKey(
        "frais_kilometriques.SimulationFraisKilometriques",
        on_delete=models.CASCADE,
        related_name="jours_travailles",
    )
    vehicule = models.ForeignKey(
        "frais_kilometriques.Vehicule",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jours_travailles",
    )
    site_travail = models.ForeignKey(
        "frais_kilometriques.SiteTravail",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jours_travailles",
    )
    date = models.DateField()
    type_jour = models.CharField(max_length=20, choices=TypeJour.choices)
    distance_km = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    montant_eur = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    frais_cantine_eur = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    montant_deductible_cantine_eur = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commentaire = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "created_at"]
        constraints = [
            models.UniqueConstraint(fields=["simulation", "date"], name="unique_jour_par_simulation"),
        ]

    def __str__(self) -> str:
        return f"{self.date} - {self.type_jour}"
