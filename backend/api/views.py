from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone
from django.contrib.auth import authenticate

from .services import VerificationService
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
    
    try:
        VerificationService.send_verification_code(email)
        return Response({'message': 'A confirmation code has been sent to your email'})
    except ValueError as e:
        return Response({'error': str(e)}, status=400)
    except Exception as e:
        return Response({'error': 'Something went wrong'}, status=500)


@api_view(['POST'])
def resend_confirmation_code_to_email(request):
    email = request.data.get('email')

    if not email:
        return Response({'error': "Email address is required"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        email = email.strip().lower()
    
    if not is_valid_email(email):
        return Response({'error': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        VerificationService.resend_verification_code(email)
        return Response({'message': 'A confirmatio34cn code has been sent to your email'})
    except ValueError as e:
        return Response({'error': str(e)}, status=400)
    except Exception as e:
        return Response({'error': 'Something went wrong'}, status=500)


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
    else:
        email = email.strip().lower()

    try:
        VerificationService.verify_email(email, user_code)
        return Response({'message': 'Email verification successful'})
    except ValueError as e:
        return Response({'error': str(e)}, status=400)
    except Exception as e:
        return Response({'error': "Something went wrong"}, status=500)
    

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
        
    username = username.strip().lower()
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user, context={'request': request}).data
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