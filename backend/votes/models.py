from django.db import models

from api.models import TimeStampedModel

class Vote(TimeStampedModel):
    VOTE_TYPE = [
        (1, 'Upvote'),
        (-1, 'Downvote'),
    ]

    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE)
    comment = models.ForeignKey('comments.Comment', on_delete=models.CASCADE)
    type = models.SmallIntegerField(choices=VOTE_TYPE)

    class Meta:
        # Enforce either post/comment
        unique_together = ['owner', 'post', 'comment']

    def __str__(self):
        return f"{self.owner} -> {self.type.get_type_display()}"