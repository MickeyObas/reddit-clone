from django.contrib import admin

from .models import Comment, CommentMedia

admin.site.register(Comment)
admin.site.register(CommentMedia)
