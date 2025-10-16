
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import LimitOffsetPagination
from .serializers import ChatRoomSerializer, ChatMessageSerializer,UnreadCountSerializer
from .models import ChatRoom, ChatMessage, OnlineUser
from rest_framework.permissions import IsAuthenticated

class ChatRoomView(APIView):
	def get(self, request, userId):
		chatRooms = ChatRoom.objects.filter(member=userId).exclude(type='SELF')
		serializer = ChatRoomSerializer(
			chatRooms, many=True, context={"request": request}
		)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		serializer = ChatRoomSerializer(
			data=request.data, context={"request": request}
		)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessagesView(ListAPIView):
	serializer_class = ChatMessageSerializer
	pagination_class = LimitOffsetPagination

	def get_queryset(self):
		roomId = self.kwargs['roomId']
		return ChatMessage.objects.\
			filter(chat__roomId=roomId).order_by('-timestamp')


class LastSeenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, userId):
        try:
            online_user = OnlineUser.objects.get(user__id=userId)
            last_seen_humanized = online_user.last_seen_humanized()
            return Response({'last_seen': last_seen_humanized}, status=status.HTTP_200_OK)
        except OnlineUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
		
class UnreadCountView(APIView):
    def get(self, request, roomId):
        unread_count = 0
        messages = ChatMessage.objects.filter(chat__roomId=roomId, read=False)
        for message in messages:
            if message.user != self.request.user:
                unread_count += 1
            else:
                pass

        data = {
            'roomId': roomId,
            'unread_count': unread_count
        }
        serializer = UnreadCountSerializer(data)
        return Response(serializer.data)
