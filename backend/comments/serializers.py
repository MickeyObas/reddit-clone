from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers

from .models import Comment, CommentMedia


class CommentSerializer(serializers.ModelSerializer):

    media = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'parent',
            'owner',
            'post',
            'body',
            'media',
            'vote_count',
            'replies',
            'created_at'
        ]

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data
    
    def get_media(self, obj):
        try:
            return obj.commentmedia.file.name
        except ObjectDoesNotExist:
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