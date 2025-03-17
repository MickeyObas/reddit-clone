from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User
from profiles.models import Profile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        print(instance)
        print(instance.username)
        Profile.objects.create(
            user=instance,
            display_name=instance.username
        )

