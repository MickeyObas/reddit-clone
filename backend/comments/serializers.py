from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Prefetch, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import serializers

from accounts.models import User
from accounts.serializers import UserSerializer
from posts.models import Post
from votes.models import Vote

from .models import Comment, CommentMedia


class CommentSerializer(serializers.ModelSerializer):

    media = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    owner = UserSerializer(read_only=True)
    vote_count = serializers.IntegerField(default=0, read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "parent",
            "owner",
            "post",
            "body",
            "media",
            "user_vote",
            "replies",
            "created_at",
            "vote_count",
        ]

    # NOTE: Fetch on demand instead
    def get_replies(self, obj):
        request = self.context["request"]

        """
        if hasattr(obj, 'replies'):
            replies = sorted(obj.replies.all(), key=lambda x: x.created_at, reverse=True)
            return CommentSerializer(
                replies,
                many=True,
                context={'request': self.context.get('request')}
            ).data
        return []
        """

        return CommentSerializer(
            obj.replies.select_related("owner", "owner__profile", "commentmedia")
            .prefetch_related(
                "replies__owner",
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                ),
            )
            .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
            .order_by("created_at"),
            many=True,
            context={"request": self.context.get("request")},
        ).data

    def get_media(self, obj):
        try:
            return obj.commentmedia.file.name
        except ObjectDoesNotExist:
            return None

    def get_user_vote(self, obj):
        user = self.context.get("request").user

        if not user or not user.is_authenticated:
            return None

        if hasattr(obj, "user_votes") and obj.user_votes:
            return obj.user_votes[0].vote_type_name.lower()

        # vote = Vote.objects.filter(
        #     comment=obj,
        #     owner=user
        # )
        # if vote.exists():
        #     return vote.first().vote_type_name.lower()

        return None

    def create(self, validated_data):
        validated_data["owner"] = self.context.get("request").user
        comment = Comment.objects.create(**validated_data)
        media_files = self.context["request"].FILES.getlist("media")

        if media_files:
            media_file = media_files[0]
            if media_file.content_type.startswith("image"):
                media_type = "IMAGE"
            elif media_file.content_type.startswith("video"):
                media_type = "VIDEO"

            CommentMedia.objects.create(
                comment=comment, type=media_type, file=media_file
            )

        return comment


class ThinCommentSerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = Comment
        fields = [
            "owner",
        ]


class FeedCommentSerializer(serializers.ModelSerializer):
    user_vote = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    parent = ThinCommentSerializer()
    vote_count = serializers.IntegerField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "parent",  # owner, None
            "post",  # title, owner(is_creator?), channel
            "body",
            "created_at",
            "vote_count",
            "user_vote",
        ]

    def get_post(self, obj):
        from posts.serializers import ThinPostSerializer

        return ThinPostSerializer(
            obj.post, context={"request": self.context["request"]}
        ).data

    def get_user_vote(self, obj):
        user = self.context.get("request").user
        if not user or not user.is_authenticated:
            return None

        if hasattr(obj, "user_votes") and obj.user_votes:
            return obj.user_votes[0].vote_type_name.lower()

        return None
