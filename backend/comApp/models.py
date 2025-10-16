from django.db import models
from django.contrib.auth import get_user_model
from userApp.models import *
from django.db import models
from shortuuidfield import ShortUUIDField
from django.contrib.humanize.templatetags.humanize import naturaltime
from django.utils import timezone

class ChatRoom(models.Model):
    roomId = ShortUUIDField()
    type = models.CharField(max_length=10, default='DM')
    member = models.ManyToManyField('userApp.User')
    name = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.roomId + ' -> ' + str(self.name)

class ChatMessage(models.Model):
    chat = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey('userApp.User', on_delete=models.SET_NULL, null=True)
    message = models.CharField(max_length=255)
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

class OnlineUser(models.Model):
    user = models.OneToOneField('userApp.User', on_delete=models.CASCADE)
    last_seen = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.user.username

    def update_last_seen(self):
        self.last_seen = timezone.now()
        self.save()

    def last_seen_humanized(self):
        return self.last_seen


def time_since(timestamp):
    return naturaltime(timestamp)