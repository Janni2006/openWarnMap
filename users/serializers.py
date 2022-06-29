from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Profile
from django.contrib import auth
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from rest_framework.exceptions import AuthenticationFailed


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'first_name', 'last_name', 'is_active']


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True, style={'input_type': 'password', 'placeholder': 'Password'})


class UserChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True, style={'input_type': 'password', 'placeholder': 'Password'})
    new_password = serializers.CharField(
        required=True, validators=[
            validate_password], style={'input_type': 'password', 'placeholder': 'Password'})
    conf_password = serializers.CharField(
        required=True, style={'input_type': 'password', 'placeholder': 'Password'})


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True, style={
        'input_type': 'email'})

    password = serializers.CharField(required=True, validators=[
                                     validate_password], style={'input_type': 'password', 'placeholder': 'Password'})
    password2 = serializers.CharField(required=True, style={
                                      'input_type': 'password', 'placeholder': 'Confirm password'})
    firstname = serializers.CharField(required=False, default="")
    lastname = serializers.CharField(required=False, default="")

    class Meta:
        model = User
        fields = ('username',  'email', 'password',
                  'password2', 'firstname', 'lastname')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        print(validated_data)

        # if validated_data['firstname']:
        #     user.firstname = validated_data['firstname']
        # if validated_data['lastname']:
        #     user.firstname = validated_data['lastname']

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class UserChangeProfileSerializer(serializers.Serializer):
    firstname = serializers.CharField()
    lastname = serializers.CharField()


class WebCheckUsernameSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)


class WebCheckEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class WebChangeNotificationSettings(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['notifications']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)
