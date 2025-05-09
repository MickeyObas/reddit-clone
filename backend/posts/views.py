import random
from itertools import chain
from operator import attrgetter

from django.db.models import Sum, Value, Prefetch, Count, OuterRef, Subquery
from django.db.models.functions import Coalesce
from django.utils import timezone

from rest_framework import parsers
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

from .models import (
    Post,
    PostMedia,
    RecentlyViewedPost
)
from communities.models import Community
from comments.models import Comment
from votes.models import Vote
from .serializers import (
    PostSerializer,
    PostDisplaySerializer,
     RecentlyViewedPostSerializer
)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def post_list_or_create(request):
    if request.method == 'GET':
        posts = Post.objects.select_related('owner', 'community').prefetch_related(
            'postmedia_set',
            Prefetch(
                'comment_set',
                queryset=Comment.objects.filter(parent__isnull=True)
                .select_related('owner')
                .prefetch_related('replies__owner')
            ),
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).order_by('-created_at').annotate(vote_count=Coalesce(Sum('vote__type'), Value(0)))
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
        post = Post.objects.select_related('owner', 'community').prefetch_related(
            'postmedia_set',
            Prefetch(
                'comment_set',
                queryset=Comment.objects.filter(parent__isnull=True).annotate(
                    vote_count=Coalesce(Sum('vote__type'), Value(0))
                ).order_by('-created_at')
                .select_related('owner', 'owner__profile', 'commentmedia')
                .prefetch_related('replies__owner', Prefetch(
                    'vote_set',
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr='user_votes'
                ))
            ),
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).annotate(
            vote_count=Coalesce(Sum('vote__type'), Value(0))
        ).get(id=pk)
    
        if request.method == 'GET':
            if request.user.is_authenticated:
                obj, created = RecentlyViewedPost.objects.update_or_create(
                    user=request.user,
                    post=post,
                    defaults={'viewed_at': timezone.now()}
                )
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
        ).select_related('community').prefetch_related(
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).order_by('-created_at').annotate(vote_count=Coalesce(Sum('vote__type'), Value(0)))

        trending_posts = Post.objects.exclude(
            community__in=user_communities
        ).prefetch_related(
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).select_related('community').annotate(vote_count=Coalesce(Sum('vote__type'), Value(0))).order_by('-created_at')[:6]

    elif sort == 'best' or sort == 'hot':
        followed_communities_posts = Post.objects.filter(
            community__in=user_communities
        ).select_related('community').prefetch_related(
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).annotate(vote_count=Coalesce(Sum('vote__type'), Value(0))).order_by('-vote_count')

        trending_posts = Post.objects.exclude(
            community__in=user_communities
        ).select_related('community').prefetch_related(
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).annotate(vote_count=Coalesce(Sum('vote__type'), Value(0))).order_by('-vote_count')[:6]

    else:
        followed_communities_posts = Post.objects.filter(
            community__in=user_communities
        ).select_related('community').prefetch_related(
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).order_by('-created_at')
        trending_posts = Post.objects.exclude(
            community__in=user_communities
        ).select_related('community').prefetch_related(
            Prefetch(
                'vote_set',
                queryset=Vote.objects.filter(owner=request.user),
                to_attr='user_votes'
            )
        ).annotate(vote_count=Coalesce(Sum('vote__type'), Value(0))).order_by('-created_at')[:6]

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


@api_view(['POST', 'PATCH'])
def track_post_view(request, pk):
    try:
        post = Post.objects.get(id=pk)
        if request.user.is_authenticated:
            obj, created = RecentlyViewedPost.objects.update_or_create(
                user=request.user,
                post=post,
                defaults={'viewed_at': timezone.now()}
            )
            return Response({'message': "'Recent posts' updated."})
        else:
            return Response({'error': 'User not authorized'}, status=401)
        
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist'}, status=404)   
    
    except Exception as e:
        print(e)
        return Response({"error": "Something went wrong"}, status=400)



@api_view(['GET'])
def recent_post_list(request):
    user = request.user

    vote_sum_subquery = Post.objects.filter(
        id=OuterRef('post_id')
    ).annotate(
        vote_sum=Coalesce(Sum('vote__type'), Value(0))
    ).values('vote_sum')[:1]

    recently_viewed_posts = (
        RecentlyViewedPost.objects
        .filter(user=user)
        .select_related('post', 'post__community')
        .prefetch_related('post__vote_set', 'post__postmedia_set')
        .annotate(
            comment_count=Coalesce(Count('post__comment'), Value(0)),
            vote_count=Subquery(vote_sum_subquery)
        )
        .order_by('-viewed_at')[:10]
    )
    serializer = RecentlyViewedPostSerializer(recently_viewed_posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['DELETE'])
def recent_posts_clear(request):
    RecentlyViewedPost.objects.filter(user=request.user).delete()
    return Response(status=204)