import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):

    email = models.EmailField(_("email address"), unique=True)
    skey = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
