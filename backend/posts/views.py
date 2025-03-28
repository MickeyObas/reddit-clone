from rest_framework import status, parsers
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from .models import (
    Post,
    PostMedia
)
from communities.models import Community
from .serializers import (
    PostSerializer,
    PostDisplaySerializer
)
from communities.serializers import CommunitySerializer


@api_view(['GET', 'POST'])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def post_list_or_create(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostDisplaySerializer(posts, many=True, context={"request": request})
        return Response(serializer.data, status=200)
    
    elif request.method == 'POST':
        data = request.data
        print(data)
        serializer = PostSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PATCH', 'DELETE'])
def post_detail_update_delete(request, pk):
    try:
        post = Post.objects.get(id=pk)

        if request.method == 'GET':
            serializer = PostSerializer(post, context={"request": request})
            return Response(serializer.data, status=200)
        
        elif request.method == 'DELETE':
            if post.owner != request.user:
                return Response({'error': 'You cannot delete posts owned by another user!'}, status=status.HTTP_401_UNAUTHORIZED)
            post.delete()
            return Response(status=204)
        
        elif request.method == 'PATCH':
            if post.owner != request.user:
                return Response({'error': 'You cannot update posts owned by another user!'}, status=status.HTTP_401_UNAUTHORIZED)
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

    except Post.DoesNotExist:
        return Response({'error': f"Post with ID '{pk}' does not exist"}, status=404)
    

@api_view(['GET'])
def user_post_feed(request):
    user = request.user
    user_communities = Community.objects.filter(
        # members__in=[user]
        members=user
    )
    posts = Post.objects.filter(
        community__in=user_communities
    ).order_by('-created_at')

    serializer = PostDisplaySerializer(posts, many=True)

    return Response(serializer.data)

