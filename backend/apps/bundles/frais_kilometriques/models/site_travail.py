from django.db import models


class SiteTravail(models.Model):
    simulation = models.ForeignKey(
        "frais_kilometriques.SimulationFraisKilometriques",
        on_delete=models.CASCADE,
        related_name="sites_travail",
    )
    nom = models.CharField(max_length=120)
    adresse_ligne_1 = models.CharField(max_length=255)
    adresse_ligne_2 = models.CharField(max_length=255, blank=True)
    code_postal = models.CharField(max_length=16)
    ville = models.CharField(max_length=120)
    pays = models.CharField(max_length=120, default="France")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Site de travail"
        verbose_name_plural = "Sites de travail"

    def __str__(self) -> str:
        return self.nom
