from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class Vote(models.Model):

    LIKE = 1
    DISLIKE = -1

    VOTE_CHOICES = (
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    )

    vote = models.SmallIntegerField(choices=VOTE_CHOICES, default=LIKE)
    user = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='votes')

    object_id = models.PositiveIntegerField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    content_object = GenericForeignKey('content_type', 'object_id')
