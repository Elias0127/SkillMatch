# Generated by Django 4.2.11 on 2024-04-19 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_workerprofile_rate_type_alter_workerprofile_rate'),
    ]

    operations = [
        migrations.AddField(
            model_name='employerprofile',
            name='company_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='employerprofile',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='employerprofile',
            name='industry',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
