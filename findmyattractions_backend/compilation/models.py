from django.db import models


class CompilationItem(models.Model):
    """
    Un élément de la liste de voyage de l'utilisateur, identifié par session.
    On stocke juste l'ID de l'attraction (pas de ForeignKey) pour rester
    indépendant de l'app 'attractions' pendant le développement.
    """
    session_key = models.CharField(max_length=40, db_index=True)
    attraction_id = models.IntegerField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session_key", "attraction_id")
        ordering = ["added_at"]