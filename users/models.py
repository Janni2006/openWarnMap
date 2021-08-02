from datetime import datetime
from django.db import models
from colorfield.fields import ColorField
from django.contrib.auth.models import User
from django.utils.translation import gettext as _
from api.models import Issue
import uuid


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_confirmed = models.BooleanField(default=False)
    validation_email_send = models.BooleanField(default=False)
    validation_email_send_time = models.DateTimeField(
        blank=True, default=datetime.now)
    private_data = models.ManyToManyField(Issue, blank=True)
    published_count = models.IntegerField(default=0)
    avatar_color = ColorField(default='#bdbdbd')

    def __str__(self):
        return f'{_("Profile")} {self.user}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


def generate_unique_uuid():

    while True:
        token = str(uuid.uuid4())

        if TokenUUID.objects.filter(uuid=token).count() == 0:
            break

    return token


class TokenUUID(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    uuid = models.TextField(default=generate_unique_uuid, unique=True)
