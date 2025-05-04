import random
from itertools import chain
from operator import attrgetter

from django.db.models import Sum, Value
from django.db.models.functions import Coalesce

from rest_framework import status, parsers
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

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
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def post_list_or_create(request):
    if request.method == 'GET':
        posts = Post.objects.order_by('-created_at')
        serializer = PostDisplaySerializer(posts, many=True, context={"request": request})
        return Response(serializer.data, status=200)
    
    elif request.method == 'POST':
        data = request.data
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
        
        if request.user != post.owner:
            raise PermissionDenied("You cannot perform this action")

        if request.method == 'DELETE':
            post.delete()
            return Response(status=204)
        
        elif request.method == 'PATCH':
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

    except Post.DoesNotExist:
        return Response({'error': f"Post with ID '{pk}' does not exist"}, status=404)
    

@api_view(['GET'])
def user_post_feed(request):
    sort = request.query_params.get('sort', None)
    print("This is sort: ", sort)
    user = request.user
    user_communities = Community.objects.filter(
        # members__in=[user]
        members=user
    )

    if sort == 'new':
        followed_communities_posts = Post.objects.filter(
            community__in=user_communities
        ).order_by('-created_at')
        trending_posts = Post.objects.exclude(
            community__in=user_communities
        ).annotate(vote_total=Coalesce(Sum('vote__type'), Value(0))).order_by('-created_at')[:6]

    elif sort == 'best' or sort == 'hot':
        followed_communities_posts = Post.objects.filter(
            community__in=user_communities
        ).annotate(vote_total=Coalesce(Sum('vote__type'), Value(0))).order_by('-vote_total', '-created_at')
        trending_posts = Post.objects.exclude(
            community__in=user_communities
        ).annotate(vote_total=Coalesce(Sum('vote__type'), Value(0))).order_by('-vote_total', '-created_at')[:6]

    else:
        followed_communities_posts = Post.objects.filter(
            community__in=user_communities
        ).order_by('-created_at')
        trending_posts = Post.objects.exclude(
            community__in=user_communities
        ).annotate(vote_total=Coalesce(Sum('vote__type'), Value(0))).order_by('-created_at')[:6]

    posts = list(followed_communities_posts) + list(trending_posts)

    if sort == 'none':
        random.shuffle(posts)
    elif sort == 'new':
        posts = sorted(
            posts,
            key=attrgetter('created_at'),
            reverse=True
        )

    serializer = PostDisplaySerializer(posts, many=True, context={'request': request})

    return Response(serializer.data)

