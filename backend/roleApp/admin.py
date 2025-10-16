""" from django.contrib import admin
from .models import Role, PermissionGroup, UserRole, RolePermission, UserPermission, Permission

admin.site.register(Role)
admin.site.register(PermissionGroup)
admin.site.register(UserRole)
admin.site.register(RolePermission)
admin.site.register(UserPermission)
admin.site.register(Permission)
 """