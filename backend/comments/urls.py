from django.urls import path

from . import views


urlpatterns = [
    path('', views.comment_list_or_create),
    path('<int:pk>/', views.comment_detail_update_delete),
    path('all/', views.all_comments),
]