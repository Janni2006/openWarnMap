from django.urls import path
from .views import *

urlpatterns = [
    path('login/', WebLoginView.as_view()),
    path('refresh-token/', WebRefreshToken.as_view()),
    path('logout/', WebTokenLogout.as_view()),
    path('register/', WebRegisterView.as_view()),
    path('user/', WebUserLoader.as_view()),
    path('change-password/', WebChangePassword.as_view()),
    path('login/reset/', WebPasswordResetRequest.as_view()),
    path('change-profile/', WebChangeProfile.as_view())
]
