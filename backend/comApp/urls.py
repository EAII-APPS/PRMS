from django.urls import path
from . import views
from .views import ChatRoomView, MessagesView, LastSeenView, UnreadCountView

urlpatterns = [

    path('chats', ChatRoomView.as_view(), name='chatRoom'),
	path('chats/<str:roomId>/messages', MessagesView.as_view(), name='messageList'),
	path('users/<int:userId>/chats', ChatRoomView.as_view(), name='chatRoomList'),
    path('users/last_seen/<int:userId>/', LastSeenView.as_view(), name='last_seen'),
    path('chats/<str:roomId>/unread_count/', UnreadCountView.as_view(), name='unread_count'),

]
 
