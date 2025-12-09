import uuid

from django.db import models
from django.conf import settings


class Chat(models.Model):

    timestamp = models.DateTimeField(auto_now_add=True)
    skey = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        default=None,
        related_name='chats',
        on_delete=models.SET_NULL,
        help_text='User associated with the chat session',
    )

    title = models.CharField(max_length=255, default='')
    model = models.CharField(max_length=255, default='')

    def __str__(self) -> str:
        return str(self.skey)


class Message(models.Model):

    BOT = 'bot'
    USER = 'user'

    ROLE_CHOICES = (
        (BOT, 'Bot'),
        (USER, 'User'),
    )

    timestamp = models.DateTimeField(auto_now_add=True)
    skey = models.UUIDField(default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')

    content = models.TextField()
    role = models.CharField(max_length=4, choices=ROLE_CHOICES)

    def __str__(self) -> str:
        return str(self.skey)
