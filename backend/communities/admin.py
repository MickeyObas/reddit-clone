from django.contrib import admin

from .models import Community
from topics.models import Topic, TopicCategory


admin.site.register(Community)
admin.site.register(Topic)
admin.site.register(TopicCategory)