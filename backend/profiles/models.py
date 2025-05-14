from django.db import models

from api.models import TimeStampedModel


class Profile(TimeStampedModel):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE)
    display_name = models.CharField(max_length=50, blank=True, null=True)
    gender = models.CharField(max_length=1, default="M", blank=True, null=True)
    about_description = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    banner = models.ImageField(upload_to="banners/", blank=True, null=True)
    is_mature = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user}'s profile"
