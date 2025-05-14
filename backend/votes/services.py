from django.db import transaction
from django.db.models import Sum

from comments.models import Comment
from posts.models import Post
from votes.models import Vote


class VoteService:
    @transaction.atomic
    def vote(self, user, obj_type, obj_id, direction):
        if obj_type == "p":
            return self._vote_post(user, obj_id, direction)
        elif obj_type == "c":
            return self._vote_comment(user, obj_id, direction)
        else:
            raise ValueError("Invalid vote object type.")

    def _vote_post(self, user, obj_id, direction):
        post = Post.objects.select_for_update().get(id=obj_id)
        vote_qs = Vote.objects.select_for_update().filter(owner=user, post=post)
        self._process_vote(vote_qs, user, direction, post=post)
        vote_count = (
            Vote.objects.filter(post_id=obj_id).aggregate(total=Sum("type"))["total"]
            or 0
        )
        return vote_count

    def _vote_comment(self, user, obj_id, direction):
        comment = Comment.objects.select_for_update().get(id=obj_id)
        vote_qs = Vote.objects.select_for_update().filter(owner=user, comment=comment)
        self._process_vote(vote_qs, user, direction, comment=comment)
        vote_count = (
            Vote.objects.filter(comment_id=obj_id).aggregate(total=Sum("type"))["total"]
            or 0
        )
        return vote_count

    def _process_vote(self, vote_qs, user, direction, **kwargs):
        if vote_qs.exists():
            existing_vote = vote_qs.first()
            if existing_vote.type == direction:
                existing_vote.delete()
            else:
                existing_vote.type = direction
                existing_vote.save()
        else:
            Vote.objects.create(owner=user, type=direction, **kwargs)
