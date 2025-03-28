from rest_framework import serializers

from .models import Community


class CommunitySerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = [
            'id',
            'name',
            'type',
            'description',
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
        return user.id in obj.members.values_list('id', flat=True)

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
    
