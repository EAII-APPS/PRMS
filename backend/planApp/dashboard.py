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
from .unit_calculator import *
from .views import *


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_data(request):
    filter_year = request.query_params.get('year')
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    filter_kpi = request.query_params.get('kpi')

    try:
        # Base query filters
        if request.user.monitoring_id or request.user.is_superadmin:
            kpi_queryset = KPI.objects.all()
            main_goal_queryset = MainGoal.objects.all()
            strategic_goal_queryset = StrategicGoal.objects.all()
            user_queryset = User.objects.all()
            # Apply filter by sector if provided
            if filter_sector:
                division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)
                if not division_ids:
                    division_ids=[0]
                else:
                    kpi_queryset = kpi_queryset.filter(division_id__in=division_ids).distinct()
                main_goal_queryset = main_goal_queryset.filter(sector_id=filter_sector)
                strategic_goal_queryset = strategic_goal_queryset.filter(sector_id=filter_sector)
                user_queryset = user_queryset.filter(division_id__in=division_ids).distinct()

            if filter_division:
                sector_of_division = Division.objects.get(id=filter_division).sector_id
                division_ids = Division.objects.filter(sector_id=sector_of_division, is_deleted=False).values_list('id', flat=True)
                kpi_queryset = kpi_queryset.filter(division_id=filter_division)
                main_goal_queryset = main_goal_queryset.filter(sector_id=sector_of_division)
                strategic_goal_queryset = strategic_goal_queryset.filter(sector_id=sector_of_division)
                user_queryset = user_queryset.filter(division_id__in=division_ids).distinct()
        if request.user.sector_id:
            division_ids = Division.objects.filter(sector_id=request.user.sector_id.id, is_deleted=False).values_list('id', flat=True)
            kpi_queryset = KPI.objects.filter(division_id__in=division_ids)
            main_goal_queryset = MainGoal.objects.filter(sector_id=request.user.sector_id.id)
            strategic_goal_queryset = StrategicGoal.objects.filter(sector_id=request.user.sector_id.id)
            user_queryset = User.objects.filter(sector_id=request.user.sector_id)
            # Apply filter by sector if provided
            if filter_sector:
                division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)
                if not division_ids:
                    division_ids=[0]
                else:
                    kpi_queryset = kpi_queryset.filter(division_id__in=division_ids).distinct()
                main_goal_queryset = main_goal_queryset.filter(sector_id=filter_sector)
                strategic_goal_queryset = strategic_goal_queryset.filter(sector_id=filter_sector)
                user_queryset = user_queryset.filter(division_id__in=division_ids).distinct()

            if filter_division:
                sector_of_division = Division.objects.get(id=filter_division).sector_id
                division_ids = Division.objects.filter(sector_id=sector_of_division, is_deleted=False).values_list('id', flat=True)
                kpi_queryset = kpi_queryset.filter(division_id=filter_division)
                main_goal_queryset = main_goal_queryset.filter(sector_id=sector_of_division)
                strategic_goal_queryset = strategic_goal_queryset.filter(sector_id=sector_of_division)
                user_queryset = user_queryset.filter(division_id__in=division_ids).distinct()
        if request.user.division_id:
            sector_of_division = Division.objects.get(id=request.user.division_id.id).sector_id
            kpi_queryset = KPI.objects.filter(division_id=request.user.division_id.id)
            main_goal_queryset = MainGoal.objects.filter(sector_id=sector_of_division)
            strategic_goal_queryset = StrategicGoal.objects.filter(sector_id=sector_of_division)
            user_queryset = User.objects.filter(sector_id=sector_of_division)
            # Apply filter by sector if provided
            if filter_sector:
                division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)
                if not division_ids:
                    division_ids=[0]
                else:
                    kpi_queryset = kpi_queryset.filter(division_id__in=division_ids).distinct()
                main_goal_queryset = main_goal_queryset.filter(sector_id=filter_sector)
                strategic_goal_queryset = strategic_goal_queryset.filter(sector_id=filter_sector)
                user_queryset = user_queryset.filter(division_id__in=division_ids).distinct()

            if filter_division:
                sector_of_division = Division.objects.get(id=filter_division).sector_id
                division_ids = Division.objects.filter(sector_id=sector_of_division, is_deleted=False).values_list('id', flat=True)
                kpi_queryset = kpi_queryset.filter(division_id=filter_division)
                main_goal_queryset = main_goal_queryset.filter(sector_id=sector_of_division)
                strategic_goal_queryset = strategic_goal_queryset.filter(sector_id=sector_of_division)
                user_queryset = user_queryset.filter(division_id__in=division_ids).distinct()

        # Fetch current counts
        current_counts = {
            "strategic_goals": strategic_goal_queryset.count(),
            "main_goals": main_goal_queryset.count(),
            "kpis": kpi_queryset.count(),
            "users": user_queryset.count(),  # Users are not filtered by sector or division
        }

        # Mock previous period counts (replace with actual logic if tracking historical data)
        previous_counts = {
            "strategic_goals": 10,  
            "main_goals": 32,
            "kpis": 80,
            "users": 2230,
        }

        # Calculate change percentage
        def calculate_change(current, previous):
            if previous == 0:
                return "+0%"  
            change = ((current - previous) / previous) * 100
            return f"{'+' if change >= 0 else ''}{round(change, 1)}%"

        stats_data = [
            {
                "title": "Strategic Goals",
                "value": current_counts["strategic_goals"],
                "change": calculate_change(current_counts["strategic_goals"], previous_counts["strategic_goals"]),
                "icon": "TrendingUpIcon",
                "color": "#6C63FF",
            },
            {
                "title": "Main Activities",
                "value": current_counts["main_goals"],
                "change": calculate_change(current_counts["main_goals"], previous_counts["main_goals"]),
                "icon": "AssignmentIcon",
                "color": "#FF6384",
            },
            {
                "title": "KPIs",
                "value": current_counts["kpis"],
                "change": calculate_change(current_counts["kpis"], previous_counts["kpis"]),
                "icon": "BarChartIcon",
                "color": "#4CAF50",
            },
            {
                "title": "Users",
                "value": current_counts["users"],
                "change": calculate_change(current_counts["users"], previous_counts["users"]),
                "icon": "PeopleIcon",
                "color": "#FFA726",
            },
        ]

        pie_chart_data = sector_performance_calculator(request)
        bar_chart_data = strategic_goal_performance(request, filter_year)
        table_data = annual_kpi_table_data(request, filter_year)
        area_data = three_year_performance_data(request,filter_year)
        if not area_data['series'] or all(all(value == 0.0 for value in series['data']) for series in area_data['series']):
            area_data = []

        response_data = {
            "dashboard_cards": stats_data,
            "pie": pie_chart_data,
            "bar": bar_chart_data,
            "table": table_data,
            "threeYearPerformance": area_data,
        }

        return JsonResponse(response_data, status=200, safe=False, json_dumps_params={'ensure_ascii': False})

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500,
            safe=False,
        )


