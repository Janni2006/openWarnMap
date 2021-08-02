from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, login
from django.db.models import Q
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string

from .models import Issue
from .serializer import *
# Create your views here.


class IssueView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer


class CreateIssueView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CreateIssueSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            gps_lat = serializer.data.get('gps_lat')
            gps_long = serializer.data.get('gps_long')
            size = serializer.data.get('size')
            height = serializer.data.get('height')
            localization = serializer.data.get('localization')
            created = serializer.data.get('created')
            queryset = Issue.objects.filter(gps_lat=gps_lat, gps_long=gps_long)

            if queryset.exists():
                issue = queryset.first()
                issue.size = size
                issue.height = height
                issue.localization = localization
                issue.created = created
                issue.save(update_fields=[
                           'size', 'height', 'localization', 'created'])

                if request.user.is_authenticated:

                    user = request.user
                    user.profile.private_data.add(issue)
                    user.save()

                return Response(IssueSerializer(issue).data, status=status.HTTP_200_OK)

            else:
                issue = Issue(gps_lat=gps_lat, gps_long=gps_long, size=size,
                              height=height, localization=localization, created=created)
                issue.save()
                if request.user.is_authenticated:

                    user = request.user
                    user.profile.private_data.add(issue)
                    user.save()

                return Response(IssueSerializer(issue).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        return Response({'Bad Request': 'You should use the POST methos!'}, status=status.HTTP_400_BAD_REQUEST)


class CreateIssueViewT(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = Issue.objects.all()
    serializer_class = CreateIssueSerializer


class GetOfflineData(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        issues = Issue.objects.all()

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        gps_lat_one = request.query_params.get('gps_lat_second')
        gps_lat_two = request.query_params.get('gps_lat_first')
        gps_long_one = request.query_params.get('gps_long_first')
        gps_long_two = request.query_params.get('gps_long_second')

        if gps_lat_one is not None and gps_lat_two is not None and gps_long_one is not None and gps_long_two is not None:
            issues = issues.filter(gps_lat__range=(gps_lat_one, gps_lat_two))
            issues = issues.filter(
                gps_long__range=(gps_long_one, gps_long_two))

            return Response(IssueSerializer(issues, many=True).data, status=status.HTTP_200_OK)


class GetIssuesAround(APIView):
    permission_classes = (AllowAny,)
    serializer_class = IssueSerializer
    lookup_url_lat = 'lat'
    lookup_url_long = 'long'

    def get(self, request, format=None):
        lat = request.GET.get(self.lookup_url_lat)
        long = request.GET.get(self.lookup_url_long)
        if lat is not None and long is not None:
            queryset = Issue.objects.filter(
                gps_lat__startswith=lat, gps_long__startswith=long)

            if queryset.exists():
                issues = []
                for i in range(queryset.count()):
                    issues.append(IssueSerializer(queryset[i]).data)
                return Response(data=issues, status=status.HTTP_200_OK)
            else:
                return Response({'No data': 'No data found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Invalad Request'}, status=status.HTTP_400_BAD_REQUEST)


class DeletePrivateEntry(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        id = request.GET.get('id')
        if id is not None:
            queryset = request.user.profile.private_data.filter(
                code__iexact=id)
            if queryset.exists():
                request.user.profile.private_data.remove(request.user.profile.private_data.filter(
                    code__iexact=id).first())
                return Response({'Success': 'Successfully deleted private entry'}, status=status.HTTP_200_OK)
        return Response({'Bad Code': 'There was no code or there was no issue with this code'}, status=status.HTTP_406_NOT_ACCEPTABLE)


class GetPrivateData(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = request.user.profile.private_data.all()
        if queryset.exists():
            issues = []
            for i in range(queryset.count()):
                issues.append(IssueSerializer(queryset[i]).data)
            return Response(data=issues, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer


UserModel = get_user_model()


class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")

            try:
                user = UserModel.objects.get(
                    Q(email__iexact=username) | Q(username__iexact=username))
            except UserModel.DoesNotExist:
                return Response({"Bad request": "There is no user with this password."}, status=status.HTTP_400_BAD_REQUEST)
            except UserModel.MultipleObjectsReturned:
                return Response({"Bad request": "There is no user with this password."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if user.check_password(password):
                    if user.is_active:
                        login(request, user)
                        token = Token.objects.get_or_create(user=user)
                        return Response(data={"username": user.username, "token": str(token[0])}, status=status.HTTP_200_OK)

            return Response({"Bad request": "There is no user with this password."}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserResetPasswordRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get("email")

            try:
                user = UserModel.objects.get(email__iexact=email)
            except UserModel.DoesNotExist:
                return Response({"Success": "An email was successfully send to your acount. If there was no account with this email address, there wont be an email."}, status=status.HTTP_200_OK)
            except UserModel.MultipleObjectsReturned:
                return Response({"Server Error": "There are multiple users with this email address"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                token = default_token_generator.make_token(user)
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

                current_site = get_current_site(request)
                email_subject = '[EPS-Warner] Reset your password'
                email_body = render_to_string(
                    'users/password_reset/reset_password_email.html', {'user': user, 'domain': current_site.domain, 'uidb': uidb64, 'token': token})
                print(email_body)

                return Response({"Success": "An email was successfully send to your acount. If there was no account with this email address, there wont be an email."}, status=status.HTTP_200_OK)
        return Response({"Invalid data": "Please try again with different parameters"}, status=status.HTTP_400_BAD_REQUEST)
