from django.contrib import admin
from roleApp.models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import *  # Import your custom User model
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

#admin.site.register(User, UserAdmin)
admin.site.register(Sector)
admin.site.register(Monitoring)
admin.site.register(Division)
admin.site.register(SectorReminder)
admin.site.register(DivisionReminder)

# Custom UserAdmin forms to include custom fields
class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = '__all__'  # Include all fields

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username',)  # Add your custom fields here if needed for creation

# Custom UserAdmin
class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ('username', 'email', 'is_staff', 'role')  # Add custom fields here
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'monitoring_id', 'sector_id', 'division_id', 'is_superadmin', 'is_admin', 'is_user','added_by', 'is_deleted', 'status', 'photo')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )
    #exclude = ['last_seen']
# Register your models here
admin.site.register(User, UserAdmin)
admin.site.unregister(Group)  # Optional: remove Group model if not used

admin.site.register(Role)
#admin.site.register(PermissionGroup)
admin.site.register(UserRole)
#admin.site.register(RolePermission)
admin.site.register(UserPermission)
admin.site.register(Permission)
