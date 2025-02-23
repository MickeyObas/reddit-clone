from django.contrib import admin

from .models import VerificationCode


class VerificationCodeModelAdmin(admin.ModelAdmin):
    list_display = [
        'email',
        'code',
        'is_expired',
        'expiry_time'
    ]

admin.site.register(VerificationCode, VerificationCodeModelAdmin)