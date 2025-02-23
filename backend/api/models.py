from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class VerificationCode(TimeStampedModel):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    expiry_time = models.DateTimeField()
    is_approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ['email', 'code']

    def save(self, *args, **kwargs):
        if not self.expiry_time:
            self.expiry_time = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expiry_time