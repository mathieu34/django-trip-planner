from django.db import models

class ProfileType(models.TextChoices):
    LOCAL = 'Local'
    TOURISTE = 'Touriste'
    PRO = 'Professionnel'

# Create your models here.
class UserProfile(models.Model):
    session_key = models.CharField(max_length=40, unique=True)
    profile_type = models.CharField(max_length=50, choices=ProfileType.choices)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.profile_type} - {self.country}"