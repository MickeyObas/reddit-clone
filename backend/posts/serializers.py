from rest_framework import serializers

from accounts.serializers import UserSerializer
from comments.models import Comment
from comments.serializers import CommentSerializer
from communities.models import Community
from communities.serializers import (CommunityDisplaySerializer,
                                     CommunitySerializer)
from votes.models import Vote

from .models import Post, PostMedia, RecentlyViewedPost


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = ["file", "type"]

    def validate(self, attrs):
        instance = PostMedia(**attrs)
        instance.full_clean()
        return attrs


class PostSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()
    owner = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    community = serializers.SerializerMethodField()
    community_id = serializers.CharField(write_only=True)
    is_member = serializers.SerializerMethodField()
    vote_count = serializers.IntegerField(default=0, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "owner",
            "community",
            "community_id",
            "title",
            "body",
            "media",
            "comments",
            "user_vote",
            "vote_count",
            "comment_count",
            "created_at",
            "is_member",
        ]

    def get_media(self, obj):
        request = self.context["request"]
        media_files = obj.postmedia_set.all()
        if media_files:
            return (
                [
                    request.build_absolute_uri(media_file.file.url)
                    for media_file in media_files
                ]
                if not media_files[0].file.url.startswith("http")
                else [media_file.file.url for media_file in media_files]
            )
        return None

    def get_comments(self, obj):
        top_comments = obj.comment_set.all()
        return CommentSerializer(
            top_comments, many=True, context={"request": self.context.get("request")}
        ).data

    def get_comment_count(self, obj):
        return obj.comment_set.count()

    def get_user_vote(self, obj):
        user = self.context.get("request").user

        if not user or not user.is_authenticated:
            return None

        vote = Vote.objects.filter(post=obj, owner=user)
        if vote.exists():
            return vote.first().vote_type_name.lower()
        return None

    def get_is_member(self, obj):
        user = self.context.get("request").user

        if not user or not user.is_authenticated:
            return False

        return user.id in obj.community.members.values_list("id", flat=True)

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        community_id = validated_data.pop("community_id")
        community = Community.objects.get(id=community_id)

        if community.type != "public":
            if user.id not in community.members.values_list("id", flat=True):
                raise serializers.ValidationError(
                    "You cannot perform this action. You are not a member of this community"
                )

        media_files = request.FILES.getlist("media")
        validated_data["owner"] = user
        validated_data["community"] = community

        post = Post.objects.create(**validated_data)

        for media_file in media_files:
            mime_type = media_file.content_type
            media_type = None

            if mime_type.startswith("image"):
                media_type = "IMAGE"
            elif mime_type.startswith("video"):
                media_type = "VIDEO"

            PostMedia.objects.create(
                post=post,
                type=media_type,
                file=media_file,
            )

        return post

    def get_community(self, obj):
        request = self.context["request"]
        if request:
            return CommunityDisplaySerializer(
                obj.community, context={"request": self.context["request"]}
            ).data


class PostDisplaySerializer(serializers.ModelSerializer):

    comment_count = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    community = CommunityDisplaySerializer()
    user_vote = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    vote_count = serializers.IntegerField()

    class Meta:
        model = Post
        fields = [
            "id",
            "community",
            "title",
            "vote_count",
            "comment_count",
            "thumbnail",
            "created_at",
            "user_vote",
            "is_member",
        ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(post=obj, parent__isnull=True).count()

    def get_thumbnail(self, obj):
        request = self.context.get("request")
        media_files = obj.postmedia_set.all()
        if media_files:
            return request.build_absolute_uri(media_files[0].file.url)
        return None

    def get_user_vote(self, obj):

        user = self.context.get("request").user
        if not user or not user.is_authenticated:
            return None

        if hasattr(obj, "user_votes") and obj.user_votes:
            return obj.user_votes[0].vote_type_name.lower()

        return None

    def get_is_member(self, obj):
        user = self.context.get("request").user
        if not user or not user.is_authenticated:
            return False
        return user.id in obj.community.members.values_list("id", flat=True)


class CommunityPostFeedSerializer(PostDisplaySerializer):

    owner = UserSerializer()

    class Meta(PostDisplaySerializer.Meta):
        fields = PostDisplaySerializer.Meta.fields + ["owner"]


class ThinPostSerializer(serializers.ModelSerializer):

    owner = UserSerializer()
    community = CommunityDisplaySerializer()

    class Meta:
        model = Post
        fields = ["id", "title", "owner", "community"]


class RecentlyViewedPostSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="post.title")
    community_id = serializers.CharField(source="post.community.id")
    community_name = serializers.CharField(source="post.community.name")
    community_avatar = serializers.ImageField(source="post.community.avatar")
    comment_count = serializers.IntegerField()
    vote_count = serializers.IntegerField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = RecentlyViewedPost
        fields = [
            "id",
            "post_id",
            "title",
            "thumbnail",
            "community_id",
            "community_name",
            "community_avatar",
            "comment_count",
            "vote_count",
        ]

    def get_thumbnail(self, obj):
        request = self.context.get("request")
        media_files = obj.post.postmedia_set.all()
        if not media_files:
            return None
        return request.build_absolute_uri(media_files[0].file.url)
