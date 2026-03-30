from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0007_alter_jourtravaille_type_jour"),
    ]

    operations = [
        migrations.AddField(
            model_name="simulationfraiskilometriques",
            name="owner_sub",
            field=models.CharField(db_index=True, default="legacy-owner", max_length=255),
            preserve_default=False,
        ),
    ]
