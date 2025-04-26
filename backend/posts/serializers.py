from rest_framework import serializers

from .models import (
    Post,
    PostMedia
)
from comments.models import Comment
from communities.models import Community
from votes.models import Vote
from accounts.serializers import UserSerializer
from comments.serializers import CommentSerializer
from communities.serializers import CommunityDisplaySerializer


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = [
            'file',
            'type'
        ]

class PostSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()
    owner = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    community = serializers.SerializerMethodField()
    community_id = serializers.CharField(write_only=True)
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'owner',
            'community',
            'community_id',
            'title',
            'body', 
            'media',
            'comments',
            'user_vote',
            'vote_count',
            'comment_count',
            'created_at',
            'is_member'
        ]

    def get_media(self, obj):
        media_files = obj.postmedia_set.all()
        if media_files:
            return ["https://reddit-clone-backend-pgon.onrender.com" + media_file.file.url for media_file in media_files]
        return None
    
    def get_comments(self, obj):
        comments = Comment.objects.filter(
            post=obj,
            parent__isnull=True
        )
        return CommentSerializer(comments, many=True, context={'request': self.context.get('request')}).data
    
    def get_comment_count(self, obj):
        return Comment.objects.filter(
            post=obj,
            parent__isnull=True
            ).count()
    
    def get_user_vote(self, obj):
        user = self.context.get('request').user
        vote = Vote.objects.filter(
            post=obj,
            owner=user
        )
        if vote.exists():
            return vote.first().vote_type_name.lower()
        return None
        
    def get_is_member(self, obj):
        user = self.context.get('request').user
        return user.id in obj.community.members.values_list('id', flat=True)

    def create(self, validated_data):
        request = self.context['request']
        user = request.user
        
        community_id = validated_data.pop('community_id')
        community = Community.objects.get(id=community_id)

        if community.type != 'public':
            if user.id not in community.members.values_list('id', flat=True):
                raise serializers.ValidationError('You cannot perform this action. You are not a member of this community')
        
        media_files = request.FILES.getlist('media')
        validated_data['owner'] = user
        validated_data['community'] = community
        
        post = Post.objects.create(**validated_data)

        for media_file in media_files:
            mime_type = media_file.content_type
            media_type = None

            if mime_type.startswith('image'):
                media_type = 'IMAGE'
            elif mime_type.startswith('video'):
                media_type = 'VIDEO'
            
            PostMedia.objects.create(
                post=post,
                type=media_type,
                file=media_file,
            )

        return post
    

    def get_community(self, obj):
        return CommunityDisplaySerializer(obj.community, context={'request': self.context['request']}).data 

class PostDisplaySerializer(serializers.ModelSerializer):

    comment_count = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    community = CommunityDisplaySerializer()
    user_vote = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'community',
            'title',
            'vote_count',
            'comment_count',
            'thumbnail',
            'created_at',
            'user_vote',
            'is_member'
        ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(
            post=obj,
            parent__isnull=True
            ).count()
    
    def get_thumbnail(self, obj):
        media_files = obj.postmedia_set.all()
        if media_files:
            return "https://reddit-clone-backend-pgon.onrender.com" + media_files[0].file.url
        return None
    
    def get_user_vote(self, obj):
        user = self.context.get('request').user
        vote = Vote.objects.filter(
            post=obj,
            owner=user
        )
        if vote.exists():
            return vote.first().vote_type_name.lower()
        return None

    def get_is_member(self, obj):
        user = self.context.get('request').user
        return user.id in obj.community.members.values_list('id', flat=True)
    
class CommunityPostFeedSerializer(PostDisplaySerializer):

    owner = UserSerializer()

    class Meta(PostDisplaySerializer.Meta):
        fields = PostDisplaySerializer.Meta.fields + ['owner'] 

class ThinPostSerializer(serializers.ModelSerializer):

    owner = UserSerializer()
    community = CommunityDisplaySerializer()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'owner',
            'community'
        ]