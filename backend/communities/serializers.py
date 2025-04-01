from rest_framework import serializers

from .models import Community
from accounts.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    moderators = UserSerializer(many=True)
    
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
            'rules',
            'created_at',
            'is_member'
        ]

    def get_is_member(self, obj):
        user = self.context.get('request').user
        return obj.members.filter(id=user.id).exists()
    
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['owner'] = user

        return super().create(validated_data)
    

class CommunityDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = [
            "id",
            "avatar",
            "name"
        ]
    
