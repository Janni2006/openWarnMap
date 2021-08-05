from django.urls import path
from .views import *

urlpatterns = [
    path('data/', WebGetData.as_view()),
    path('create/', WebCreateIssueView.as_view()),
    path('private-data/', WebGetPrivateData.as_view()),
]
