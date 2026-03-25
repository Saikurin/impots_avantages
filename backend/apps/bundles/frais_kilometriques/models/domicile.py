from django.db import models


class AdresseDomicile(models.Model):
    simulation = models.OneToOneField(
        "frais_kilometriques.SimulationFraisKilometriques",
        on_delete=models.CASCADE,
        related_name="domicile",
    )
    libelle = models.CharField(max_length=120, blank=True)
    adresse_ligne_1 = models.CharField(max_length=255)
    adresse_ligne_2 = models.CharField(max_length=255, blank=True)
    code_postal = models.CharField(max_length=16)
    ville = models.CharField(max_length=120)
    pays = models.CharField(max_length=120, default="France")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Adresse de domicile"
        verbose_name_plural = "Adresses de domicile"

    def __str__(self) -> str:
        return f"Domicile {self.ville}"
