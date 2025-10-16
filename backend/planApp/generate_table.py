from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import StrategicGoal, MainGoal, KPI ,AnnualKPI,ThreeyearKPI
from django.db.models import Count
from userApp.models import *
from reportApp.models import Measure,Unit
from userApp.models import Sector
from reportApp.serializer import MeasureSerializer
from rest_framework import permissions, status
from django.core.exceptions import ValidationError
from rest_framework.exceptions import APIException
import re
from django.db.models import Sum
from datetime import date
from django.db.models import Q
from django.db.models import Prefetch
from .views import merge_annual_kpis,merge_three_kpis
from .unit_calculator import convert_three_plan_to_base,convert_three_performance_to_base


def calculate_plan_values(operation, plans, measure,is_incremental=False,initial=None):
    """
    Calculates the sum or average of plan values after converting them to the base unit.
    
    Args:
        operation (str): 'sum' or 'average'
        plans (list of tuples): Each tuple is (value, unit_id)
        measure (Measure): Measure object to determine the base unit.
    
    Returns:
        float: The calculated sum or average in the base unit.
    
    Raises:
        ValueError: If the base unit for the measure isn't found or if an unsupported operation is passed.
    """

    # Get the base unit for the measure
    base_unit = Unit.objects.filter(measure_id=measure, isBaseUnit=True).first()
    if not base_unit:
        raise ValueError("Base unit for the specified measure not found!")
    
    # Collect all unique unit IDs from plans for bulk fetching
    unit_ids = {unit_id for _, unit_id in plans if unit_id is not None}
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk(field_name="id")
    
    total = 0
    count = 0
    
    for value, unit_id in plans:
        if value is None:
            continue  # Skip None values
        
        unit = unit_objects.get(unit_id)
        if unit:
            # Compute conversion factor: convert the unit to the base unit.
            conversion_factor = unit.conversionFactor / base_unit.conversionFactor
            converted_value = value * conversion_factor
        else:
            # Fallback: if no unit is found, use the value as is.
            converted_value = value
        
        total += converted_value
        count += 1

    if is_incremental:
        total += initial
    
    if operation == 'sum':
        if base_unit.symbol is not None:
            return f'{total}{base_unit.symbol}'
        else:
            return f'{total}'
    elif operation == 'average':
        if count > 0:
            if base_unit.symbol is not None:
                return f'{round(total/count)}{base_unit.symbol}'
            else:
                return f'{round(total/count)}'
        else:
            return 0
    else:
        raise ValueError("Unsupported operation: {}".format(operation))


