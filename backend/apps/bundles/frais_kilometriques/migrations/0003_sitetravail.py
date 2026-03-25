from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0002_adressedomicile"),
    ]

    operations = [
        migrations.CreateModel(
            name="SiteTravail",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nom", models.CharField(max_length=120)),
                ("adresse_ligne_1", models.CharField(max_length=255)),
                ("adresse_ligne_2", models.CharField(blank=True, max_length=255)),
                ("code_postal", models.CharField(max_length=16)),
                ("ville", models.CharField(max_length=120)),
                ("pays", models.CharField(default="France", max_length=120)),
                ("latitude", models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ("longitude", models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ("actif", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "simulation",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="sites_travail",
                        to="frais_kilometriques.simulationfraiskilometriques",
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
                "verbose_name": "Site de travail",
                "verbose_name_plural": "Sites de travail",
            },
        ),
    ]
