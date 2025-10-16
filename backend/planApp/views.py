# views.py
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import *
from userApp.models import *
from reportApp.models import *
from .serializers import *
from reportApp.serializer import *
from rest_framework import permissions, status
from django.core.exceptions import ValidationError
from rest_framework.exceptions import APIException
from django.utils.encoding import smart_str  
from django.utils import timezone  
from django.db.models import Q
from collections import defaultdict
from .unit_calculator import validate_annual_plan,validate_three_plan,convert_quarterly_plans_to_base,convert_three_plan_to_base,convert_three_performance_to_base


class MergedThreeYearKPI:
    def __init__(self, data):
        self.kpi_id = data['kpi']
        self.measure_id = Measure.objects.filter(id=data['measure'])
        self.measure = data['measure']
        self.year_one = data['year_one']
        self.year_two = data['year_two']
        self.year_three = data['year_three']
        self.three_year = data['three_year']
        self.initial = data['initial']
        self.year_one_value = data['year_one_value']
        self.year_two_value = data['year_two_value']
        self.year_three_value = data['year_three_value']
        self.year_one_performance = data['year_one_performance']
        self.year_two_performance = data['year_two_performance']
        self.year_three_performance = data['year_three_performance']
        self.year_one_performance_unit = data['year_one_performance_unit']
        self.year_two_performance_unit = data['year_two_performance_unit']
        self.year_three_performance_unit  = data['year_three_performance_unit']
        self.operation = data['operation']
        self.year_one_unit = data['year_one_unit']
        self.year_two_unit = data['year_two_unit']
        self.year_three_unit = data['year_three_unit']
        self.three_year_unit_id = data['three_year_unit_id']
        self.initial_unit_id = data['initial_unit_id']
    @property
    def year_one_unit_id(self):
        return Unit.objects.filter(id=self.year_one_unit).first().id

    @property
    def year_two_unit_id(self):
        return Unit.objects.filter(id=self.year_two_unit).first().id

    @property
    def year_three_unit_id(self):
        return Unit.objects.filter(id=self.year_three_unit).first().id
    @property
    def year_one_performance_unit_id(self):
        unit = Unit.objects.filter(id=self.year_one_performance_unit).first()
        return unit.id if unit else None  # Return None if unit is not found

    @property
    def year_two_performance_unit_id(self):
        unit = Unit.objects.filter(id=self.year_two_performance_unit).first()
        return unit.id if unit else None  # Return None if unit is not found

    @property
    def year_three_performance_unit_id(self):
        unit = Unit.objects.filter(id=self.year_three_performance_unit).first()
        return unit.id if unit else None  # Return None if unit is not found

    @property
    def kpi(self):
        from planApp.models import KPI  # replace `yourapp` with your actual app name
        return KPI.objects.filter(id=self.kpi_id).first()
    
    @property
    def id(self):
        from planApp.models import AnnualKPI  # replace `yourapp` with your actual app name
        return AnnualKPI.objects.filter(kpi=self.kpi_id).first()


