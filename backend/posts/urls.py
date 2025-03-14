from django.urls import path 

from . import views


urlpatterns = [
    path('', views.post_list_or_create),
    path('feed/', views.user_post_feed),
    path('<int:pk>/', views.post_detail_update_delete),
]