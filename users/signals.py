from django.db.models.signals import m2m_changed, post_save, post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile
from django.conf import settings
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, *args, **kwargs):
    if created:
        Token.objects.create(user=instance)


def private_data_changed(sender, instance, **kwargs):
    instance.published_count = instance.private_data.count()
    instance.save()


m2m_changed.connect(private_data_changed, sender=Profile.private_data.through)
