from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Feedback(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, null=True, blank=True,
                             default=None, on_delete=models.SET_DEFAULT)
    email = models.EmailField()
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    content = models.TextField()
