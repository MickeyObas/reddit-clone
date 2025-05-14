from django.urls import include, path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from . import views

urlpatterns = [
    path("register/", views.register),
    path("verify-email/", views.verify_email),
    path("send-confirmation-email/", views.send_confirmation_code_to_email),
    path("resend-confirmation-email/", views.resend_confirmation_code_to_email),
    path("token/", views.login),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("password-reset/", views.password_reset_request),
    path("password-reset-confirm/", views.password_reset_confirm),
    path("accounts/", include("accounts.urls")),
    path("posts/", include("posts.urls")),
    path("profiles/", include("profiles.urls")),
    path("communities/", include("communities.urls")),
    path("votes/", include("votes.urls")),
    path("comments/", include("comments.urls")),
    path("topics/", include("topics.urls")),
]