def calculate_performance(three_year_kpis):
    total_plans = 0
    total_performance = 0
    performance_data = []

    for kpi in three_year_kpis:
        # Initialize a dictionary to hold the performance details for each KPI
        kpi_performance = {
            'year_one_performance': None,
            'year_two_performance': None,
            'year_three_performance': None,
            'total_performance': None
        }
        
        
        # Convert year one
        if kpi.year_one_value is not None:
            # Convert units to base units
            year_one_plan_value, year_one_value_base_unit = convert_three_plan_to_base(kpi)
            year_one_performance_value, year_one_performance_base_unit = convert_three_performance_to_base(kpi)
            year_one_plan = year_one_plan_value.get('year_one_value')
            year_one_performance = year_one_performance_value.get('year_one_performance')
            total_plans += year_one_plan

            if year_one_plan is not None and year_one_performance is not None:
                if year_one_plan != 0:
                    kpi_performance['year_one_performance'] = f'{round((year_one_performance / year_one_plan) * 100,2)}%' if year_one_plan and year_one_plan != 0 else None
                    total_performance += year_one_performance
                else:
                    kpi_performance['year_one_performance'] = None

        # Convert year two
        if kpi.year_two_value is not None:
            # Convert units to base units
            year_two_plan_value, year_two_value_base_unit = convert_three_plan_to_base(kpi)
            year_two_performance_value, year_two_performance_base_unit = convert_three_performance_to_base(kpi)
            year_two_plan = year_two_plan_value.get('year_two_value')
            total_plans += year_two_plan

            year_two_performance = year_two_performance_value.get('year_two_performance')
            if year_two_plan is not None and year_two_performance is not None:
                if year_one_plan != 0:
                    # Convert to percentage (e.g., 95%)
                    kpi_performance['year_two_performance'] = f'{round((year_two_performance / year_two_plan) * 100,2)}%' if year_two_plan and year_two_plan != 0 else None
                    total_performance += year_two_performance
                else:
                    kpi_performance['year_two_performance'] = None

        # Convert year three
        if kpi.year_three_value is not None:
            # Convert units to base units
            year_three_plan_value, year_three_value_base_unit = convert_three_plan_to_base(kpi)
            year_three_performance_value, year_three_performance_base_unit = convert_three_performance_to_base(kpi)
            year_three_plan = year_three_plan_value.get('year_three_value')
            year_three_performance = year_three_performance_value.get('year_three_performance')
            total_plans += year_three_plan

            if year_three_plan is not None and year_three_performance is not None:

                if year_three_plan != 0:
                    # Convert to percentage (e.g., 95%)
                    kpi_performance['year_three_performance'] = f'{round((year_three_performance / year_three_plan) * 100,2)}%' if year_three_plan and year_three_plan != 0 else None
                    total_performance += year_three_performance
                else:
                    kpi_performance['year_three_performance'] = None

        print("Total plans:",total_plans)
        print("Total performance:",total_performance)
        # Calculate total performance across all years
        total_performance_value = (round((total_performance / total_plans) * 100,2) if total_plans != 0 else None)
        if total_performance_value is not None:
            kpi_performance['total_performance'] = '100%' if total_performance_value > 100 else f'{total_performance_value}%'
        else:
            kpi_performance['total_performance'] = None
        performance_data.append(kpi_performance)

    return performance_data

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def generate_table_data(request):
    filter_year = request.query_params.get('year')
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    filter_quarter = request.query_params.get('quarter')
    filter_quarter = int(filter_quarter) if filter_quarter is not None else None
    table_data = []

    if request.user.monitoring_id or request.user.is_superadmin:
        division_ids = []

        # Filter AnnualKPI set first
        annual_kpi_queryset = AnnualKPI.objects.filter(
            year=filter_year
        )

        # Apply filter by sector if provided
        if filter_sector:
            division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)
            if not division_ids:
                print("division_ids is none:",division_ids)
                division_ids=[0]
            else:
                print("division_ids is:",division_ids)
                annual_kpi_queryset = annual_kpi_queryset.filter(division_id__in=division_ids).distinct()


        # Fetch Strategic Goals with nested Main Activities
        strategic_goals = StrategicGoal.objects.prefetch_related(
            Prefetch(
                'maingoals',  # Corrected related_name
                queryset=MainGoal.objects.prefetch_related(
                    Prefetch(
                        'kpis',
                        queryset=KPI.objects.prefetch_related(
                            Prefetch(
                                'annualkpi_set',  # Prefetch the filtered AnnualKPI set
                                queryset=annual_kpi_queryset
                            )
                        ).filter(division_id__in=division_ids) if division_ids else KPI.objects.all().distinct()  # Only filter by division if division_ids is populated
                    )
                )
            )
        ).distinct()  # Ensure distinct strategic_goals to avoid duplication
        if filter_division:
            # Fetch Strategic Goals with nested Main Activities
            strategic_goals = StrategicGoal.objects.prefetch_related(
                Prefetch(
                    'maingoals',  # Corrected related_name
                    queryset=MainGoal.objects.prefetch_related(
                        Prefetch(
                            'kpis',
                            queryset=KPI.objects.prefetch_related(
                                Prefetch(
                                    'annualkpi_set',  # Prefetch the filtered AnnualKPI set
                                    queryset=annual_kpi_queryset.distinct()
                                )
                            ).filter(division_id=filter_division)
                        )
                    )
                )
            ).distinct()  # Ensure distinct strategic_goals to avoid duplication
        # Prepare the table data
        for index, strategic_goal in enumerate(strategic_goals, start=1):
            strategic_goal_data = {
                'index': index,
                'strategic_goal_name': strategic_goal.name,
                'maingoals': []
            }

            for maingoal in strategic_goal.maingoals.all():  # Corrected related_name here as well
                main_activity_data = {
                    'main_goal_name': maingoal.name,
                    'expected_outcome': maingoal.expected_outcome,
                    'kpis': []
                }
                print("value of filter quarter:",filter_quarter)
                print("Filtering by year:", filter_year)
                seen_kpi_names = set()
                for kpi in maingoal.kpis.all():
                    if kpi.name in seen_kpi_names:
                        continue  # Skip duplicate KPI
                    seen_kpi_names.add(kpi.name)
                    merged_annual_kpis = merge_annual_kpis(kpi.annualkpi_set.filter(year=filter_year))
                    if filter_quarter is None:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl1': annual_kpi['initial'] + annual_kpi['pl1'] if is_incremental else annual_kpi['pl1'],
                                'pl1_unit':Unit.objects.get(id=annual_kpi.get("pl1_unit_id")).symbol or "",
                                'pl2': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] if is_incremental else annual_kpi['pl2'],
                                'pl2_unit':Unit.objects.get(id=annual_kpi.get("pl2_unit_id")).symbol or "",
                                'pl3': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] if is_incremental else annual_kpi['pl3'],
                                'pl3_unit':Unit.objects.get(id=annual_kpi.get("pl3_unit_id")).symbol or "",
                                'pl4': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] + annual_kpi['pl4'] if is_incremental else annual_kpi['pl4'],
                                'pl4_unit':Unit.objects.get(id=annual_kpi.get("pl4_unit_id")).symbol or "",
                            })
                    if filter_quarter == 1:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl1': annual_kpi['initial'] + annual_kpi['pl1'] if is_incremental else annual_kpi['pl1'],
                                'pl1_unit':Unit.objects.get(id=annual_kpi.get("pl1_unit_id")).symbol or ""
                            })

                    elif filter_quarter == 2:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl2': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] if is_incremental else annual_kpi['pl2'],
                                'pl2_unit':Unit.objects.get(id=annual_kpi.get("pl2_unit_id")).symbol or ""
                            })
                    elif filter_quarter == 3:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl3': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] if is_incremental else annual_kpi['pl4'],
                                'pl3_unit':Unit.objects.get(id=annual_kpi.get("pl3_unit_id")).symbol or "",
                            })
                    elif filter_quarter == 4:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl4': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] + annual_kpi['pl4'] if is_incremental else annual_kpi['pl4'],
                                'pl4_unit':Unit.objects.get(id=annual_kpi.get("pl4_unit_id")).symbol or "",
                            })
                    elif filter_quarter == 6:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            six_month = calculate_plan_values(annual_kpi['operation'],[ (annual_kpi.get('pl1'),annual_kpi.get('pl1_unit_id')), (annual_kpi.get('pl2'),annual_kpi.get('pl2_unit_id'))],annual_kpi.get('measure'),is_incremental,annual_kpi['initial'])
                            print("Here",six_month)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl6': six_month,
                            })
                    elif filter_quarter == 9:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            nine_month = calculate_plan_values(annual_kpi['operation'],[( annual_kpi.get('pl1'),annual_kpi.get('pl1_unit_id')),( annual_kpi.get('pl2'),annual_kpi.get('pl2_unit_id')), (annual_kpi.get('pl3'),annual_kpi.get('pl3_unit_id'))],annual_kpi.get('measure'),is_incremental,annual_kpi['initial'])
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl9': nine_month,
                            })
                if main_activity_data['kpis']:  # Only include Main Activities with KPIs
                    strategic_goal_data['maingoals'].append(main_activity_data)

            if strategic_goal_data['maingoals']:  # Only include Strategic Goals with Main Activities
                table_data.append(strategic_goal_data)
    elif request.user.sector_id:
        division_ids = Division.objects.filter(sector_id=request.user.sector_id.id, is_deleted=False).values_list('id', flat=True)

        # Filter AnnualKPI set first
        annual_kpi_queryset = AnnualKPI.objects.filter(division_id__in=division_ids,
            year=filter_year if filter_year else datetime.date.today().year
        )


        # Fetch Strategic Goals with nested Main Activities
        strategic_goals = StrategicGoal.objects.prefetch_related(
            Prefetch(
                'maingoals',  # Corrected related_name
                queryset=MainGoal.objects.prefetch_related(
                    Prefetch(
                        'kpis',
                        queryset=KPI.objects.prefetch_related(
                            Prefetch(
                                'annualkpi_set',  # Prefetch the filtered AnnualKPI set
                                queryset=annual_kpi_queryset.distinct()
                            )
                        ).filter(division_id__in=division_ids)
                    )
                )
            )
        ).distinct()  # Ensure distinct strategic_goals to avoid duplication

        if filter_division:
            # Fetch Strategic Goals with nested Main Activities
            strategic_goals = StrategicGoal.objects.prefetch_related(
                Prefetch(
                    'maingoals',  # Corrected related_name
                    queryset=MainGoal.objects.prefetch_related(
                        Prefetch(
                            'kpis',
                            queryset=KPI.objects.prefetch_related(
                                Prefetch(
                                    'annualkpi_set',  # Prefetch the filtered AnnualKPI set
                                    queryset=annual_kpi_queryset.distinct()
                                )
                            ).filter(division_id=filter_division)
                        )
                    )
                )
            ).distinct()  # Ensure distinct strategic_goals to avoid duplication

        # Further filter by division if provided
        strategic_goals = strategic_goals.distinct()

        # Prepare the table data
        for index, strategic_goal in enumerate(strategic_goals, start=1):
            strategic_goal_data = {
                'index': index,
                'strategic_goal_name': strategic_goal.name,
                'maingoals': []
            }

            for maingoal in strategic_goal.maingoals.all():  # Corrected related_name here as well
                main_activity_data = {
                    'main_goal_name': maingoal.name,
                    'expected_outcome': maingoal.expected_outcome,
                    'kpis': []
                }
                seen_kpi_names = set()
                for kpi in maingoal.kpis.all():
                    if kpi.name in seen_kpi_names:
                        continue  # Skip duplicate KPI
                    seen_kpi_names.add(kpi.name)
                    # Do not merge annual KPIs for sector users
                    merged_annual_kpis = merge_annual_kpis(kpi.annualkpi_set.filter(year=filter_year))
                    if filter_quarter is None:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl1': annual_kpi['initial'] + annual_kpi['pl1'] if is_incremental else annual_kpi['pl1'],
                                'pl1_unit':Unit.objects.get(id=annual_kpi.get("pl1_unit_id")).symbol or "",
                                'pl2': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] if is_incremental else annual_kpi['pl2'],
                                'pl2_unit':Unit.objects.get(id=annual_kpi.get("pl2_unit_id")).symbol or "",
                                'pl3': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] if is_incremental else annual_kpi['pl3'],
                                'pl3_unit':Unit.objects.get(id=annual_kpi.get("pl3_unit_id")).symbol or "",
                                'pl4': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] + annual_kpi['pl4'] if is_incremental else annual_kpi['pl4'],
                                'pl4_unit':Unit.objects.get(id=annual_kpi.get("pl4_unit_id")).symbol or "",
                            })
                    if filter_quarter == 1:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl1': annual_kpi['initial'] + annual_kpi['pl1'] if is_incremental else annual_kpi['pl1'],
                                'pl1_unit':Unit.objects.get(id=annual_kpi.get("pl1_unit_id")).symbol or ""
                            })

                    elif filter_quarter == 2:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl2': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] if is_incremental else annual_kpi['pl2'],
                                'pl2_unit':Unit.objects.get(id=annual_kpi.get("pl2_unit_id")).symbol or ""
                            })
                    elif filter_quarter == 3:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl3': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] if is_incremental else annual_kpi['pl4'],
                                'pl3_unit':Unit.objects.get(id=annual_kpi.get("pl3_unit_id")).symbol or "",
                            })
                    elif filter_quarter == 4:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl4': annual_kpi['initial'] + annual_kpi['pl1'] + annual_kpi['pl2'] + annual_kpi['pl3'] + annual_kpi['pl4'] if is_incremental else annual_kpi['pl4'],
                                'pl4_unit':Unit.objects.get(id=annual_kpi.get("pl4_unit_id")).symbol or "",
                            })
                    elif filter_quarter == 6:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            six_month = calculate_plan_values(annual_kpi['operation'],[ (annual_kpi.get('pl1'),annual_kpi.get('pl1_unit_id')), (annual_kpi.get('pl2'),annual_kpi.get('pl2_unit_id'))],annual_kpi.get('measure'),is_incremental,annual_kpi['initial'])
                            print("Here",six_month)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl6': six_month,
                            })
                    elif filter_quarter == 9:
                        for annual_kpi in merged_annual_kpis:
                            is_incremental = annual_kpi.get("incremental", False)
                            nine_month = calculate_plan_values(annual_kpi['operation'],[( annual_kpi.get('pl1'),annual_kpi.get('pl1_unit_id')),( annual_kpi.get('pl2'),annual_kpi.get('pl2_unit_id')), (annual_kpi.get('pl3'),annual_kpi.get('pl3_unit_id'))],annual_kpi.get('measure'),is_incremental,annual_kpi['initial'])
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi['year'],  # Access dictionary keys
                                'annual_value': annual_kpi['annual'] + annual_kpi['initial'] if is_incremental else annual_kpi['annual'],
                                'annual_unit':Unit.objects.get(id=annual_kpi.get("annual_unit_id")).symbol or "",
                                'initial': annual_kpi['initial'],
                                'initial_unit':Unit.objects.get(id=annual_kpi.get("initial_unit_id")).symbol or "",
                                'weight': annual_kpi['weight'],
                                'measure': Measure.objects.get(id=annual_kpi.get('measure')).name or "",  # Use .get() for optional fields
                                'pl9': nine_month,
                            })
                if main_activity_data['kpis']:  # Only include Main Activities with KPIs
                    strategic_goal_data['maingoals'].append(main_activity_data)

            if strategic_goal_data['maingoals']:  # Only include Strategic Goals with Main Activities
                table_data.append(strategic_goal_data)

    elif request.user.division_id:
        division_ids = Division.objects.filter(id=request.user.division_id.id, is_deleted=False).values_list('id', flat=True)
        # Filter AnnualKPI set first
        annual_kpi_queryset = AnnualKPI.objects.filter(division_id__in=division_ids,
            year=filter_year if filter_year else datetime.date.today().year
        )


        # Fetch Strategic Goals with nested Main Activities
        strategic_goals = StrategicGoal.objects.prefetch_related(
            Prefetch(
                'maingoals',  # Corrected related_name
                queryset=MainGoal.objects.prefetch_related(
                    Prefetch(
                        'kpis',
                        queryset=KPI.objects.prefetch_related(
                            Prefetch(
                                'annualkpi_set',  # Prefetch the filtered AnnualKPI set
                                queryset=annual_kpi_queryset
                            )
                        ).filter(division_id__in=division_ids)  # Only filter by division if division_ids is populated
                    )
                )
            )
        ).distinct()  # Ensure distinct strategic_goals to avoid duplication


        # Prepare the table data
        for index, strategic_goal in enumerate(strategic_goals, start=1):
            strategic_goal_data = {
                'index': index,
                'strategic_goal_name': strategic_goal.name,
                'maingoals': []
            }

            for maingoal in strategic_goal.maingoals.all():  # Corrected related_name here as well
                main_activity_data = {
                    'main_goal_name': maingoal.name,
                    'expected_outcome': maingoal.expected_outcome,
                    'kpis': []
                }

                for kpi in maingoal.kpis.all():
                    # Do not merge annual KPIs for sector users
                    if filter_quarter is None:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            print("Operation is: ",annual_kpi.operation)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl1': annual_kpi.initial + annual_kpi.pl1 if is_incremental else annual_kpi.pl1,
                                'pl1_unit':Unit.objects.get(id=annual_kpi.pl1_unit_id.id).symbol or "",
                                'pl2': annual_kpi.initial + annual_kpi.pl1 + annual_kpi.pl2 if is_incremental else annual_kpi.pl2,
                                'pl2_unit':Unit.objects.get(id=annual_kpi.pl2_unit_id.id).symbol or "",
                                'pl3': annual_kpi.initial + annual_kpi.pl1 + annual_kpi.pl2 + annual_kpi.pl3 if is_incremental else annual_kpi.pl3,
                                'pl3_unit':Unit.objects.get(id=annual_kpi.pl3_unit_id.id).symbol or "",
                                'pl4': annual_kpi.initial + annual_kpi.pl1 + annual_kpi.pl2 + annual_kpi.pl3 + annual_kpi.pl4 if is_incremental else annual_kpi.pl4,
                                'pl4_unit':Unit.objects.get(id=annual_kpi.pl4_unit_id.id).symbol or "",
                            })
                    if filter_quarter == 1:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            print("Operation is: ",annual_kpi.operation)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl1': annual_kpi.initial + annual_kpi.pl1 if is_incremental else annual_kpi.pl1,
                                'pl1_unit':Unit.objects.get(id=annual_kpi.pl1_unit_id.id).symbol or "",

                            })
                    if filter_quarter == 2:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            print("Operation is: ",annual_kpi.operation)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl2': annual_kpi.initial + annual_kpi.pl1 + annual_kpi.pl2 if is_incremental else annual_kpi.pl2,
                                'pl2_unit':Unit.objects.get(id=annual_kpi.pl2_unit_id.id).symbol or "",

                            })
                    if filter_quarter == 3:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            print("Operation is: ",annual_kpi.operation)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl3': annual_kpi.initial + annual_kpi.pl1 + annual_kpi.pl2 + annual_kpi.pl3 if is_incremental else annual_kpi.pl3,
                                'pl3_unit':Unit.objects.get(id=annual_kpi.pl3_unit_id.id).symbol or "",

                            })
                    if filter_quarter == 4:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            print("Operation is: ",annual_kpi.operation)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl4': annual_kpi.initial + annual_kpi.pl1 + annual_kpi.pl2 + annual_kpi.pl3 + annual_kpi.pl4 if is_incremental else annual_kpi.pl4,
                                'pl4_unit':Unit.objects.get(id=annual_kpi.pl4_unit_id.id).symbol or "",

                            })
                    elif filter_quarter == 6:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            six_month = calculate_plan_values(annual_kpi.operation,[ (annual_kpi.pl1,annual_kpi.pl1_unit_id), (annual_kpi.pl2,annual_kpi.pl2_unit_id)],annual_kpi.measure.id,is_incremental,annual_kpi.initial)
                            print("Here",six_month)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl6': six_month,
                            })
                    elif filter_quarter == 9:
                        for annual_kpi in kpi.annualkpi_set.all():
                            is_incremental = annual_kpi.incremental
                            nine_month = calculate_plan_values(annual_kpi.operation,[ (annual_kpi.pl1,annual_kpi.pl1_unit_id), (annual_kpi.pl2,annual_kpi.pl2_unit_id), (annual_kpi.pl3,annual_kpi.pl3_unit_id)],annual_kpi.measure.id,is_incremental,annual_kpi.initial)
                            main_activity_data['kpis'].append({
                                'kpi_name': kpi.name,
                                'year': annual_kpi.year,
                                'annual_value': annual_kpi.annual + annual_kpi.initial if is_incremental else annual_kpi.annual,
                                'annual_unit':Unit.objects.get(id=annual_kpi.annual_unit_id.id).symbol or "",
                                'initial': annual_kpi.initial,
                                'initial_unit':Unit.objects.get(id=annual_kpi.initial_unit_id.id).symbol or "",
                                'weight': annual_kpi.weight,
                                'measure': Measure.objects.get(id=annual_kpi.measure.id).name or "",
                                'pl9': nine_month,
                            })


                if main_activity_data['kpis']:  # Only include Main Activities with KPIs
                    strategic_goal_data['maingoals'].append(main_activity_data)

            if strategic_goal_data['maingoals']:  # Only include Strategic Goals with Main Activities
                table_data.append(strategic_goal_data)
    else:
        pass

    return JsonResponse(table_data, safe=False)




