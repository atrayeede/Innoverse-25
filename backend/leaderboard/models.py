from django.db import models

class Leaderboard(models.Model):
    name = models.CharField(max_length=100)
    time = models.FloatField()  # Time taken for 10 questions (lower is better)
    questions = models.JSONField(default=list)  # Default to an empty list

    def __str__(self):
        return f"{self.name} - {self.time}s"
