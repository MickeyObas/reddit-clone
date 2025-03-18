from rest_framework import serializers

from .models import (
    Post,
    PostMedia
)
from comments.models import Comment
from votes.models import Vote
from accounts.serializers import UserSerializer
from comments.serializers import CommentSerializer

class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = [
            'file',
            'type'
        ]

class PostSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()
    owner = UserSerializer()
    comments = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    community = serializers.CharField(source='community.name')

    class Meta:
        model = Post
        fields = [
            'id',
            'owner',
            'community',
            'title',
            'body', 
            'media',
            'comments',
            'vote_count',
            'comment_count'
        ]
    
    def validate_community(self, community):
        user = self.context.get('request').user
        if user.id not in community.members.values_list('id', flat=True):
            raise serializers.ValidationError('You are not a member of this community.')
        return community

    def get_media(self, obj):
        media_files = obj.postmedia_set.all()
        if media_files:
            return [media_file.file.name for media_file in media_files]
        return None
    
    def get_comments(self, obj):
        comments = Comment.objects.filter(
            post=obj,
            parent__isnull=True
        )
        return CommentSerializer(comments, many=True).data
    
    def get_comment_count(self, obj):
        return Comment.objects.filter(
            post=obj,
            parent__isnull=True
            ).count()
        

    def create(self, validated_data):
        media_files = self.context['request'].FILES.getlist('media')
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
    

class PostDisplaySerializer(serializers.ModelSerializer):

    comment_count = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    community = serializers.CharField(source='community.name')
    user_vote = serializers.SerializerMethodField()

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
            'user_vote'
        ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(
            post=obj,
            parent__isnull=True
            ).count()
    
    def get_thumbnail(self, obj):
        media_files = obj.postmedia_set.all()
        if media_files:
            return media_files[0].file.name
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
