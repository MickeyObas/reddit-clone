from django.urls import path

from . import views


urlpatterns = [
    path('', views.comment_list_or_create),
    path('all/', views.all_comments),
]