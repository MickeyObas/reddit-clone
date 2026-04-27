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
