from django.db import models
from django.contrib.auth.models import AbstractUser
#from roleApp.models import Permission, UserPermission, UserRole, Role
from django.db import IntegrityError
#from roleApp.models import *
# Create your models here.
from django.db.models.signals import pre_save
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import datetime
from django.db import transaction

from django.dispatch import receiver

from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

class Monitoring(models.Model):
    name = models.CharField(max_length=1000, unique=True)
    phone_no = models.PositiveIntegerField(null=True, blank=True)
    email = models.CharField(max_length=1000, null=True, blank=True)
    status = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('User', related_name='monitorings_added', null=True, blank=True, on_delete=models.SET_NULL)
    updated_by = models.ForeignKey('User', related_name='monitorings_updated', null=True, blank=True, on_delete=models.SET_NULL)
    deleted_by = models.ForeignKey('User', related_name='monitorings_deleted', null=True, blank=True, on_delete=models.SET_NULL)
    status_changed_by = models.ForeignKey('User', related_name='monitorings_status_changed', null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return self.name
 
class Sector(models.Model):
    name = models.CharField(max_length=45, unique=True)
    phone_no = models.CharField(max_length=45, null=True, blank=True)
    email = models.CharField(max_length=45, null=True, blank=True)
    status = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('User', related_name='sectors_added', null=True, blank=True, on_delete=models.SET_NULL)
    updated_by = models.ForeignKey('User', related_name='sectors_updated', null=True, blank=True, on_delete=models.SET_NULL)
    deleted_by = models.ForeignKey('User', related_name='sectors_deleted', null=True, blank=True, on_delete=models.SET_NULL)
    status_changed_by = models.ForeignKey('User', related_name='sectors_status_changed', null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return self.name


class Division(models.Model):
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name='divisions', null=True, blank=True)  # Linking Division to Sector
    name = models.CharField(max_length=45, unique=True)
    phone_no = models.CharField(max_length=45, null=True, blank=True)
    email = models.CharField(max_length=45, null=True, blank=True)  # Assuming Division might also have an email
    status = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)  # Assuming Division might have an is_deleted flag
    added_by = models.ForeignKey('User', related_name='divisions_added', null=True, blank=True, on_delete=models.SET_NULL)
    updated_by = models.ForeignKey('User', related_name='divisions_updated', null=True, blank=True, on_delete=models.SET_NULL)
    deleted_by = models.ForeignKey('User', related_name='divisions_deleted', null=True, blank=True, on_delete=models.SET_NULL)
    status_changed_by = models.ForeignKey('User', related_name='divisions_status_changed', null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return f"{self.id} - {self.name}"
    

class User(AbstractUser):
    monitoring_id = models.ForeignKey('Monitoring', on_delete=models.CASCADE, null=True, blank=True)
    sector_id = models.ForeignKey('Sector', on_delete=models.CASCADE, null=True, blank=True)
    division_id = models.ForeignKey('Division', on_delete=models.CASCADE, null=True, blank=True)
    is_superadmin = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_user = models.BooleanField(default=False)
    role = models.ForeignKey('Role', on_delete=models.CASCADE, null=True, blank=True)
    last_seen = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    gender = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    photo = models.ImageField(upload_to='images/', null=True, blank=True)
    status = models.BooleanField(default=True)  # Assuming `status=True` means active
    deleted_by = models.ForeignKey('self', related_name='deleted_users', null=True, blank=True, on_delete=models.SET_NULL)
    added_by = models.ForeignKey('self', related_name='users_added', null=True, blank=True, on_delete=models.SET_NULL)
    status_changed_by = models.ForeignKey('self', related_name='status_changed_users', null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateField(auto_now_add=True)
    
            
    def __str__(self):
        return f"{self.username}"
        
class SectorReminder(models.Model):
    title = models.CharField(max_length=100)
    submision_dateof_sector = models.DateTimeField()
    added_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class DivisionReminder(models.Model):
    title = models.CharField(max_length=100)
    submision_dateof_division = models.DateTimeField()
    added_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.title



# Role app models

class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('C', 'Created'),
        ('U', 'Updated'),
        ('D', 'Deleted'),
    )

    action = models.CharField(max_length=1, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('User', related_name='user_name', on_delete=models.CASCADE, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    def __str__(self):
        return f"{self.get_action_display()} {self.content_type} {self.object_id}"

class UserRole(models.Model):
    user_id = models.ForeignKey('User', related_name='user_id_role', on_delete=models.CASCADE)
    role_id = models.ForeignKey('Role', on_delete=models.CASCADE)
    added_by = models.ForeignKey('User', related_name='added_user_roles', null=True,blank=True, on_delete=models.CASCADE)
    updated_by = models.ForeignKey('User', related_name='updated_Userroles', null=True, on_delete=models.CASCADE,blank=True)

    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)
        
        if created:
            action = 'C'
            AuditLog.objects.create(action=action, user=self.added_by, content_object=self)

    def __str__(self):
        return f"{self.user_id.username} - {self.role_id.name}"  # Show username and role

@receiver(pre_save, sender=UserRole)
def set_added_by_and_updated_by(sender, instance, **kwargs):
    user = get_user_model().objects.get(id=instance.added_by.id) if instance.added_by else None
    if user:
        if not instance.pk:
            instance.added_by = user
        else:
            instance.updated_by = user



class UserPermission(models.Model):
    user_id = models.ForeignKey('User', related_name='user_id_rolepermission', null=True, on_delete=models.CASCADE)
    permission_id = models.ManyToManyField('Permission', related_name='user_permissions')
    added_by = models.ForeignKey('User', related_name='added_user_permissions', null=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)
        action = 'C' if created else 'U'
        AuditLog.objects.create(action=action, user=self.added_by, content_object=self)

    def __str__(self) -> str:
        return f"{self.user_id}"


class Role(models.Model):
    name = models.CharField(max_length=45)
    permission_id = models.ManyToManyField('Permission', related_name='role_permissions_Role')  # Remove on_delete argument
    sector_id = models.ForeignKey('Sector', related_name='sector_name', on_delete=models.CASCADE, null=True,blank=True)
    monitoring_id = models.ForeignKey('Monitoring', related_name='monitoring_name', on_delete=models.CASCADE, null=True,blank=True)
    division_id = models.ForeignKey('Division', related_name='division_name', on_delete=models.CASCADE, null=True,blank=True)
    added_by = models.ForeignKey('User', related_name='added_roles', null=True, on_delete=models.CASCADE,blank=True)
    updated_by = models.ForeignKey('User', related_name='updated_roles', null=True, on_delete=models.CASCADE,blank=True)

    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)
        action = 'C' if created else 'U'
        AuditLog.objects.create(action=action, user=self.added_by, content_object=self)


    def __str__(self):
        return f"{self.id}-{self.name}" 
    
 
@receiver(pre_save, sender=Role)
def set_added_by_and_updated_by(sender, instance, **kwargs):
    if not instance.pk:  # If it's a new object being created
        user = instance.added_by
        if user:
            if not instance.sector_id:
                instance.sector_id = user.sector_id
            if not instance.monitoring_id:
                instance.monitoring_id = user.monitoring_id
            if not instance.division_id:
                instance.division_id = user.division_id
    else:  # If it's an existing object being updated
        user = instance.updated_by

class RolePermission(models.Model):
    role_id = models.ForeignKey('Role', on_delete=models.CASCADE)
    permission_id = models.ManyToManyField('Permission', related_name='permission_ids')  # Remove on_delete argument
    added_by = models.ForeignKey('User', related_name='added_role_permissions', null=True, on_delete=models.CASCADE)

class Permission(models.Model):
    name = models.CharField(max_length=45)
    grouped_id = models.ForeignKey('PermissionGroup',null=True, blank = True, on_delete=models.CASCADE)
    added_by = models.ForeignKey('User', related_name='added_permissions', null=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)
        action = 'C' if created else 'U'
        AuditLog.objects.create(action=action, user=self.added_by, content_object=self)

    def __str__(self):
        return self.grouped_id.name if self.grouped_id else ""
    def __str__(self):
        return self.name

class PermissionGroup(models.Model):

    order_num = models.CharField(max_length=45, blank=True)
    permissions = models.ManyToManyField('Permission', blank=True)
    name = models.CharField(max_length=45)
    added_by = models.ForeignKey('User', related_name='added_permission_groups', null=True, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name