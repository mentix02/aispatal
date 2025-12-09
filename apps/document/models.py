import uuid

from django.db import models


class Document(models.Model):

    skey = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    name = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    raw_content = models.TextField(default='', blank=True)
    file = models.FileField(upload_to='documents/', null=True, blank=True)
    uploaded_by = models.ForeignKey(
        'user.User',
        null=True,
        blank=True,
        default=None,
        related_name='documents',
        on_delete=models.CASCADE,
    )

    category = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self) -> str:
        return self.name if self.name else str(self.skey)
