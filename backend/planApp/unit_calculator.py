from django.db.models import Q
from reportApp.models import *
from .models import *

def convert_quarterly_plans_to_base(annual_kpi):
    """
    Converts quarterly plan values (pl1, pl2, pl3, pl4) of an AnnualKPI instance to a base unit.

    Args:
        annual_kpi (AnnualKPI): An instance of the AnnualKPI model.

    Returns:
        dict: A dictionary containing converted plan values in the base unit,   with the base unit ID.
    """
    
    # Extract quarterly plan values and their respective unit IDs
    plan_values = {
        "pl1": annual_kpi.pl1,
        "pl2": annual_kpi.pl2,
        "pl3": annual_kpi.pl3,
        "pl4": annual_kpi.pl4
    }

    plan_unit_ids = {
        "pl1_unit_id": annual_kpi.pl1_unit_id_id,
        "pl2_unit_id": annual_kpi.pl2_unit_id_id,
        "pl3_unit_id": annual_kpi.pl3_unit_id_id,
        "pl4_unit_id": annual_kpi.pl4_unit_id_id
    }

    # Fetch the Measure object associated with this AnnualKPI
    measure = annual_kpi.measure

    # Find the base unit for this measure
    base_unit = Unit.objects.filter(measure_id=measure.id, isBaseUnit=True).first()
    if not base_unit:
        raise ValueError("Base unit for the specified measure not found!")

    # Fetch unit objects for the used unit IDs
    unit_ids = {uid for uid in plan_unit_ids.values() if uid is not None}
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk(field_name="id")

    # Convert each plan value to the base unit and assign base unit ID
    converted_values = {}
    base_unit_ids = {}

    for key, value in plan_values.items():
        if value is None:
            converted_values[key] = 0  # Treat None values as 0
            continue

        unit_id_key = key + "_unit_id"  # Get corresponding unit ID key
        unit = unit_objects.get(plan_unit_ids[unit_id_key])

        if unit:
            # Convert the value to the base unit using the conversion factor
            conversion_factor = unit.conversionFactor / base_unit.conversionFactor
            converted_values[key] = value * conversion_factor
            base_unit_ids[key] = base_unit.id  # Set the base unit ID for the plan
        else:
            converted_values[key] = value  # If no unit found, keep original value
            base_unit_ids[key] = None  # No base unit ID found

    return converted_values, base_unit.id

def convert_quarterly_performance_to_base(annual_kpi):
    """
    Converts quarterly performance values (pr1, pr2, pr3, pr4) of an AnnualKPI instance to a base unit.

    Args:
        annual_kpi (AnnualKPI): An instance of the AnnualKPI model.

    Returns:
        tuple: A dictionary containing converted performance values in the base unit, and the base unit ID.
    """

    # Extract quarterly performance values and their respective unit IDs
    performance_values = {
        "pr1": annual_kpi.pr1,
        "pr2": annual_kpi.pr2,
        "pr3": annual_kpi.pr3,
        "pr4": annual_kpi.pr4
    }

    performance_unit_ids = {
        "pr1_unit_id": annual_kpi.pr1_unit_id_id,
        "pr2_unit_id": annual_kpi.pr2_unit_id_id,
        "pr3_unit_id": annual_kpi.pr3_unit_id_id,
        "pr4_unit_id": annual_kpi.pr4_unit_id_id
    }

    # Fetch the Measure object associated with this AnnualKPI
    measure = annual_kpi.measure

    # Find the base unit for this measure
    base_unit = Unit.objects.filter(measure_id=measure.id, isBaseUnit=True).first()
    if not base_unit:
        raise ValueError("Base unit for the specified measure not found!")

    # Fetch unit objects for the used unit IDs
    unit_ids = {uid for uid in performance_unit_ids.values() if uid is not None}
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk(field_name="id")

    # Convert each performance value to the base unit
    converted_values = {}

    for key, value in performance_values.items():
        unit_id_key = key + "_unit_id"  # Get corresponding unit ID key
        unit = unit_objects.get(performance_unit_ids.get(unit_id_key))  # Get unit safely

        if value is None or unit is None:
            # If either value or unit is None, return None instead of converting
            converted_values[key] = None
        else:
            # Convert the value to the base unit using the conversion factor
            conversion_factor = unit.conversionFactor / base_unit.conversionFactor
            converted_values[key] = value * conversion_factor

    return converted_values, base_unit.id




