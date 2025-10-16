from django.core.management.base import BaseCommand
from userApp.models import User
from userApp.models import Role, UserRole, Permission, UserPermission
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Seed initial data'

    def handle(self, *args, **kwargs):
        # Create Permission
        # Assuming you have a Permission object with id=1 for all permissions
        permissions = Permission.objects.all()

        # Create Role
        role = Role.objects.create(
            id=1,
            name='superadmin',
            sector_id=None,
            monitoring_id=None,
            division_id=None
        )
        role.permission_id.add(*permissions)
        hashed_password = make_password('123456789')
        # Create User
        user = User.objects.create(
            id=1,
            username ='superadmin@gmail.com',
            first_name='Super',
            last_name='Admin',
            phone='0912345667',
            gender='male',
            email='superadmin@gmail.com',
            role=role,
            is_superadmin=True,
            is_staff=True,
            is_admin=True,  
            is_superuser=True,
            password = hashed_password 
        )

        """ user_profile = UserProfile.objects.create(
            user = user,
            first_name = user.first_name,
            last_name = user.last_name,
            email = user.email,
            gender = user.gender,
            phone = user.phone
        ) """

        #Create UserRole
        user_role = UserRole.objects.create(
            user_id=user,
            role_id=role
        )
         
        # user_permission = UserPermission.objects.create()
        # user_permission.user_id = user
        # user_permission.permission_id.add(*permissions)

        role_permissions = user.role.permission_id.all()
        user_permission = UserPermission.objects.create(user_id=user)
        user_permission.permission_id.set(role_permissions)
            
        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully'))



