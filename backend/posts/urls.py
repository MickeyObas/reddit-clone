from django.urls import include, path

from . import views

urlpatterns = [
    path("", views.post_list_or_create),
    path("feed/", views.user_post_feed),
    path("bookmarks/", views.user_bookmark_list),
    path("<int:pk>/", views.post_detail_update_delete),
    path("<int:pk>/comments/", include("comments.urls")),
    path("<int:pk>/bookmark/", views.post_bookmark_create_or_delete),
    # path("<int:pk>/track-recent/", views.track_post_view),
    path("recently-viewed/", views.recent_post_list),
    path("recently-viewed/delete/", views.recent_posts_clear),
]
