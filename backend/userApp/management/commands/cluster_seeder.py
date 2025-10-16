from django.core.management.base import BaseCommand
from userApp.models import Sector, Division, Monitoring, User
from django.db import transaction

class Command(BaseCommand):
    help = 'Seed initial data'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        super_admin_user = User.objects.get(id=1)

        # Define sectors and divisions in a dictionary
        sectors_with_divisions = {
            "Administration Sector": [
                ("Finance", "933124515", "finance@gmail.com"),
                ("Buying and Supply", "955124515", "buyer@gmail.com"),
                ("Inventory", "933222115", "inventory@gmail.com"),
                ("Contract", "955112115", "contract@gmail.com"),
                ("Plan and monitoring", "955112115", "plan@gmail.com")
            ],
            "Research Sector": [
                ("SID", "9232188151", "sid@gmail.com"),
                ("Robotics", "921345615", "robotics@gmail.com"),
                ("NLP", "921345615", "nlp@gmail.com"),
                ("Startup", "921345615", "startup@gmail.com"),
                ("Machine Learning", "921345615", "ml@gmail.com"),
                ("Computer Vision", "921345615", "cv@gmail.com"),
                ("Support", "921345615", "support@gmail.com")
            ],
            "Data Sector": [
            ],
            "General Director Sector": [
                ("Data Center", "9232225151", "center@gmail.com"),
                ("Communication", "955122115", "communication@gmail.com"),
                ("Safe City", "933112115", "safecity@gmail.com"),
                ("Law", "922112115", "law@gmail.com"),
                ("Women and Social Works", "944221115", "women@gmail.com"),
                ("Anti Corruption", "911112115", "anticorruption@gmail.com"),
                ("Human Resources", "933112115", "resource@gmail.com"),
                ("Audit", "944112115", "audit@gmail.com"),
                ("Institutional Safety", "922112115", "safety@gmail.com"),
                ("Stakeholders", "933114515", "stakeholders@gmail.com")
            ]
        }

        # Loop through the dictionary and create sectors and divisions
        for sector_name, divisions in sectors_with_divisions.items():
            sector, _ = Sector.objects.get_or_create(
                name=sector_name,
                defaults={
                    "phone_no": "911111111",  # Generic phone and email for each sector
                    "email": f"{sector_name.lower().replace(' ', '')}@gmail.com",
                    "status": True,
                    "is_deleted": False,
                    "added_by": super_admin_user,
                    "updated_by": super_admin_user,
                    "status_changed_by": super_admin_user,
                }
            )
            for division_name, phone_no, email in divisions:
                Division.objects.get_or_create(
                    name=division_name,
                    defaults={
                        "phone_no": phone_no,
                        "email": email,
                        "status": True,
                        "is_deleted": False,
                        "added_by": super_admin_user,
                        "sector": sector
                    }
                )

        # Create standalone Monitoring
        Monitoring.objects.get_or_create(
            name="Monitoring",
            defaults={
                "phone_no": "923265122",
                "email": "monitoring@gmail.com",
                "status": True,
                "is_deleted": False,
                "added_by": super_admin_user,
            }
        )

        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully'))
