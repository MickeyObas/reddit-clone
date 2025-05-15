from datetime import datetime
import json
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests

from django.conf import settings
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils import timezone

from accounts.models import User

from .models import VerificationCode
from .utils import generate_6_digit_code



class VerificationService:
    @staticmethod
    def send_verification_code(email):
        try:
            if User.objects.filter(email=email).exists():
                raise ValueError("Account with this email already exists")
            elif VerificationCode.objects.filter(email=email).exists():
                VerificationCode.objects.filter(email=email).delete

            code = generate_6_digit_code()
            subject = "Your verification code"
            from_email = settings.EMAIL_HOST_USER

            html_content = render_to_string(
                "emails/verification_email.html",
                {"code": code, "current_year": datetime.now().year},
            )
            text_content = f"Enter this code on reddit to confirm your email address -> {code}. If you did NOT request for this code, please ignore and report to Mickey, the developer."
            email_message = EmailMultiAlternatives(
                subject, text_content, from_email, [email]
            )
            email_message.attach_alternative(html_content, "text/html")
            email_message.send()

            VerificationCode.objects.create(email=email, code=code)

        except Exception as e:
            print(e)
            raise ValueError(e)

    @staticmethod
    def resend_verification_code(email):
        cache_key = f"sent_token_{email}"
        if cache.get(cache_key):
            raise ValueError(
                "Too many requests. Please wait before requesting a new code"
            )
        cache.set(cache_key, True, 60)
        VerificationCode.objects.filter(email=email).delete()
        VerificationService.send_verification_code(email=email)

    @staticmethod
    def verify_email(email, user_code):
        try:
            code_entry = VerificationCode.objects.get(
                email=email, code=user_code, is_approved=False
            )
            if timezone.now() > code_entry.expiry_time:
                raise ValueError(
                    'Code expired. Please tap on "Resend" to get a new verification code sent to your email.'
                )
            code_entry.is_approved = True
            code_entry.save()
        except VerificationCode.DoesNotExist:
            raise ValueError("Invalid code")


class GoogleAuthService:
    @staticmethod
    def exchange_code_for_tokens(code):
        CLIENT_ID = settings.GOOGLE_CLIENT_ID
        CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET
        TOKEN_URL = "https://oauth2.googleapis.com/token"

        response = requests.post(
            TOKEN_URL,
            data={
                "code": code,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "redirect_uri": "postmessage",
                "grant_type": "authorization_code",
            },
        )

        if response.status_code == 200:
            response_data = response.json()

            try:
                idinfo = id_token.verify_oauth2_token(response_data['id_token'], google_requests.Request(), CLIENT_ID)

                return {
                    "email": idinfo.get('email'),
                    "sub": idinfo.get('sub')
                }

            except Exception as e:
                raise ValueError(e)

        else:
            raise Exception(f"Failed to exchange code: {response.text}")

