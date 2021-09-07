from datetime import datetime, timedelta
from re import A
from django import http
from django.contrib.auth import get_user_model
from rest_framework import serializers, status, generics
from rest_framework.response import Response
from rest_framework import exceptions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_encode
from reactbackend.serializers import CreateVoteSerializer, IssueSerializer, CreateIssueSerializer
from django.contrib.auth import get_user_model

from .models import Votes

from api.models import Issue, generate_unique_code

from django.contrib.gis.geos import Point


class WebGetData(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        data = []
        queryset = Issue.objects.all()

        for object in queryset:
            data.append({'code': object.code, 'active': object.active,
                        'verified': object.verified, 'gps_lat': object.gps.coords[1], 'gps_long': object.gps.coords[0], 'size': object.size, 'height': object.height, 'localization': object.localization, 'created': object.created})

        return Response(data=data, status=status.HTTP_200_OK)


class WebCreateIssueView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CreateIssueSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # active = serializer.data.get('status')
            gps_lat = serializer.data.get('gps_lat')
            gps_long = serializer.data.get('gps_long')
            size = serializer.data.get('size')
            height = serializer.data.get('height')
            localization = serializer.data.get('localization')
            created = serializer.data.get('created')
            queryset = Issue.objects.filter(
                gps=Point(float(gps_long), float(gps_lat)))

            if queryset.exists():
                issue = queryset.first()
                issue.size = size
                issue.height = height
                issue.localization = localization
                issue.created = created
                issue.save(update_fields=[
                           'size', 'height', 'localization', 'created'])

                user = request.user
                user.profile.private_data.add(issue)
                user.save()

                return Response(IssueSerializer(issue).data, status=status.HTTP_200_OK)

            else:
                issue = Issue(gps=Point(float(gps_long), float(gps_lat)), size=size,
                              height=height, localization=localization, created=created)
                issue.save()
                if request.user.is_authenticated:

                    user = request.user
                    user.profile.private_data.add(issue)
                    user.save()

                return Response(IssueSerializer(issue).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class WebGetPrivateData(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = request.user.profile.private_data.all()
        if queryset.exists():
            issues = []
            for object in queryset:
                issues.append({'code': object.code, 'active': object.active,
                               'verified': object.verified, 'gps_lat': object.gps.coords[1], 'gps_long': object.gps.coords[0], 'size': object.size, 'height': object.height, 'localization': object.localization, 'created': object.created})
            return Response(data=issues, status=status.HTTP_200_OK)
        return Response(data={'Error': 'No data found'}, status=status.HTTP_404_NOT_FOUND)


class WebSendFeedback(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        if request.user.isAuthenticated:
            return Response(data={}, status=status.HTTP_201_CREATED)
        else:
            return Response(data={}, status=status.HTTP_201_CREATED)


class WebCreateIssueVote(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CreateVoteSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            entry_id = serializer.data.get("entry_id")
            entry = Issue.objects.get(code__iexact=entry_id)
            confirm = serializer.data.get("confirm")

            existing_queryset = Votes.objects.filter(
                entry=entry, user=request.user)

            if not existing_queryset.exists():
                if confirm:

                    vote = Votes(entry=entry, user=request.user,
                                 confirm=True, change=False)
                    vote.save()

                    return Response(status=status.HTTP_201_CREATED, data={'created': 'Thanks for ranking this entry!'})

                else:
                    change = serializer.data.get("change")
                    if change:
                        applied_change = serializer.data.get("applied_change")

                        if applied_change == 0:

                            vote = Votes(entry=entry, user=request.user, confirm=False,
                                         change=True, applied_change="IP")

                        elif applied_change == 1:
                            vote = Votes(entry=entry, user=request.user, confirm=False,
                                         change=True, applied_change="NT")
                        else:
                            return Response(data={'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

                        vote.save()

                        print(vote.applied_change)

                        return Response(status=status.HTTP_201_CREATED, data={'created': 'Thanks for ranking this entry!'})

                    return Response(data={'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data={"Error": "You have ranked this entry already!"}, status=status.HTTP_409_CONFLICT)
        print(serializer.errors)
        return Response(data={'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
