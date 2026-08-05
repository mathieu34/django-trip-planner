from django.db import models


class Category(models.Model):
    GROUP_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('hotel', 'Hôtel'),
        ('attraction', 'Attraction'),
    ]

    name = models.CharField(max_length=100, unique=True)
    group = models.CharField(max_length=20, choices=GROUP_CHOICES)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Attraction(models.Model):
    tripadvisor_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name='attractions'
    )

    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)

    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    price_level = models.CharField(max_length=10, blank=True)

    horaires = models.JSONField(blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True)

    groupes = models.JSONField(blank=True, null=True)

    note_tripadvisor = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    nombre_reviews = models.IntegerField(default=0)
    photo_count = models.IntegerField(default=0)
    recompenses = models.JSONField(blank=True, null=True)

    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Photo(models.Model):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name='photos'
    )
    url = models.URLField()

    def __str__(self):
        return f"Photo de {self.attraction.name}"