def sector_performance_calculator(request):
    try:
        if request.user.monitoring_id or request.user.is_superadmin:
            # Get filters from request query params (if any)
            filter_year = request.query_params.get('year')
            filter_kpi = request.query_params.get('kpi')
            filter_sector = request.query_params.get('sector')
            filter_division = request.query_params.get('division')
            # Extract all sectors without filtering
            all_sectors = Sector.objects.all()  # Get all sectors in the system
            if filter_sector:
                division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)
                all_sectors = all_sectors.filter(id=filter_sector)

            if filter_division:
                sector_of_division = Division.objects.get(id=filter_division).sector_id
                division_ids = Division.objects.filter(sector_id=sector_of_division, is_deleted=False).values_list('id', flat=True)
                all_sectors = all_sectors.filter(id=sector_of_division)
            # Initialize performance dictionary
            sector_performance = defaultdict(lambda: {"total_planned": 0, "total_actual": 0})

            # Loop over each sector to calculate performance
            for sector in all_sectors:
                # Find divisions that belong to the current sector
                divisions = Division.objects.filter(sector_id=sector.id, is_deleted=False)
                division_ids = divisions.values_list('id', flat=True)

                # Fetch AnnualKPI records for these divisions
                annual_kpis = AnnualKPI.objects.filter(division_id__in=division_ids).distinct()

                # Apply year filter if provided
                if filter_year:
                    annual_kpis = annual_kpis.filter(year=filter_year)

                # Apply KPI filter if provided
                if filter_kpi:
                    annual_kpis = annual_kpis.filter(kpi_id=filter_kpi)

                # Process each AnnualKPI for the current sector
                for annual_kpi in annual_kpis:
                    # Convert AnnualKPI quarterly plans to base unit
                    converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)
                    total_planned_base = sum(converted_plans.values())  # Sum up all converted quarterly values

                    converted_actuals, base_unit_id = convert_quarterly_performance_to_base(annual_kpi)

                    # Ensure None values are replaced with 0 before summing
                    total_actual_base = sum(v if v is not None else 0 for v in converted_actuals.values())


                    # Accumulate the total planned and actual values for the sector
                    sector_performance[sector.name]["total_planned"] += total_planned_base
                    sector_performance[sector.name]["total_actual"] += total_actual_base
            # Prepare pie chart data
            pie_chart_data = []
            for sector in all_sectors:
                sector_name = sector.name
                total_actual = sector_performance.get(sector_name, {}).get("total_actual", 0)
                total_planned = sector_performance.get(sector_name, {}).get("total_planned", 0)

                # Calculate performance as percentage
                performance = (total_actual / total_planned * 100) if total_planned > 0 else 0

                # Add sector to the pie chart data
                pie_chart_data.append({
                    "sector": sector_name,
                    "value": round(performance, 2)
                })

        if request.user.sector_id:
            # Get filters from request query params (if any)
            filter_year = request.query_params.get('year')
            filter_kpi = request.query_params.get('kpi')
            filter_division = request.query_params.get('division')

            divisions = Division.objects.filter(sector_id=request.user.sector_id)
            # Apply division filter if provided
            if filter_division:
                divisions = divisions.filter(id=filter_division)

            division_ids = divisions.values_list('id', flat=True)
            # Initialize performance dictionary
            sector_performance = {"total_planned": 0, "total_actual": 0}

            # Fetch AnnualKPI records for the filtered divisions
            annual_kpis = AnnualKPI.objects.filter(division_id__in=division_ids).distinct()

            # Apply year filter if provided
            if filter_year:
                annual_kpis = annual_kpis.filter(year=filter_year)

            # Apply KPI filter if provided
            if filter_kpi:
                annual_kpis = annual_kpis.filter(kpi_id=filter_kpi)
            # Prepare pie chart data
            pie_chart_data = []

            for division in divisions:
                # Initialize performance values for each division
                division_performance = {"total_planned": 0, "total_actual": 0}

                # Fetch AnnualKPI records for this specific division
                division_kpis = annual_kpis.filter(division_id=division.id)

                for annual_kpi in division_kpis:
                    # Convert quarterly plans and performance to base unit
                    converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)
                    total_planned_base = sum(converted_plans.values())

                    converted_actuals, base_unit_id = convert_quarterly_performance_to_base(annual_kpi)
                    total_actual_base = sum(v if v is not None else 0 for v in converted_actuals.values())

                    # Accumulate performance data for this division
                    division_performance["total_planned"] += total_planned_base
                    division_performance["total_actual"] += total_actual_base

                # Calculate division performance percentage
                total_actual = division_performance["total_actual"]
                total_planned = division_performance["total_planned"]
                performance = (total_actual / total_planned * 100) if total_planned > 0 else 0

                pie_chart_data.append({
                    "sector": division.name,
                    "value": round(performance, 2)
                })


        # Return the pie chart data
        return pie_chart_data

    except Exception as e:
        return {"error": str(e)}



