from rest_framework import serializers

from django.core import exceptions, mail
from django.core.cache import cache
from django.contrib.auth.password_validation import (
    validate_password
)
from django.utils.crypto import get_random_string

from .models import User
from api.utils import is_valid_email
from api.models import VerificationCode

import random

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=200)
    password2 = serializers.CharField(max_length=200)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password2'
        ]
        extra_kwargs = {
            'username': {'read_only': True},
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
        
        email_verification_code = VerificationCode.objects.filter(
            email=email,
            is_approved=True
        )

        if not email_verification_code.exists():
            raise serializers.ValidationError('Cannot create account. User email is not verified.')
        
        email_verification_code.delete()
    
        return email
        
     
    def create(self, validated_data):
        validated_data['username'] = self.generate_random_username()
        user = User.objects.create_user(**validated_data)
        user.save()
        return user
    
    def generate_random_username(self):
        adjectives = [
            "Wobbly", "Soggy", "Spicy", "Bouncy", "Crispy", "Jolly", "Goofy", "Dizzy",
            "Clumsy", "Zesty", "Witty", "Sassy", "Nifty", "Quirky", "Snappy", "Gloomy",
            "Peppy", "Bizarre", "NoodleLike", "Jazzy", "Lumpy", "Mischievous", "Wonky",
            "Sleepy", "Speedy", "Tacky", "Loopy", "Gleaming", "Mysterious", "Lukewarm"  
        ]

        nouns = [
            "Cactus", "Waffle", "Penguin", "Octopus", "Pickle", "Giraffe", "Pancake",
            "Squid", "Flamingo", "Squirrel", "Tornado", "Meatball", "Koala", "Goblin",
            "Turnip", "Tofu", "Llama", "Cabbage", "Gnome", "Ravioli", "Jellyfish",
            "Walrus", "Noodle", "TaterTot", "Chimichanga", "Lobster", "Marshmallow",
            "Ferret", "Pudding", "Kangaroo", "Muffin", "Banana", "Hedgehog", "Narwhal"
        ]

        while True:
            random_username = f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(10000, 99999)}"

            if not User.objects.filter(username=random_username).exists():
                return random_username


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        if obj.profile.avatar:
            return obj.profile.avatar.url
        return None

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'avatar'
        ]

    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user:
            raise serializers.ValidationError('User with this email does not exist.')
        return value
    
    def send_reset_email(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = get_random_string(60)
        cache.set(f"password_reset_{token}", user.id, timeout=3600)
        reset_link = f"http://localhost:8000/api/reset-password?token={token}"
        mail.send_mail(
            "Password Reset Request",
            f"Click the link to reset your Reddit password: {reset_link}",
            "no-reply@yourapp.com",
            [email],
        )


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        token = data["token"]
        user_id = cache.get(f"password_reset_{token}")

        if not user_id:
            raise serializers.ValidationError('Invalid or expired token.')
        data['user'] = User.objects.get(id=user_id)
        return data
    
    def save(self, **kwargs):
        user = self.validated_data['user']  
        user.set_password(self.validated_data['new_password'])     
        user.save()   
        cache.delete(f"password_reset_{self.validated_data['token']}")

