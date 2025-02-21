from django.db import models


class Community(models.Model):
    class Type(models.TextChoices):
        PUBLIC = "PUBLIC" , "Public"
        RESTRICTED = "RESTRICTED", "Restricted"
        PRIVATE = "PRIVATE", "Private"

    name = models.CharField(max_length=24)
    type = models.CharField(choices=Type.choices, default=Type.PUBLIC)
    description = models.TextField(blank=False, null=False)
    avatar = models.ImageField(upload_to='community-icons')
    banner = models.ImageField(upload_to='community-banners')


    def __str__(self):
        return self.name
