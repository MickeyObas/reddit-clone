import random
from itertools import chain
from operator import attrgetter

from django.db.models import Count, OuterRef, Prefetch, Subquery, Sum, Value, When, Case, IntegerField, Q
from django.db.models.functions import Coalesce
from django.core.cache import cache
from django.utils import timezone
from rest_framework import parsers
from rest_framework.decorators import (api_view, parser_classes,
                                       permission_classes)
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from comments.models import Comment
from communities.models import Community
from votes.models import Vote

from .models import Bookmark, Post, PostMedia, RecentlyViewedPost
from .serializers import (PostDisplaySerializer, PostSerializer,
                          RecentlyViewedPostSerializer, BookmarkSerializer)
from .services import get_next_cursor, parse_cursor, get_feed_cache_key


PAGE_SIZE = 12


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def post_list_or_create(request):
    if request.method == "GET":
        posts = (
            Post.objects.select_related("owner", "community")
            .prefetch_related(
                "postmedia_set",
                Prefetch(
                    "comment_set",
                    queryset=Comment.objects.filter(parent__isnull=True)
                    .select_related("owner")
                    .prefetch_related("replies__owner"),
                ),
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                ),
                Prefetch(
                    "bookmarks",
                    queryset=Bookmark.objects.filter(owner=request.user),
                    to_attr="user_bookmarks",
                ),
            )
            .order_by("-created_at")
            # .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
        )
        serializer = PostDisplaySerializer(
            posts, many=True, context={"request": request}
        )
        return Response(serializer.data, status=200)

    elif request.method == "POST":
        data = request.data
        serializer = PostSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PATCH", "DELETE"])
def post_detail_update_delete(request, pk):
    try:
        post = (
            Post.objects.select_related("owner", "community")
            .prefetch_related(
                "postmedia_set",
                Prefetch(
                    "comment_set",
                    queryset=Comment.objects.filter(parent__isnull=True)
                    # .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
                    .order_by("-created_at")
                    .select_related("owner", "owner__profile", "commentmedia")
                    .prefetch_related(
                        "replies__owner",
                        Prefetch(
                            "vote_set",
                            queryset=Vote.objects.filter(owner=request.user),
                            to_attr="user_votes",
                        ),
                    ),
                ),
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                ),
                Prefetch(
                    "bookmarks",
                    queryset=Bookmark.objects.filter(owner=request.user),
                    to_attr="user_bookmarks",
                ),
            )
            # .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
            .get(id=pk)
        )

        if request.method == "GET":
            if request.user.is_authenticated:
                obj, created = RecentlyViewedPost.objects.update_or_create(
                    user=request.user, post=post, defaults={"viewed_at": timezone.now()}
                )
            serializer = PostSerializer(post, context={"request": request})
            return Response(serializer.data, status=200)

        if request.user != post.owner:
            raise PermissionDenied("You cannot perform this action")

        if request.method == "DELETE":
            post.delete()
            return Response(status=204)

        elif request.method == "PATCH":
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

    except Post.DoesNotExist:
        return Response({"error": f"Post with ID '{pk}' does not exist"}, status=404)


