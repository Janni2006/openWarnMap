from django.db.models.signals import m2m_changed, post_delete, post_save, post_save, pre_delete, pre_save
from django.dispatch import receiver
from .models import Issue, Statistics
import datetime
from django.utils import timezone


@receiver(post_save, sender=Issue)
def update_lastUpdateField(sender, instance, created, **kwargs):
    if not created and timezone.now() - instance.updated > timezone.timedelta(seconds=5):
        instance.updated = timezone.now()
        instance.save()


@receiver(post_save, sender=Issue)
def add_range(sender, instance, created, **kwargs):
    if created:
        item = Issue.objects.get(code__iexact=instance.code)
        try:
            object = Statistics.objects.get(
                time__month=item.created.strftime('%m'), time__year=item.created.strftime('%Y'))
        except:
            object = Statistics.objects.create(time=datetime.datetime.fromisoformat(
                f"{item.created.strftime('%Y')}-{item.created.strftime('%m')}-01"))
            object.save()
            object.count = 1
            object.save()
        else:
            object = Statistics.objects.get(
                time__month=item.created.strftime('%m'), time__year=item.created.strftime('%Y'))
            object.count = object.count + 1
            object.save()


@receiver(post_delete, sender=Issue)
def delete_range(sender, instance, **kwargs):
    StatisticsModel = Statistics()
    try:
        object = Statistics.objects.get(
            time__month=instance.created.strftime('%m'), time__year=instance.created.strftime('%Y'))
    except StatisticsModel.DoesNotExist:
        return
    else:
        object.count = object.count - 1
        object.save()
