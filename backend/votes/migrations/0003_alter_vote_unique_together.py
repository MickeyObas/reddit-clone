# Generated by Django 5.1.6 on 2025-03-15 10:38

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0002_postmedia_file_alter_postmedia_type"),
        ("votes", "0002_alter_vote_comment_alter_vote_post"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="vote",
            unique_together={("owner", "post")},
        ),
    ]
