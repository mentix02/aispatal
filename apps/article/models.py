import uuid

from django.db import models
from django.utils.text import slugify
from django.contrib.contenttypes.fields import GenericRelation


class Article(models.Model):

    title = models.CharField(max_length=255)
    content = models.TextField(default='', blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length=255, unique=True)

    votes = GenericRelation('vote.Vote')
    author = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='articles')
    category = models.ForeignKey(
        'qna.Category', on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name='articles'
    )

    def save(self, *args, **kwargs):
        if self._state.adding or not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class ArticleDocument(models.Model):

    document = models.FileField(upload_to='documents/')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='documents')
