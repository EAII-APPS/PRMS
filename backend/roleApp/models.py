from django.db import models
from django.db.models.signals import pre_save
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import datetime
from django.db import transaction

from django.dispatch import receiver

from django.contrib.auth import get_user_model

# Create your models here.








