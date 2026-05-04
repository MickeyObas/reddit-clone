from django.db.models import Count, OuterRef, Prefetch, Q, Exists
from django.core.cache import cache
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

from .models import Bookmark, Post
from .serializers import (PostDisplaySerializer, PostSerializer,
                          BookmarkSerializer, PostDisplayBaseSerializer)
from .services import track_recent_view, get_recent_post_ids, clear_recent_views, get_user_feed


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def post_list_or_create(request):
    if request.method == "GET":
        posts = (
            Post.objects.select_related("owner", "community")
            .prefetch_related(
                "media",
                Prefetch(
                    "comments",
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
            .defer("body")
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
        if request.method == "GET":
            post = (
                Post.objects.select_related("owner", "community")
                .prefetch_related(
                    "media",
                    Prefetch(
                        "comments",
                        queryset=Comment.objects.filter(parent__isnull=True)
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
                .get(id=pk)
            )
            if request.user.is_authenticated:
                track_recent_view(request.user.id, post.id)

            serializer = PostSerializer(post, context={"request": request})
            return Response(serializer.data, status=200)

        post = Post.objects.only("id", "owner").get(id=pk)
        
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
    result = get_user_feed(
        user=request.user,
        sort=request.query_params.get("sort"),
        cursor=request.query_params.get("cursor")
    )
    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_post_list(request):
    user = request.user
    post_ids = get_recent_post_ids(user.id)
    
    posts = (
        Post.objects
        .filter(id__in=post_ids)
        .select_related("community")
        .prefetch_related("media")
        .annotate(
            comment_count=Count("comments", filter=Q(comments__parent__isnull=True)),
        )
    )

    posts_by_id = {str(p.id): p for p in posts}
    ordered_posts = [posts_by_id[pid] for pid in post_ids if pid in posts_by_id]
    
    serializer = PostDisplayBaseSerializer(
        ordered_posts, many=True, context={"request": request}
    )
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def recent_posts_clear(request):
    clear_recent_views(request.user.id)
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