@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def three_year_table_data(request):
    filter_year = request.query_params.get('year')
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    table_data = []

    if request.user.monitoring_id or request.user.is_superadmin:
        division_ids = []
        # Apply filter by sector if provided
        if filter_sector:
            division_ids = list(Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True))
            if not division_ids:
                print("No divisions found for sector:", filter_sector)
                division_ids = [0]  # Ensures no match instead of empty query error
            else:
                print("Filtered division_ids:", division_ids)

        # Fetch Strategic Goals with nested Main Activities
        strategic_goals = StrategicGoal.objects.prefetch_related(
            Prefetch(
                'maingoals',  # Corrected related_name
                queryset=MainGoal.objects.prefetch_related(
                    Prefetch(
                        'kpis',
                        queryset=KPI.objects.prefetch_related(
                            Prefetch(
                                'threeyear_kpi_set',  # Prefetch the filtered AnnualKPI set
                                queryset=ThreeyearKPI.objects.filter(division_id__in=division_ids).distinct() if division_ids else ThreeyearKPI.objects.filter(year_one = filter_year)
                            )
                        )
                    )
                )
            )
        ).distinct()  # Ensure distinct strategic_goals to avoid duplication

        if filter_division:
            # Fetch Strategic Goals with nested Main Activities
            strategic_goals = StrategicGoal.objects.prefetch_related(
                Prefetch(
                    'maingoals',  # Corrected related_name
                    queryset=MainGoal.objects.prefetch_related(
                        Prefetch(
                            'kpis',
                            queryset=KPI.objects.prefetch_related(
                                Prefetch(
                                    'threeyear_kpi_set',  # Prefetch the filtered AnnualKPI set
                                    queryset=ThreeyearKPI.objects.filter(year_one = filter_year)
                                )
                            ).filter(division_id=filter_division)
                        )
                    )
                )
            ).distinct()  # Ensure distinct strategic_goals to avoid duplication

        # Prepare the table data
        for index, strategic_goal in enumerate(strategic_goals, start=1):
            strategic_goal_data = {
                'index': index,
                'strategic_goal_name': strategic_goal.name,
                'maingoals': []
            }

            for maingoal in strategic_goal.maingoals.all():  # Corrected related_name here as well
                main_activity_data = {
                    'main_goal_name': maingoal.name,
                    'expected_outcome': maingoal.expected_outcome,
                    'kpis': []
                }

                seen_kpi_names = set()
                for kpi in maingoal.kpis.all():
                    if kpi.name in seen_kpi_names:
                        continue  # Skip duplicate KPI
                    seen_kpi_names.add(kpi.name) 
                    merged_three_kpis = merge_three_kpis(kpi.threeyear_kpi_set.filter(year_one=filter_year))
                    for three_year_kpi in merged_three_kpis:
                        # Collect values for calculation
                        performance_data = calculate_performance([three_year_kpi])
                        print("Performance data:", performance_data)
                        plans = [
                            (three_year_kpi.year_one_value, three_year_kpi.year_one_unit_id),
                            (three_year_kpi.year_two_value, three_year_kpi.year_two_unit_id),
                            (three_year_kpi.year_three_value, three_year_kpi.year_three_unit_id),
                        ]

                        # Compute incremental values
                        year_one_calculated = calculate_plan_values(three_year_kpi.operation, [plans[0]], three_year_kpi.measure)
                        year_two_calculated = calculate_plan_values(three_year_kpi.operation, plans[:2], three_year_kpi.measure)
                        year_three_calculated = calculate_plan_values(three_year_kpi.operation, plans, three_year_kpi.measure)

                        main_activity_data['kpis'].append({
                            'kpi_name': kpi.name,
                            'year_one': three_year_kpi.year_one,
                            'year_two': three_year_kpi.year_two,
                            'year_three': three_year_kpi.year_three,
                            'measure': Measure.objects.get(id=three_year_kpi.measure).name if three_year_kpi.measure else "",
                            'year_one_value': year_one_calculated,
                            'year_two_value': year_two_calculated,
                            'year_three_value': year_three_calculated,
                            'year_one_unit': Unit.objects.get(id=three_year_kpi.year_one_unit).symbol if three_year_kpi.year_one_unit else "",
                            'year_two_unit': Unit.objects.get(id=three_year_kpi.year_two_unit).symbol if three_year_kpi.year_two_unit else "",
                            'year_three_unit': Unit.objects.get(id=three_year_kpi.year_three_unit).symbol if three_year_kpi.year_three_unit else "",
                            'performance_data': performance_data[0],  # Extract the first (and only) entry
                        })


                if main_activity_data['kpis']:  # Only include Main Activities with KPIs
                    strategic_goal_data['maingoals'].append(main_activity_data)

            if strategic_goal_data['maingoals']:  # Only include Strategic Goals with Main Activities
                table_data.append(strategic_goal_data)

    if request.user.sector_id:
        division_ids = []
        # Apply filter by sector if provided
        if request.user.sector_id:
            division_ids = list(Division.objects.filter(sector_id=request.user.sector_id, is_deleted=False).values_list('id', flat=True))
            if not division_ids:
                division_ids = [0]  # Ensures no match instead of empty query error
            else:
                print("Filtered division_ids:", division_ids)

        # Fetch Strategic Goals with nested Main Activities
        strategic_goals = StrategicGoal.objects.prefetch_related(
            Prefetch(
                'maingoals',  # Corrected related_name
                queryset=MainGoal.objects.prefetch_related(
                    Prefetch(
                        'kpis',
                        queryset=KPI.objects.prefetch_related(
                            Prefetch(
                                'threeyear_kpi_set',  # Prefetch the filtered AnnualKPI set
                                queryset=ThreeyearKPI.objects.filter(division_id__in=division_ids,year_one = filter_year)
                            )
                        )
                    )
                )
            )
        ).distinct()  # Ensure distinct strategic_goals to avoid duplication

        if filter_division:
            # Fetch Strategic Goals with nested Main Activities
            strategic_goals = StrategicGoal.objects.prefetch_related(
                Prefetch(
                    'maingoals',  # Corrected related_name
                    queryset=MainGoal.objects.prefetch_related(
                        Prefetch(
                            'kpis',
                            queryset=KPI.objects.prefetch_related(
                                Prefetch(
                                    'threeyear_kpi_set',  # Prefetch the filtered AnnualKPI set
                                    queryset=ThreeyearKPI.objects.filter(year_one = filter_year)
                                )
                            ).filter(division_id=filter_division)
                        )
                    )
                )
            ).distinct()  # Ensure distinct strategic_goals to avoid duplication

        # Prepare the table data
        for index, strategic_goal in enumerate(strategic_goals, start=1):
            strategic_goal_data = {
                'index': index,
                'strategic_goal_name': strategic_goal.name,
                'maingoals': []
            }

            for maingoal in strategic_goal.maingoals.all():  # Corrected related_name here as well
                main_activity_data = {
                    'main_goal_name': maingoal.name,
                    'expected_outcome': maingoal.expected_outcome,
                    'kpis': []
                }

                seen_kpi_names = set()
                for kpi in maingoal.kpis.all():
                    if kpi.name in seen_kpi_names:
                        continue  # Skip duplicate KPI
                    seen_kpi_names.add(kpi.name)                    
                    merged_three_kpis = merge_three_kpis(kpi.threeyear_kpi_set.filter(year_one=filter_year))
                    for three_year_kpi in merged_three_kpis:
                        # Collect values for calculation
                        performance_data = calculate_performance([three_year_kpi])
                        print("Performance data:", performance_data)
                        plans = [
                            (three_year_kpi.year_one_value, three_year_kpi.year_one_unit_id),
                            (three_year_kpi.year_two_value, three_year_kpi.year_two_unit_id),
                            (three_year_kpi.year_three_value, three_year_kpi.year_three_unit_id),
                        ]

                        # Compute incremental values
                        year_one_calculated = calculate_plan_values(three_year_kpi.operation, [plans[0]], three_year_kpi.measure)
                        year_two_calculated = calculate_plan_values(three_year_kpi.operation, plans[:2], three_year_kpi.measure)
                        year_three_calculated = calculate_plan_values(three_year_kpi.operation, plans, three_year_kpi.measure)

                        main_activity_data['kpis'].append({
                            'kpi_name': kpi.name,
                            'year_one': three_year_kpi.year_one,
                            'year_two': three_year_kpi.year_two,
                            'year_three': three_year_kpi.year_three,
                            'measure': Measure.objects.get(id=three_year_kpi.measure).name if three_year_kpi.measure else "",
                            'year_one_value': year_one_calculated,
                            'year_two_value': year_two_calculated,
                            'year_three_value': year_three_calculated,
                            'year_one_unit': Unit.objects.get(id=three_year_kpi.year_one_unit).symbol if three_year_kpi.year_one_unit else "",
                            'year_two_unit': Unit.objects.get(id=three_year_kpi.year_two_unit).symbol if three_year_kpi.year_two_unit else "",
                            'year_three_unit': Unit.objects.get(id=three_year_kpi.year_three_unit).symbol if three_year_kpi.year_three_unit else "",
                            'performance_data': performance_data[0],  # Extract the first (and only) entry
                        })


                if main_activity_data['kpis']:  # Only include Main Activities with KPIs
                    strategic_goal_data['maingoals'].append(main_activity_data)

            if strategic_goal_data['maingoals']:  # Only include Strategic Goals with Main Activities
                table_data.append(strategic_goal_data)

    if request.user.division_id:

        # Fetch Strategic Goals with nested Main Activities
        strategic_goals = StrategicGoal.objects.prefetch_related(
            Prefetch(
                'maingoals',  # Corrected related_name
                queryset=MainGoal.objects.prefetch_related(
                    Prefetch(
                        'kpis',
                        queryset=KPI.objects.prefetch_related(
                            Prefetch(
                                'threeyear_kpi_set',  # Prefetch the filtered AnnualKPI set
                                queryset=ThreeyearKPI.objects.filter(year_one = filter_year)
                            )
                        ).filter(division_id=request.user.division_id).distinct()
                    )
                )
            )
        ).distinct()  # Ensure distinct strategic_goals to avoid duplication


        # Prepare the table data
        for index, strategic_goal in enumerate(strategic_goals, start=1):
            strategic_goal_data = {
                'index': index,
                'strategic_goal_name': strategic_goal.name,
                'maingoals': []
            }

            for maingoal in strategic_goal.maingoals.all():  # Corrected related_name here as well
                main_activity_data = {
                    'main_goal_name': maingoal.name,
                    'expected_outcome': maingoal.expected_outcome,
                    'kpis': []
                }

                seen_kpi_names = set()
                for kpi in maingoal.kpis.all():
                    if kpi.name in seen_kpi_names:
                        continue  # Skip duplicate KPI
                    seen_kpi_names.add(kpi.name)                    
                    for three_year_kpi in kpi.threeyear_kpi_set.all():
                        # Collect values for calculation
                        performance_data = calculate_performance([three_year_kpi])
                        plans = [
                            (three_year_kpi.year_one_value, three_year_kpi.year_one_unit_id),
                            (three_year_kpi.year_two_value, three_year_kpi.year_two_unit_id),
                            (three_year_kpi.year_three_value, three_year_kpi.year_three_unit_id),
                        ]

                        # Compute incremental values
                        year_one_calculated = calculate_plan_values(three_year_kpi.operation, [plans[0]], three_year_kpi.measure)
                        year_two_calculated = calculate_plan_values(three_year_kpi.operation, plans[:2], three_year_kpi.measure)
                        year_three_calculated = calculate_plan_values(three_year_kpi.operation, plans, three_year_kpi.measure)

                        main_activity_data['kpis'].append({
                            'kpi_name': kpi.name,
                            'year_one': three_year_kpi.year_one,
                            'year_two': three_year_kpi.year_two,
                            'year_three': three_year_kpi.year_three,
                            'measure': three_year_kpi.measure.name if three_year_kpi.measure else "",
                            'year_one_value': year_one_calculated,
                            'year_two_value': year_two_calculated,
                            'year_three_value': year_three_calculated,
                            'year_one_unit': three_year_kpi.year_one_unit.symbol if three_year_kpi.year_one_unit else "",
                            'year_two_unit': three_year_kpi.year_two_unit.symbol if three_year_kpi.year_two_unit else "",
                            'year_three_unit': three_year_kpi.year_three_unit.symbol if three_year_kpi.year_three_unit else "",
                            'performance_data': performance_data[0],  # Extract the first (and only) entry
                        })


                if main_activity_data['kpis']:  # Only include Main Activities with KPIs
                    strategic_goal_data['maingoals'].append(main_activity_data)

            if strategic_goal_data['maingoals']:  # Only include Strategic Goals with Main Activities
                table_data.append(strategic_goal_data)

    return Response(table_data)
