from django.urls import path, include
from .views import *

urlpatterns = [
    path('', IssueView.as_view(), name="api"),
    path('add', CreateIssueViewT.as_view()),
    path('get', GetIssuesAround.as_view()),
    path('offline', GetOfflineData.as_view()),
    path('private_delete/delete', DeletePrivateEntry.as_view()),
    path('private_data/', GetPrivateData.as_view()),
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/login/reset', PasswordResetRequestView.as_view()),
]
