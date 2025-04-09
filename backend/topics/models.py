from django.db import models

from api.models import TimeStampedModel


class TopicCategory(TimeStampedModel):
    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=7)

    def __str__(self):
        return self.name
    

class Topic(TimeStampedModel):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(TopicCategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.name