def strategic_goal_performance(request, year):
    performance_data = []
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    filter_kpi = request.query_params.get('kpi')

    # Fetch all Strategic Goals
    all_strategic_goals = StrategicGoal.objects.all()
    division_ids = Division.objects.all().values_list('id', flat=True)

    if request.user.monitoring_id or request.user.is_superadmin:
        if filter_sector:
            all_strategic_goals = all_strategic_goals.filter(sector_id=filter_sector)
            division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)

        if filter_division:
            sector_of_division = Division.objects.get(id=filter_division).sector_id
            all_strategic_goals = all_strategic_goals.filter(sector_id=sector_of_division)
            division_ids = Division.objects.filter(id=filter_division, is_deleted=False).values_list('id', flat=True)

        # Loop over each strategic goal to calculate aggregated performance
        for strategic_goal in all_strategic_goals:
            # Fetch all related MainGoals for this strategic goal
            main_goals = MainGoal.objects.filter(strategic_goal_id=strategic_goal)
            # Fetch all related KPIs for these MainGoals
            kpis = KPI.objects.filter(main_goal_id__in=main_goals)
            if filter_kpi:
                kpis = kpis.filter(id=filter_kpi)

            total_performance = 0
            valid_kpi_count = 0  # Track number of KPIs with valid performance

            # Loop over each KPI
            for kpi in kpis:
                annual_kpis = AnnualKPI.objects.filter(kpi=kpi, year=year,division_id__in=division_ids)
                if annual_kpis.exists():
                    annual_kpi = annual_kpis[0]
                    if annual_kpi.operation == "average":
                        converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)
                        total_planned_base = sum(converted_plans.values()) /len(converted_plans) if converted_plans else 0

                        converted_actuals, base_unit_id = convert_quarterly_performance_to_base(annual_kpi)
                        total_actual_base = sum(v if v is not None else 0 for v in converted_actuals.values()) / len(converted_actuals) if converted_actuals else 0
                    else:
                        # Convert quarterly values to base unit
                        converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)
                        total_planned_base = sum(converted_plans.values()) if converted_plans else 0

                        converted_actuals, base_unit_id = convert_quarterly_performance_to_base(annual_kpi)
                        total_actual_base = sum(v if v is not None else 0 for v in converted_actuals.values()) if converted_actuals else 0
    
                    # Calculate KPI performance percentage
                    if total_planned_base > 0:
                        performance_percentage = (total_actual_base / total_planned_base) * 100
                        total_performance += performance_percentage
                        valid_kpi_count += 1  # Only count KPIs with valid performance

            # Compute average performance for the strategic goal
            avg_performance = (total_performance / valid_kpi_count) if valid_kpi_count > 0 else None

            # Append the aggregated performance for the strategic goal
            performance_data.append({
                "strategic_goal": strategic_goal.name,
                "performance_percentage": round(avg_performance, 2) if avg_performance is not None else None
            })
    if request.user.sector_id:

        all_strategic_goals = all_strategic_goals.filter(sector_id=request.user.sector_id)
        division_ids = Division.objects.filter(sector_id=request.user.sector_id, is_deleted=False).values_list('id', flat=True)

        if filter_division:
            sector_of_division = Division.objects.get(id=filter_division).sector_id
            all_strategic_goals = all_strategic_goals.filter(sector_id=sector_of_division)
        # Loop over each strategic goal to calculate aggregated performance
        for strategic_goal in all_strategic_goals:
            # Fetch all related MainGoals for this strategic goal
            main_goals = MainGoal.objects.filter(strategic_goal_id=strategic_goal)
            # Fetch all related KPIs for these MainGoals
            kpis = KPI.objects.filter(main_goal_id__in=main_goals)
            if filter_kpi:
                kpis = kpis.filter(id=filter_kpi)

            total_performance = 0
            valid_kpi_count = 0  # Track number of KPIs with valid performance

            # Loop over each KPI
            for kpi in kpis:
                annual_kpis = AnnualKPI.objects.filter(kpi=kpi, year=year,division_id__in=division_ids)
                if annual_kpis.exists():
                    annual_kpi = annual_kpis[0]

                    # Convert quarterly values to base unit
                    converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)
                    total_planned_base = sum(converted_plans.values()) if converted_plans else 0

                    converted_actuals, base_unit_id = convert_quarterly_performance_to_base(annual_kpi)
                    total_actual_base = sum(v if v is not None else 0 for v in converted_actuals.values()) if converted_actuals else 0

                    # Calculate KPI performance percentage
                    if total_planned_base > 0:
                        performance_percentage = (total_actual_base / total_planned_base) * 100
                        total_performance += performance_percentage
                        valid_kpi_count += 1  # Only count KPIs with valid performance

            # Compute average performance for the strategic goal
            avg_performance = (total_performance / valid_kpi_count) if valid_kpi_count > 0 else None

            # Append the aggregated performance for the strategic goal
            performance_data.append({
                "strategic_goal": strategic_goal.name,
                "performance_percentage": round(avg_performance, 2) if avg_performance is not None else None
            })
    if request.user.division_id:

        sector_of_division = Division.objects.get(id=request.user.division_id.id).sector_id
        all_strategic_goals = all_strategic_goals.filter(sector_id=sector_of_division)
        # Loop over each strategic goal to calculate aggregated performance
        for strategic_goal in all_strategic_goals:
            # Fetch all related MainGoals for this strategic goal
            main_goals = MainGoal.objects.filter(strategic_goal_id=strategic_goal)
            # Fetch all related KPIs for these MainGoals
            kpis = KPI.objects.filter(main_goal_id__in=main_goals)
            if filter_kpi:
                kpis = kpis.filter(id=filter_kpi)

            total_performance = 0
            valid_kpi_count = 0  # Track number of KPIs with valid performance

            # Loop over each KPI
            for kpi in kpis:
                annual_kpis = AnnualKPI.objects.filter(kpi=kpi, year=year,division_id=request.user.division_id)
                if annual_kpis.exists():
                    annual_kpi = annual_kpis[0]

                    # Convert quarterly values to base unit
                    converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)
                    total_planned_base = sum(converted_plans.values()) if converted_plans else 0

                    converted_actuals, base_unit_id = convert_quarterly_performance_to_base(annual_kpi)
                    total_actual_base = sum(v if v is not None else 0 for v in converted_actuals.values()) if converted_actuals else 0

                    # Calculate KPI performance percentage
                    if total_planned_base > 0:
                        performance_percentage = (total_actual_base / total_planned_base) * 100
                        total_performance += performance_percentage
                        valid_kpi_count += 1  # Only count KPIs with valid performance

            # Compute average performance for the strategic goal
            avg_performance = (total_performance / valid_kpi_count) if valid_kpi_count > 0 else None

            # Append the aggregated performance for the strategic goal
            performance_data.append({
                "strategic_goal": strategic_goal.name,
                "performance_percentage": round(avg_performance, 2) if avg_performance is not None else None
            })

    return performance_data



