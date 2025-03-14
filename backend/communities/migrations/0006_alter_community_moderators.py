# Generated by Django 5.1.6 on 2025-03-14 10:54

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0005_community_rules'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='moderators',
            field=models.ManyToManyField(blank=True, related_name='communities_modding', to=settings.AUTH_USER_MODEL),
        ),
    ]
