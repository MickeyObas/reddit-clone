from rest_framework import serializers

from .models import (
    Post,
    PostMedia
)


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = [
            'file',
            'type'
        ]

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = [
            'id',
            'owner',
            'community',
            'title',
            'body', 
        ]
    
    def validate_community(self, community):
        user = self.context.get('request').user
        if user.id not in community.members.values_list('id', flat=True):
            raise serializers.ValidationError('You are not a member of this community.')
        return community

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