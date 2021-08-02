import base64
from datetime import datetime
import time
import math
import hmac
import hashlib
from django.shortcuts import render, redirect
from django.contrib.auth import (
    logout, login, hashers, get_user_model)
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password, ValidationError
from django.db.models import Q
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_text
from django.utils.translation import gettext as _

from .decorators import unauthenticated_user, session_variable_get
from django.utils import timezone
# Create your views here.

UserModel = get_user_model()


@unauthenticated_user
def custom_register(request):
    username = email = password1 = password2 = ""

    context = {
        "username": "",
        "email": "",
    }
    if request.method == 'POST':
        username = request.POST.get("username", "")
        email = request.POST.get("email", "")
        password1 = request.POST.get("password1", "")
        password2 = request.POST.get("password2", "")

        error = bad_username = bad_email = passwords_unequal = bad_password = False
        password_error = []

        context = {
            "username": username,
            "email": email,
        }

        if User.objects.filter(username=username).exists():
            bad_username = True
            error = True

        if User.objects.filter(email=email).exists():
            bad_email = True
            error = True

        if password1 != password2:
            passwords_unequal = True
            error = True

        try:
            validate_password(password=password1)
        except ValidationError as e:
            bad_password = True
            error = True
            password_error = e
        if not error:
            user = User.objects.create(
                username=username,
                email=email,
                password=hashers.make_password(password=password1),
                is_active=False,
            )
            user.save()

            # send an email
            request.session['user_pk'] = user.pk
            return redirect('email_validation_send')

        context = {
            "username": username,
            "email": email,
            "password1": password1,
            "password2": password2,
            "bad_username": bad_username,
            "bad_email": bad_email,
            "passwords_unequal": passwords_unequal,
            "bad_password": bad_password,
            "password_error": password_error,
        }
        return render(request, 'users/register.html', context)
    else:
        return render(request, 'users/register.html')


@unauthenticated_user
def custom_login(request):
    username = password = ""
    context = {
        "username": "",
    }
    if request.method == 'POST':
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")

        context = {
            "username": username,
        }

        try:
            user = UserModel.objects.get(
                Q(email__iexact=username) | Q(username__iexact=username))
        except UserModel.DoesNotExist:
            context = {
                "username": username,
                "error": True,
            }
        except UserModel.MultipleObjectsReturned:
            context = {
                "username": username,
                "error": True,
            }
        else:
            if user.check_password(password):
                if user.is_active:
                    login(request, user)
                    return redirect('profile')
                request.session['user_pk'] = user.pk
                return redirect('email_validation_send')
            else:
                context = {
                    "username": username,
                    "error": True,
                }
    return render(request, 'users/login.html', context)


@unauthenticated_user
@session_variable_get(needed_in_session=["user_pk"])
def email_validation_send(request):
    user_pk = request.session.get('user_pk')
    user = UserModel.objects.get(pk__iexact=user_pk)
    if user.profile.email_confirmed:
        return redirect('home')

    if not user.profile.validation_email_send:
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        current_site = get_current_site(request)
        email_subject = '[EPS-Warner] Validate your email'
        email_body = render_to_string(
            'users/email_validation_email.html', {'user': user, 'domain': current_site.domain, 'uidb': uidb64, 'token': token})
        print(email_body)
        user.profile.validation_email_send = True
        user.profile.validation_email_send_time = datetime.utcnow()
        user.save()
    return render(request, 'users/email_validation_send.html', {"user_to_validate": user})


@unauthenticated_user
def email_validation_request(request, uidb64, token):
    user_pk = force_text(urlsafe_base64_decode(uidb64))

    try:
        user = UserModel.objects.get(pk__iexact=user_pk)
    except UserModel.DoesNotExist:
        messages.error(request, _("There is an error"))
    except UserModel.MultipleObjectsReturned:
        messages.error(request, _(
            "An error occurred while doing this task. Please try again"))
    else:
        if user.profile.email_confirmed:
            messages.info(request, _("Your email is already validated."))
            return redirect('home')

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.profile.email_confirmed = True
            user.save()
            return render(request, 'users/email_validation_success.html')
    messages.error(
        request, _("The link you used to validate your email was invalid."))
    return redirect('home')


