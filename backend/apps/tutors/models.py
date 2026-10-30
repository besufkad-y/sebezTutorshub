from django.db import models
from django.conf import settings

class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def id(self):
        return self.subject_id

    def __str__(self):
        return self.name

class TutorProfile(models.Model):
    tutor = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='tutor_profile'
    )
    bio = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    availability = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.tutor}"

class TutorSubject(models.Model):
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tutor_subjects'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='subject_tutors'
    )

    class Meta:
        unique_together = ('tutor', 'subject')

    def __str__(self):
        return f"{self.tutor} teaches {self.subject}"

class RatingsSummary(models.Model):
    tutor = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='ratings_summary'
    )
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_reviews = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.tutor}: {self.average_rating} ({self.total_reviews} reviews)"

# Add helper property/m2m to User
settings.AUTH_USER_MODEL
User = None
