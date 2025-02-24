from rest_framework import serializers

from django.core import exceptions
from django.contrib.auth.password_validation import (
    validate_password
)

from .models import User
from api.utils import is_valid_email
from api.models import VerificationCode

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=200)
    password2 = serializers.CharField(max_length=200)

    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'password2'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')

        if password != password2:
            raise serializers.ValidationError({
                'password': "Passwords don't match"
            })
        
        # Remove password2 as it's not to be stored
        del attrs['password2']

        user = User(**attrs)
        errors = dict()

        try:
            validate_password(user=user, password=password)
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)

    def validate_email(self, value):
        email = value.strip().lower()

        if not is_valid_email(email):
            raise serializers.ValidationError("Email is invalid. Please enter a valid email address.")

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise serializers.ValidationError(f"An account with this email address already exists. Please use another one.")
        
        email_verified = VerificationCode.objects.filter(
            email=email,
            is_approved=True
        ).exists()

        if not email_verified:
            raise serializers.ValidationError('Cannot create account. User email is not verified.')

        return email
        
     
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    