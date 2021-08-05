from datetime import datetime
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import Issue
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ('code', 'active', 'verified', 'gps_lat', 'gps_long',
                  'size', 'height', 'localization', 'created')


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
    username = serializers.CharField(required=True, validators=[
                                     UniqueValidator(queryset=User.objects.all())])
    email = serializers.EmailField(required=True, validators=[
                                   UniqueValidator(queryset=User.objects.all())], style={
        'input_type': 'email'})

    password = serializers.CharField(write_only=True, required=True, validators=[
                                     validate_password], style={'input_type': 'password', 'placeholder': 'Password'})
    password2 = serializers.CharField(write_only=True, required=True, style={
                                      'input_type': 'password', 'placeholder': 'Confirm password'})

    class Meta:
        model = User
        fields = ('username',  'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class CreateIssueSerializer(serializers.Serializer):
    # status = serializers.BooleanField(default=True, required=False)
    gps_lat = serializers.DecimalField(
        required=True, decimal_places=7, max_digits=10)
    gps_long = serializers.DecimalField(
        required=True, decimal_places=7, max_digits=10)
    size = serializers.IntegerField(default=1, required=False)
    height = serializers.IntegerField(default=1, required=False)
    localization = serializers.IntegerField(default=0, required=False)
    created = serializers.DateTimeField(
        default=timezone.now, required=False)

    def validate(self, attrs):
        if attrs["gps_lat"] > 360 or attrs["gps_lat"] < 0:
            raise serializers.ValidationError(
                {"gps_lat": "gps_lat is greater than 360 or less than 0"})
        if attrs["gps_long"] > 360 or attrs["gps_long"] < 0:
            raise serializers.ValidationError(
                {"gps_long": "gps_long is greater than 360 or less than 0"})
        return attrs

    def create(self, validated_data):
        if Issue.objects.filter(gps_lat__iexact=validated_data["gps_lat"], gps_long__iexact=validated_data["gps_long"]).exists():
            issue = Issue.objects.filter(
                gps_lat__iexact=validated_data["gps_lat"], gps_long__iexact=validated_data["gps_long"]).first()
            issue.size = validated_data["size"]
            issue.height = validated_data["height"]
            issue.localization = validated_data["localization"]
            issue.save(update_fields=[
                'size', 'height', 'localization'])
        else:
            issue = Issue(gps_lat=validated_data["gps_lat"], gps_long=validated_data["gps_long"], size=validated_data["size"],
                          height=validated_data["height"], localization=validated_data["localization"], created=validated_data["created"])
            issue.save()

        return issue


class UserResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
