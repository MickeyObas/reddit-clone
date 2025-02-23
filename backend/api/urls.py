from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.register),
    path('verify-email/', views.verify_email),
    path('send-confirmation-email/', views.send_confirmation_code_to_email),
    path('resend-confirmation-email/', views.resend_confirmation_code_to_email)
]