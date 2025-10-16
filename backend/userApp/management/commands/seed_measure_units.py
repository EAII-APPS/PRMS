from django.core.management.base import BaseCommand
from reportApp.models import Measure, Unit

class Command(BaseCommand):
    help = "Seed the database with measures and units"

    def handle(self, *args, **kwargs):
        # List of measures and their corresponding units
        measures = [
            {
                "name": "በመጠን",  # Data Size
                "units": [
                    {"name": "Byte", "symbol": "B", "conversionFactor": "0.000000000931322575", "isBaseUnit": False},
                    {"name": "Kilobyte", "symbol": "KB", "conversionFactor": "0.00000095367431640625", "isBaseUnit": False},
                    {"name": "Megabyte", "symbol": "MB", "conversionFactor": "0.0009765625", "isBaseUnit": False},
                    {"name": "Gigabyte", "symbol": "GB", "conversionFactor": "1", "isBaseUnit": True},  # Base Unit
                    {"name": "Terabyte", "symbol": "TB", "conversionFactor": "1024", "isBaseUnit": False},
                    {"name": "Petabyte", "symbol": "PB", "conversionFactor": "1048576", "isBaseUnit": False},
                ],

            },
            {
                "name": "በሰአት",  # Time
                "units": [
                {"name": "Millisecond", "symbol": "ms", "conversionFactor": "0.0000002777777778", "isBaseUnit": False},
                {"name": "Second", "symbol": "s", "conversionFactor": "0.0002777778", "isBaseUnit": False},
                {"name": "Minute", "symbol": "min", "conversionFactor": "0.0166666667", "isBaseUnit": False},
                {"name": "Hour", "symbol": "h", "conversionFactor": "1", "isBaseUnit": True}  # Base Unit
                ]

            },
            {
                "name": "በመቶኛ",  # Percentage
                "units": [
                    {"name": "Percentage", "symbol": "%", "conversionFactor": "1", "isBaseUnit": True},
                ],
            },
            {
                "name": "በብር",  # Money
                "units": [
                    {"name": "Birr", "symbol": "Birr", "conversionFactor": "1", "isBaseUnit": True},
                ],
            },
        ]

        for measure_data in measures:
            # Create or get the measure
            measure, created = Measure.objects.get_or_create(name=measure_data["name"])
            if created:
                self.stdout.write(f"Created Measure: {measure.name}")
            else:
                self.stdout.write(f"Measure already exists: {measure.name}")

            # Create or get units for this measure
            for unit_data in measure_data["units"]:
                unit, unit_created = Unit.objects.get_or_create(
                    name=unit_data["name"],
                    measure_id=measure,
                    defaults={
                        "symbol": unit_data["symbol"],
                        "conversionFactor": unit_data["conversionFactor"],
                        "isBaseUnit": unit_data["isBaseUnit"],
                    },
                )
                if unit_created:
                    self.stdout.write(f"  Created Unit: {unit.name} ({unit.symbol}) for Measure: {measure.name}")
                else:
                    self.stdout.write(f"  Unit already exists: {unit.name} ({unit.symbol}) for Measure: {measure.name}")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully."))
