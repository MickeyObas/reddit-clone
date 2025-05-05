from django.db import models

from api.models import TimeStampedModel

class Comment(TimeStampedModel):
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE)
    body = models.TextField()

    def __str__(self):
        return f"{self.owner} on {self.post.title}"
    
    # @property
    # def vote_count(self):
    #     count_query = self.vote_set.all().aggregate(vote_count=models.Sum('type', default=0))
    #     return count_query['vote_count']


class CommentMedia(TimeStampedModel):
    class MEDIA_TYPES(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"
        
    comment = models.OneToOneField('Comment', on_delete=models.CASCADE)
    type = models.CharField(max_length=5, default=MEDIA_TYPES.IMAGE)
    url = models.URLField()
    file = models.FileField(upload_to='comment_media/')

    def __str__(self):
        return f"{self.comment.id} -> {self.type}"

