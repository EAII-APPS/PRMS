from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from notifications.signals import notify
from .models import ChatRoom, ChatMessage, User, OnlineUser
from django.utils import timezone
import json

class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def getUser(self, userId):
        return User.objects.get(id=userId)

    @database_sync_to_async
    def getOnlineUsers(self):
        onlineUsers = OnlineUser.objects.all()
        return [onlineUser.user.id for onlineUser in onlineUsers]

    @database_sync_to_async
    def addOnlineUser(self, user):
        try:
            OnlineUser.objects.create(user=user)
        except:
            pass

    @database_sync_to_async
    def deleteOnlineUser(self, user):
        try:
            OnlineUser.objects.get(user=user).delete()
        except:
            pass

    @database_sync_to_async
    def updateLastSeen(self, user):
        try:
            onlineUser = OnlineUser.objects.get(user=user)
            onlineUser.update_last_seen()
        except OnlineUser.DoesNotExist:
            OnlineUser.objects.create(user=user, last_seen=timezone.now())

    @database_sync_to_async
    def saveMessage(self, message, userId, roomId):
        userObj = User.objects.get(id=userId)
        chatObj = ChatRoom.objects.get(roomId=roomId)
        chatMessageObj = ChatMessage.objects.create(
            chat=chatObj, user=userObj, message=message, read=False
        )
        user_image_url = userObj.photo.url if hasattr(userObj, 'photo') and userObj.photo else None

        return {
            'action': 'message',
            'user': userId,
            'roomId': roomId,
            'message': message,
            'userImage': user_image_url,
            'userName': userObj.first_name + " " + userObj.last_name,
            'timestamp': str(chatMessageObj.timestamp)
        }

    @database_sync_to_async
    def send_notification(self, recipient, message):
        notify.send(self.user, recipient=recipient, verb='sent you a message', description=message)

    @database_sync_to_async
    def mark_as_read(self, roomId, userId):
        chat_room = ChatRoom.objects.get(roomId=roomId)
        members = chat_room.member.all()

        reads_user = User.objects.get(id=userId)
        messages = ChatMessage.objects.filter(chat__roomId=roomId, read=False)
        for message in messages:
            if message.user != reads_user:
                messages.update(read=True)
            else:
                pass
        return messages.count()
    
    async def sendOnlineUserList(self):
        onlineUserList = await self.getOnlineUsers()
        chatMessage = {
            'type': 'chat_message',
            'message': {
                'action': 'onlineUser',
                'userList': onlineUserList
            }
        }
        await self.channel_layer.group_send('onlineUser', chatMessage)

    async def connect(self):
        self.userId = self.scope['url_route']['kwargs']['userId']
        self.userRooms = await database_sync_to_async(
            list
        )(ChatRoom.objects.filter(member=self.userId))
        for room in self.userRooms:
            await self.channel_layer.group_add(
                room.roomId,
                self.channel_name
            )
        await self.channel_layer.group_add('onlineUser', self.channel_name)
        self.user = await self.getUser(self.userId)
        await self.addOnlineUser(self.user)
        await self.updateLastSeen(self.user)
        await self.sendOnlineUserList()
        await self.accept()

    async def disconnect(self, close_code):
        await self.deleteOnlineUser(self.user)
        await self.updateLastSeen(self.user)
        await self.sendOnlineUserList()
        for room in self.userRooms:
            await self.channel_layer.group_discard(
                room.roomId,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']
        roomId = text_data_json['roomId']
        chatMessage = {}
        if action == 'message':
            message = text_data_json['message']
            userId = text_data_json['user']
            chatMessage = await self.saveMessage(message, userId, roomId)
            recipient = await database_sync_to_async(User.objects.get)(id=userId)
            await self.send_notification(recipient, message)
        elif action == 'typing':
            chatMessage = text_data_json
        elif action == 'markAsRead':
            userId = text_data_json['user']
            await self.mark_as_read(roomId, userId)
            
        await self.updateLastSeen(self.user)
        
        await self.channel_layer.group_send(
            roomId,
            {
                'type': 'chat_message',
                'message': chatMessage
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
