from rest_framework import parsers, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from .models import Topic, TopicCategory
from .serializers import TopicCategorySerializer


@api_view(["GET"])
def topics_list(request):
    categories = TopicCategory.objects.all()
    serializer = TopicCategorySerializer(categories, many=True)
    return Response(serializer.data)
