from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0006_distancetrajet"),
    ]

    operations = [
        migrations.AlterField(
            model_name="jourtravaille",
            name="type_jour",
            field=models.CharField(
                choices=[
                    ("site", "Site"),
                    ("teletravail", "Teletravail"),
                    ("conges", "Conges"),
                ],
                max_length=20,
            ),
        ),
    ]
