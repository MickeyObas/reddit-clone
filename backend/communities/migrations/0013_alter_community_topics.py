# Generated by Django 5.1.6 on 2025-04-14 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("communities", "0012_alter_community_moderators"),
        ("topics", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="community",
            name="topics",
            field=models.ManyToManyField(blank=True, to="topics.topic"),
        ),
    ]
