from django.db import models

from api.models import TimeStampedModel



class Post(models.Model, TimeStampedModel):
    title = models.CharField(max_length=300)
    body = models.TextField()
    # Images 
    # Links 

    
