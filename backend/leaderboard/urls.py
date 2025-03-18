from django.urls import path
from .views import leaderboard_list

urlpatterns = [
    path("", leaderboard_list, name="leaderboard-list"),  # /api/leaderboard/
]