@api_view(["GET"])
def user_post_feed(request):
    sort = request.query_params.get("sort", None)
    cursor = request.query_params.get("cursor")
    print("Cursor ---> ", cursor)
    user = request.user
    cache_key = get_feed_cache_key(user.id, sort)

    if not cursor:
        cached = cache.get(cache_key)
        print("CACHED -------> ", cached)
        if cached:
            return Response(cached)

    user_community_ids = list(
        Community.objects.filter(members=user).values_list("id", flat=True)
    )

    posts_qs = (
        Post.objects
        .select_related("community")
        .prefetch_related(
            Prefetch(
                "vote_set",
                queryset=Vote.objects.filter(owner=request.user),
                to_attr="user_votes",
            ),
            Prefetch(
                "bookmarks",
                queryset=Bookmark.objects.filter(owner=request.user),
                to_attr="user_bookmarks",
            ),
        )
        .annotate(
            is_followed=Case(
                When(community_id__in=user_community_ids, then=Value(1)),
                default=Value(0),
                output_field=IntegerField(),
            )
        )
    )

    parsed = parse_cursor(cursor)

    if sort == "new":
        if parsed:
            posts_qs = posts_qs.filter(
                Q(is_followed__lt=parsed["is_followed"]) |
                Q(
                    is_followed=parsed["is_followed"],
                    created_at__lt=parsed["primary"]
                ) |
                Q(
                    is_followed=parsed["is_followed"],
                    created_at=parsed["primary"],
                    id__lt=parsed["id"]
                )
            )
        posts = posts_qs.order_by("-is_followed", "-created_at", "-id")[:PAGE_SIZE]

    elif sort == "best" or sort == "hot":
        if parsed:
            posts_qs = posts_qs.filter(
                Q(is_followed__lt=parsed["is_followed"]) |
                Q(
                    is_followed=parsed["is_followed"],
                    vote_count__lt=int(parsed["primary"])
                ) |
                Q(
                    is_followed=parsed["is_followed"],
                    vote_count=int(parsed["primary"]),
                    id__lt=parsed["id"]
                )
            )
        posts = posts_qs.order_by("-is_followed", "-vote_count", "-id")[:PAGE_SIZE]
        
    else:
        if parsed:
            posts_qs = posts_qs.filter(
                Q(is_followed__lt=parsed["is_followed"]) |
                Q(
                    is_followed=parsed["is_followed"],
                    created_at__lt=parsed["primary"]
                ) |
                Q(
                    is_followed=parsed["is_followed"],
                    created_at=parsed["primary"],
                    id__lt=parsed["id"]
                )
            )

        posts = posts_qs.order_by("-is_followed", "-created_at", "-id")[:PAGE_SIZE]

    serializer = PostDisplaySerializer(posts, many=True, context={"request": request})

    response_data = {
        "posts": serializer.data,
        "cursor": get_next_cursor(posts, sort)
    }

    if not cursor:
        cache.set(cache_key, response_data, timeout=60)

    return Response(response_data)



@api_view(["GET"])
def recent_post_list(request):
    user = request.user
    
    recently_viewed_posts = (
        RecentlyViewedPost.objects.filter(user=user)
        .select_related("post", "post__community")
        .prefetch_related("post__vote_set", "post__postmedia_set")
        .annotate(
            comment_count=Coalesce(Count("post__comment"), Value(0)),
            # vote_count=Subquery(vote_sum_subquery),
        )
        .order_by("-viewed_at")[:10]
    )
    serializer = RecentlyViewedPostSerializer(
        recently_viewed_posts, many=True, context={"request": request}
    )
    return Response(serializer.data)


@api_view(["DELETE"])
def recent_posts_clear(request):
    RecentlyViewedPost.objects.filter(user=request.user).delete()
    return Response(status=204)


@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def post_bookmark_create_or_delete(request, pk):
    try:
        post = Post.objects.get(id=pk)

        if request.method == "POST":
            bookmark, created = Bookmark.objects.get_or_create(
                owner=request.user, post=post
            )

            if created:
                serializer = BookmarkSerializer(bookmark, context={"request": request})
                return Response(serializer.data, status=201)

            return Response({"error": "Post already bookmarked."}, status=400)

        Bookmark.objects.filter(owner=request.user, post=post).delete()
        return Response(status=204)

    except Post.DoesNotExist:
        return Response({"error": "Post does not exist."}, status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_bookmark_list(request):
    bookmarks = (
        Bookmark.objects.filter(owner=request.user)
        .select_related(
            "post",
            "post__owner",
            "post__owner__profile",
            "post__community",
            "post__community__owner",
        )
        .prefetch_related("post__community__topics")
        .order_by("-created_at")
    )
    serializer = BookmarkSerializer(bookmarks, many=True, context={"request": request})
    return Response(serializer.data, status=200)
