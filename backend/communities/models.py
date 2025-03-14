from django.db import models

from api.models import TimeStampedModel

class Community(TimeStampedModel):
    class Type(models.TextChoices):
        PUBLIC = "PUBLIC" , "Public"
        RESTRICTED = "RESTRICTED", "Restricted"
        PRIVATE = "PRIVATE", "Private"

    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE,related_name='communities_owned')
    moderators = models.ManyToManyField('accounts.User', related_name='communities_modding', blank=True)
    members = models.ManyToManyField('accounts.User')
    name = models.CharField(max_length=24, unique=True)
    type = models.CharField(choices=Type.choices, default=Type.PUBLIC)
    description = models.TextField(blank=False, null=False)
    avatar = models.ImageField(upload_to='community-icons/', blank=True, null=True)
    banner = models.ImageField(upload_to='community-banners/', blank=True, null=True)
    rules = models.JSONField(default=list)

    class Meta:
        verbose_name_plural = "Communities"

    def save(self, *args, **kwargs):
        if not self.pk or not self.name.startswith('r/'):
            self.name = "r/" + self.name
        return super().save(*args, **kwargs)
    
    @property
    def member_count(self):
        return self.members.count()

    def __str__(self):
        return self.name
