from django.contrib import admin

from .models import VerificationCode


class VerificationCodeModelAdmin(admin.ModelAdmin):
    list_display = [
        'email',
        'code',
        'is_expired',
        'is_approved'
    ]

admin.site.register(VerificationCode, VerificationCodeModelAdmin)