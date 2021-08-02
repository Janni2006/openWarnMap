from django.urls import path
from .views import (logout_request, custom_register, profile,
                    custom_login, change_password, request_reset_password,
                    reset_password_email_sent, set_password_after_reset,
                    email_validation_send, email_validation_request)

urlpatterns = [
    path('logout', logout_request, name="logout"),
    path('register', custom_register, name="register"),
    path('profile/change_password', change_password, name="change_password"),
    path('profile', profile, name="profile"),
    path('login', custom_login, name="login"),
    path('login/email_validation_send',
         email_validation_send, name="email_validation_send"),
    path('login/email_validation/<uidb64>/<token>',
         email_validation_request, name="email_validatione_request"),
    path('reset-password', request_reset_password,
         name="password_reset_request"),
    path('reset-password-sent', reset_password_email_sent,
         name="reset_password_email_sent"),
    path('reset/<uidb64>/<token>', set_password_after_reset,
         name="set_password_after_reset")
]
