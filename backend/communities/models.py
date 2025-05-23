from django.db import models

from api.models import TimeStampedModel


class Community(TimeStampedModel):
    class Type(models.TextChoices):
        PUBLIC = "public", "Public"
        RESTRICTED = "restricted", "Restricted"
        PRIVATE = "private", "Private"

    owner = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="communities_owned"
    )
    moderators = models.ManyToManyField(
        "accounts.User", related_name="communities_modding", blank=True
    )
    members = models.ManyToManyField("accounts.User")
    name = models.CharField(max_length=24, unique=True)
    subtitle = models.CharField(max_length=150, blank=True, null=True)
    type = models.CharField(choices=Type.choices, default=Type.PUBLIC)
    description = models.TextField(blank=False, null=False)
    avatar = models.ImageField(upload_to="community-icons/", blank=True, null=True)
    banner = models.ImageField(upload_to="community-banners/", blank=True, null=True)
    rules = models.JSONField(default=list, blank=True)
    is_mature = models.BooleanField(default=True)
    topics = models.ManyToManyField("topics.Topic", blank=True)

    class Meta:
        verbose_name_plural = "Communities"

    @property
    def member_count(self):
        return self.members.count()

    def __str__(self):
        return self.name
