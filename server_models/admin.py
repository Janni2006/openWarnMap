from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import *

# Register your models here.


class IssueAdmin(OSMGeoAdmin):
    list_display = ("full_name", "active", "verified",
                    "created", "updated", "creator")
    list_filter = ("active", "verified", "updated")


admin.site.register(Issue, IssueAdmin)
admin.site.register(Statistics)
