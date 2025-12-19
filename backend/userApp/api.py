from rest_framework import viewsets,permissions,status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import *
from django.contrib.auth.models import Group
from rest_framework.decorators import action
from .models import *
from roleApp.models import *
import re
from collections import defaultdict
from django.db.models import F
from django.db.models import Q
from comApp.models import ChatRoom
from django.shortcuts import get_object_or_404

User = get_user_model()  # Get the user model

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override to exclude users marked as 'is_deleted'.
        """
        user_sector_id = self.request.user.sector_id
        user_monitoring_id = self.request.user.monitoring_id
        user_division_id = self.request.user.division_id
        print("User sector ID:", user_sector_id)  # Updated print statement for clarity
        # if self.request.user.id:
        #     return User.objects.filter(id=self.request.user.id)
        if user_sector_id:
            
            admin_division_ids = Division.objects.filter(sector_id=user_sector_id.id).distinct().values_list('id', flat=True)
            
            if admin_division_ids:
                return User.objects.filter(
                    Q(sector_id=user_sector_id, division_id= None) | Q(division_id__in=admin_division_ids, is_admin=True, sector_id=None)
                )
            else:
                return User.objects.filter(is_deleted=False, sector_id=user_sector_id)
        elif user_monitoring_id:
            return User.objects.filter(is_deleted=False, monitoring_id=user_monitoring_id)
        elif user_division_id:   
            return User.objects.filter(is_deleted=False, division_id=user_division_id)
        elif self.request.user.is_superuser:
            return User.objects.filter(is_deleted=False)
        else:
            return User.objects.none()
        

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def chat_user(self, request):
        logged_in_user = self.request.user

        # Get the chat rooms that the logged-in user is a member of
        chatrooms = ChatRoom.objects.filter(member=logged_in_user)

        # Get the users who are members of those chat rooms, excluding the logged-in user
        excluded_user_ids = User.objects.filter(chatroom__in=chatrooms).exclude(id=logged_in_user.id).values_list('id', flat=True)

        # Get the users who are not deleted and do not have a chat room with the logged-in user
        users_to_include = User.objects.filter(is_deleted=False).exclude(id__in=excluded_user_ids).exclude(id=logged_in_user.id)

        # Serialize the queryset
        serializer = UserSerializer(users_to_include, many=True)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_profile(self, request):
        try:
            user = request.user.id
            user_data = User.objects.get(id=user)

            # Get user permissions
            user_permissions_instances = UserPermission.objects.filter(user_id=user)
            permissions_dict = []
            for user_permission in user_permissions_instances:
                for permission in user_permission.permission_id.all():
                    permissions_dict.append(permission.name)

            # ---- FIX: safely handle user roles ----
            user_role_instance = UserRole.objects.filter(user_id=user).first()

            if user_role_instance:
                userRoles = user_role_instance.role_id.name
            else:
                userRoles = None  # or "No Role Assigned"

            # Serialize user profile data
            profile_data = self.get_serializer(user_data).data

            profile_data['userRole'] = userRoles
            profile_data['userPermissions'] = permissions_dict

            return Response(profile_data)

        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        def perform_create(self, serializer):

            
            user = serializer.save(added_by=self.request.user)
            role_permissions = user.role.permission_id.all()
            user_roles = UserRole.objects.create(user_id=user, role_id=user.role)

            # user_permission = UserPermission.objects.create(user_id=user, added_by=self.request.user, permission_id.set(role_permissions))
            user_permission = UserPermission.objects.create(user_id=user, added_by=self.request.user)
            user_permission.permission_id.set(role_permissions)
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            

        def perform_update(self, serializer):
            serializer.save(updated_by=self.request.user, status_changed_by=self.request.user)

        def destroy(self, request, *args, **kwargs):
            instance = self.get_object()
            instance.delete()
            # instance.deleted_by = request.user
            # instance.is_deleted = True  # Mark as deleted rather than removing
            # instance.save()

            # Optionally, you could also return a custom message or data
            return Response({"message": "User marked as deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class MonitoringViewSet(viewsets.ModelViewSet):
    queryset = Monitoring.objects.all()
    serializer_class = MonitoringSerializer
    permission_classes = [permissions.IsAuthenticated]  # Adjusted permission
    
    def get_queryset(self):
        """
        Override to exclude monitor marked as 'is_deleted'.
        """
        return Monitoring.objects.filter(is_deleted=False, added_by=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user, status_changed_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        # instance.deleted_by = request.user
        # instance.is_deleted = True  # Mark as deleted rather than removing
        # instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SectorViewSet(viewsets.ModelViewSet):
    queryset = Sector.objects.all()
    permission_classes = [permissions.IsAuthenticated]  # Consider adjusting permissions as needed
    serializer_class = SectorSerializer

    def get_queryset(self):
        """
        Override to exclude sector marked as 'is_deleted'.
        """
        if self.request.user.monitoring_id:
            return Sector.objects.filter(is_deleted=False)
        else:
            return Sector.objects.filter(is_deleted=False, added_by=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user, status_changed_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        # instance.deleted_by = request.user
        # instance.is_deleted = True  # Mark as deleted rather than removing
        # instance.save()
        # Soft delete all divisions under this sector
        divisions = Division.objects.filter(sector=instance)
        for division in divisions:
            division.deleted_by = request.user
            division.is_deleted = True
            division.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.filter(sector__is_deleted=False)  # Assuming you want to filter by sector
    permission_classes = [permissions.IsAuthenticated]  # Consider adjusting permissions as needed
    serializer_class = DivisionSerializer

    def get_queryset(self):
        """
        Override to exclude sector marked as 'is_deleted'.
        """
        if self.request.user.monitoring_id:
            return Division.objects.filter(is_deleted=False)
        elif self.request.user.is_superuser:
            return Division.objects.filter(is_deleted=False)
        else:
            return Division.objects.filter(is_deleted=False, sector_id=self.request.user.sector_id)
        
    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user, status_changed_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        # instance.deleted_by = request.user
        # instance.is_deleted = True  # Mark as deleted rather than removing
        # instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

'''
class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get', 'delete'])
    def latest(self, request):
        try:
            latest_reminder = Reminder.objects.latest('id')
            
        except Reminder.DoesNotExist:
            return Response(status=404)

        if request.method == 'GET':
                serializer = self.get_serializer(latest_reminder)
                print(serializer.data, 'lllllllllll')
                return Response(serializer.data)
            
        elif request.method == 'DELETE':
            latest_reminder.delete()
            return Response(status=204)
        
    def create(self, request, *args, **kwargs):
            
        # Delete all existing reminders
        Reminder.objects.filter(added_by=self.request.user).delete()
        # Create a new reminder
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(added_by=request.user)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
'''

class SectorReminderViewSet(viewsets.ModelViewSet):
    queryset = SectorReminder.objects.all()
    serializer_class = SectorReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SectorReminder.objects.all().order_by('-id')[:1]

    def perform_create(self, serializer):
        SectorReminder.objects.all().delete()
        serializer.save(added_by=self.request.user)

    @action(detail=False, methods=['delete'], url_path='latest')
    def delete_latest(self, request):
        latest_reminder = SectorReminder.objects.filter(added_by=self.request.user).latest('id')
        latest_reminder.delete()
        return Response(status=204)

class DivisionReminderViewSet(viewsets.ModelViewSet):
    queryset = DivisionReminder.objects.all()
    serializer_class = DivisionReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # DivisionReminder.objects.filter(added_by=self.request.user)
        return DivisionReminder.objects.all().order_by('-id')[:1]

    def perform_create(self, serializer):
        DivisionReminder.objects.all().delete()
        serializer.save(added_by=self.request.user)

    @action(detail=False, methods=['delete'], url_path='latest')
    def delete_latest(self, request):
        latest_reminder = DivisionReminder.objects.filter(added_by=self.request.user).latest('id')
        latest_reminder.delete()
        return Response(status=204)
   