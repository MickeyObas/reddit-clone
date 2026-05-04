from celery import shared_task
from django.core.cache import cache
from django.db.models import Count, Q

from posts.models import Post
from posts.serializers import PostDisplaySerializer, PostDisplayBaseSerializer


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def update_trending_cache():
    posts = list(
        Post.objects
            .select_related("community")
            .order_by("-vote_count", "-id")[:50]
            .annotate(
                comment_count=Count("comments", filter=Q(comments__parent__isnull=True)),
        ))

    data = PostDisplayBaseSerializer(posts, many=True).data

    cache.set("trending:posts", data, timeout=120)