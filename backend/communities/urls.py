from django.urls import path

from . import views


urlpatterns = [
    path('', views.community_list_or_create),
    path('<int:pk>/', views.community_detail_update_delete),
    path('<int:pk>/join/', views.community_join),
    path('<int:pk>/leave/', views.community_leave),
    path('<int:pk>/posts/', views.community_post_feed),
]