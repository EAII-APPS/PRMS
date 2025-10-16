# permission_seeder.py

import datetime
from django.core.management.base import BaseCommand
from userApp.models import Permission


class Command(BaseCommand):
    help = "Seed data for permissions"

    def handle(self, *args, **kwargs):
        # Define seed data for permissions
        permissions_data = [
            {"id":1,"name": "createUser"},
            {"id":2,"name": "readUser"},
            {"id":3,"name": "updateUser"},
            {"id":4,"name": "deleteUser"},
            {"id":5,"name": "createRole"},
            {"id":6,"name": "readRole"},
            {"id":7,"name": "updateRole"},
            {"id":8,"name": "deleteRole"},
            {"id":9,"name": "createSummmary"},
            {"id":10,"name": "readSummmary"},
            {"id":11,"name": "updateSummmary"},
            {"id":12,"name": "deleteSummmary"},
            {"id":13,"name": "createDivision"},
            {"id":14,"name": "readDivision"},
            {"id":15,"name": "updateDivision"},
            {"id":16,"name": "deleteDivision"},
            {"id":17,"name": "createKpi"},
            {"id":18,"name": "readKpi"},
            {"id":19,"name": "updateKpi"},
            {"id":20,"name": "deleteKpi"},
            {"id":21,"name": "createMainActivity"},
            {"id":22,"name": "readMainActivity"},
            {"id":23,"name": "updateMainActivity"},
            {"id":24,"name": "deleteMainActivity"},
            {"id":25,"name": "createStrategicGoal"},
            {"id":26,"name": "readStrategicGoal"},
            {"id":27,"name": "updateStrategicGoal"},
            {"id":28,"name": "deleteStrategicGoal"},
            {"id":29,"name": "createKpiDescription"},
            {"id":30,"name": "readKpiDescription"},
            {"id":31,"name": "updateKpiDescription"},
            {"id":32,"name": "deleteKpiDescription"},
            {"id":33,"name": "createMeasure"},
            {"id":34,"name": "readMeasure"},
            {"id":35,"name": "updateMeasure"},
            {"id":36,"name": "deleteMeasure"},
            {"id":37,"name": "createMonitoring"},
            {"id":38,"name": "readMonitoring"},
            {"id":39,"name": "updateMonitoring"},
            {"id":40,"name": "deleteMonitoring"},
            {"id":41,"name": "createSector"},
            {"id":42,"name": "readSector"},
            {"id":43,"name": "updateSector"},
            {"id":44,"name": "deleteSector"},
            {"id":45,"name": "createAdmin"},
            {"id":46,"name": "readAdmin"},
            {"id":47,"name": "updateAdmin"},
            {"id":48,"name": "deleteAdmin"},
            {"id":49,"name": "createSetting"},
            {"id":50,"name": "readSetting"},
            {"id":51,"name": "updateSetting"},
            {"id":52,"name": "deleteSetting"},
            {"id":53,"name": "createAssign"},
            {"id":54,"name": "readAssign"},
            {"id":55,"name": "updateAssign"},
            {"id":56,"name": "deleteAssign"},
            {"id":57,"name": "createAssignMain"},
            {"id":58,"name": "readAssignMain"},
            {"id":59,"name": "updateAssignMain"},
            {"id":60,"name": "deleteAssignMain"},
            {"id":61,"name": "createKpiTrack"},
            {"id":62,"name": "readKpiTrack"},
            {"id":63,"name": "updateKpiTrack"},
            {"id":64,"name": "deleteKpiTrack"},
        ]
        for data in permissions_data:
            permission = Permission.objects.create(**data)
            self.stdout.write(
                self.style.SUCCESS(f"Permission created: {permission.name}")
            )
