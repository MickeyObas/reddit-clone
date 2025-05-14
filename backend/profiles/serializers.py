from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "display_name",
            "about_description",
            "avatar",
            "banner",
            "is_mature",
            "created_at",
        ]
