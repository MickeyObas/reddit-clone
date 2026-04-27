from django.db import transaction
from django.db.models import Sum, F
from django.core.exceptions import ObjectDoesNotExist

from comments.models import Comment
from posts.models import Post
from votes.models import Vote



class VoteService:
    _MODEL_MAP = {
        "p": (Post, "post"),
        "c": (Comment, "comment")
    }

    @transaction.atomic
    def vote(self, user, obj_type, obj_id, direction):
        if direction not in (1, -1):
            raise ValueError("Invalid vote direction")

        model, fk_field = self._MODEL_MAP.get(obj_type, (None, None))
        if model is None:
            raise ValueError("Invalid vote object type")

        try:
            obj = model.objects.get(id=obj_id)
        except ObjectDoesNotExist:
            raise ValueError(f"{model.__name__} not found")
        
        vote_qs = Vote.objects.select_for_update().filter(owner=user, **{fk_field: obj})
        delta = self._process_vote(vote_qs, user, direction, obj=obj, fk_field=fk_field)

        if delta != 0:
            model.objects.filter(id=obj_id).update(vote_count=F("vote_count") + delta)

        obj.refresh_from_db(fields=["vote_count"])
        return obj.vote_count


    def _process_vote(self, vote_qs, user, direction, obj, fk_field):
        existing_vote = vote_qs.first()

        if existing_vote:
            if existing_vote.type == direction:
                # remove vote
                existing_vote.delete()
                return -direction

            else:
                # change vote
                old = existing_vote.type
                existing_vote.type = direction
                existing_vote.save(update_fields=["type"])
                return direction - old

        else:
            Vote.objects.create(owner=user, type=direction, **{fk_field: obj})
            return direction
