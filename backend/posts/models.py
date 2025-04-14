from django.db import models

from api.models import TimeStampedModel


class Post(TimeStampedModel):
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    community = models.ForeignKey('communities.Community', on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    body = models.TextField()
    flairs = models.ManyToManyField('tags.Flair', blank=True)

    def __str__(self):
        return f"{self.id} - {self.owner} - {self.title}"
    
    @property
    def vote_count(self):
        count_query = self.vote_set.all().aggregate(vote_count=models.Sum('type', default=0))
        return count_query['vote_count']


class PostMedia(TimeStampedModel):
    class MEDIA_TYPES(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"
        LINK = "LINK", "Link"

    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    type = models.CharField(max_length=5, default=MEDIA_TYPES.IMAGE, blank=True)
    file = models.FileField(upload_to='post_media/')
    url = models.URLField()

    def __str__(self):
        return f"Post-{self.post.id} ({self.type})"