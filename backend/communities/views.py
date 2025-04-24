from rest_framework import status, parsers
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from .models import Community
from posts.models import Post
from .serializers import CommunitySerializer
from posts.serializers import (
    PostDisplaySerializer, 
    CommunityPostFeedSerializer
)
from django.db.models.functions import Coalesce
from django.db.models import Sum, Value


@api_view(['GET'])
def user_community_list(request):
    user = request.user
    communities = Community.objects.filter(members=user)
    serializer = CommunitySerializer(communities, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def community_list_or_create(request):
    if request.method == 'GET':
        communities = Community.objects.all()
        serializer = CommunitySerializer(communities, many=True, context={'request': request})
        return Response(serializer.data, status=200)
    
    elif request.method == 'POST':
        data = request.data
        print(data)
        serializer = CommunitySerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PATCH', 'DELETE'])
def community_detail_update_delete(request, pk):
    try:
        community = Community.objects.get(id=pk)

        if request.method == 'GET':
            serializer = CommunitySerializer(community, context={'request': request})
            return Response(serializer.data, status=200)
        
        elif request.method == 'DELETE':
            if community.owner != request.user:
                return Response({'error': 'You cannot delete communities owned by another user!'}, status=status.HTTP_401_UNAUTHORIZED)
            community.delete()
            return Response(status=204)
        
        elif request.method == 'PATCH':
            if community.owner != request.user:
                return Response({'error': 'You cannot update communities owned by another user!'}, status=status.HTTP_401_UNAUTHORIZED)
            serializer = CommunitySerializer(community, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

    except Community.DoesNotExist:
        return Response({'error': f"Community with ID '{pk}' does not exist"}, status=400)
    
    
# TODO: Review
@api_view(['GET'])
def community_post_feed(request, pk):
    sort = request.GET.get('sort')
    try:
        community = Community.objects.get(id=pk)
        posts = Post.objects.filter(
            community=community
        )

        if sort == "latest":
            posts = posts.order_by('-created_at')
        elif sort == "best":
            posts = posts.annotate(
                vote_total=Coalesce(Sum('vote__type'), Value(0))
            ).order_by('-vote_total')

        community_serializer = CommunitySerializer(community, context={"request": request})
        post_serializer = CommunityPostFeedSerializer(posts, many=True, context={'request': request})
        return Response({
            "community": community_serializer.data,
            "posts": post_serializer.data
        })
    
    except Community.DoesNotExist:
        return Response({'error': 'Community does not exist.'}, status=404)


@api_view(['POST'])
def community_join(request, pk):
    try:
        user = request.user
        community = Community.objects.get(id=pk)

        if user.id in community.members.values_list('id', flat=True):
            return Response({'error': 'You are already a member of this community.'}, status=400)
        
        community.members.add(user)

        return Response({'message': 'You have successfully joined the community.'})
    
    except Community.DoesNotExist:
        return Response({'error': f'Community with ID: {pk} does not exist. '})
    

@api_view(['POST'])
def community_leave(request, pk):
    try:
        user = request.user
        community = Community.objects.get(id=pk)

        if user.id not in community.members.values_list('id', flat=True):
            return Response({'error': 'You are not a member of this community.'}, status=400)
        
        community.members.remove(user)

        return Response({'message': 'You have successfully left the community.'})
    
    except Community.DoesNotExist:
        return Response({'error': f'Community with ID: {pk} does not exist. '})


@api_view(['POST'])
def community_name_legal(request):
    community_name = request.data.get('community_name')
    if Community.objects.filter(name__iexact=community_name).exists():
        return Response({'error': f'"{community_name}" is already taken'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Valid.'})
    

