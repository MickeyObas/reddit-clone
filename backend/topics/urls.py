from django.urls import path

from . import views


urlpatterns = [
    path('', views.topics_list)
]