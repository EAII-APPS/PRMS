
from rest_framework import serializers
from .models import ChatRoom, ChatMessage
from userApp.serializers import UserSerializer
from userApp.models import *

class ChatRoomSerializer(serializers.ModelSerializer):
	member = UserSerializer(many=True, read_only=True)
	members = serializers.ListField(write_only=True)

	def create(self, validatedData):
		memberObject = validatedData.pop('members')
		chatRoom = ChatRoom.objects.create(**validatedData)
		chatRoom.member.set(memberObject)
		return chatRoom

	class Meta:
		model = ChatRoom
		exclude = ['id']

class ChatMessageSerializer(serializers.ModelSerializer):
	userName = serializers.SerializerMethodField()
	userImage = serializers.ImageField(source='user.photo')

	class Meta:
		model = ChatMessage
		exclude = ['id', 'chat']

	def get_userName(self, Obj):
		return Obj.user.first_name + ' ' + Obj.user.last_name

class UnreadCountSerializer(serializers.Serializer):
    roomId = serializers.CharField()
    unread_count = serializers.IntegerField()
	