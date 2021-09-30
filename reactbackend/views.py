from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from reactbackend.serializers import CreateVoteSerializer, IssueSerializer, CreateIssueSerializer
from django_filters.rest_framework import DjangoFilterBackend

from .models import Votes

from api.models import Issue

from django.contrib.gis.geos import Point


class WebGetData(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()


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


class WebGetPrivateData(generics.ListAPIView):
    queryset = Issue.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["active", "verified"]

    # def get_queryset(self):
    # return self.request.user.profile.private_data.all()
    # return Issue.objects.all()


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


class WebGetPrivateIssueVoteStatus(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        issue_code = request.GET.get("item", str)

        try:
            issue = Issue.objects.get(code__iexact=issue_code)
        except Issue.MultipleObjectsReturned:
            return Response({"Internal server error": "Something went drastically wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Issue.DoesNotExist:
            return Response({"not found": "The desired entry was not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            if issue.creator == request.user or request.user.profile.private_data.all().filter(
                    code__iexact=issue_code).exists():
                return Response({"issue": issue.code, "private": True}, status=status.HTTP_200_OK)
            queryset = Votes.objects.filter(entry=issue, user=request.user)

            if queryset.exists():
                return Response({"issue": queryset.first().entry.code, "voted": True, "confirm": queryset.first().confirm, "change": queryset.first().change}, status=status.HTTP_200_OK)
            else:
                return Response({"issue": issue.code, "voted": False}, status=status.HTTP_200_OK)
