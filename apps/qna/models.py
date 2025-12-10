import uuid

from django.db import models
from django.contrib.contenttypes.fields import GenericRelation


class Category(models.Model):

    name = models.SlugField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super().save(*args, **kwargs)


class Question(models.Model):

    text = models.TextField()

    votes = GenericRelation('vote.Vote')
    category = models.ForeignKey('qna.Category', on_delete=models.SET_NULL, null=True, blank=True, default=None)

    timestamp = models.DateTimeField(auto_now_add=True)
    skey = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self) -> str:
        return str(self.skey)


class Answer(models.Model):

    text = models.TextField()

    votes = GenericRelation('vote.Vote')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    user = models.ForeignKey('user.User', related_name='answers', on_delete=models.CASCADE)

    timestamp = models.DateTimeField(auto_now_add=True)
    skey = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self) -> str:
        return str(self.skey)
