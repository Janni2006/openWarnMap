from django.contrib import admin
from .models import *

# Register your models here.


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("email", "firstname", "lastname")


class VotesAdmin(admin.ModelAdmin):
    list_display = ("entry", "confirm", "change", "created", "applied_change")
    list_filter = ("entry", "confirm", "change")


admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Votes, VotesAdmin)
