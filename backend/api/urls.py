from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.urls import path, include

from . import views

urlpatterns = [
    path('register/', views.register),
    path('verify-email/', views.verify_email),
    path('send-confirmation-email/', views.send_confirmation_code_to_email),
    path('resend-confirmation-email/', views.resend_confirmation_code_to_email),
    path('token/', views.login),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('posts/', include('posts.urls')),
    path('communities/', include('communities.urls'))
]