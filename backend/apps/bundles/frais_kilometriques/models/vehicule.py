from django.db import models


class Vehicule(models.Model):
    class TypeVehicule(models.TextChoices):
        VOITURE = "voiture", "Voiture"
        MOTOCYCLETTE = "motocyclette", "Motocyclette"
        CYCLOMOTEUR = "cyclomoteur", "Cyclomoteur"
        ELECTRIQUE = "electrique", "Electrique"

    simulation = models.ForeignKey(
        "frais_kilometriques.SimulationFraisKilometriques",
        on_delete=models.CASCADE,
        related_name="vehicules",
    )
    marque = models.CharField(max_length=120)
    modele = models.CharField(max_length=120)
    immatriculation = models.CharField(max_length=32)
    type_vehicule = models.CharField(
        max_length=20,
        choices=TypeVehicule.choices,
        default=TypeVehicule.VOITURE,
    )
    puissance_administrative = models.PositiveSmallIntegerField()
    date_achat = models.DateField(null=True, blank=True)
    date_vente = models.DateField(null=True, blank=True)
    actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Vehicule"
        verbose_name_plural = "Vehicules"

    def __str__(self) -> str:
        return f"{self.marque} {self.modele}"
