from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):

    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'parent',
            'owner',
            'post',
            'body',
            'replies',
            'created_at'
        ]

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data