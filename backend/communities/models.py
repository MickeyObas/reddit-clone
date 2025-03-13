from django.db import models

from api.models import TimeStampedModel

class Community(TimeStampedModel):
    class Type(models.TextChoices):
        PUBLIC = "PUBLIC" , "Public"
        RESTRICTED = "RESTRICTED", "Restricted"
        PRIVATE = "PRIVATE", "Private"

    name = models.CharField(max_length=24, unique=True)
    type = models.CharField(choices=Type.choices, default=Type.PUBLIC)
    description = models.TextField(blank=False, null=False)
    avatar = models.ImageField(upload_to='community-icons', blank=True, null=True)
    banner = models.ImageField(upload_to='community-banners', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Communities"

    def save(self, *args, **kwargs):
        if not self.pk:
            self.name = "r/" + self.name
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name
