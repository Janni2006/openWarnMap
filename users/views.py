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

from django.conf import settings
from users.models import TokenUUID

from users.serializers import *
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


class WebRegisterView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    UserModel = get_user_model()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get("username")
            email = serializer.data.get("email")
            password = serializer.data.get("password")
            conf_password = serializer.data.get("password2")

            error = {
                "code": 200,
                "username": {"error": False, "msg_code": None, "msg": ""},
                "email": {"error": False, "msg_code": None, "msg": ""},
                "password": {"error": False, "msg_code": None, "msg": ""},
                "conf_password": {"error": False, "msg_code": None, "msg": ""}
            }

            if self.UserModel.objects.filter(username__iexact=username).exists():
                error["username"] = {"error": True, "msg_code": 1,
                                     "msg": "This username is already in use"}
                error["code"] = 400

            if self.UserModel.objects.filter(email__iexact=email).exists():
                error["email"] = {"error": True, "msg_code": 1,
                                  "msg": "This email is already in use"}
                error["code"] = 400

            if password != conf_password:
                error["password"] = {"error": True, "msg_code": 2,
                                     "msg": "The passwords don´t match"}
                error["conf_password"] = {"error": True, "msg_code": 2,
                                          "msg": "The passwords don´t match"}
                error["code"] = 400

            if error != {
                "code": 200,
                "username": {"error": False, "msg_code": None, "msg": ""},
                "email": {"error": False, "msg_code": None, "msg": ""},
                "password": {"error": False, "msg_code": None, "msg": ""},
                "conf_password": {"error": False, "msg_code": None, "msg": ""}
            }:
                return Response(data=error, status=status.HTTP_400_BAD_REQUEST)
            serializer.create(validated_data=serializer.validated_data)
            return Response({"success": True, "message": "The user was successsfully created"})
        return Response({"Bad Request": "Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST)


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
        print(request.user.last_login)
        return Response(data={
            "username": request.user.username,
            "avatar_color": request.user.profile.avatar_color,
            "email": request.user.email,
            "firstname": request.user.first_name,
            "lastname": request.user.last_name,
            "last_login": str(request.user.last_login)
        })


class WebChangeProfile(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserChangeProfileSerializer

    def post(self, request):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = request.user
            user.first_name = serializer.data.get("firstname")
            user.last_name = serializer.data.get("lastname")

            user.save(update_fields=['first_name', 'last_name'])
        return Response()


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
                return Response(
                    {
                        "code": 400,
                        "message": "Invalid data was provided.",
                        "details": {
                            "password": {
                                "error": False
                            },
                            "new_password": {
                                "error": True,
                                "msg_code": 0,
                                "msg": "The passwords don´t match"
                            },
                            "conf_password": {
                                "error": True,
                                "msg_code": 0,
                                "msg": "The passwords don´t match"
                            }
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
            return Response(
                {
                    "code": 400,
                    "message": "Invalid data was provided.",
                    "details": {
                        "password": {
                            "error": True,
                            "msg_code": 0,
                            "msg": "The password doen´t work for authorization"
                        },
                        "new_password": {
                            "error": False,
                        },
                        "conf_password": {
                            "error": False,
                        }
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

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

                return Response({"message": "An email was successfully send to your acount. If there was no account with this email address, there wont be an email."}, status=status.HTTP_200_OK)
        return Response({"code": 400, "message": "Invalid data was provided."}, status=status.HTTP_400_BAD_REQUEST)


class WebCheckUsername(APIView):
    permission_classes = (AllowAny,)
    serializer_class = WebCheckUsernameSerializer

    UserModel = get_user_model()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get("username")

            try:
                self.UserModel.objects.get(username__iexact=username)
            except self.UserModel.DoesNotExist:
                return Response({"username": username, "not_ocupied": True}, status=status.HTTP_200_OK)

            return Response({"username": username, "not_ocupied": False}, status=status.HTTP_200_OK)
        return Response({"code": 400, "message": "Invalid data was provided."}, status=status.HTTP_400_BAD_REQUEST)


class WebCheckEmail(APIView):
    permission_classes = (AllowAny,)
    serializer_class = WebCheckEmailSerializer

    UserModel = get_user_model()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data.get("email")

            try:
                self.UserModel.objects.get(email__iexact=email)
            except self.UserModel.DoesNotExist:
                return Response({"email": email, "not_ocupied": True}, status=status.HTTP_200_OK)

            return Response({"email": email, "not_ocupied": False}, status=status.HTTP_200_OK)
        return Response({"code": 400, "message": "Invalid data was provided."}, status=status.HTTP_400_BAD_REQUEST)


class WebSetNotificationSettings(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = WebChangeNotificationSettings


class WebPasswordTokenCheck(APIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'valid': True, 'uidb64': uidb64, 'token': token})

            # if redirect_url and len(redirect_url) > 3:
            #     return CustomRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)
            # else:
            #     return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)

            except UnboundLocalError as e:
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)
