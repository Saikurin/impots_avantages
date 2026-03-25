from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("frais_kilometriques", "0007_alter_jourtravaille_type_jour"),
    ]

    operations = [
        migrations.AddField(
            model_name="jourtravaille",
            name="frais_cantine_eur",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="jourtravaille",
            name="montant_deductible_cantine_eur",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
