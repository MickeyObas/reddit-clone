# any_app/tasks.py
from celery import shared_task
from django.core.cache import cache

from posts.models import Post
from posts.serializers import PostDisplaySerializer

@shared_task
def add(x, y):
    return x + y


@shared_task
def update_trending_cache():
    posts = list(
        Post.objects
        .select_related("community")
        .order_by("-vote_count", "-id")[:50]
    )

    data = PostDisplaySerializer(posts, many=True).data

    cache.set("trending:posts", data, timeout=120)