def merge_annual_kpis(annual_kpis):
    # Group by kpi, division_id, measure, year, and the additional unit IDs
    grouped_kpis = defaultdict(lambda: {
        'kpi': None,
        'measure': None,
        'year': None,
        'annual': 0,
        'initial': 0,
        'pl1': 0,
        'pl2': 0,
        'pl3': 0,
        'pl4': 0,
        'pr1': 0,
        'pr2': 0,
        'pr3': 0,
        'pr4': 0,
        'weight': 0,
        'operation': None,
        'incremental':False,
        'pl1_unit_id': None,  # Add placeholder for unit IDs to be set after merging
        'pl2_unit_id': None,
        'pl3_unit_id': None,
        'pl4_unit_id': None,
        'annual_unit_id': None,  # For base unit assignment
        'initial_unit_id': None,
        'count': 0  # Initialize count for averaging
    })

    for record in annual_kpis:
        converted_plans, base_unit_id = convert_quarterly_plans_to_base(record)
        # Construct key for grouping
        # Construct key for grouping, now includes sector_id derived from division_id
        key = (
            record.kpi_id,
            record.measure_id,
            record.year
        )

        # Add values to the existing group
        grouped_kpis[key]['kpi'] = record.kpi_id
        grouped_kpis[key]['measure'] = record.measure_id
        grouped_kpis[key]['year'] = record.year
        # Add unit IDs
        grouped_kpis[key]['pl1_unit_id'] = base_unit_id
        grouped_kpis[key]['pl2_unit_id'] = base_unit_id
        grouped_kpis[key]['pl3_unit_id'] = base_unit_id
        grouped_kpis[key]['pl4_unit_id'] = base_unit_id

        # Add the annual and initial values and their units
        grouped_kpis[key]['annual_unit_id'] = base_unit_id
        grouped_kpis[key]['initial_unit_id'] = base_unit_id
        grouped_kpis[key]['weight'] += record.weight or 0
        grouped_kpis[key]['operation'] = record.operation
        grouped_kpis[key]['incremental']=record.incremental
        # Get the operation type
        operation = record.operation
        if operation == 'sum':
            # Merge values (including the converted quarterly plans)
            grouped_kpis[key]['annual'] += record.annual or 0
            grouped_kpis[key]['initial'] += record.initial or 0
            grouped_kpis[key]['pl1'] += converted_plans['pl1'] # Use converted value for the plans
            grouped_kpis[key]['pl2'] += converted_plans['pl2']
            grouped_kpis[key]['pl3'] += converted_plans['pl3']
            grouped_kpis[key]['pl4'] += converted_plans['pl4']
            grouped_kpis[key]['pr1'] += record.pr1 or 0
            grouped_kpis[key]['pr2'] += record.pr2 or 0
            grouped_kpis[key]['pr3'] += record.pr3 or 0
            grouped_kpis[key]['pr4'] += record.pr4 or 0
        elif operation == 'average':
            # Increment the count for averaging
            grouped_kpis[key]['count'] += 1

            # Average the values (including the converted quarterly plans)
            grouped_kpis[key]['annual'] = (
                (grouped_kpis[key]['annual'] * (grouped_kpis[key]['count'] - 1)) + (record.annual or 0)
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['initial'] = (
                (grouped_kpis[key]['initial'] * (grouped_kpis[key]['count'] - 1)) + (record.initial or 0)
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pl1'] = (
                (grouped_kpis[key]['pl1'] * (grouped_kpis[key]['count'] - 1)) + converted_plans['pl1']
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pl2'] = (
                (grouped_kpis[key]['pl2'] * (grouped_kpis[key]['count'] - 1)) + converted_plans['pl2']
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pl3'] = (
                (grouped_kpis[key]['pl3'] * (grouped_kpis[key]['count'] - 1)) + converted_plans['pl3']
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pl4'] = (
                (grouped_kpis[key]['pl4'] * (grouped_kpis[key]['count'] - 1)) + converted_plans['pl4']
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pr1'] = (
                (grouped_kpis[key]['pr1'] * (grouped_kpis[key]['count'] - 1)) + (record.pr1 or 0)
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pr2'] = (
                (grouped_kpis[key]['pr2'] * (grouped_kpis[key]['count'] - 1)) + (record.pr2 or 0)
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pr3'] = (
                (grouped_kpis[key]['pr3'] * (grouped_kpis[key]['count'] - 1)) + (record.pr3 or 0)
            ) / grouped_kpis[key]['count']

            grouped_kpis[key]['pr4'] = (
                (grouped_kpis[key]['pr4'] * (grouped_kpis[key]['count'] - 1)) + (record.pr4 or 0)
            ) / grouped_kpis[key]['count']
    # Convert grouped_kpis to a list of dictionaries for response
    merged_data = list(grouped_kpis.values())
    return merged_data

from collections import defaultdict

def merge_three_kpis(three_kpis):
    grouped_kpis = defaultdict(lambda: {
        'kpi': None,
        'measure': None,
        'year_one': None,
        'year_two': None,
        'year_three': None,
        'three_year': 0,
        'initial': 0,
        'three_year': 0,
        'year_one_value': 0,
        'year_two_value': 0,
        'year_three_value': 0,
        'year_one_performance': None,
        'year_two_performance': None,
        'year_three_performance': None,
        'year_one_performance_unit': None,
        'year_two_performance_unit': None,
        'year_three_performance_unit': None,
        'operation': None,
        'year_one_unit': None,
        'year_two_unit': None,
        'year_three_unit': None,
        'three_year_unit_id': None,
        'initial_unit_id': None,
        'count': 0  # For averaging
    })

    for record in three_kpis:
        converted_plans, base_unit_id = convert_three_plan_to_base(record)
        converted_three_plans, base_three_unit_id = convert_three_performance_to_base(record)
        key = (
            record.kpi_id,
            record.measure_id,
            record.year_one,
            record.year_two,
            record.year_three
        )

        grouped_kpis[key]['kpi'] = record.kpi_id
        grouped_kpis[key]['measure'] = record.measure_id
        grouped_kpis[key]['year_one'] = record.year_one
        grouped_kpis[key]['year_two'] = record.year_two
        grouped_kpis[key]['year_three'] = record.year_three
        grouped_kpis[key]['year_one_unit'] = base_unit_id
        grouped_kpis[key]['year_two_unit'] = base_unit_id
        grouped_kpis[key]['year_three_unit'] = base_unit_id
        grouped_kpis[key]['year_one_performance_unit'] = base_three_unit_id
        grouped_kpis[key]['year_two_performance_unit'] = base_three_unit_id
        grouped_kpis[key]['year_three_performance_unit'] = base_three_unit_id
        grouped_kpis[key]['three_year_unit_id'] = base_unit_id
        grouped_kpis[key]['initial_unit_id'] = base_unit_id
        grouped_kpis[key]['operation'] = record.operation

        operation = record.operation
        if operation == 'sum':
            grouped_kpis[key]['three_year'] += record.three_year or 0
            grouped_kpis[key]['initial'] += record.initial or 0
            grouped_kpis[key]['year_one_value'] += converted_plans['year_one_value']
            grouped_kpis[key]['year_two_value'] += converted_plans['year_two_value']
            grouped_kpis[key]['year_three_value'] += converted_plans['year_three_value']
            # Sum the performance values if they are not None
            if converted_three_plans.get('year_one_performance') is not None:
                grouped_kpis[key]['year_one_performance'] = converted_three_plans['year_one_performance'] or None

            if converted_three_plans.get('year_two_performance') is not None:
                grouped_kpis[key]['year_two_performance'] = converted_three_plans['year_two_performance'] or None

            if converted_three_plans.get('year_three_performance') is not None:
                grouped_kpis[key]['year_three_performance'] = converted_three_plans['year_three_performance'] or None


        elif operation == 'average':
            grouped_kpis[key]['count'] += 1
            count = grouped_kpis[key]['count']

            grouped_kpis[key]['three_year'] = ((grouped_kpis[key]['three_year'] * (count - 1)) + (record.three_year or 0)) / count
            grouped_kpis[key]['initial'] = ((grouped_kpis[key]['initial'] * (count - 1)) + (record.initial or 0)) / count
            grouped_kpis[key]['year_one_value'] = ((grouped_kpis[key]['year_one_value'] * (count - 1)) + converted_plans['year_one_value']) / count
            grouped_kpis[key]['year_two_value'] = ((grouped_kpis[key]['year_two_value'] * (count - 1)) + converted_plans['year_two_value']) / count
            grouped_kpis[key]['year_three_value'] = ((grouped_kpis[key]['year_three_value'] * (count - 1)) + converted_plans['year_three_value']) / count
            # Handle year_one_performance only if not None
            if record.year_one_performance is not None:
                existing = grouped_kpis[key]['year_one_performance'] or 0
                grouped_kpis[key]['year_one_performance'] = (
                    (existing * (count - 1)) + record.year_one_performance
                ) / count

            # Handle year_two_performance only if not None
            if record.year_two_performance is not None:
                existing = grouped_kpis[key]['year_two_performance'] or 0
                grouped_kpis[key]['year_two_performance'] = (
                    (existing * (count - 1)) + record.year_two_performance
                ) / count

            # Handle year_three_performance only if not None
            if record.year_three_performance is not None:
                existing = grouped_kpis[key]['year_three_performance'] or 0
                grouped_kpis[key]['year_three_performance'] = (
                    (existing * (count - 1)) + record.year_three_performance
                ) / count
    # Convert grouped_kpis to a list of objects instead of dictionaries
    merged_data = [MergedThreeYearKPI(kpi) for kpi in grouped_kpis.values()]
    return merged_data

class CustomErrorException(APIException):
    status_code = 403
    default_detail = 'Custom error message.'
#Here we will define the CRUD functions for strategic goals 
@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def handle_strategic_goal(request,id=None):
    if request.method == 'POST':
        try:
            request.data['added_by'] = request.user.id
            request.data['name'] =  smart_str(request.data['name'],encoding='utf-8')

            serializer = StrategicGoalSerializer(data=request.data)
            if serializer.is_valid():
                # Save the strategic goal instance
                serializer.save()
                return Response({'message': 'Strategic goal set successfully'}, status=200)
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            # Custom error response for ValidationError
            error_message = str(e)
            return Response({'message':str(e)}, status=403)

    if request.method == 'GET':
        if id:
            strategic_goal = StrategicGoal.objects.get(pk=id)  
            serializer = StrategicGoalSerializer(strategic_goal)
            return Response(serializer.data)
        else:
            strategic_goals = StrategicGoal.objects.filter(is_deleted=0)  # Filter only non-deleted goals
            serializer = StrategicGoalSerializer(strategic_goals, many=True)
            return Response(serializer.data)

    if request.method == 'DELETE':
        try:
            goal = StrategicGoal.objects.get(pk=id)
            # Soft delete by setting is_deleted to True
            goal.is_deleted = True  
            # Set the deleted_by field to the ID of the authenticated user
            goal.deleted_by_id = request.user.id
            goal.delete()  # Save the changes to the database
            return Response({'message': 'Strategic goal soft deleted successfully'}, status=200)
        except StrategicGoal.DoesNotExist:
            return Response({'error': 'Strategic goal not found'}, status=404)

    if request.method == 'PUT':
        try:
            strategic_goal = StrategicGoal.objects.get(pk=id)
            strategic_goal.updated_by_id = request.user.id
        except StrategicGoal.DoesNotExist:
            return Response({'error': 'Strategic goal does not exist'}, status=404)
        serializer = StrategicGoalSerializer(strategic_goal, data=request.data, partial=True)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except ValidationError as e:
            error_message = str(e)
            return Response({'message':str(e)}, status=403)
    else:
        return Response({'error': 'Method not allowed'}, status=405)

#Here we will define the CRUD functions for main goals
@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def handle_main_goal(request,id=None):
    def validate_weight(new_weight,sector_id=None,request=None):
        stra_id = request.data['strategic_goal_id']
        strategic_data = StrategicGoal.objects.get(id=stra_id)

        # 1️⃣ Ensure the new MainGoal weight does not exceed the StrategicGoal's weight
        if new_weight > strategic_data.weight:
            raise ValidationError(
                f"The weight of a Main Goal ({new_weight}) cannot exceed its Strategic Goal's weight ({strategic_data.weight})."
            )

        # 2️⃣ Check if total MainGoals weight in the sector exceeds StrategicGoal weight
        if sector_id is not None:
            # ✅ Exclude the current instance when updating (to avoid double counting)
            existing_total_weight = MainGoal.objects.filter(
                sector_id=sector_id, strategic_goal_id=stra_id
            ).exclude(id=request.data.get('id')).aggregate(total_weight=Sum('weight'))['total_weight'] or 0

            total_weight = existing_total_weight + new_weight
            sector_name = Sector.objects.get(id=sector_id)

            if total_weight > strategic_data.weight:
                raise ValidationError(
                    f"Total weight of Main Goals in sector {sector_name.name} cannot exceed {strategic_data.weight}. "
                    f"(Current: {existing_total_weight}, Adding: {new_weight}, Total: {total_weight})"
                )

    if request.method == 'POST':
        if hasattr(request.user, 'sector_id') and request.user.sector_id:
            request.data['sector_id'] = [request.user.sector_id.id]
        elif request.user.monitoring_id is not None or request.user.is_superadmin:
            pass
        try:
            request.data['added_by'] = request.user.id
            if request.user.sector_id:
                new_weight = float(request.data.get('weight'))   
                # Validate the weight against the existing data
                validate_weight(new_weight, sector_id=request.user.sector_id.id,request=request)
                    
            else:
                new_weight = request.data.get('weight', 0)
                new_weight = float(new_weight) if new_weight else 0
                print("new weight:",new_weight)
                print("request",request)
                validate_weight(new_weight,request=request)
            
        except ValueError:
            return Response({'error': 'Weight must be a valid number.'}, status=400)
        except ValidationError as e:
            return Response(
                {'message': str(e)},
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = MainGoalSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Main goal set successfully'}, status=200)
        else:
            return Response(serializer.errors, status=400)
        
    if request.method == 'GET':
        if id:
            user = request.user
            main_goal = MainGoal.objects.filter(id=id,is_deleted=False)
            
            if user.monitoring_id and user.is_superuser == 1:  # If the user has a monitoring_id, they can access all main goals
                pass  # No additional filtering needed
            elif user.division_id or user.sector_id:  # If the user has a division_id or sector_id
                user_sector_id = Division.objects.filter(id=user.division_id.id).values_list('sector_id', flat=True).first()
                user_sector_id_id = user.sector_id.id
                if user_sector_id or user_sector_id_id:  # If the division has a sector_id
                    main_goal = main_goal.filter(sector_id_id__in=user_sector_id or user_sector_id_id)
                else:
                    # If the division has no sector, return an empty queryset
                    main_goal = main_goal.none()
            
            serializer = MainGoalSerializer(main_goal, many=True)
            return Response(serializer.data)
        else:
            user = request.user
            main_goals = MainGoal.objects.filter(is_deleted=False)

            if user.monitoring_id:  # If the user has a monitoring_id, they can access all main goals
                pass  # No additional filtering needed
            elif user.division_id or user.sector_id:  # If the user has a division_id or sector_id
                # Get the user's sectors based on division and sector IDs
                user_sector_ids = []

                if user.division_id:
                    user_sector_id = Division.objects.filter(id=user.division_id.id).values_list('sector_id', flat=True)
                    user_sector_ids.extend(user_sector_id)

                    if user_sector_id or user_sector_ids:
                        main_goals = main_goals.filter(sector_id__id__in=user_sector_id or user_sector_ids)
                # If the user has any associated sector IDs, filter main goals
                if user.sector_id:
                    user_sector_ids.append(user.sector_id_id)
                    main_goals = main_goals.filter(sector_id__id__in=user_sector_ids)

            serializer = MainGoalSerializer(main_goals, many=True)
            return Response(serializer.data)
    
    if request.method == 'DELETE':
        try:
            goal = MainGoal.objects.get(pk=id)
            goal.delete()  # Normal delete
            return Response({'message': 'Main goal deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except MainGoal.DoesNotExist:
            return Response({'error': 'Main goal not found'}, status=status.HTTP_404_NOT_FOUND)

    # ✅ Updated PUT Request
    if request.method == 'PUT':
        try:
            main_goal = MainGoal.objects.get(pk=id)

            if request.user.sector_id:
                new_weight = request.data.get('weight', main_goal.weight)
                new_weight = float(new_weight)

                # ✅ Exclude current `main_goal.id` in validation to avoid double counting
                request.data['id'] = main_goal.id  

                validate_weight(new_weight, sector_id=request.user.sector_id.id, request=request)
                main_goal.updated_by_id = request.user.id    
            else:
                new_weight = float(request.data.get('weight', 0)) if request.data.get('weight') else 0

        except ValueError:
            return Response({'error': 'Weight must be a valid number.'}, status=400)
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)
        except MainGoal.DoesNotExist:
            return Response({'error': 'Main Goal not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MainGoalSerializer(main_goal, data=request.data, partial=True)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response({'message': str(e)}, status=403)
    else:
        return Response({'error': 'Method not allowed'}, status=405)
    
#Here we will define CRUD functions related to KPI
@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def handle_kpi(request,id=None):
    if request.method == 'POST':
        try:
            if hasattr(request.user, 'division_id') and request.user.division_id:
                request.data['division_id'] = [request.user.division_id.id]
            elif request.user.monitoring_id is not None or request.user.is_superadmin:
                pass     
            # Ensure 'added_by', 'division_id', and 'sector_id' are set to the current user's attributes
            request.data['name'] =  smart_str(request.data['name'],encoding='utf-8')

            serializer = KPISerializer(data=request.data)
            # Validate and save the serialized data
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'KPI created successfully'}, status=200)
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            error_message = str(e)
            return Response({'message': error_message}, status=403)
    
    if request.method == 'GET':

        if id:
            user = request.user
            kpis = KPI.objects.filter(id=id)

            if user.monitoring_id:  # If the user has a monitoring_id, they can access all KPI
                pass  # No additional filtering needed
            elif user.sector_id:
                divisions = Division.objects.filter(sector_id=user.sectror_id).values_list('id',flat=True)
                # Get all MainGoal IDs related to the user's sector
                main_goal_ids = MainGoal.objects.filter(sector_id=user.sector_id.id).values_list('id', flat=True)
                # Filter KPIs by these MainGoal IDs
                kpis = kpis.filter(id=id,division_id__in=divisions ,main_goal_id__in=main_goal_ids)
            elif user.division_id:  # If the user has a division_id
                # Filter KPIs by the user's division ID
                kpis = kpis.filter(division_id=user.division_id.id)

            serializer = KPISerializer(kpis, many=True)
            return Response(serializer.data)
        else:
            user = request.user
            kpis = KPI.objects.filter()

            if user.monitoring_id:  # If the user has a monitoring_id, they can access all KPI
                pass  # No additional filtering needed
            elif user.sector_id:
                user_sector_ids = []
                user_sector_ids.append(user.sector_id.id)

                divisions = Division.objects.filter(sector_id=user.sector_id.id).values_list('id',flat=True)
                # Get all MainGoal IDs related to the user's sector
                main_goal_ids = MainGoal.objects.filter(sector_id=user.sector_id.id).values_list('id', flat=True)
                # Filter KPIs by these MainGoal IDs
                kpis = kpis.filter(main_goal_id__in=main_goal_ids,division_id__in=divisions).distinct()
            elif user.division_id:  # If the user has a division_id
                # Filter KPIs by the user's division ID
                kpis = kpis.filter(division_id__in=[user.division_id.id])

            serializer = KPISerializer(kpis, many=True)
            return Response(serializer.data)

    if request.method == 'PUT':
        try:
            kpis = KPI.objects.get(pk=id)
            kpis.updated_by_id = request.user.id
        except KPI.DoesNotExist:
            return Response({'error': 'Main goal does not exist'}, status=404)
    

        serializer = KPISerializer(kpis, data=request.data, partial=True)  # Allow partial updates
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except ValidationError as e:
            error_message = str(e)
            return Response({'message':str(e)}, status=403)

    if request.method == 'DELETE':
        try:
            goal = KPI.objects.get(pk=id)
            goal.is_deleted = True  # Soft delete by setting is_deleted to True
            goal.deleted_by_id = request.user.id
            goal.delete()  # Save the changes to the database
            return Response({'message': 'KPI goal deleted successfully'}, status=200)

        except KPI.DoesNotExist:
            return Response({'error': 'Strategic goal not found'}, status=404)
    else:
        return Response({'error': 'Method not allowed'}, status=405)

# Here we will define CRUD functions related to KPI
@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def handle_Annual_KPI(request, id=None):
    # POST - Create a new AnnualKPI
    if request.method == 'POST':
        try:
            if hasattr(request.user, 'division_id') and request.user.division_id:
                request.data['division_id'] = request.user.division_id.id
            elif request.user.monitoring_id is not None or request.user.is_superadmin:
                pass
            # Initialize the serializer with the incoming data
            serializer = AnnualKPISerializer(data=request.data)

            # Validate and save the serialized data
            if serializer.is_valid():
                is_valid, message = validate_annual_plan(request.data)
                if not is_valid:
                    return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
                # Fetch the current weight of the sector, subcity, and woreda
                existing_division_weight = AnnualKPI.objects.filter(
                    division_id=request.user.division_id, year=request.data.get('year'), kpi=request.data.get('kpi')
                ).aggregate(total_weight=Sum('weight'))['total_weight'] or 0
                
                # Retrieve the KPI data to get main activity details
                kpi = request.data.get('kpi')
                kpi_data = KPI.objects.get(id=kpi)
                main_id = kpi_data.main_goal_id.id
                main_data = MainGoal.objects.get(id=main_id)
                
                # Calculate the new total weight after adding this entry
                new_weight = serializer.validated_data.get('weight', 0)
                if existing_division_weight + new_weight > main_data.weight:
                    return Response(
                        {'message': f'Total weight of Annual KPI cannot exceed {main_data.weight} for the specified sector, you are left with {main_data.weight-existing_division_weight}'},
                        status=status.HTTP_403_FORBIDDEN
                    )

                serializer.save()

                return Response({'message': 'Annual KPI created successfully'}, status=201)
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            # Custom error response for ValidationError
            error_message = str(e)
            print(error_message)
            return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)


    # GET - Retrieve KPI data (either all or specific based on ID)
    if request.method == 'GET':
        filter_year = request.query_params.get('year')
        filter_division = request.query_params.get('division')
        filter_sector = request.query_params.get('sector')
        user = request.user
        if id:
            try:
                annual_kpi = AnnualKPI.objects.get(id=id)  # Renamed variable
                serializer = AnnualKPISerializer(annual_kpi)  # Renamed variable
                return Response(serializer.data, status=200)
            except AnnualKPI.DoesNotExist:
                return Response({'error': 'KPI not found'}, status=404)
        else:
            annual_kpis = AnnualKPI.objects.filter(year=filter_year)  # Renamed variable
            # If no ID is provided, fetch all KPIs
            if user.monitoring_id or user.is_superadmin:
                #process annual_kpis here
                if filter_sector:
                    division_ids = Division.objects.filter(sector_id=filter_sector).values_list('id', flat=True)
                    annual_kpis = annual_kpis.filter(division_id__in=division_ids).distinct()
                elif filter_division:
                    annual_kpis = annual_kpis.filter(division_id=filter_division).distinct()
                else:
                    annual_kpis = annual_kpis  # Renamed variable

            elif user.sector_id:
                division_ids = Division.objects.filter(sector_id=user.sector_id, is_deleted=False).values_list('id', flat=True)
                annual_kpis = annual_kpis.filter(division_id__in=division_ids).distinct()
                if filter_division:
                    annual_kpis = annual_kpis.filter(division_id=filter_division).distinct()
                else:
                    annual_kpis = annual_kpis  # Renamed variable
            elif user.division_id:
                annual_kpis = annual_kpis.filter(division_id=user.division_id).distinct()
            else:
                pass
            serializer = AnnualKPISerializer(annual_kpis, many=True)  # Renamed variable
            return Response(serializer.data, status=200)

    if request.method == 'PUT':
        # Update an existing Annual KPI
        try:
            annual_kpi = AnnualKPI.objects.get(pk=id)
        except AnnualKPI.DoesNotExist:
            return Response({'error': 'Annual KPI not found'}, status=404)

        serializer = AnnualKPISerializer(annual_kpi, data=request.data, partial=True)
        if serializer.is_valid():
            # Same weight check logic as in POST
            existing_division_weight = AnnualKPI.objects.filter(
                division_id=request.user.division_id, year=request.data.get('year'), kpi=request.data.get('kpi')
            ).aggregate(total_weight=Sum('weight'))['total_weight'] or 0

            new_weight = serializer.validated_data.get('weight', 0)

            kpi = request.data.get('kpi')
            kpi_data = KPI.objects.get(id=kpi)
            main_id = kpi_data.main_goal_id.id
            main_data = MainGoal.objects.get(id=main_id)

            if existing_division_weight + new_weight > main_data.weight:
                return Response(
                    {'message': f'Total weight of Annual KPI cannot exceed {main_data.weight} for the specified sector, you are left with {main_data.weight-existing_division_weight}'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Save updated data
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    # DELETE - Delete an existing AnnualKPI
    if request.method == 'DELETE':
        try:
            annual_kpi = AnnualKPI.objects.get(pk=id)  # Renamed variable
            annual_kpi.delete()  # Perform the deletion
            return Response({'message': 'KPI deleted successfully'}, status=200)
        except AnnualKPI.DoesNotExist:
            return Response({'error': 'KPI not found'}, status=404)

    # Method not allowed if not POST, GET, PUT, or DELETE
    return Response({'error': 'Method not allowed'}, status=405)



@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def handle_three_KPI(request, id=None):
    # POST - Create a new AnnualKPI
    if request.method == 'POST':
        try:
            if hasattr(request.user, 'division_id') and request.user.division_id:
                request.data['division_id'] = request.user.division_id.id
            elif request.user.monitoring_id is not None or request.user.is_superadmin:
                pass
            # Initialize the serializer with the incoming data
            serializer = ThreeyearKPISerializer(data=request.data)

            # Validate and save the serialized data
            if serializer.is_valid():
                is_valid, message = validate_three_plan(request.data)
                if not is_valid:
                    return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
                # Fetch the current weight of the sector, subcity, and woreda
                serializer.save()

                return Response({'message': 'Three Year KPI created successfully'}, status=201)
            else:
                return Response(serializer.errors, status=400)
        except ValidationError as e:
            # Custom error response for ValidationError
            error_message = str(e)
            print(error_message)
            return Response({'message': str(e)}, status=status.HTTP_403_FORBIDDEN)


    # GET - Retrieve KPI data (either all or specific based on ID)
    if request.method == 'GET':
        user = request.user
        if id:
            try:
                three_kpi = ThreeyearKPI.objects.get(id=id)  # Renamed variable
                serializer = ThreeyearKPISerializer(three_kpi)  # Renamed variable
                return Response(serializer.data, status=200)
            except ThreeyearKPI.DoesNotExist:
                return Response({'error': 'Three Year KPI not found'}, status=404)
        else:
            three_kpis = ThreeyearKPI.objects.all()  # Renamed variable
            # If no ID is provided, fetch all KPIs
            if user.monitoring_id or user.is_superadmin:
                #process three_kpis here
                three_kpis = three_kpis  # Renamed variable
            elif user.sector_id:
                division_ids = Division.objects.filter(sector_id=user.sector_id, is_deleted=False).values_list('id', flat=True)
                three_kpis = three_kpis.filter(division_id__in=division_ids).distinct()
            elif user.division_id:
                three_kpis = three_kpis.filter(division_id=user.division_id).distinct()
            else:
                pass

            serializer = ThreeyearKPISerializer(three_kpis, many=True)  # Renamed variable
            return Response(serializer.data, status=200)

    if request.method == 'PUT' and id:
        # Update an existing Annual KPI
        try:
            three_kpi = ThreeyearKPI.objects.get(pk=id)
        except ThreeyearKPI.DoesNotExist:
            return Response({'error': 'Three year KPI not found'}, status=404)

        serializer = ThreeyearKPISerializer(three_kpi, data=request.data, partial=True)
        if serializer.is_valid():
            # Save updated data
            serializer.save()
            return Response(serializer.data, status=200)

    # DELETE - Delete an existing AnnualKPI
    if request.method == 'DELETE':
        try:
            three_kpi = ThreeyearKPI.objects.get(pk=id)  # Renamed variable
            three_kpi.delete()  # Perform the deletion
            return Response({'message': 'Three Year KPI deleted successfully'}, status=200)
        except ThreeyearKPI.DoesNotExist:
            return Response({'error': 'KPI not found'}, status=404)

    # Method not allowed if not POST, GET, PUT, or DELETE
    return Response({'error': 'Method not allowed'}, status=405)


@api_view(['POST', 'PUT', 'GET'])
@permission_classes([permissions.IsAuthenticated])
def assignStrategicGoal(request):
    if request.method == 'GET':
        # Handle GET request here, maybe return some information or form.
        strategic_goal_id = request.query_params.get('strategic_goal_id')
        if not strategic_goal_id:
            return Response({'error': 'strategic_goal_id is required in query parameters.'}, status=400)
        try:
            # Retrieve StrategicGoal instance
            strategic_goal = StrategicGoal.objects.get(id=strategic_goal_id)
        except StrategicGoal.DoesNotExist:
            return Response({'error': 'Strategic goal does not exist.'}, status=404)

        # Retrieve sector_ids associated with the strategic goal
        sector_ids = strategic_goal.sector_id.values_list('id', flat=True)

        return Response({'sector_ids': list(sector_ids)}, status=200)
    if request.method == 'PUT':
        # Extract data from the request
        data = request.data
        sector_ids = data.get('sector_id', [])  # Get sector_id as a list, default to empty list if not provided
        strategic_goal_id = data.get('strategic_goal_id')

        # Ensure strategic_goal_id is provided
        if not strategic_goal_id:
            return Response({'error': 'strategic_goal_id is required.'}, status=400)

        try:
            # Retrieve StrategicGoal instance
            strategic_goal = StrategicGoal.objects.get(id=strategic_goal_id)
        except StrategicGoal.DoesNotExist:
            return Response({'error': 'Strategic goal does not exist.'}, status=404)

        # Clear existing sectors if any
        strategic_goal.sector_id.clear()

        # Iterate over sector_ids and assign each sector to the strategic goal
        for sector_id in sector_ids:
            try:
                # Retrieve Sector instance
                sector = Sector.objects.get(id=sector_id)
            except Sector.DoesNotExist:
                return Response({'error': f'Sector with ID {sector_id} does not exist.'}, status=404)

            # Add the sector to the strategic goal's many-to-many relationship
            strategic_goal.sector_id.add(sector)

        # Set assigned field to True if at least one sector_id has a value
        if sector_ids:
            strategic_goal.assigned = True
            strategic_goal.save()

        return Response({'success': 'Sectors assigned to strategic goal successfully.'}, status=200)




@api_view(['POST', 'PUT', 'GET'])
@permission_classes([permissions.IsAuthenticated])
def assignMainGoal(request):

    def validate_weight(new_weight,sector_id=None,strategicGoal_id=None):
        # Calculate existing total weight, excluding current instance if updating
        if sector_id is not None:
            existing_total_weight = MainGoal.objects.filter(
                sector_id__in=[sector_id],strategic_goal_id = strategicGoal_id.id
            ).aggregate(total_weight=Sum('weight'))['total_weight'] or 0
            
            strategic_data = StrategicGoal.objects.get(id=strategicGoal_id.id)
            
            # Calculate remaining weight and validate
            left_weight = strategic_data.weight - existing_total_weight
            total_weight = existing_total_weight + new_weight
            sector_name = Sector.objects.get(id=sector_id)
            print(f'existing total weight for {sector_name}',existing_total_weight)
            if total_weight > strategic_data.weight:
                raise ValidationError(
                    f"Total weight of Main Activity cannot exceed {strategic_data.weight} for {sector_name.name} sector"
                    f"Current weight is: {existing_total_weight}, the remaining weight is: {left_weight}."
                )
  
    if request.method == 'GET':
        # Handle GET request here, maybe return some information or form.
        main_goal_id = request.query_params.get('main_goal_id')
        if not main_goal_id:
            return Response({'error': 'main_goal_id is required in query parameters.'}, status=400)
        try:
            # Retrieve StrategicGoal instance
            main_goal = MainGoal.objects.get(id=main_goal_id)
        except MainGoal.DoesNotExist:
            return Response({'error': 'Strategic goal does not exist.'}, status=404)

        # Retrieve sector_ids associated with the strategic goal
        sector_ids = main_goal.sector_id.values_list('id', flat=True)

        return Response({'sector_ids': list(sector_ids)}, status=200)
    if request.method == 'PUT':
        
        # Extract data from the request
        user=request.user
        sector_user = user.sector_id
        data = request.data
        sector_ids = data.get('sector_id', [])  # Get sector_id as a list, default to empty list if not provided
        main_goal_id = data.get('main_goal_id')

        # Ensure strategic_goal_id is provided
        if not main_goal_id:
            return Response({'error': 'main_goal is required.'}, status=400)

        try:
            # Retrieve StrategicGoal instance
            main_goal = MainGoal.objects.get(id=main_goal_id)
        except MainGoal.DoesNotExist:
            return Response({'error': 'Main Goal does not exist.'}, status=404)
        
        if user.monitoring_id or user.is_superuser is not None and sector_user is None:
        
        # Clear existing sectors if any
            main_goal.sector_id.clear()

            # Iterate over sector_ids and assign each sector to the strategic goal
            for sector_id in sector_ids:
                try:
                    main_goal=MainGoal.objects.get(id=request.data['main_goal_id'])
                    new_weight = main_goal.weight

                    # Validate the weight against the existing data
                    validate_weight(new_weight, sector_id,strategicGoal_id=main_goal.strategic_goal_id)
                    
                    
                    # Retrieve Sector instance
                    sector = Sector.objects.get(id=sector_id)

                except ValidationError as e:
                    return Response({'message': str(e)}, status=400)
                except Sector.DoesNotExist:
                    return Response({'error': f'Sector with ID {sector_id} does not exist.'}, status=404)

                # Add the sector to the strategic goal's many-to-many relationship
                main_goal.sector_id.add(sector)

            # Set assigned field to True if at least one sector_id has a value
            if sector_ids:
                main_goal.save()

            return Response({'success': 'Sectors assigned to Main Activity successfully.'}, status=200)
        

@api_view(['POST', 'PUT', 'GET'])
@permission_classes([permissions.IsAuthenticated])
def assignkpi(request):
    user = request.user
    monitoring_user = user.monitoring_id
    sector_user = user.sector_id
    division_user = user.division_id
 
    if request.method == 'PUT':
        data = request.data
        division_ids = data.get('division_id', [])
        kpi_id = data.get('kpi')

        if not kpi_id:
            return Response({'error': 'kpi is required.'}, status=400)

        try:
            kpi = KPI.objects.get(id=kpi_id)
        except KPI.DoesNotExist:
            return Response({'error': 'KPI does not exist.'}, status=404)

        if monitoring_user or request.user.is_superadmin or sector_user and not  division_user:

            # Iterate over sector_ids and assign each sector to the strategic goal
            for division_id in division_ids:
                try:
                    main_goal=MainGoal.objects.get(id=kpi.main_goal_id.id)
                    kpi.division_id.clear()
                    # Retrieve Sector instance
                    division = Division.objects.get(id=division_id)

                except ValidationError as e:
                    return Response({'message': str(e)}, status=400)
                except Sector.DoesNotExist:
                    return Response({'error': f'Sector with ID {division_id} does not exist.'}, status=404)

                # Add the sector to the strategic goal's many-to-many relationship
                kpi.division_id.add(division)

            # Set assigned field to True if at least one sector_id has a value
            kpi.division_id.clear()
            if division_ids:
                kpi.division_id.set(Division.objects.filter(id__in=division_ids))
                kpi.save()
                return Response({'success': 'Divisions assigned successfully.', 'division_ids': division_ids}, status=200)
            return Response({'error': 'No valid division IDs provided.'}, status=400)

        return Response({'error': 'Invalid user role or data.'}, status=403)

    return Response({'error': 'Method not allowed.'}, status=405)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def set_performance(request, id):

    if request.method == 'PUT':
        try:
            annualKPI = AnnualKPI.objects.get(pk=id)
        except AnnualKPI.DoesNotExist:
            return Response({'error': 'KPI does not exist'}, status=404)
        serializer = AnnualKPISerializer(annualKPI, data=request.data, partial=True)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response({'message': str(e)}, status=403)

    return Response({'error': 'Method not allowed'}, status=405)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def set_three_performance(request, id):

    if request.method == 'PUT':
        try:
            threeKPI = ThreeyearKPI.objects.get(pk=id)
        except ThreeyearKPI.DoesNotExist:
            return Response({'error': 'KPI does not exist'}, status=404)
        serializer = ThreeyearKPISerializer(threeKPI, data=request.data, partial=True)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response({'message': str(e)}, status=403)

    return Response({'error': 'Method not allowed'}, status=405)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def plan_document_view(request, id=None):
    filter_year = request.query_params.get('year')
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    filter_quarter = request.query_params.get('quarter')
    user = request.user
    try:
        plan_document = PlanDocument.objects.get(pk=id) if id else None
    except PlanDocument.DoesNotExist:
        return Response({'error': 'PlanDocument not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        user_sector_id = user.sector_id_id
        user_division_id = user.division_id_id
        div_user_sector_id = Division.objects.filter(id=user_division_id).values_list('sector_id', flat=True).first()

        plan_documents = PlanDocument.objects.all()

        if user.monitoring_id or user.is_superuser == 1:
            if filter_year:
                plan_documents = plan_documents.filter(year=filter_year,status=True,submitted=True)
            if filter_sector:
                divisions = Division.objects.filter(sector_id=filter_sector).values_list('id', flat=True)
                plan_documents = plan_documents.filter(division_id__in=divisions,status=True,submitted=True) or plan_documents.filter(sector_id=filter_sector,status=True,submitted=True)
            if filter_division:
                plan_documents = plan_documents.filter(division_id=filter_division,status=True,submitted=True)
            if filter_quarter:
                plan_documents = plan_documents.filter(quarter=filter_quarter,status=True,submitted=True)
        elif user_sector_id:
            if filter_year:
                plan_documents = plan_documents.filter(year=filter_year,submitted=True)
            if filter_quarter:
                plan_documents = plan_documents.filter(quarter=filter_quarter,submitted=True)
            if filter_division:
                plan_documents = plan_documents.filter(division_id=filter_division,submitted=True)
            else:
                divisions = Division.objects.filter(sector_id=user_sector_id)
                plan_documents = plan_documents.filter(Q(sector_id=user.sector_id) | Q(division_id__in=divisions), submitted=True)
        elif user_division_id:
            if filter_year:
                plan_documents = plan_documents.filter(year=filter_year)
            if filter_quarter:
                plan_documents = plan_documents.filter(quarter=filter_quarter)
            plan_documents = plan_documents.filter(division_id=user_division_id) 
        if id:
            serializer = PlanDocumentSerializer(plan_document)
        else:
            serializer = PlanDocumentSerializer(plan_documents, many=True)
        
        return Response(serializer.data)

    elif request.method == 'POST':
        mutable_data = request.data.copy()
        mutable_data['added_by'] = user.id
        if user.is_superuser:
            mutable_data['status'] = True
            mutable_data['submitted'] = True
        if user.monitoring_id_id:
            mutable_data['monitoring_id'] = user.monitoring_id_id
            mutable_data['status'] = True
            mutable_data['submitted'] = True
        if user.sector_id_id:
            mutable_data['sector_id'] = user.sector_id_id
            mutable_data['submitted'] = True
            mutable_data['status'] = True

            # Fetch all SectorReminder objects related to the user’s sector
            reminders = SectorReminder.objects.all()
            
            # Only proceed if there are reminders
            if reminders.exists():
                # Set 'late' to False initially; it will only be True if any reminder is late
                current_time = timezone.now()

                # Iterate through reminders to check if any are overdue
                for reminder in reminders:
                    if reminder.submision_dateof_sector < current_time:
                        # If any reminder is overdue, set late to True and break out of the loop
                        mutable_data['late'] = True
                        break
            else:
                # If there are no reminders, do nothing (mutable_data['late'] is not set)
                pass
        if user.division_id_id:
            mutable_data['division_id'] = user.division_id_id
            # Fetch all SectorReminder objects related to the user’s sector
            reminders = DivisionReminder.objects.all()
            
            # Only proceed if there are reminders
            if reminders.exists():
                # Set 'late' to False initially; it will only be True if any reminder is late
                current_time = timezone.now()

                # Iterate through reminders to check if any are overdue
                for reminder in reminders:
                    if reminder.submision_dateof_sector < current_time:
                        # If any reminder is overdue, set late to True and break out of the loop
                        mutable_data['late'] = True
                        break
            else:
                # If there are no reminders, do nothing (mutable_data['late'] is not set)
                pass

        serializer = PlanDocumentSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        if not plan_document:
            return Response({'error': 'PlanDocument not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PlanDocumentSerializer(plan_document, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not plan_document:
            return Response({'error': 'PlanDocument not found'}, status=status.HTTP_404_NOT_FOUND)
        
        plan_document.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def measure_handler(request, id=None):
    """
    Unified view to handle Measure creation (POST), 
    retrieving one or all measures (GET), updating (PUT), and deleting (DELETE).
    """

    if request.method == 'POST':
        # Create a new measure
        serializer = MeasureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Measure created successfully'}, status=201)
        else:
            return Response(serializer.errors, status=400)

    elif request.method == 'GET':
        if id:
            # Retrieve a specific measure by ID
            try:
                measure = Measure.objects.get(pk=id)
                serializer = MeasureSerializer(measure)
                return Response(serializer.data, status=200)
            except Measure.DoesNotExist:
                return Response({'error': 'Measure not found'}, status=404)
        else:
            # Retrieve all measures
            measures = Measure.objects.all()
            serializer = MeasureSerializer(measures, many=True)
            return Response(serializer.data, status=200)

    elif request.method == 'PUT' and id:
        # Update an existing measure
        try:
            measure = Measure.objects.get(pk=id)
        except Measure.DoesNotExist:
            return Response({'error': 'Measure not found'}, status=404)

        serializer = MeasureSerializer(measure, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    elif request.method == 'DELETE' and id:
        # Delete a specific measure
        try:
            measure = Measure.objects.get(pk=id)
            measure.delete()
            return Response({'message': 'Measure deleted successfully'}, status=204)
        except Measure.DoesNotExist:
            return Response({'error': 'Measure not found'}, status=404)

    return Response({'error': 'Method not allowed'}, status=405)





@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def unit_handler(request, id=None):
    """
    Unified view to handle Unit creation (POST), 
    retrieving one or all units (GET), updating (PUT), and deleting (DELETE).
    """

    if request.method == 'POST':
        # Create a new unit
        serializer = UnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Unit created successfully'}, status=201)
        else:
            return Response(serializer.errors, status=400)

    elif request.method == 'GET':
        if id:
            # Retrieve a specific unit by ID
            try:
                unit = Unit.objects.get(pk=id)
                serializer = UnitSerializer(unit)
                return Response(serializer.data, status=200)
            except Unit.DoesNotExist:
                return Response({'error': 'Unit not found'}, status=404)
        else:
            # Retrieve all units
            units = Unit.objects.all()
            serializer = UnitSerializer(units, many=True)
            return Response(serializer.data, status=200)

    elif request.method == 'PUT' and id:
        # Update an existing unit
        try:
            unit = Unit.objects.get(pk=id)
        except Unit.DoesNotExist:
            return Response({'error': 'Unit not found'}, status=404)

        serializer = UnitSerializer(unit, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    elif request.method == 'DELETE' and id:
        # Delete a specific unit
        try:
            unit = Unit.objects.get(pk=id)
            unit.delete()
            return Response({'message': 'Unit deleted successfully'}, status=204)
        except Unit.DoesNotExist:
            return Response({'error': 'Unit not found'}, status=404)

    return Response({'error': 'Method not allowed'}, status=405)





