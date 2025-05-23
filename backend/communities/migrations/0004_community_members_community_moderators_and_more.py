# Generated by Django 5.1.6 on 2025-03-14 09:59

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("communities", "0003_alter_community_avatar_alter_community_banner"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="community",
            name="members",
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name="community",
            name="moderators",
            field=models.ManyToManyField(
                related_name="communities_modding", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="community",
            name="owner",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="communities_owned",
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="community",
            name="avatar",
            field=models.ImageField(
                blank=True, null=True, upload_to="community-icons/"
            ),
        ),
        migrations.AlterField(
            model_name="community",
            name="banner",
            field=models.ImageField(
                blank=True, null=True, upload_to="community-banners/"
            ),
        ),
    ]
