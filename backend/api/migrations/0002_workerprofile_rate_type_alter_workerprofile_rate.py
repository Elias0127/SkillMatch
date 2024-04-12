# Generated by Django 4.2.11 on 2024-04-12 03:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='workerprofile',
            name='rate_type',
            field=models.CharField(choices=[('fixed', 'Fixed'), ('per_hour', 'Per Hour'), ('negotiable', 'Negotiable')], default='fixed', max_length=10),
        ),
        migrations.AlterField(
            model_name='workerprofile',
            name='rate',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]