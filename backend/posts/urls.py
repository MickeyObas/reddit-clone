from django.urls import path 

from . import views


urlpatterns = [
    path('', views.post_list_or_create),
    path('<int:pk>/', views.post_detail),
]