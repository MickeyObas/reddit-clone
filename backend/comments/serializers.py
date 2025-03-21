from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers

from .models import Comment, CommentMedia
from votes.models import Vote


class CommentSerializer(serializers.ModelSerializer):

    media = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'parent',
            'owner',
            'post',
            'body',
            'media',
            'user_vote',
            'vote_count',
            'replies',
            'created_at'
        ]

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all().order_by('created_at'), many=True, context={'request': self.context.get('request')}).data
    
    def get_media(self, obj):
        try:
            return obj.commentmedia.file.name
        except ObjectDoesNotExist:
            return None
        
    def get_user_vote(self, obj):
        user = self.context.get('request').user
        vote = Vote.objects.filter(
            comment=obj,
            owner=user
        )
        if vote.exists():
            return vote.first().vote_type_name.lower()
        return None
    
    def create(self, validated_data):
        comment = Comment.objects.create(**validated_data)
        media_files = self.context['request'].FILES.getlist('media')

        if media_files:
            media_file = media_files[0]
            if media_file.content_type.startswith('image'):
                media_type = 'IMAGE'
            elif media_file.content_type.startswith('video'):
                media_type = 'VIDEO'

            CommentMedia.objects.create(
                comment=comment,
                type=media_type,
                file=media_file
            )
        
        return comment