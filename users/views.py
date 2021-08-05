import jwt
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from rest_framework import serializers, status, generics
from rest_framework.response import Response
from rest_framework import exceptions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string

from django.conf import settings
from users.models import TokenUUID

from users.serializers import UserResetPasswordRequestSerializer, UserChangePasswordSerializer, UserLoginSerializer, IssueSerializer, UserRegistrationSerializer, CreateIssueSerializer
from users.utils import generate_access_token, generate_refresh_token


class WebLoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    UserModel = get_user_model()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        response = Response()

        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")

            try:
                user = self.UserModel.objects.get(
                    Q(email__iexact=username) | Q(username__iexact=username))
            except self.UserModel.DoesNotExist:
                return Response({"Bad request": "There is no user with this password."}, status=status.HTTP_400_BAD_REQUEST)
            except self.UserModel.MultipleObjectsReturned:
                return Response({"Bad request": "There is no user with this password."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if user.check_password(password):
                    if user.is_active:
                        access_token = generate_access_token(user)
                        refresh_token = generate_refresh_token(user)
                        response.set_cookie(
                            key='refreshtoken', value=refresh_token, httponly=True, expires=datetime.now()+timedelta(days=7))
                        response.data = {
                            "username": user.username, "token": access_token}
                        return response

        return Response({"Bad request": "There is no user with this password."}, status=status.HTTP_400_BAD_REQUEST)


class WebRegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer


class WebRefreshToken(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()
    UserModel = get_user_model()

    def post(self, request):
        refresh_token = request.COOKIES.get('refreshtoken')

        if refresh_token is None:
            return Response(data={"Bad Request": "Authentication credentials were not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(
                refresh_token, settings.REFRESH_TOKEN_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response(data={"Bad Request": "expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = self.UserModel.objects.filter(
                id=payload.get('user_id')).first()
            if user is None:
                return Response(data={"Not Found": "The user couldn´t be found"}, status=status.HTTP_404_NOT_FOUND)

            queryset = TokenUUID.objects.filter(
                user=user, uuid=payload.get('uuid'))
            if not queryset.exists():
                return Response(data={"Bad Request": "Token is inactive"}, status=status.HTTP_400_BAD_REQUEST)

            if not user.is_active:
                return Response(data={"Bad Request": "User is inactive"}, status=status.HTTP_400_BAD_REQUEST)

            object = queryset.first()
            object.delete()

            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)
            response = Response()
            if(access_token and refresh_token):
                response.set_cookie(
                    key='refreshtoken', value=refresh_token, httponly=True, expires=datetime.now()+timedelta(days=7))
                response.data = {'token': access_token}
            else:
                response.data = {"Internal server error",
                                 "Something went wrong while creating the token"}
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return response


class WebTokenLogout(APIView):
    permission_classes = (IsAuthenticated,)
    UserModel = get_user_model()

    def post(self, request):
        refresh_token = request.COOKIES.get('refreshtoken')

        if refresh_token is None:
            return Response(data={"Bad Request": "Authentication credentials were not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(
                refresh_token, settings.REFRESH_TOKEN_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response(data={"Bad Request": "expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = self.UserModel.objects.filter(
                id=payload.get('user_id')).first()
            if user is None:
                raise exceptions.AuthenticationFailed('User not found')

            queryset = TokenUUID.objects.filter(
                user=user, uuid=payload.get('uuid'))
            if not queryset.exists():
                raise exceptions.AuthenticationFailed('token is inactive')

            object = queryset.first()
            object.delete()

            return Response({'logout': 'success'}, status=status.HTTP_200_OK)


class WebUserLoader(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(data={"username": request.user.username, "avatar_color": request.user.profile.avatar_color, "email": request.user.email, "firstname": request.user.first_name, "lastname": request.user.last_name, "last_login": request.user.last_login})


class WebChangePassword(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserChangePasswordSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get("old_password")
            new_password = serializer.data.get("new_password")
            conf_password = serializer.data.get("conf_password")

            if request.user.check_password(old_password):
                if new_password == conf_password:
                    request.user.set_password(new_password)
                    request.user.save()

                    return Response({'Success': 'Successfully changed password'}, status=status.HTTP_200_OK)
                return Response({'Passwords don´t match': 'The two new passwords aren´t equal'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'Unauthorized': 'The provided authorization password isn´t correct'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(
            {'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class WebPasswordResetRequest(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserResetPasswordRequestSerializer

    UserModel = get_user_model()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get("email")

            try:
                user = self.UserModel.objects.get(email__iexact=email)
            except self.UserModel.DoesNotExist:
                return Response({"Success": "An email was successfully send to your acount. If there was no account with this email address, there wont be an email."}, status=status.HTTP_200_OK)
            except self.UserModel.MultipleObjectsReturned:
                return Response({"Server Error": "There are multiple users with this email address"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                token = default_token_generator.make_token(user)
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

                current_site = get_current_site(request)
                email_subject = '[EPS-Warner] Reset your password'
                # email_body = render_to_string(
                #     'users/password_reset/reset_password_email.html', {'user': user, 'domain': current_site.domain, 'uidb': uidb64, 'token': token})
                print(token)
                print(uidb64)

                return Response({"Success": "An email was successfully send to your acount. If there was no account with this email address, there wont be an email."}, status=status.HTTP_200_OK)
        return Response({"Invalid data": "Please try again with different parameters"}, status=status.HTTP_400_BAD_REQUEST)
