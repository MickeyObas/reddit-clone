from django.db.models import Prefetch, OuterRef, Prefetch, Exists, Count
from django.db.models.functions import Coalesce
from rest_framework import parsers, status
from rest_framework.decorators import (api_view, parser_classes,
                                       permission_classes)
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import (IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.response import Response

from accounts.models import User
from posts.models import Post
from posts.serializers import (CommunityPostFeedSerializer,
                               PostDisplaySerializer)
from votes.models import Vote

from .models import Community
from .serializers import CommunitySerializer

import logging


logger = logging.getLogger("app.communities.views")

@api_view(["GET"])
def user_community_list(request):
    user = request.user
    communities = Community.objects.filter(members=user).only("id", "avatar", "name")
    serializer = CommunitySerializer(
        communities, many=True, context={"request": request}
    )
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def community_list_or_create(request):
    if request.method == "GET":
        is_member_qs = Community.members.through.objects.filter(
            community=OuterRef("pk"), user=request.user
        )
        communities = Community.objects.prefetch_related(
            Prefetch("moderators", queryset=User.objects.select_related("profile")),
            "topics"
        ).annotate(
            is_member=Exists(is_member_qs),
            member_count=Count("members")
        )
        serializer = CommunitySerializer(
            communities, many=True, context={"request": request}
        )
        return Response(serializer.data, status=200)

    elif request.method == "POST":
        data = request.data
        serializer = CommunitySerializer(data=data, context={"request": request})
        if serializer.is_valid():
            new_community = serializer.save()
            return Response(
                CommunitySerializer(new_community, context={"request": request}).data,
                status=201,
            )
        return Response(serializer.errors, status=400)


@api_view(["GET", "PATCH", "DELETE"])
def community_detail_update_delete(request, pk):
    try:
        if request.method == "GET":
            is_member_qs = Community.members.through.objects.filter(
                community=OuterRef("pk"), user=request.user
            )
            community = Community.objects.select_related("owner").annotate(
                is_member=Exists(is_member_qs),
                member_count=Count("members")
            ).get(id=pk)

            serializer = CommunitySerializer(community, context={"request": request})
            return Response(serializer.data, status=200)

        community = Community.objects.only("id", "owner").get(id=pk)

        if community.owner != request.user:
            raise PermissionDenied("You cannot perform this action.")

        if request.method == "DELETE":
            community.delete()
            return Response(status=204)

        elif request.method == "PATCH":
            serializer = CommunitySerializer(
                community, data=request.data, partial=True, context={"request": request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

    except Community.DoesNotExist:
        return Response(
            {"error": f"Community with ID '{pk}' does not exist"}, status=400
        )


# TODO: Review
@api_view(["GET"])
def community_post_feed(request, pk):
    sort = request.GET.get("sort")
    try:
        is_member_qs = Community.members.through.objects.filter(
            community=OuterRef("pk"), user=request.user
        )
        community = Community.objects.only("id").get(id=pk)
        posts = (
            Post.objects.prefetch_related(
                Prefetch(
                    "vote_set",
                    queryset=Vote.objects.filter(owner=request.user),
                    to_attr="user_votes",
                )
            )
            .filter(community=community)
            # .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
        )

        if sort == "latest":
            posts = posts.order_by("-created_at")
        elif sort == "best":
            posts = posts.order_by("-vote_count")

        community_serializer = CommunitySerializer(
            community, context={"request": request}
        )
        post_serializer = CommunityPostFeedSerializer(
            posts, many=True, context={"request": request}
        )
        return Response(
            {"community": community_serializer.data, "posts": post_serializer.data}
        )

    except Community.DoesNotExist:
        return Response({"error": "Community does not exist."}, status=404)


@api_view(["GET"])
def community_popular_posts_list(request, pk):
    try:
        community = Community.objects.get(id=pk)
        posts = (
            Post.objects.filter(community=community)
            .select_related("community")
            # .annotate(vote_count=Coalesce(Sum("vote__type"), Value(0)))
            .order_by("-vote_count")[:5]
        )
        serializer = PostDisplaySerializer(
            posts, many=True, context={"request": request}
        )
        return Response(serializer.data)

    except Community.DoesNotExist:
        return Response({"error": "Community does not exist"}, status=404)

    except Exception as e:
        logger.error(f"Error getting popular posts for user: {request.user.id}", exc_info=True)
        return Response({"error": str(e)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def community_join(request, pk):
    try:
        user = request.user
        community = Community.objects.get(id=pk)

        if user.id in community.members.values_list("id", flat=True):
            return Response(
                {"error": "You are already a member of this community."}, status=400
            )

        community.members.add(user)

        return Response({"message": "You have successfully joined the community."})

    except Community.DoesNotExist:
        return Response({"error": f"Community with ID: {pk} does not exist. "})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def community_leave(request, pk):
    try:
        user = request.user
        community = Community.objects.get(id=pk)

        if user.id not in community.members.values_list("id", flat=True):
            return Response(
                {"error": "You are not a member of this community."}, status=400
            )

        community.members.remove(user)

        return Response({"message": "You have successfully left the community."})

    except Community.DoesNotExist:
        return Response({"error": f"Community with ID: {pk} does not exist. "})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def community_name_legal(request):
    community_name = request.data.get("community_name")
    if Community.objects.filter(name__iexact=community_name).exists():
        return Response(
            {"error": f'"{community_name}" is already taken'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        return Response({"message": "Valid."})