@unauthenticated_user
def request_reset_password(request):
    if request.method == 'POST':
        email = request.POST.get("email", "")

        try:
            user = UserModel.objects.get(email__iexact=email)
        except UserModel.DoesNotExist:
            return redirect('reset_password_email_sent')
        except UserModel.MultipleObjectsReturned:
            messages.error(request, _(
                "An error occurred while doing this task. Please try again"))
        else:
            token = default_token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

            current_site = get_current_site(request)
            email_subject = '[EPS-Warner] Reset your password'
            email_body = render_to_string(
                'users/password_reset/reset_password_email.html', {'user': user, 'domain': current_site.domain, 'uidb': uidb64, 'token': token})
            print(email_body)

            return redirect('reset_password_email_sent')

    return render(request, 'users/password_reset/reset_password_request.html')


@unauthenticated_user
def reset_password_email_sent(request):
    return render(request, 'users/password_reset/reset_password_email_sent.html')


@unauthenticated_user
def set_password_after_reset(request, uidb64, token):
    user_pk = force_text(urlsafe_base64_decode(uidb64))

    try:
        user = UserModel.objects.get(pk__iexact=user_pk)
    except UserModel.DoesNotExist:
        messages.error("There is an error")
    except UserModel.MultipleObjectsReturned:
        messages.error(request, _(
            "An error occurred while doing this task. Please try again"))
    else:
        if default_token_generator.check_token(user, token):
            error = passwords_unequal = bad_password = False
            password_error = []

            if request.method == 'POST':
                password_1 = request.POST.get("password", "")
                password_2 = request.POST.get("password_confirm", "")

                if password_1 != password_2:
                    error = True
                    passwords_unequal = True

                try:
                    validate_password(password=password_1)
                except ValidationError as e:
                    bad_password = True
                    error = True
                    password_error = e
                else:
                    if not error:
                        user.password = hashers.make_password(
                            password=password_1)
                        user.save()
                        return redirect('home')

            context = {'error': error, 'password_unequal': passwords_unequal,
                       'bad_password': bad_password, 'password_error': password_error}

            return render(request, 'users/password_reset/reset_password_set_password.html', context)
    messages.error(
        request, _("The link you used to reset your password was invalid."))
    return redirect('home')


@login_required(login_url='login')
def profile(request):
    latest_private_data = request.user.profile.private_data.order_by(
        '-created')[:5]

    qr_string = "otpauth://totp/" + request.user.email + "?secret=" + \
        request.user.profile.totp_key + "&issuer=EPS&algorithm=SHA1&digits=6&period=30"

    if request.method == 'POST':
        firstname = request.POST.get("firstname", request.user.first_name)
        lastname = request.POST.get("lastname", request.user.last_name)

        tfa_activated = request.POST.get(
            "2fa_active", "off")
        tfa_generate = request.POST.get(
            "2fa_generate", "off")

        request.user.first_name = firstname
        request.user.last_name = lastname
        request.user.profile.two_factor_authentification = tfa_activated == "on"
        request.user.save()

        messages.success(request, _("Profile edit successfull!"))
        return redirect('profile')

    if request.GET.get("basic_edit", "False") == "true":
        basic_edit = True
    else:
        basic_edit = False

    if request.GET.get("security_edit", "") == "true":
        security_edit = True
    else:
        security_edit = False

    return render(request, 'users/profile.html', {"latest_private_data": latest_private_data, "basic_edit": basic_edit, "qr_code": qr_string, "security_edit": security_edit})


@login_required(login_url='login')
def change_password(request):
    password_old = password_1 = password_2 = ""

    context = {
        "username": "",
        "email": "",
    }

    if request.method == 'POST':
        password_old = request.POST.get("password_old", "")
        password_1 = request.POST.get("password_1", "")
        password_2 = request.POST.get("password_2", "")

        user = UserModel.objects.get(username__iexact=request.user.username)

        error = passwords_unequal = bad_password = False
        password_error = []

        if user.check_password(password_old):

            if password_1 != password_2:
                passwords_unequal = True
                error = True

            try:
                validate_password(password=password_1)
            except ValidationError as e:
                bad_password = True
                error = True
                password_error = e
            if not error:
                user.password = hashers.make_password(password=password_1)
                user.save()

                login(request, user)

                return redirect('profile')

            context = {
                "error": error,
                "passwords_unequal": passwords_unequal,
                "bad_password": bad_password,
                "password_error": password_error,
            }
            return render(request, 'users/change_password.html', context)
        else:
            context = {
                "error": True,
                "wron_password": True,
            }
            return render(request, 'users/change_password.html', context)
    else:
        return render(request, 'users/change_password.html')


@login_required(login_url='login')
def logout_request(request):
    logout(request)
    messages.success(request, _("Successfully logged out"))
    return redirect("home")
