from rest_framework import serializers

from .models import Community


class CommunitySerializer(serializers.ModelSerializer):
    
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
            'created_at'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['owner'] = user

        return super().create(validated_data)
    
