from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0004_vehicule"),
    ]

    operations = [
        migrations.CreateModel(
            name="JourTravaille",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("date", models.DateField()),
                ("type_jour", models.CharField(choices=[("site", "Site"), ("teletravail", "Teletravail")], max_length=20)),
                ("distance_km", models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ("montant_eur", models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ("commentaire", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("simulation", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="jours_travailles", to="frais_kilometriques.simulationfraiskilometriques")),
                ("site_travail", models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name="jours_travailles", to="frais_kilometriques.sitetravail")),
                ("vehicule", models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name="jours_travailles", to="frais_kilometriques.vehicule")),
            ],
            options={"ordering": ["date", "created_at"]},
        ),
        migrations.AddConstraint(
            model_name="jourtravaille",
            constraint=models.UniqueConstraint(fields=("simulation", "date"), name="unique_jour_par_simulation"),
        ),
    ]
