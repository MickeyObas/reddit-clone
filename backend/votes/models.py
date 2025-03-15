from django.db import models

from api.models import TimeStampedModel

class Vote(TimeStampedModel):
    VOTE_TYPE = [
        (1, 'Upvote'),
        (-1, 'Downvote'),
    ]

    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, blank=True, null=True)
    comment = models.ForeignKey('comments.Comment', on_delete=models.CASCADE, blank=True, null=True)
    type = models.SmallIntegerField(choices=VOTE_TYPE)

    class Meta:
        # Enforce either post/comment
        unique_together = ['owner', 'post']

    @property
    def get_vote_type_name(self):
        types = {}
        for type in Vote.VOTE_TYPE:
            types[type[0]] = type[1]
        print(types)
        return types[self.type]

    def __str__(self):
        return f"{self.owner} -> {self.post.id} -> {self.get_vote_type_name}"