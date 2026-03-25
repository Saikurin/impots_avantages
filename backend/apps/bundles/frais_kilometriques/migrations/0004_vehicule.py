from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0003_sitetravail"),
    ]

    operations = [
        migrations.CreateModel(
            name="Vehicule",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("marque", models.CharField(max_length=120)),
                ("modele", models.CharField(max_length=120)),
                ("immatriculation", models.CharField(max_length=32)),
                (
                    "type_vehicule",
                    models.CharField(
                        choices=[
                            ("voiture", "Voiture"),
                            ("motocyclette", "Motocyclette"),
                            ("cyclomoteur", "Cyclomoteur"),
                            ("electrique", "Electrique"),
                        ],
                        default="voiture",
                        max_length=20,
                    ),
                ),
                ("puissance_administrative", models.PositiveSmallIntegerField()),
                ("date_achat", models.DateField(blank=True, null=True)),
                ("date_vente", models.DateField(blank=True, null=True)),
                ("actif", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "simulation",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="vehicules",
                        to="frais_kilometriques.simulationfraiskilometriques",
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
                "verbose_name": "Vehicule",
                "verbose_name_plural": "Vehicules",
            },
        ),
    ]
