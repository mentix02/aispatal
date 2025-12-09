from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token

from apps.user.models import User


@receiver(post_save, sender=User)
def create_auth_token(sender: type[User], instance: User = None, created: bool = False, **kwargs):  # noqa
    if created:
        Token.objects.create(user=instance)
