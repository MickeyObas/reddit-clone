from rest_framework import serializers

from .models import Community
from accounts.serializers import UserSerializer
from topics.serializers import TopicCategorySerializer, TopicSerializer

class CommunitySerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    moderators = UserSerializer(many=True, required=False)
    topic_ids = serializers.ListField(write_only=True, child=serializers.IntegerField())
    topics = TopicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Community
        fields = [
            'id',
            'name',
            'type',
            'description',
            'subtitle',
            'avatar',
            'banner',
            'member_count',
            'moderators',
            'topics',
            'rules',
            'created_at',
            'is_member',
            'is_mature',
            'topic_ids'
        ]

    def get_is_member(self, obj):
        user = self.context.get('request').user
        return obj.members.filter(id=user.id).exists()
    
    def create(self, validated_data):
        topic_ids = validated_data.pop('topic_ids')
        request = self.context.get('request')
        user = request.user

        community = Community.objects.create(owner=user, **validated_data)
        community.topics.set(topic_ids)
        community.members.add(user.id)
        community.moderators.add(user.id)

        return community

class CommunityDisplaySerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = [
            "id",
            "avatar",
            "name"
        ]
    
    def get_avatar(self, obj):
        if obj.avatar:
            return "http://localhost:8000" + obj.avatar.url