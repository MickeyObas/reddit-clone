# Generated by Django 5.1.6 on 2025-03-17 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0002_comment_parent'),
    ]

    operations = [
        migrations.AddField(
            model_name='commentmedia',
            name='file',
            field=models.FileField(default=1, upload_to='comment_media/'),
            preserve_default=False,
        ),
    ]
