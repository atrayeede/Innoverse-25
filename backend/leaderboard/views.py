from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Leaderboard
from .serializers import LeaderboardSerializer

@api_view(['GET', 'POST'])
def leaderboard_list(request):
    if request.method == 'GET':
        players = Leaderboard.objects.all().order_by('time')  # Fastest first
        serializer = LeaderboardSerializer(players, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if "questions" in request.data and len(request.data["questions"]) == 10:
            serializer = LeaderboardSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Must submit 10 questions"}, status=status.HTTP_400_BAD_REQUEST)