def annual_kpi_table_data(request, year):
    table_data = []
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    filter_kpi = request.query_params.get('kpi')

    if request.user.monitoring_id or request.user.is_superadmin:
        # Fetch all AnnualKPI records for the given year
        annual_kpis = AnnualKPI.objects.filter(year=year)
        if filter_sector:
            division_ids = Division.objects.filter(sector_id=filter_sector, is_deleted=False).values_list('id', flat=True)
            annual_kpis = annual_kpis.filter(division_id__in=division_ids)
        if filter_division:
            annual_kpis = annual_kpis.filter(division_id=filter_division)
        if filter_kpi:
            annual_kpis = annual_kpis.filter(kpi_id=filter_kpi)

        for annual_kpi in annual_kpis:
            # Convert quarterly plan values to base unit
            converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)

            # Convert quarterly performance values to base unit
            converted_performance, _ = convert_quarterly_performance_to_base(annual_kpi)

            if annual_kpi.operation == "sum":
                total_plan = sum(v if v is not None else 0 for v in converted_plans.values())
                total_actual = sum(v if v is not None else 0 for v in converted_performance.values())
            elif annual_kpi.operation == "average":
                total_plan = sum(v if v is not None else 0 for v in converted_plans.values()) / len(converted_plans)
                total_actual = sum(v if v is not None else 0 for v in converted_performance.values()) / len(converted_performance)

            # Extract plan and performance values, keeping None values intact
            pl1 = converted_plans.get('pl1')
            pl2 = converted_plans.get('pl2')
            pl3 = converted_plans.get('pl3')
            pl4 = converted_plans.get('pl4')

            pr1 = converted_performance.get('pr1')
            pr2 = converted_performance.get('pr2')
            pr3 = converted_performance.get('pr3')
            pr4 = converted_performance.get('pr4')

            # Calculate performance percentages, using "N/A" for None or 0 plan values
            q1_performance = round((pr1 / pl1) * 100, 2) if pl1 and pr1 is not None else "N/A"
            q2_performance = round((pr2 / pl2) * 100, 2) if pl2 and pr2 is not None else "N/A"
            q3_performance = round((pr3 / pl3) * 100, 2) if pl3 and pr3 is not None else "N/A"
            q4_performance = round((pr4 / pl4) * 100, 2) if pl4 and pr4 is not None else "N/A"
            total_performance = round((total_actual / total_plan) * 100, 2) if total_plan > 0 else "N/A"

            # Append the data to table_data
            table_data.append({
                "kpi": annual_kpi.kpi.name if annual_kpi.kpi else "N/A",
                "weight": annual_kpi.weight or 0,
                "total_plan": round(total_plan, 2) if total_plan else "N/A",
                "q1_performance(%)": q1_performance,
                "q2_performance(%)": q2_performance,
                "q3_performance(%)": q3_performance,
                "q4_performance(%)": q4_performance,
                "total_performance(%)": total_performance,
            })
    if request.user.sector_id:
        # Fetch all AnnualKPI records for the given year
        division_ids = Division.objects.filter(sector_id=request.user.sector_id, is_deleted=False).values_list('id', flat=True)
        annual_kpis = AnnualKPI.objects.filter(year=year,division_id__in=division_ids)

        if filter_division:
            annual_kpis = annual_kpis.filter(division_id__in=filter_division)
        if filter_kpi:
            annual_kpis = annual_kpis.filter(kpi_id=filter_kpi)

        for annual_kpi in annual_kpis:
            # Convert quarterly plan values to base unit
            converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)

            # Convert quarterly performance values to base unit
            converted_performance, _ = convert_quarterly_performance_to_base(annual_kpi)

            # Ensure None values are replaced with 0 for the total plan and total actual
            if annual_kpi.operation == "sum":
                total_plan = sum(v if v is not None else 0 for v in converted_plans.values())
                total_actual = sum(v if v is not None else 0 for v in converted_performance.values())
            elif annual_kpi.operation == "average":
                total_plan = sum(v if v is not None else 0 for v in converted_plans.values()) / len(converted_plans)
                total_actual = sum(v if v is not None else 0 for v in converted_performance.values()) / len(converted_performance)

            # Extract plan and performance values, keeping None values intact
            pl1 = converted_plans.get('pl1')
            pl2 = converted_plans.get('pl2')
            pl3 = converted_plans.get('pl3')
            pl4 = converted_plans.get('pl4')

            pr1 = converted_performance.get('pr1')
            pr2 = converted_performance.get('pr2')
            pr3 = converted_performance.get('pr3')
            pr4 = converted_performance.get('pr4')

            # Calculate performance percentages, using "N/A" for None or 0 plan values
            q1_performance = round((pr1 / pl1) * 100, 2) if pl1 and pr1 is not None else "N/A"
            q2_performance = round((pr2 / pl2) * 100, 2) if pl2 and pr2 is not None else "N/A"
            q3_performance = round((pr3 / pl3) * 100, 2) if pl3 and pr3 is not None else "N/A"
            q4_performance = round((pr4 / pl4) * 100, 2) if pl4 and pr4 is not None else "N/A"
            total_performance = round((total_actual / total_plan) * 100, 2) if total_plan > 0 else "N/A"

            # Append the data to table_data
            table_data.append({
                "kpi": annual_kpi.kpi.name if annual_kpi.kpi else "N/A",
                "weight": annual_kpi.weight or 0,
                "total_plan": round(total_plan, 2) if total_plan else "N/A",
                "q1_performance(%)": q1_performance,
                "q2_performance(%)": q2_performance,
                "q3_performance(%)": q3_performance,
                "q4_performance(%)": q4_performance,
                "total_performance(%)": total_performance,
            })
    if request.user.division_id:
        # Fetch all AnnualKPI records for the given year
        annual_kpis = AnnualKPI.objects.filter(year=year)
        annual_kpis = annual_kpis.filter(division_id=request.user.division_id)
        if filter_kpi:
            annual_kpis = annual_kpis.filter(kpi_id=filter_kpi)

        for annual_kpi in annual_kpis:
            # Convert quarterly plan values to base unit
            converted_plans, base_unit_id = convert_quarterly_plans_to_base(annual_kpi)

            # Convert quarterly performance values to base unit
            converted_performance, _ = convert_quarterly_performance_to_base(annual_kpi)

            if annual_kpi.operation == "sum":
                total_plan = sum(v if v is not None else 0 for v in converted_plans.values())
                total_actual = sum(v if v is not None else 0 for v in converted_performance.values())
            elif annual_kpi.operation == "average":
                total_plan = sum(v if v is not None else 0 for v in converted_plans.values()) / len(converted_plans)
                total_actual = sum(v if v is not None else 0 for v in converted_performance.values()) / len(converted_performance)

            # Extract plan and performance values, keeping None values intact
            pl1 = converted_plans.get('pl1')
            pl2 = converted_plans.get('pl2')
            pl3 = converted_plans.get('pl3')
            pl4 = converted_plans.get('pl4')

            pr1 = converted_performance.get('pr1')
            pr2 = converted_performance.get('pr2')
            pr3 = converted_performance.get('pr3')
            pr4 = converted_performance.get('pr4')

            # Calculate performance percentages, using "N/A" for None or 0 plan values
            q1_performance = round((pr1 / pl1) * 100, 2) if pl1 and pr1 is not None else "N/A"
            q2_performance = round((pr2 / pl2) * 100, 2) if pl2 and pr2 is not None else "N/A"
            q3_performance = round((pr3 / pl3) * 100, 2) if pl3 and pr3 is not None else "N/A"
            q4_performance = round((pr4 / pl4) * 100, 2) if pl4 and pr4 is not None else "N/A"
            total_performance = round((total_actual / total_plan) * 100, 2) if total_plan > 0 else "N/A"

            # Append the data to table_data
            table_data.append({
                "kpi": annual_kpi.kpi.name if annual_kpi.kpi else "N/A",
                "weight": annual_kpi.weight or 0,
                "total_plan": round(total_plan, 2) if total_plan else "N/A",
                "q1_performance(%)": q1_performance,
                "q2_performance(%)": q2_performance,
                "q3_performance(%)": q3_performance,
                "q4_performance(%)": q4_performance,
                "total_performance(%)": 100 if total_performance > 100 else total_performance

            })

    return table_data



