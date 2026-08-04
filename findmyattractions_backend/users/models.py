from django.db import models
from django.contrib.auth.models import User


class ProfileType(models.TextChoices):
    LOCAL = 'Local'
    TOURISTE = 'Touriste'
    PRO = 'Professionnel'

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_type = models.CharField(max_length=50, choices=ProfileType.choices)
    country = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username