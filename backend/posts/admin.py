from django.contrib import admin

from .models import Post, PostMedia


class PostModelAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "owner__email"]


admin.site.register(Post, PostModelAdmin)
admin.site.register(PostMedia)