def three_year_performance_data(request, filter_year):
    data = ThreeyearKPI.objects.all()
    print("data:", data)
    final_data = []
    filtered_years = []  # Initialize filtered_years to an empty list.
    filter_sector = request.query_params.get('sector')
    filter_division = request.query_params.get('division')
    kpi_filter = request.query_params.get('kpi')

    if request.user.monitoring_id or request.user.is_superadmin:
        # Fetch all KPIs
        data = data
    if request.user.sector_id:
        # Fetch KPIs for the user's sector
        divisions = Division.objects.filter(sector_id=request.user.sector_id)
        division_ids = divisions.values_list('id', flat=True)
        data = data.filter(division_id__in=division_ids)
    if request.user.division_id:
        # Fetch KPIs for the user's woreda sector
        data = data.filter(division_id=request.user.division_id)
    if filter_sector:
        # Filter KPIs by sector
        divisions = Division.objects.filter(sector_id=filter_sector, is_deleted=False)
        division_ids = divisions.values_list('id', flat=True)
        data = data.filter(division_id__in=division_ids)
    if filter_division: 
        # Filter KPIs by division
        data = data.filter(division_id=filter_division)     
    if kpi_filter:
        data = data.filter(kpi=kpi_filter)

    for item in data:
        year_labels = [item.year_one, item.year_two, item.year_three]

        if int(filter_year) not in year_labels:
            print(f"Skipping KPI {item.id} as it doesn't include the filter_year {filter_year}.")
            continue  # Skip if this KPI doesn't include the filter_year

        try:
            converted_plans, _ = convert_three_plan_to_base(item)
            converted_performance, _ = convert_three_performance_to_base(item)
            print("converted_plans:", converted_plans)
            print("converted_performance:", converted_performance)
        except Exception as e:
            print(f"Error in conversion for KPI {item.id}: {str(e)}")
            continue

        # Slice data from the filter_year onward
        start_index = year_labels.index(int(filter_year))
        filtered_years = year_labels[start_index:]
        filtered_plan_values = list(converted_plans.values())[start_index:]
        filtered_perf_values = list(converted_performance.values())[start_index:]

        # Build performance % series
        performance_percentages = []
        for plan, actual in zip(filtered_plan_values, filtered_perf_values):
            actual = actual or 0
            plan = plan or 0

            if plan == 0:
                performance_percentages.append(0)
            else:
                performance = (actual / plan) * 100
                performance_percentages.append(round(min(performance, 100), 2))

        # Skip KPIs that have all 0% performance
        if all(value == 0 for value in performance_percentages):
            print(f"Skipping KPI {item.id} as all performance percentages are zero.")
            continue

        final_data.append({
            "name": str(item.kpi.name if item.kpi else f"KPI {item.id}"),
            "data": performance_percentages
        })

    return {
        "categories": filtered_years,
        "series": final_data
    }
