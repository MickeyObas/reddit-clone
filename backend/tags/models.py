from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=80)

    def __str__(self):
        return self.name


class Flair(models.Model):
    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class Topic(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name
