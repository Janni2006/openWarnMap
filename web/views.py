from django.http.response import JsonResponse
from django.shortcuts import render
from datetime import datetime
import geojson
from django.template.loader import render_to_string
from django.core.paginator import Paginator
from django.utils.translation import gettext as _
from api.models import Statistics, Issue
# Create your views here.


def home(request, *args, **kwargs):
    return render(request, "web/main.html")


def home_data(request, *args, **kwargs):
    queryset = Issue.objects.all()

    all = []
    active = []
    for entry in queryset:
        entryPoint = geojson.Point(
            (float(entry.gps_long), float(entry.gps_lat)))
        all.append(geojson.Feature(
            geometry=entryPoint, properties=render_to_string('web/mapPopUp.html', {"entry": entry})))
        if entry.active:
            active.append(geojson.Feature(
                geometry=entryPoint, properties=render_to_string('web/mapPopUp.html', {"entry": entry})))

    all_featureCollection = geojson.FeatureCollection(all)
    active_featureCollection = geojson.FeatureCollection(active)

    return JsonResponse(data={"all": all_featureCollection, "active": active_featureCollection})


def statistics(request):
    latest_data = Issue.objects.all().order_by('-updated')[:5]
    count = Issue.objects.all().count()
    difference = Issue.objects.all().count() - Issue.objects.all().exclude(updated__year=datetime.now().strftime(
        '%Y'), updated__month=datetime.now().strftime("%m"), updated__day=datetime.now().strftime("%d")).count()
    active_count = Issue.objects.filter(active=True).count()
    active_differnece = Issue.objects.filter(active=True).count() - Issue.objects.filter(active=True).exclude(updated__year=datetime.now().strftime(
        '%Y'), updated__month=datetime.now().strftime("%m"), updated__day=datetime.now().strftime("%d")).count()
    monthly_difference = []

    for month in range(12):
        empty = {"month": 0, "year": 0, "difference": 0}
        month_object = Statistics.objects.filter(
            time__month=month+1)
        if month_object.exists():
            empty["month"] = month_object.order_by(
                '-time').first().time.strftime('%B')
            empty["year"] = month_object.order_by(
                '-time').first().time.strftime('%Y')
            year = int(month_object.order_by(
                '-time').first().time.strftime('%Y'))
            queryset = Statistics.objects.filter(
                time__month=month+1, time__year=year - 1)
            if queryset.exists():
                empty["data"] = month_object.order_by(
                    '-time').first().count - queryset.first().count
            else:
                empty["difference"] = month_object.order_by(
                    '-time').first().count
            monthly_difference.append(empty)

    context = {
        "latest_data": latest_data,
        "monthly_difference": monthly_difference,
        "count": count,
        "active_count": active_count,
        "difference": difference,
        "active_difference": active_differnece,
    }

    if request.user.is_authenticated:
        latest_private_data = request.user.profile.private_data.all().order_by(
            '-created')[:5]
        context = {
            "latest_data": latest_data,
            "monthly_difference": monthly_difference,
            "latest_private_data": latest_private_data,
            "count": count,
            "active_count": active_count,
            "difference": difference,
            "active_difference": active_differnece,
        }
        return render(request, "web/statistics.html", context)

    return render(request, "web/statistics.html", context)


def statistics_data(request, year=datetime.now().strftime('%Y')):
    months = [_("January"), _("February"), _("March"), _("April"), _("May"),
              _("June"), _("July"), _("August"), _("September"), _("October"), _("November"), _("December")]
    data = {"monthly": {"public": [], "labels": months},
            "yearly": {"labels": [], "values": []}}

    if request.user.is_authenticated:
        data = {"monthly": {"public": [], "private": [], "labels": months},
                "yearly": {"labels": [], "values": []}}
        for month in range(12):
            queryset = request.user.profile.private_data.filter(
                created__month=month+1, created__year=year)
            data["monthly"]["private"].append(queryset.count())

    for month in range(12):
        queryset = Statistics.objects.filter(
            time__month=month+1, time__year=year)
        if queryset.exists():
            data["monthly"]["public"].append(queryset.first().count)
        else:
            data["monthly"]["public"].append(0)

    query_all = Statistics.objects.all()
    for object in query_all:
        exists = False
        for year in range(len(data["yearly"]["labels"])):
            if int(object.time.strftime('%Y')) == int(data["yearly"]["labels"][year]):
                data["yearly"]["values"][year] += object.count

                exists = True
                break
        if not exists:
            data["yearly"]["labels"].append(object.time.strftime('%Y'))
            data["yearly"]["values"].append(object.count)

    return JsonResponse(data=data)


def AboutView(request, *args, **kwargs):
    return render(request, "web/about.html", {"footer": True})


def issue_list_view(request, *args, **kwargs):
    order_by = request.GET.get("order_by")
    if order_by:
        queryset = Issue.objects.all().order_by(order_by)
    else:
        queryset = Issue.objects.all().order_by()
    paginator = Paginator(queryset, 30)
    page_number = int(request.GET.get("page", "1"))
    page_obj = paginator.get_page(page_number)
    return render(request, "web/issue_list.html", {"paginator": page_obj, "order_by": order_by})


def custom_error_404(request, *args, **kwargs):
    return render(request, 'errors/404.html', {})
