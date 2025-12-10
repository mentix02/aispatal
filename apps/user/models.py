import uuid
import secrets

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager


def generate_secret_key() -> str:
    """Generate a random secret key of length 32."""
    return secrets.token_urlsafe(24)


class UserManager(BaseUserManager):

    def create_user(self, email: str, password: str, **extra_fields):
        """
        Create and save a User with the given email and password.
        """

        if not email:
            raise ValueError(_('User must have an email.'))

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('email_verified', True)

        if not extra_fields.get('is_staff'):
            raise ValueError(_('Superuser must have is_staff=True.'))
        if not extra_fields.get('is_superuser'):
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):

    # is_staff means the User is a doctor

    objects = UserManager()

    username = None
    last_name = None
    first_name = None
    date_joined = None

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.URLField(blank=True, null=True, default=None)

    email_verified = models.BooleanField(default=False)
    email = models.EmailField(_("email address"), unique=True)

    skey = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(_("Name of User"), blank=True, max_length=255, default='')
    access_key = models.CharField(_("Access Key"), max_length=32, default=generate_secret_key)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'

    def get_full_name(self) -> str:
        return self.name


class NextjsAccount(models.Model):

    account_id = models.TextField()
    provider_id = models.TextField()
    user = models.ForeignKey('user.User', on_delete=models.DO_NOTHING)

    id_token = models.TextField(blank=True, null=True)
    access_token = models.TextField(blank=True, null=True)
    refresh_token = models.TextField(blank=True, null=True)

    access_token_expires_at = models.DateTimeField(blank=True, null=True)
    refresh_token_expires_at = models.DateTimeField(blank=True, null=True)

    scope = models.TextField(blank=True, null=True)
    password = models.TextField(blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'nextjs_account'


class NextjsSession(models.Model):

    token = models.TextField()
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)

    expires_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    user_agent = models.TextField(blank=True, null=True, default=None)

    # Don't be clever trying to use GenericIPAddressField - smarter men than you have tried and failed.
    ip_address = models.TextField(null=True, blank=True, default=None)

    class Meta:
        db_table = 'nextjs_session'


class NextjsVerification(models.Model):

    value = models.TextField()
    identifier = models.TextField()

    expires_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'nextjs_verification'
