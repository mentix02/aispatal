import uuid

from django.db import models


class Chat(models.Model):

    timestamp = models.DateTimeField(auto_now_add=True)
    skey = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    user = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='chats')

    title = models.CharField(max_length=255, default='')
    model = models.CharField(max_length=255, default='gpt-5-nano')

    def __str__(self) -> str:
        return self.title if self.title else str(self.skey)


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
