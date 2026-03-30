from django.db import models


class SimulationFraisKilometriques(models.Model):
    class Statut(models.TextChoices):
        BROUILLON = "brouillon", "Brouillon"
        COMPLETEE = "completee", "Completee"
        CALCULEE = "calculee", "Calculee"

    owner_sub = models.CharField(max_length=255, db_index=True)
    annee_fiscale = models.PositiveSmallIntegerField()
    date_debut_periode = models.DateField()
    date_fin_periode = models.DateField()
    statut = models.CharField(
        max_length=16,
        choices=Statut.choices,
        default=Statut.BROUILLON,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Simulation {self.id} - {self.annee_fiscale}"
