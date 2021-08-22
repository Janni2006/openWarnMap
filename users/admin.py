from django.contrib import admin
from django.contrib.auth import models
from .models import Profile, TokenUUID
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from reactbackend.models import Votes

# Register your models here.


class VotesInline(admin.StackedInline):
    model = Votes
    can_delete = True
    verbose_name_plural = "Votes"


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profiles'


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, VotesInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(TokenUUID)
