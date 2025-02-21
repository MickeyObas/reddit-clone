from django.db import models


class Profile(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE)
    display_name = models.CharField(max_length=50, blank=True, null=True)
    about_description = models.TextField()
    avatar = models.ImageField(upload_to='avatars')
    banner = models.ImageField(upload_to='banners')

    def __str__(self):
        return f"{self.user}'s profile"

