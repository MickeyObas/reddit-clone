from itertools import chain
from operator import attrgetter

from django.db.models import Prefetch, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import parsers, permissions, status
from rest_framework.decorators import (api_view, parser_classes,
                                       permission_classes)
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

from accounts.models import User
from comments.models import Comment
from comments.serializers import FeedCommentSerializer
from posts.models import Post
from posts.serializers import PostDisplaySerializer
from votes.models import Vote

from .models import Profile
from .serializers import ProfileSerializer


@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def profile_list(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET", "PATCH"])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def profile_detail_update(request, pk):
    try:
        user = User.objects.get(id=pk)
        profile = user.profile

        if request.method == "GET":
            serializer = ProfileSerializer(profile, context={"request": request})
            return Response(serializer.data)

        elif request.method == "PATCH":
            if request.user.id != profile.user.id:
                raise PermissionDenied(
                    "You cannot update a profile that does not belong to you"
                )

            serializer = ProfileSerializer(
                profile, data=request.data, partial=True, context={"request": request}
            )
            if serializer.is_valid():
                updated_profile = serializer.save()
                serializer = ProfileSerializer(
                    updated_profile, context={"request": request}
                )
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

    except Profile.DoesNotExist:
        return Response({"error": "Profile does not exist."}, status=404)

    except User.DoesNotExist:
        return Response({"error": "User does not exist."}, status=404)


@api_view(["GET"])
def profile_overview(request, pk):
    sort_filter = request.query_params.get("sort", "new")
    user = User.objects.get(id=pk)
    # NOTE: This is temporary. Change back to request-scoping for user
    # user = request.user
    posts = (
        Post.objects.select_related("community")
        .prefetch_related(
            Prefetch(
                "vote_set",
                queryset=Vote.objects.filter(owner=request.user),
                to_attr="user_votes",
            )
        )
        .filter(owner=user)
        .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
    )
    comments = (
        Comment.objects.select_related("post")
        .prefetch_related(
            Prefetch(
                "vote_set",
                queryset=Vote.objects.filter(owner=request.user),
                to_attr="user_votes",
            )
        )
        .filter(owner=user)
        .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
    )

    for p in posts:
        p.content_type = "post"
    for c in comments:
        c.content_type = "comment"

    if sort_filter == "new":
        key = attrgetter("created_at")
    elif sort_filter == "best" or sort_filter == "hot":
        key = attrgetter("vote_count")

    combined = sorted(chain(posts, comments), key=key, reverse=True)

    results = []
    paginator = LimitOffsetPagination()
    paginator.default_limit = 5

    for item in combined:
        if item.content_type == "post":
            data = PostDisplaySerializer(item, context={"request": request}).data
        else:
            data = FeedCommentSerializer(item, context={"request": request}).data
        data["type"] = item.content_type

        results.append(data)

    paginated_feed_items = paginator.paginate_queryset(results, request)

    return paginator.get_paginated_response(paginated_feed_items)


@api_view(["GET"])
def profile_posts(request, pk):
    sort = request.query_params.get("sort", "new")
    print(sort)
    user = User.objects.get(id=pk)

    posts = []
    paginator = LimitOffsetPagination()
    paginator.default_limit = 3

    if sort == "new":
        posts = (
            Post.objects.select_related("community")
            .prefetch_related(
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                )
            )
            .filter(owner=user)
            .order_by("-created_at")
            .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
        )
    elif sort == "best" or sort == "hot":
        posts = (
            Post.objects.prefetch_related(
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                )
            )
            .filter(owner=user)
            .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
            .order_by("-vote_count")
        )

    paginated_posts = paginator.paginate_queryset(posts, request)

    serializer = PostDisplaySerializer(
        paginated_posts, many=True, context={"request": request}
    )
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def profile_comments(request, pk):
    sort = request.query_params.get("sort", "new")
    user = User.objects.get(id=pk)

    comments = []
    paginator = LimitOffsetPagination()
    paginator.default_limit = 10

    if sort == "new":
        comments = (
            Comment.objects.select_related("post")
            .prefetch_related(
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                )
            )
            .filter(owner=user)
            .order_by("-created_at")
            .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
        )
    elif sort == "best" or sort == "hot":
        comments = (
            Comment.objects.select_related("post")
            .prefetch_related(
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                )
            )
            .filter(owner=user)
            .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
            .order_by("-vote_count")
        )

    paginated_comments = paginator.paginate_queryset(comments, request)

    serializer = FeedCommentSerializer(
        paginated_comments, many=True, context={"request": request}
    )
    return paginator.get_paginated_response(serializer.data)
