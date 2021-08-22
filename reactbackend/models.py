from django.db import models
from django.contrib.auth.models import User
from api.models import Issue

# Create your models here.


class Feedback(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, null=True, blank=True,
                             default=None, on_delete=models.SET_DEFAULT)
    email = models.EmailField()
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    content = models.TextField()


class Votes(models.Model):

    CHOICES = (("IP", "Invalid position"), ("NT", "No trees near this entry"))

    id = models.BigAutoField(primary_key=True)
    entry = models.ForeignKey(
        Issue, blank=False, null=False, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL)
    confirm = models.BooleanField(default=True)
    change = models.BooleanField(default=False)
    applied_change = models.CharField(
        max_length=2, choices=CHOICES, null=True, blank=True)
    created = models.DateTimeField(auto_now=True)
