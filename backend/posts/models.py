from django.db import models

from api.models import TimeStampedModel



class Post(TimeStampedModel):
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    community = models.ForeignKey('communities.Community', on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    body = models.TextField()
    flairs = models.ManyToManyField('tags.Flair')

    def __str__(self):
        return f"{self.owner} - {self.title}"

    
class PostMedia(TimeStampedModel):
    class MEDIA_TYPES(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"
        LINK = "LINK", "Link"

    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    type = models.CharField(max_length=5, default=MEDIA_TYPES.IMAGE)
    url = models.URLField()

    def __str__(self):
        return self.type