def validate_annual_plan(annual_kpi_data):
    """
    Validates if the sum of quarterly plan values (pl1, pl2, pl3, pl4) matches the annual plan after unit conversion.

    Args:
        annual_kpi_data (dict): A dictionary containing AnnualKPI data from the request.

    Returns:
        tuple: (bool, str) - A boolean indicating success and a message.
    """
    
    # Extract values
    annual_plan = annual_kpi_data.get('annual')
    annual_unit_id = annual_kpi_data.get('annual_unit_id')
    operation = annual_kpi_data.get('operation', 'sum').lower()
    plan_values = {
        "pl1": annual_kpi_data.get('pl1', 0),
        "pl2": annual_kpi_data.get('pl2', 0),
        "pl3": annual_kpi_data.get('pl3', 0),
        "pl4": annual_kpi_data.get('pl4', 0)
    }

    plan_unit_ids = {
        "pl1_unit_id": annual_kpi_data.get('pl1_unit_id'),
        "pl2_unit_id": annual_kpi_data.get('pl2_unit_id'),
        "pl3_unit_id": annual_kpi_data.get('pl3_unit_id'),
        "pl4_unit_id": annual_kpi_data.get('pl4_unit_id')
    }

    # Fetch relevant units in one query
    unit_ids = {annual_unit_id} | {uid for uid in plan_unit_ids.values() if uid}
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk(field_name="id")

    # Convert quarterly plans to base units
    total_quarterly_base = 0
    for key, value in plan_values.items():
        unit_id_key = key + "_unit_id"
        unit = unit_objects.get(plan_unit_ids.get(unit_id_key))

        if unit:
            total_quarterly_base += float(value) * unit.conversionFactor
        else:
            total_quarterly_base += float(value)  # Assume base unit if no conversion factor
    # Convert annual plan to base unit
    if annual_unit_id in unit_objects:
        annual_base = float(annual_plan) * unit_objects[annual_unit_id].conversionFactor
    else:
        annual_base = float(annual_plan)

    # Determine comparison based on operation type
    if operation == 'sum':
        compare_value = total_quarterly_base
        op_desc = "sum"
    elif operation == 'average':
        compare_value = total_quarterly_base / 4
        op_desc = "average"
    else:
        return False, f"Unsupported operation '{operation}'."

    # Compare the computed value with the annual plan value (both in base unit)
    if round(compare_value, 2) != round(annual_base, 2):
        return False, f"The {op_desc} of quarterly plan values (converted) does not match the annual plan value."

    return True, "Validation successful."


def validate_three_plan(three_kpi_data):
    """
    Validates if the sum of quarterly plan values (pl1, pl2, pl3, pl4) matches the annual plan after unit conversion.

    Args:
        annual_kpi_data (dict): A dictionary containing AnnualKPI data from the request.

    Returns:
        tuple: (bool, str) - A boolean indicating success and a message.
    """
    
    # Extract values
    three_year = three_kpi_data.get('three_year')
    three_year_unit_id = three_kpi_data.get('three_year_unit_id')
    operation = three_kpi_data.get('operation', 'sum').lower()
    performance_values = {
        "year_one_value": three_kpi_data.get('year_one_value', 0),
        "year_two_value": three_kpi_data.get('year_two_value', 0),
        "year_three_value": three_kpi_data.get('year_three_value', 0),
    }

    performance_unit_ids = {
        "year_one_unit": three_kpi_data.get('year_one_unit'),
        "year_two_unit": three_kpi_data.get('year_two_unit'),
        "year_three_unit": three_kpi_data.get('year_three_unit'),
    }

    # Fetch relevant units in one query
    unit_ids = {three_year_unit_id} | {uid for uid in performance_unit_ids.values() if uid}
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk(field_name="id")

    # Convert quarterly plans to base units
    total_three_base = 0
    for key, value in performance_values.items():
        unit_id_key = key + "_unit_id"
        unit = unit_objects.get(performance_unit_ids.get(unit_id_key))

        if unit:
            total_three_base += float(value) * unit.conversionFactor
        else:
            total_three_base += float(value)  # Assume base unit if no conversion factor
    # Convert annual plan to base unit
    if three_year_unit_id in unit_objects:
        annual_base = float(three_year) * unit_objects[three_year_unit_id].conversionFactor
    else:
        annual_base = float(three_year)

    # Determine comparison based on operation type
    if operation == 'sum':
        compare_value = total_three_base
        op_desc = "sum"
    elif operation == 'average':
        compare_value = total_three_base / 3
        op_desc = "average"
    else:
        return False, f"Unsupported operation '{operation}'."

    # Compare the computed value with the annual plan value (both in base unit)
    if round(compare_value, 2) != round(annual_base, 2):
        return False, f"The {op_desc} of three year plan values (converted) does not match the three year plan value."

    return True, "Validation successful."


