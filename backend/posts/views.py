from rest_framework import status, parsers
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from .models import (
    Post,
    PostMedia
)
from .serializers import (
    PostSerializer
)


@api_view(['GET', 'POST'])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def post_list_or_create(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        data = request.data
        print(data)
        serializer = PostSerializer(data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



@api_view(['GET'])
def post_detail(request, pk):
    try:
        post = Post.objects.get(id=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=200)
    except Post.DoesNotExist:
        return Response({'error': f"Post with ID '{pk}' does not exist"}, status=400)
    


