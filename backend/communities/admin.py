from django.contrib import admin

from topics.models import Topic, TopicCategory

from .models import Community

admin.site.register(Community)
admin.site.register(Topic)
admin.site.register(TopicCategory)
