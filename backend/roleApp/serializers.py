from rest_framework import serializers
from userApp.models import Role, PermissionGroup, UserRole, RolePermission, UserPermission, Permission
from userApp.models import User
class RoleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Role
        fields = '__all__'
    
    def perform_create(self, serializer):
        serializer.save(added_by=self.context['request'].user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.context['request'].user)

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

    def perform_create(self, serializer):
        serializer.save(added_by=self.context['request'].user)

class PermissionGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroup
        fields = '__all__'
        print(User.monitoring_id)

    def perform_create(self, serializer):
        
        user = self.context['request'].User.user_id
        serializer.save(added_by=User.user_id)

class UserRoleSerializer(serializers.ModelSerializer):
    added_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UserRole
        fields = ['user_id', 'role_id', 'added_by']

class RolePermissionSerializer(serializers.ModelSerializer):
    permission_names = serializers.SerializerMethodField()

    class Meta:
        model = RolePermission
        fields = ['id', 'role_id', 'permission_id', 'permission_names', 'added_by']

    def get_permission_names(self, obj):
        return [permission.name for permission in obj.permission_id.all()]

    def perform_create(self, serializer):
        serializer.save(added_by=self.context['request'].user)
class UserPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermission
        fields = '__all__'
