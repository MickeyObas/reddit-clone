from django.contrib import admin

from .models import User


class UserModelAdmin(admin.ModelAdmin):
    list_display = [
        'email',
        'username',
        'created_at',
        'is_active'
    ]

admin.site.register(User, UserModelAdmin)