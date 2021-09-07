from django.db.models.signals import m2m_changed, post_save, post_save
from django.dispatch import receiver
from .models import Votes


@receiver(post_save, sender=Votes)
def create_auth_token(sender, instance=None, created=False, *args, **kwargs):
    if created:
        print(Votes.objects.filter(entry=instance.entry, confirm=True).count())