def convert_three_plan_to_base(annual_kpi):
    """
    Converts quarterly plan values (pl1, pl2, pl3, pl4) of an AnnualKPI instance to a base unit.

    Args:
        annual_kpi (AnnualKPI): An instance of the AnnualKPI model.

    Returns:
        dict: A dictionary containing converted plan values in the base unit,   with the base unit ID.
    """
    
    # Extract quarterly plan values and their respective unit IDs
    plan_values = {
        "year_one_value": annual_kpi.year_one_value,
        "year_two_value": annual_kpi.year_two_value,
        "year_three_value": annual_kpi.year_three_value,
    }

    plan_unit_ids = {
        "year_one_unit": annual_kpi.year_one_unit,
        "year_two_unit": annual_kpi.year_two_unit,
        "year_three_unit": annual_kpi.year_three_unit,
    }

    # Fetch the Measure object associated with this AnnualKPI
    measure = annual_kpi.measure
    print("plan unit ids:",plan_unit_ids)
    print("plan values:",plan_values)
    # Find the base unit for this measure
    base_unit = Unit.objects.filter(measure_id=measure, isBaseUnit=True).first()
    if not base_unit:
        raise ValueError("Base unit for the specified measure not found!")

    # Fetch unit objects for the used unit IDs
    unit_ids = {unit for unit in plan_unit_ids.values() if isinstance(unit, int) and unit is not None}
    print("Your unit id:",unit_ids)
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk()
    
    # Convert each plan value to the base unit and assign base unit ID
    converted_values = {}
    base_unit_ids = {}

    for key, value in plan_values.items():
        if value is None:
            converted_values[key] = 0  # Treat None values as 0
            continue

        unit_id_key = key.replace("value", "unit")
        unit = unit_objects.get(plan_unit_ids[unit_id_key])

        if unit:
            # Convert the value to the base unit using the conversion factor
            conversion_factor = unit.conversionFactor / base_unit.conversionFactor
            converted_values[key] = value * conversion_factor
            base_unit_ids[key] = base_unit.id  # Set the base unit ID for the plan
        else:
            converted_values[key] = value  # If no unit found, keep original value
            base_unit_ids[key] = None  # No base unit ID found

    return converted_values, base_unit.id

def convert_three_performance_to_base(three_kpi):
    """
    Converts quarterly plan values (pl1, pl2, pl3, pl4) of an AnnualKPI instance to a base unit.

    Args:
        annual_kpi (AnnualKPI): An instance of the AnnualKPI model.

    Returns:
        dict: A dictionary containing converted plan values in the base unit,   with the base unit ID.
    """
    
    # Extract quarterly plan values and their respective unit IDs
    # Extract quarterly plan values and their respective unit IDs
    performance_values = {
        "year_one_performance": three_kpi.year_one_performance,
        "year_two_performance": three_kpi.year_two_performance,
        "year_three_performance": three_kpi.year_three_performance,
    }

    performance_unit_ids = {
        "year_one_performance_unit": three_kpi.year_one_performance_unit,
        "year_two_performance_unit": three_kpi.year_two_performance_unit,
        "year_three_performance_unit": three_kpi.year_three_performance_unit,
    }

        # Check if there is any performance data
    print("Your performance values:",performance_values)

    # Fetch the Measure object associated with this AnnualKPI
    measure = three_kpi.measure

    # Find the base unit for this measure
    base_unit = Unit.objects.filter(measure_id=measure, isBaseUnit=True).first()
    if not base_unit:
        raise ValueError("Base unit for the specified measure not found!")

    # Fetch unit objects for the used unit IDs
    print("Your performance values:",performance_values)
    print("Your unit id:",performance_unit_ids)
    unit_ids = {unit for unit in performance_unit_ids.values() if unit is not None}
    unit_ids = {
    unit.id if isinstance(unit, Unit) else unit
    for unit in performance_unit_ids.values()
    if unit is not None
    }

    print("Cleaned unit ids:", unit_ids)
    print("Your unit id:",unit_ids)
    unit_objects = Unit.objects.filter(id__in=unit_ids).in_bulk(field_name="id")
    print("Your unit object:",unit_objects)
    # Convert each plan value to the base unit and assign base unit ID
    converted_values = {}

    for key, value in performance_values.items():
        # Construct the corresponding unit ID key (e.g., 'year_one_performance_unit')
        unit_id_key = key + "_unit"  # Generate the correct unit key

        unit_id = performance_unit_ids.get(unit_id_key)

        if value is None or unit_id is None:
            converted_values[key] = None  # If no value or unit ID, return None
        else:
            unit = unit_objects.get(unit_id)
            if unit:
                # Convert the value to the base unit using the conversion factor
                conversion_factor = unit.conversionFactor / base_unit.conversionFactor
                converted_values[key] = value * conversion_factor
            else:
                # If unit is not found, just return the original value
                converted_values[key] = value

    return converted_values, base_unit.id