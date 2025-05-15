from django.db import models

from api.models import TimeStampedModel


class Post(TimeStampedModel):
    owner = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    community = models.ForeignKey("communities.Community", on_delete=models.CASCADE)
    title = models.CharField(max_length=300, blank=False)
    body = models.TextField(blank=True, null=True)
    flairs = models.ManyToManyField("tags.Flair", blank=True)

    def __str__(self):
        return f"{self.id} - {self.owner} - {self.title}"


class PostMedia(TimeStampedModel):
    class MEDIA_TYPES(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"
        LINK = "LINK", "Link"

    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    type = models.CharField(
        max_length=5, default=MEDIA_TYPES.IMAGE, blank=True, choices=MEDIA_TYPES.choices
    )
    file = models.FileField(upload_to="post_media/")
    url = models.URLField()

    def clean(self):
        from django.core.exceptions import ValidationError

        if (
            self.type in [self.MEDIA_TYPES.IMAGE, self.MEDIA_TYPES.VIDEO]
            and not self.file
        ):
            raise ValidationError("File is required for image/video media.")
        if self.type == self.MEDIA_TYPES.LINK and not self.url:
            raise ValidationError("URL is required for link media.")

    def __str__(self):
        return f"Post-{self.post.id} ({self.type})"


class RecentlyViewedPost(models.Model):
    user = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="recently_viewed_posts"
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "post")
        ordering = ["-viewed_at"]
