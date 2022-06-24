from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Profile


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
