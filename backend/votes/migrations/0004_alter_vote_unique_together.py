# Generated by Django 5.1.6 on 2025-05-04 10:20

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("comments", "0003_commentmedia_file"),
        ("posts", "0006_alter_postmedia_type"),
        ("votes", "0003_alter_vote_unique_together"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="vote",
            unique_together={("owner", "comment"), ("owner", "post")},
        ),
    ]
