from django.urls import path

from . import views

urlpatterns = [
    path("", views.profile_list),
    path("<int:pk>/", views.profile_detail_update),
    path("<int:pk>/overview/", views.profile_overview),
    path("<int:pk>/posts/", views.profile_posts),
    path("<int:pk>/comments/", views.profile_comments),
]
