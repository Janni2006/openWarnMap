from datetime import datetime
from django.db.models import fields
from pkg_resources import require
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from server_models.models import Issue
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from django.contrib.gis.geos import Point
from .models import Votes


class IssueSerializer(serializers.ModelSerializer):
    gps_coords = ReadOnlyField(source="gps.coords")

    class Meta:
        model = Issue
        fields = ('code', 'active', 'verified', 'gps_coords',
                  'size', 'height', 'localization', 'created')


class CreateIssueSerializer(serializers.Serializer):
    # status = serializers.BooleanField(default=True, required=False)
    gps_lat = serializers.DecimalField(
        required=True, decimal_places=17, max_digits=20)
    gps_long = serializers.DecimalField(
        required=True, decimal_places=17, max_digits=20)
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
        if Issue.objects.filter(gps__iexact=Point(float(validated_data["gps_long"]), float(validated_data["gps_lat"]))).exists():
            issue = Issue.objects.filter(
                gps__iexact=Point(float(validated_data["gps_long"]), float(validated_data["gps_lat"]))).first()
            issue.size = validated_data["size"]
            issue.height = validated_data["height"]
            issue.localization = validated_data["localization"]
            issue.save(update_fields=[
                'size', 'height', 'localization'])
        else:
            issue = Issue(gps=Point(float(validated_data["gps_long"]), float(validated_data["gps_lat"])), size=validated_data["size"],
                          height=validated_data["height"], localization=validated_data["localization"], created=validated_data["created"])
            issue.save()

        return issue


class CreateFeedbackSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    firstname = serializers.CharField(required=False)
    lastname = serializers.CharField(required=False)
    content = serializers.CharField(required=True)


class CreateVoteSerializer(serializers.Serializer):
    entry_id = serializers.CharField(required=True)
    confirm = serializers.BooleanField(required=True)
    change = serializers.BooleanField(default=False)
    applied_change = serializers.IntegerField(required=False)


class ConfirmVoteSerializer(serializers.Serializer):
    entry_id = serializers.CharField(required=True)
