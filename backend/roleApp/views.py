from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from userApp.models import Role, PermissionGroup, UserRole, RolePermission, UserPermission,Permission
from .serializers import RoleSerializer, PermissionSerializer, PermissionGroupSerializer, UserRoleSerializer, RolePermissionSerializer, UserPermissionSerializer
from django.contrib.auth.models import Group
from django.dispatch import Signal
from django.contrib.auth import get_user_model
import re
from collections import defaultdict


# Views for Role CRUD operations
class RoleListCreateView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {'user': self.request.user}


    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    def get(self, request, *args, **kwargs):
        # Filter UserRole queryset by added_by field
        queryset = self.queryset.filter(added_by=self.request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RoleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

    def update(self, request, *args, **kwargs):
        print("Update method called")  # Debugging statement
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # After updating the Role, update the related UserPermissions
        role = instance
        new_permissions = serializer.validated_data.get('permission_id', [])

        # Get all UserRole instances associated with the updated Role
        user_roles = UserRole.objects.filter(role_id=role.id)

        # Iterate through each UserRole and update the related UserPermission instances
        for user_role in user_roles:
            user = user_role.user_id
            user_permissions = UserPermission.objects.filter(user_id=user)

            for user_permission in user_permissions:
                # Update the permissions for the user
                user_permission.permission_id.set(new_permissions)

        return Response(serializer.data)
    
    
# Views for Permission CRUD operations
class PermissionListCreateView(generics.ListCreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes =[IsAuthenticated]

    def get(self, request):
        """
        Returns the profile information of the authenticated user along with their permissions.
        """
        try:
            user = request.user
            user_permissions_instances = UserPermission.objects.filter(user_id=user)
            permissions_dict = defaultdict(list)
            added_permissions = set()

            for user_permission in user_permissions_instances:
                for permission in user_permission.permission_id.all():
                    permission_name = permission.name
                    permission_id =permission.id
                    if permission_name not in added_permissions:
                        split_names = re.findall('[A-Z][^A-Z]*', permission_name)
                        key = split_names[-1]  
                        permissions_dict[key].append({"name": permission_name,"id": permission_id})
                        added_permissions.add(permission_name)
            #queryset = self.queryset.filter(added_by=self.request.user)
            #serializer = self.serializer_class(queryset, many=True)
            return Response(permissions_dict, status=status.HTTP_200_OK)
        except:
            pass


    
class PermissionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


# Views for PermissionGroup CRUD operations
class PermissionGroupListCreateView(generics.ListCreateAPIView):
    queryset = PermissionGroup.objects.all()
    serializer_class = PermissionGroupSerializer

class PermissionGroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PermissionGroup.objects.all()
    serializer_class = PermissionGroupSerializer

# Views for UserRole CRUD operations
class UserRoleListCreateView(generics.ListCreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class UserRoleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer

# Views for RolePermission CRUD operations
class RolePermissionListCreateView(generics.ListCreateAPIView):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer

    def perform_create(self, serializer):   
        serializer.save(added_by=self.request.user)

    def post(self, request, *args, **kwargs):
        serializer = RolePermissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RolePermissionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer

# Views for UserPermission CRUD operations
class UserPermissionListCreateView(generics.ListCreateAPIView):
    queryset = UserPermission.objects.all()
    serializer_class = UserPermissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Exclude the 'added_by' field when creating a new UserPermission instance
        serializer.save()



class UserPermissionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserPermission.objects.all()
    serializer_class = UserPermissionSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)