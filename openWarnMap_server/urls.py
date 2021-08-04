from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic.base import RedirectView
from frontend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    path('api/', RedirectView.as_view(pattern_name='api')),
    path('backend/auth/', include('users.urls')),
    path('react/', include('reactbackend.urls')),
    # path('login/', RedirectView.as_view(pattern_name='login')),
    # path('register/', RedirectView.as_view(pattern_name='register')),
    # path('logout/', RedirectView.as_view(pattern_name='logout')),
    re_path(r'.*', views.index, name="home"),
]

# urlpatterns += re_path(r'.*', views.index)
