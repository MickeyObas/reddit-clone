from rest_framework import serializers

from .models import Topic, TopicCategory


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "name", "category"]


class TopicCategorySerializer(serializers.ModelSerializer):

    topics = serializers.SerializerMethodField()

    class Meta:
        model = TopicCategory
        fields = ["name", "emoji", "topics"]

    def get_topics(self, obj):
        return TopicSerializer(obj.topic_set.all(), many=True).data
