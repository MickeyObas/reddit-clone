from django.db import models

from api.models import TimeStampedModel

class Comment(TimeStampedModel):
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE)
    body = models.TextField()

    def __str__(self):
        return f"{self.owner} on {self.post.title}"


class CommentMedia(TimeStampedModel):
    class MEDIA_TYPES(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"
        
    comment = models.OneToOneField('Comment', on_delete=models.CASCADE)
    type = models.CharField(max_length=5, default=MEDIA_TYPES.IMAGE)
    url = models.URLField()

    def __str__(self):
        return f"{self.comment.id} -> {self.type}"

