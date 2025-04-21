from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status, parsers
from django.db.models import Sum, Value
from django.db.models.functions import Coalesce

from .models import Profile
from accounts.models import User
from posts.models import Post
from comments.models import Comment
from .serializers import ProfileSerializer
from posts.serializers import PostSerializer, PostDisplaySerializer
from comments.serializers import CommentSerializer, FeedCommentSerializer

from itertools import chain
from operator import attrgetter


@api_view(['GET'])
def profile_list(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def profile_detail_update(request, pk):
    try:
        user = User.objects.get(id=pk)
        profile = user.profile

        if request.method == 'GET':
            serializer = ProfileSerializer(profile, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            if request.user.id != profile.user.id:
                return Response({'error': 'You cannot perform this action'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Profile updated successfuly.'})
            return Response(serializer.errors, status=400)
    
    except Profile.DoesNotExist:
        return Response({'error': "Profile does not exist."}, status=404)
    

@api_view(['GET'])
def profile_overview(request, pk):
    sort_filter = request.query_params.get('sort', 'new')
    user = User.objects.get(id=pk)
    # NOTE: This is temporary. Change back to request-scoping for user
    # user = request.user
    posts = Post.objects.filter(owner=user)
    comments = Comment.objects.filter(owner=user)

    for p in posts:
        p.content_type = 'post'
    for c in comments:
        c.content_type = 'comment'

    if sort_filter == 'new':
        key = attrgetter('created_at')
    elif sort_filter == 'best' or sort_filter == 'hot':
        key = attrgetter('vote_count')

    combined = sorted(
        chain(posts, comments),
        key=key,
        reverse=True
    )

    results = []

    for item in combined:
        if item.content_type == 'post':
            data = PostDisplaySerializer(item, context={'request': request}).data
        else:
            data = FeedCommentSerializer(item, context={'request': request}).data
        data['type'] = item.content_type

        results.append(data)
    
    return Response(results)


@api_view(['GET'])
def profile_posts(request, pk):
    sort = request.query_params.get('sort', 'new')
    print(sort)
    user = User.objects.get(id=pk)
    posts = []

    if sort == 'new':
        posts = Post.objects.filter(owner=user).order_by('-created_at')
    elif sort == 'best' or sort == 'hot':
        posts = Post.objects.filter(owner=user).annotate(
            vote_total=Coalesce(Sum('vote__type'), Value(0))
        ).order_by('-vote_total')

    serializer = PostDisplaySerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def profile_comments(request, pk):
    sort = request.query_params.get('sort', 'new')
    user = User.objects.get(id=pk)
    comments = []

    if sort == 'new':
        comments = Comment.objects.filter(owner=user).order_by('created_at')
    elif sort == 'best' or sort == 'hot':
        comments = Comment.objects.filter(owner=user).annotate(
            vote_total=Coalesce(Sum('vote__type'), Value(0))
        ).order_by('-vote_total')

    serializer = FeedCommentSerializer(comments, many=True, context={'request': request})
    return Response(serializer.data)