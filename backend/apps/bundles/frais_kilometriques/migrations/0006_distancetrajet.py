from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0005_jourtravaille"),
    ]

    operations = [
        migrations.CreateModel(
            name="DistanceTrajet",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("distance_km", models.DecimalField(decimal_places=2, max_digits=10)),
                ("distance_aller_retour_km", models.DecimalField(decimal_places=2, max_digits=10)),
                ("duree_secondes", models.PositiveIntegerField(default=0)),
                ("source_calcul", models.CharField(default="openrouteservice", max_length=64)),
                ("date_calcul", models.DateTimeField(auto_now=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("adresse_domicile", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="distances_trajet", to="frais_kilometriques.adressedomicile")),
                ("simulation", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="distances_trajet", to="frais_kilometriques.simulationfraiskilometriques")),
                ("site_travail", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="distances_trajet", to="frais_kilometriques.sitetravail")),
            ],
        ),
        migrations.AddConstraint(
            model_name="distancetrajet",
            constraint=models.UniqueConstraint(fields=("simulation", "adresse_domicile", "site_travail"), name="unique_distance_par_trajet"),
        ),
    ]
