from django.urls import path
from .views import *
from django.conf.urls import handler404

urlpatterns = [
    path('', home, name="home"),
    path('data', home_data),
    path('list', issue_list_view),
    path('about', AboutView, name="about"),
    path('statistics', statistics, name="statistics"),
    path('statistics/data/<year>', statistics_data, name="statistics_data"),
]

handler404 = 'web.views.custom_error_404'
