from django.db import models
import string
import random
import datetime
from django.utils.translation import gettext as _
from django.contrib.auth.models import User
from django.utils import timezone


def generate_unique_code():

    while True:
        random_num = random.randint(a=0, b=2)
        sample_str = ''.join((random.choice(string.ascii_letters)
                              for i in range(3+random_num)))
        sample_str += ''.join((random.choice(string.digits)
                               for i in range(7-random_num)))

        # Convert string to list and shuffle it to mix letters and digits
        sample_list = list(sample_str)
        random.shuffle(sample_list)
        final_code = ''.join(sample_list)
        if Issue.objects.filter(code=final_code).count() == 0:
            break

    return final_code
# Create your models here.


class Issue(models.Model):
    code = models.CharField(default=generate_unique_code, max_length=10)
    active = models.BooleanField(null=False, default=True)
    verified = models.BooleanField(null=False, default=False)
    gps_lat = models.DecimalField(null=False, decimal_places=7, max_digits=10)
    gps_long = models.DecimalField(
        null=False, decimal_places=7, max_digits=10)
    size = models.IntegerField(null=False, default=1)
    height = models.IntegerField(null=False, default=1)
    localization = models.IntegerField(null=False, default=0)
    created = models.DateTimeField(default=datetime.datetime.now)
    updated = models.DateTimeField(default=datetime.datetime.now)
    creator = models.ForeignKey(
        User, null=True, blank=True, default=None, on_delete=models.SET_DEFAULT)

    @property
    def full_name(self):
        return "Issue %s" % (self.code)

    def __str__(self):
        return f'Issue {self.code}'


class Statistics(models.Model):
    time = models.DateTimeField(default=datetime.datetime.now)
    count = models.IntegerField(default=0)

    def __str__(self):
        month = self.time.strftime('%B')
        year = self.time.strftime('%Y')
        return f'Issues {_(month)}, {year}'
