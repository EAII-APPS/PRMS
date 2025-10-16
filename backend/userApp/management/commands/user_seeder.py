from django.core.management.base import BaseCommand
from userApp.models import User, Role,UserRole, Permission, Monitoring, Sector, Division, UserPermission
from django.contrib.auth.hashers import make_password
from django.db import transaction

class Command(BaseCommand):
    help = 'Seed initial data'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        super_admin_user = User.objects.get(id=1)
        monitoring_instance = Monitoring.objects.get(id=1)
        
        sectors = {
            'Research Sector': Sector.objects.get(id=2),
            'Data': Sector.objects.get(id=3),
            'Administration Sector': Sector.objects.get(id=1),
            'General Director': Sector.objects.get(id=4)
        }

        divisions = {
            'SID': Division.objects.get_or_create(name='SID')[0],
            'Machine Learning': Division.objects.get_or_create(name='Machine Learning')[0],
            'Data Center': Division.objects.get_or_create(name='Data Center')[0],
            'Finance': Division.objects.get_or_create(name='Finance')[0],
            'Buying and Supply': Division.objects.get_or_create(name='Buying and Supply')[0],
            'Communication': Division.objects.get_or_create(name='Communication')[0],
            'Human Resources': Division.objects.get_or_create(name='Human Resources')[0],
            'Inventory': Division.objects.get_or_create(name='Inventory')[0],
            'Contract': Division.objects.get_or_create(name='Contract')[0],
            'Robotics': Division.objects.get_or_create(name='Robotics')[0],
            'NLP': Division.objects.get_or_create(name='NLP')[0],
            'Startup': Division.objects.get_or_create(name='Startup')[0],
            'Support': Division.objects.get_or_create(name='Support')[0],
            'Computer Vision': Division.objects.get_or_create(name='Computer Vision')[0],
            'Safe City': Division.objects.get_or_create(name='Safe City')[0],
            'Law': Division.objects.get_or_create(name='Law')[0],
            'Women and Social Works': Division.objects.get_or_create(name='Women and Social Works')[0],
            'Anti Corruption': Division.objects.get_or_create(name='Anti Corruption')[0],
            'Audit': Division.objects.get_or_create(name='Audit')[0],
            'Institutional Safety': Division.objects.get_or_create(name='Institutional Safety')[0],
            'Stakeholders': Division.objects.get_or_create(name='Stakeholders')[0],
            'Plan and monitoring': Division.objects.get_or_create(name='Plan and monitoring')[0]
        }

        # Permissions for different roles
        all_permissions = set(Permission.objects.all())
        monitoring_exclusions = {13, 14, 15, 16, 29, 30, 31, 32, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52}
        sector_exclusions = {25, 27, 28, 36, 37, 38, 39, 40, 41, 42, 43, 44, 49, 50, 51, 52, 53, 54, 55, 56}
        division_exclusions = {13, 14, 15, 16, 21, 23, 24, 25, 27, 28, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64}

        monitoring_permissions = all_permissions - set(Permission.objects.filter(id__in=monitoring_exclusions))
        sector_permissions = all_permissions - set(Permission.objects.filter(id__in=sector_exclusions))
        division_permissions = all_permissions - set(Permission.objects.filter(id__in=division_exclusions))

        # Define roles
        roles_data = [
            {'id': 2, 'name': 'Monitoring Admin', 'monitoring': monitoring_instance, 'sector': None, 'division': None, 'permissions': monitoring_permissions},
            {'id': 3, 'name': 'Research Sector Admin', 'monitoring': None, 'sector': sectors['Research Sector'], 'division': None, 'permissions': sector_permissions},
            {'id': 4, 'name': 'Data Sector Admin', 'monitoring': None, 'sector': sectors['Data'], 'division': None, 'permissions': sector_permissions},
            {'id': 5, 'name': 'Administration Sector Admin', 'monitoring': None, 'sector': sectors['Administration Sector'], 'division': None, 'permissions': sector_permissions},
            {'id': 6, 'name': 'General Director Sector Admin', 'monitoring': None, 'sector': sectors['General Director'], 'division': None, 'permissions': sector_permissions},
            {'id': 7, 'name': 'Administration Division Admin', 'monitoring': None, 'sector': None, 'division': divisions['Finance'], 'permissions': division_permissions},
            {'id': 8, 'name': 'Research Division Admin', 'monitoring': None, 'sector': None, 'division': divisions['SID'], 'permissions': division_permissions},
            {'id': 9, 'name': 'General Director Division Admin', 'monitoring': None, 'sector': None, 'division': divisions['Data Center'], 'permissions': division_permissions}
        ]

        for role_data in roles_data:
            role, _ = Role.objects.get_or_create(
                id=role_data['id'],
                defaults={
                    'name': role_data['name'],
                    'monitoring_id': role_data['monitoring'],
                    'sector_id': role_data['sector'],
                    'division_id': role_data['division'],
                    'added_by': super_admin_user
                }
            )
            role.permission_id.add(*role_data['permissions'])

        hashed_password = make_password('123456789')
        # Define users
        users_data = [
            # Administration Sector
            {'username': 'yitagesu@gmail.com', 'first_name': 'Yitagesu', 'last_name': 'Desalegn', 'phone': '0911334547', 'gender': 'male', 'email': 'yitagesu@gmail.com', 'role_id': 5, 'is_admin': True, 'sector_id': sectors['Administration Sector']},
            {'username': 'megerso@gmail.com', 'first_name': 'Megerso', 'last_name': 'Kumbi', 'phone': '0912345678', 'gender': 'male', 'email': 'megerso@gmail.com', 'role_id': 7, 'is_admin': True, 'division_id': divisions['Finance']},
            {'username': 'solomon@gmail.com', 'first_name': 'Solomon', 'last_name': 'Tilahun', 'phone': '0912345679', 'gender': 'male', 'email': 'solomon@gmail.com', 'role_id': 7, 'is_admin': True, 'division_id': divisions['Buying and Supply']},
            {'username': 'mohamed@gmail.com', 'first_name': 'Mohamed', 'last_name': 'Kedir', 'phone': '0912345680', 'gender': 'male', 'email': 'mohamed@gmail.com', 'role_id': 7, 'is_admin': True, 'division_id': divisions['Inventory']},
            {'username': 'lemlem@gmail.com', 'first_name': 'Lemlem', 'last_name': 'Mulatu', 'phone': '0912345681', 'gender': 'female', 'email': 'lemlem@gmail.com', 'role_id': 7, 'is_admin': True, 'division_id': divisions['Contract']},
            {'username': 'tigistzeleke@gmail.com', 'first_name': 'Tigist', 'last_name': 'Zeleke', 'phone': '0912345681', 'gender': 'female', 'email': 'tigistzeleke@gmail.com', 'role_id': 7, 'is_admin': True, 'division_id': divisions['Plan and monitoring']},
            # Monitoring
            {'username': 'tigist@gmail.com', 'first_name': 'Tigist', 'last_name': 'Zeleke', 'phone': '0912333667', 'gender': 'female', 'email': 'tigist@gmail.com', 'role_id': 2, 'is_admin': True, 'monitoring_id': monitoring_instance},
            
            # Research Sector
            {'username': 'taye@gmail.com', 'first_name': 'Taye', 'last_name': 'Girma', 'phone': '0912366667', 'gender': 'male', 'email': 'taye@gmail.com', 'role_id': 3, 'is_admin': True, 'sector_id': sectors['Research Sector']},
            {'username': 'mamo@gmail.com', 'first_name': 'Mamo', 'last_name': 'Mekonen', 'phone': '0912345682', 'gender': 'male', 'email': 'mamo@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['SID']},
            {'username': 'ashenafi@gmail.com', 'first_name': 'Ashenafi', 'last_name': 'Bekele', 'phone': '0911994547', 'gender': 'male', 'email': 'ashenafi@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['Robotics']},
            {'username': 'samuel@gmail.com', 'first_name': 'Samuel', 'last_name': 'Rahmeto', 'phone': '0912345683', 'gender': 'male', 'email': 'samuel@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['NLP']},
            {'username': 'yodit@gmail.com', 'first_name': 'Yodit', 'last_name': 'Mola', 'phone': '0912345684', 'gender': 'female', 'email': 'yodit@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['Startup']},
            {'username': 'sentayehu@gmail.com', 'first_name': 'Sentayehu', 'last_name': 'Zekarias', 'phone': '0912345685', 'gender': 'male', 'email': 'sentayehu@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['Machine Learning']},
            {'username': 'yehualashet@gmail.com', 'first_name': 'Yehualashet', 'last_name': 'Megerso', 'phone': '0912345686', 'gender': 'male', 'email': 'yehualashet@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['Computer Vision']},
            {'username': 'hiwot@gmail.com', 'first_name': 'Hiwot', 'last_name': 'Hiwot', 'phone': '0912345687', 'gender': 'female', 'email': 'hiwot@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['Support']},

            # Data Sector
            {'username': 'biniam@gmail.com', 'first_name': 'Biniam', 'last_name': 'Endashaw', 'phone': '0912354547', 'gender': 'male', 'email': 'biniam@gmail.com', 'role_id': 4, 'is_admin': True, 'sector_id': sectors['Data']},

            # General Director Sector
            {'username': 'kebede@gmail.com', 'first_name': 'Kebede', 'last_name': 'Tolosa', 'phone': '912345688', 'gender': 'male', 'email': 'kebede@gmail.com', 'role_id': 6, 'is_admin': True, 'sector_id': sectors['General Director']},
            {'username': 'tesfaye@gmail.com', 'first_name': 'Tesfaye', 'last_name': 'Zewde', 'phone': '912345689', 'gender': 'male', 'email': 'tesfaye@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Communication']},
            {'username': 'endalkachew@gmail.com', 'first_name': 'Endalkachew', 'last_name': 'Girsah', 'phone': '912345690', 'gender': 'male', 'email': 'endalkachew@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Data Center']},
            {'username': 'zerihun@gmail.com', 'first_name': 'Zerihun', 'last_name': 'Tola', 'phone': '912345691', 'gender': 'male', 'email': 'zerihun@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Safe City']},
            {'username': 'hana@gmail.com', 'first_name': 'Hana', 'last_name': 'Teshome', 'phone': '912345692', 'gender': 'female', 'email': 'hana@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Law']},
            {'username': 'tsige@gmail.com', 'first_name': 'Tsige', 'last_name': 'Dessie', 'phone': '912345693', 'gender': 'female', 'email': 'tsige@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Women and Social Works']},
            {'username': 'fikadu@gmail.com', 'first_name': 'Fikadu', 'last_name': 'Bedada', 'phone': '912345694', 'gender': 'male', 'email': 'fikadu@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Anti Corruption']},
            {'username': 'yigremachew@gmail.com', 'first_name': 'Yigremachew', 'last_name': 'Getu', 'phone': '912345695', 'gender': 'male', 'email': 'yigremachew@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Human Resources']},
            {'username': 'ajema@gmail.com', 'first_name': 'Ajema', 'last_name': 'Leta', 'phone': '912345696', 'gender': 'male', 'email': 'ajema@gmail.com', 'role_id': 9, 'is_admin': True, 'division_id': divisions['Audit']},
            # {'username': 'getachew.kide@gmail.com', 'first_name': 'Getachew', 'last_name': 'Kide', 'phone': '0912345697', 'gender': 'male', 'email': 'getachew@gmail.com', 'role_id': 8, 'is_admin': True, 'division_id': divisions['IT']},
        ]


        for user_data in users_data:
            user, _ = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'phone': user_data['phone'],
                    'gender': user_data['gender'],
                    'email': user_data['email'],
                    'password': hashed_password,
                    'role_id': user_data['role_id'],
                    'is_admin': user_data['is_admin'],
                    'sector_id': user_data.get('sector_id'),
                    'division_id': user_data.get('division_id'),
                    'monitoring_id': user_data.get('monitoring_id')
                }
                
            )
            #Create UserRole
            role_instance = Role.objects.filter(id=user_data['role_id']).first()
            if not role_instance:
                print(f"Role ID {user_data['role_id']} does not exist!")
                continue

            # Create UserRole if it does not exist
            UserRole.objects.get_or_create(user_id=user, role_id=role_instance)

            # Assign permissions based on the user's role
            role_permissions = role_instance.permission_id.all()
            user_permission, _ = UserPermission.objects.get_or_create(user_id=user)
            user_permission.permission_id.set(role_permissions)

        self.stdout.write(self.style.SUCCESS("User and role permissions have been successfully seeded"))