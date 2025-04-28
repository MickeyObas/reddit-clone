from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.contrib.auth import authenticate

from .models import VerificationCode
from accounts.models import User
from accounts.serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

from .utils import (
    is_valid_email,
    generate_6_digit_code, 
)


@api_view(['POST'])
def send_confirmation_code_to_email(request):
    email = request.data.get('email')

    if not email:
        return Response({'error': "Email address is required"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        email = email.strip().lower()

    if not is_valid_email(email):
        return Response({'error': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(
        email=email
    ).exists():
        return Response({'error': 'A user with this email address aleady exists.'}, status=400)
    
    if VerificationCode.objects.filter(email=email).exists():
        return Response({'error': 'Verrification Code for this email already exists.'})
    
    code = generate_6_digit_code()

    subject = "Your verification code"
    message = f"Enter this code on reddit to confirm your email address -> {code}. If you did NOT request for this code, please ignore and report to Mickey, the developer."
    send_mail(subject, message, settings.EMAIL_HOST_USER, [email])

    VerificationCode.objects.create(email=email, code=code)

    return Response({'message': 'A confirmation code has been sent to your email'})


@api_view(['POST'])
def resend_confirmation_code_to_email(request):
    email = request.data.get('email')

    if not email:
        return Response({'error': "Email address is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not is_valid_email(email):
        return Response({'error': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)

    email = email.strip().lower()

    # Rate-limiting
    cache_key = f"sent_token_{email}"
    if cache.get(cache_key):
        return Response({'error': 'Too many requests. Please wait before requesting a new code'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    cache.set(cache_key, True, 60)

    # Invalidate/delete any previous verfication code(s)
    previous_verification_codes = VerificationCode.objects.filter(
        email=email
    )
    previous_verification_codes.delete()

    code = generate_6_digit_code()

    # TODO: Make atomic
    send_mail(
        "Your verification code",
        f"Enter this new verification code on Reddit (the clone) to confirm your email address -> {code}. If you did NOT request for this code, please ignore and report to Mickey, the developer.",
        settings.EMAIL_HOST_USER,
        [email]
    )

    VerificationCode.objects.create(email=email, code=code)

    return Response({'message': 'A confirmation code has been sent to your email'})


@api_view(['POST'])
def verify_email(request):
    user_code = request.data.get('code')
    email = request.data.get('email')

    if not user_code:
        return Response({
            'error': 'User code required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not email:
        return Response({
            'error': 'Email address required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = email.strip().lower()

    try:
        code_entry = VerificationCode.objects.get(
            email=email,
            code=user_code,
            is_approved=False
        )
        if timezone.now() > code_entry.expiry_time:
            return Response({'error': 'Code expired. Please tap on "Resend" to get a new verification code sent to your email.'}, status=status.HTTP_400_BAD_REQUEST)
        
        code_entry.is_approved = True
        code_entry.save()

        return Response({'message': 'Email verification successful'})
    
    except VerificationCode.DoesNotExist:
        return Response({'error': "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registration successful'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username:
        return Response({'error': 'Please enter your email or username'}, status=400)

    if not password:
        return Response({'error': 'Please enter your password'}, status=400)
    
    # TODO: Forbid Users from using '@' in usernames or custom backend'll break lmao
    
    username = username.strip().lower()
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.send_reset_email()
        return Response({'message': 'A password reset link has been sent to your email.'})
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Password has been reset successfully.'})
    return Response(serializer.errors, status=400)