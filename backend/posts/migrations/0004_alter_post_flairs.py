# Generated by Django 5.1.6 on 2025-03-18 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0003_alter_post_options"),
        ("tags", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="flairs",
            field=models.ManyToManyField(blank=True, to="tags.flair"),
        ),
    ]
