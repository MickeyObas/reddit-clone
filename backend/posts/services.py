import time

from django.core.cache import cache
from django.db.models import Count, OuterRef, Q, Exists

from core.redis import client
from posts.models import Bookmark, Post
from posts.serializers import PostDisplayBaseSerializer
from votes.models import Vote
from communities.models import Community


MAX_RECENT = 20
KEY_TTL = 60 * 60 * 24 * 30
PAGE_SIZE = 12


def parse_cursor(cursor):
    if not cursor:
        return None

    parts = cursor.split("_")
    return {
        "is_followed": int(parts[0]),
        "primary": parts[1],  # created_at OR vote_count
        "id": parts[2],
    }

def get_next_cursor(posts, sort):
    if not posts:
        return None

    last = list(posts)[-1]

    if sort in ["best", "hot"]:
        primary = last.vote_count
    else:
        primary = last.created_at.isoformat()

    return f"{last.is_followed}_{primary}_{last.id}"

def get_feed_cache_key(user_id, sort):
    if sort == "best" or sort == "hot":
        return "trending:posts"
    return f"feed:{user_id}:{sort}:page1"

def apply_user_context(data, user):
    
    if not user or not user.is_authenticated:
        for post in data:
            post.update({
                "is_member": False,
                "is_bookmarked": False,
                "user_vote": None,
            })
        return data


    post_ids = [p["id"] for p in data]
    community_ids = [p["community"]["id"] for p in data]

    bookmarks = set(
        Bookmark.objects.filter(owner=user, post_id__in=post_ids)
        .values_list("post_id", flat=True)
    )

    votes = {
        v.post_id: v.vote_type_name.lower()
        for v in Vote.objects.filter(owner=user, post_id__in=post_ids)
    }

    memberships = set(
        Community.members.through.objects.filter(
            user_id=user.id,
            community_id__in=community_ids
        ).values_list("community_id", flat=True)
    )

    for post in data:
        post["is_bookmarked"] = post["id"] in bookmarks
        post["user_vote"] = votes.get(post["id"])
        post["is_member"] = post["community"]["id"] in memberships

    return data

def track_recent_view(user_id, post_id):
    key = f"recent:posts:user:{user_id}"
    now = time.time()

    client.zadd(key, {str(post_id): now})
    client.zremrangebyrank(key, 0, -(MAX_RECENT +  1))
    client.expire(key, KEY_TTL)

def get_recent_post_ids(user_id):
    key = f"recent:posts:user:{user_id}"
    post_ids = client.zrevrange(key, 0, MAX_RECENT - 1)
    return post_ids

def clear_recent_views(user_id):
    client.delete(f"recent:posts:user:{user_id}")

def fetch_feed_posts(user, sort, cursor):
    parsed = parse_cursor(cursor)

    is_followed_qs = Community.members.through.objects.filter(
        community_id=OuterRef("community_id"),
        user_id=user.id
    )

    posts_qs = (
        Post.objects
        .select_related("community")
        .prefetch_related("media")
        .annotate(
            comment_count=Count("comments", filter=Q(comments__parent__isnull=True)),
            is_followed=Exists(is_followed_qs),
        )
    )

    if sort == "best" or sort == "hot":
        cached = cache.get("trending:posts")
        if cached:
            return cached

        if parsed:
            posts_qs = posts_qs.filter(
                Q(is_followed__lt=parsed["is_followed"]) |
                Q(is_followed=parsed["is_followed"], vote_count__lt=int(parsed["primary"])) |
                Q(is_followed=parsed["is_followed"], vote_count=int(parsed["primary"]), id__lt=parsed["id"])
            )
        return posts_qs.order_by("-is_followed", "-vote_count", "-id")[:PAGE_SIZE]

    if sort == "new":
        if parsed:
            posts_qs = posts_qs.filter(
                Q(is_followed__lt=parsed["is_followed"]) |
                Q(is_followed=parsed["is_followed"], created_at__lt=parsed["primary"]) |
                Q(is_followed=parsed["is_followed"], created_at=parsed["primary"], id__lt=parsed["id"])
            )
        return posts_qs.order_by("-is_followed", "-created_at", "-id")[:PAGE_SIZE]

    # default
    if parsed:
        posts_qs = posts_qs.filter(
            Q(is_followed__lt=parsed["is_followed"]) |
            Q(is_followed=parsed["is_followed"], created_at__lt=parsed["primary"]) |
            Q(is_followed=parsed["is_followed"], created_at=parsed["primary"], id__lt=parsed["id"])
        )
    return posts_qs.order_by("-is_followed", "-created_at", "-id")[:PAGE_SIZE]

def get_user_feed(user, sort, cursor):
    cache_key = get_feed_cache_key(user.id, sort)
    print(cache_key)
    
    if not cursor:
        cached = cache.get(cache_key)

        if cached:
            return {
                "posts": apply_user_context(cached, user),
                "cursor": None
            }
    
    posts = fetch_feed_posts(user, sort, cursor)
    serialized = PostDisplayBaseSerializer(posts, many=True).data

    if not cursor:
        cache.set(cache_key, serialized, timeout=60)

    return {
        "posts": apply_user_context(serialized, user),
        "cursor": get_next_cursor(posts, sort)
    }
