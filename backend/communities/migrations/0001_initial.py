# Generated by Django 5.1.6 on 2025-02-23 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Community",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=24)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("PUBLIC", "Public"),
                            ("RESTRICTED", "Restricted"),
                            ("PRIVATE", "Private"),
                        ],
                        default="PUBLIC",
                    ),
                ),
                ("description", models.TextField()),
                ("avatar", models.ImageField(upload_to="community-icons")),
                ("banner", models.ImageField(upload_to="community-banners")),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
