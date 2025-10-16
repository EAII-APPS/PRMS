
from django.contrib import admin
from django.urls import path, include  # Import include
from .views import *
urlpatterns = [

    path('api-auth/', include('rest_framework.urls')),
     # URLs for Role views
    path('roles/', RoleListCreateView.as_view(), name='role-list'),
    path('roles/<int:pk>/', RoleRetrieveUpdateDestroyView.as_view(), name='role-detail'),

    # URLs for Permission views
    path('permissions/', PermissionListCreateView.as_view(), name='permission-list'),
    path('permissions/<int:pk>/', PermissionRetrieveUpdateDestroyView.as_view(), name='permission-detail'),

    # URLs for PermissionGroup views
    path('permission-groups/', PermissionGroupListCreateView.as_view(), name='permission-group-list'),
    path('permission-groups/<int:pk>/', PermissionGroupRetrieveUpdateDestroyView.as_view(), name='permission-group-detail'),

    # URLs for UserRole views
    path('user-roles/', UserRoleListCreateView.as_view(), name='user-role-list'),
    path('user-roles/<int:pk>/', UserRoleRetrieveUpdateDestroyView.as_view(), name='user-role-detail'),

    # URLs for RolePermission views
    path('role-permissions/', RolePermissionListCreateView.as_view(), name='role-permission-list'),
    path('role-permissions/<int:pk>/', RolePermissionRetrieveUpdateDestroyView.as_view(), name='role-permission-detail'),

    # URLs for UserPermission views
    path('user-permissions/', UserPermissionListCreateView.as_view(), name='user-permission-list'),
    path('user-permissions/<int:pk>/', UserPermissionRetrieveUpdateDestroyView.as_view(), name='user-permission-detail'),

]
