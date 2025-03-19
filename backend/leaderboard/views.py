from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Leaderboard , Player
from .serializers import LeaderboardSerializer, PlayerSerializer
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

@csrf_exempt
@api_view(['GET', 'POST'])
def leaderboard_list(request):
    if request.method == 'GET':
        players = Leaderboard.objects.all().order_by('time')  # Fastest first
        serializer = LeaderboardSerializer(players, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        
            serializer = LeaderboardSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
@api_view(['GET', 'POST'])
def player_list(request):
    if request.method == 'GET':
        players = Player.objects.all() # Fastest first
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        
            serializer = PlayerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
@api_view(['PATCH', 'DELETE'])
def player_detail(request, player_id):
    """Update or delete a specific player."""
    player = get_object_or_404(Player, id=player_id)

    if request.method == 'PATCH':
        serializer = PlayerSerializer(player, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        player.delete()
        return Response({"message": "Player deleted successfully"}, status=status.HTTP_204_NO_CONTENT)