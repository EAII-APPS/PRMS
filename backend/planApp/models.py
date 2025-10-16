from django.db import models
from django.core.validators import MinValueValidator
import datetime
from django.core.exceptions import ValidationError
from django.db.models import Sum
from userApp.models import *
import re

from reportApp.models import *


def process_plan_value(plan_value):
    match = re.match(r"(\d*\.?\d+)([a-zA-Z%]*)", plan_value)
    if match:
        number_part = float(match.group(1))
        text_part = match.group(2)
        return number_part, text_part
    return 0.0, ""

def convert_to_bytes(value, unit):
    if unit:
        unit = unit.upper()
    if unit == 'KB':
        value *= 1024
    elif unit == 'MB':
        value *= 1024**2
    elif unit == 'GB':
        value *= 1024**3
    elif unit == 'TB':
        value *= 1024**4
    elif unit == 'PB':
        value = value * 1024**5
    return value


def convert_to(value, unit):
    # Convert the unit to uppercase for consistency
    unit = unit.upper()
    
    # Dictionary of conversion factors
    conversion_factors = {
        'BYTES': 1,
        'KB': 1024,
        'MB': 1024**2,
        'GB': 1024**3,
        'TB': 1024**4,
        'PB': 1024**5
    }
    
    # Check if the unit is valid
    if unit in conversion_factors:
        return value / conversion_factors[unit]
    else:
        raise ValueError(f"Invalid unit: {unit}")
    
def calculate_total_plan(*plans):
    total_bytes = 0
    percentage_values = []
    total_sum = 0
    has_unit = False
    units = []
    
    for plan in plans:
        if plan:
            number, plan_text = process_plan_value(plan)
            if plan_text.upper() in ['BYTES', 'KB', 'MB', 'GB', 'TB','PB']:
                byte_value = convert_to_bytes(number, plan_text)
                total_bytes += byte_value
                has_unit = True
                units.append(plan_text.upper())
            elif plan_text.upper() == '%':
                percentage_values.append(number)
                has_unit = True
            else:
                total_sum += number
    if percentage_values:
        average_percentage = sum(percentage_values)
        return f"{round(average_percentage)}%"
    elif has_unit:
        unit_order = ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB']
        largest_unit = max(units, key=lambda unit: unit_order.index(unit))
        total = convert_to(total_bytes,largest_unit)
        return f"{round(total)}{largest_unit}"
    else:
        return f"{round(total_sum)}"

def calculate_average_plan(*plans):
    total_bytes = 0
    percentage_values = []
    average_values = []
    total_sum = 0
    has_unit = False
    units = []
    
    for plan in plans:
        if plan:
            number, plan_text = process_plan_value(plan)
            
            # Handling byte units
            if plan_text.upper() in ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB']:
                byte_value = convert_to_bytes(number, plan_text)
                total_bytes += byte_value
                has_unit = True
                units.append(plan_text.upper())
            
            # Handling percentages
            elif plan_text.upper() == '%':
                percentage_values.append(number)
                # Don't mark has_unit as True for percentage cases
            
            # Handling plain numbers
            else:
                average_values.append(number)
                # total_sum += number
                
    
    # Calculate average for percentage values if they exist
    if percentage_values:
        average_percentage = sum(percentage_values) / len(percentage_values)
        return f"{round(average_percentage)}%"
    else:
        Average = sum(average_values)/len(average_values)
        return f"{round(Average)}"


class KPI(models.Model):
    name = models.CharField(max_length=500)
    main_goal_id = models.ForeignKey('MainGoal', on_delete=models.CASCADE, related_name='kpis')
    division_id = models.ManyToManyField('userApp.Division', related_name='kpis',blank=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.id} - {self.name}"

class ThreeyearKPI(models.Model):
    kpi = models.ForeignKey('KPI', on_delete=models.CASCADE, null=True, blank=True,related_name='threeyear_kpi_set')
    measure = models.ForeignKey('reportApp.Measure',  on_delete=models.CASCADE, null=True, blank=True)
    initial = models.FloatField(null=True, blank=True)
    initial_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='threeyear_kpis')
    three_year = models.FloatField( null=True, blank=True)
    three_year_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True)
    year_one = models.PositiveIntegerField(null=True, blank=True)
    year_one_value = models.FloatField(max_length=100,null=True)
    year_one_unit = models.ForeignKey('reportApp.Unit',  on_delete=models.CASCADE, null=True, blank=True, related_name='year_one_units')
    year_one_performance = models.FloatField(null=True, blank=True)
    year_one_performance_unit = models.ForeignKey('reportApp.Unit',  on_delete=models.CASCADE, null=True, blank=True, related_name='year_one_performance_units')
    year_two = models.PositiveIntegerField(null=True, blank=True)
    year_two_value = models.FloatField(max_length=100,null=True)
    year_two_unit = models.ForeignKey('reportApp.Unit',  on_delete=models.CASCADE, null=True, blank=True, related_name='year_two_units')
    year_two_performance = models.FloatField(null=True, blank=True)
    year_two_performance_unit = models.ForeignKey('reportApp.Unit',  on_delete=models.CASCADE, null=True, blank=True, related_name='year_two_performance_units')
    year_three = models.PositiveIntegerField(null=True, blank=True)
    year_three_value = models.FloatField(max_length=100,null=True)
    year_three_unit = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE, null=True, blank=True, related_name='year_three_units')
    year_three_performance = models.FloatField(null=True, blank=True)
    year_three_performance_unit = models.ForeignKey('reportApp.Unit',  on_delete=models.CASCADE, null=True, blank=True, related_name='year_three_performance_units')
    division_id = models.ForeignKey('userApp.Division', on_delete=models.CASCADE, null=True, blank=True)
    operation = models.CharField(max_length=45, default='sum', choices=[('sum', 'SUM'), ('average', 'AVERAGE')])

    
    def __str__(self):
        return f"{self.id} - {self.kpi}"

class AnnualKPI(models.Model):
    kpi = models.ForeignKey('KPI', on_delete=models.CASCADE, null=True, blank=True,related_name='annualkpi_set')
    measure = models.ForeignKey('reportApp.Measure', on_delete=models.CASCADE, null=True, blank=True)

    annual = models.FloatField( null=True, blank=True)
    annual_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True)
    division_id = models.ForeignKey('userApp.Division', on_delete=models.CASCADE, null=True, blank=True)

    year = models.PositiveIntegerField(validators=[MinValueValidator(limit_value=datetime.MINYEAR)])

    initial = models.FloatField()
    initial_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='initial_unit')

    weight = models.FloatField(null=True, blank=True)

    pl1 = models.FloatField()
    pl2 = models.FloatField()
    pl3 = models.FloatField()
    pl4 = models.FloatField()

    pl1_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pl1_unit')
    pl2_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pl2_unit')
    pl3_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pl3_unit')
    pl4_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pl4_unit')

    pr1 = models.FloatField( null=True,blank=True)
    pr2 = models.FloatField( null=True,blank=True)
    pr3 = models.FloatField( null=True,blank=True)
    pr4 = models.FloatField( null=True,blank=True)

    pr1_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pr1_unit')
    pr2_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pr2_unit')
    pr3_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pr3_unit')
    pr4_unit_id = models.ForeignKey('reportApp.Unit', on_delete=models.CASCADE,null=True, blank=True, related_name='pr4_unit')
    operation = models.CharField(max_length=45, default='sum', choices=[('sum', 'SUM'), ('average', 'AVERAGE')])
    incremental = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.id} - {self.kpi}"

class MainGoal(models.Model):
    name = models.CharField(max_length=500)
    strategic_goal_id = models.ForeignKey('StrategicGoal', on_delete=models.CASCADE, related_name='maingoals')
    weight = models.FloatField(null=True, blank=True)
    sector_id = models.ManyToManyField('userApp.Sector', blank=True)  # Removed on_delete
    monitoring_id = models.ForeignKey('userApp.Monitoring', on_delete=models.CASCADE, null=True, blank=True)
    division_id = models.ForeignKey('userApp.Division', on_delete=models.CASCADE, null=True, blank=True)
    added_by = models.ForeignKey('userApp.User', related_name='added_main_goals', null=True, on_delete=models.SET_NULL, blank=True)
    updated_by = models.ForeignKey('userApp.User', related_name='updated_main_goals', null=True, on_delete=models.SET_NULL, blank=True)
    deleted_by = models.ForeignKey('userApp.User', related_name='deleted_main_goals', null=True, on_delete=models.SET_NULL, blank=True)
    approved_by = models.ForeignKey('userApp.User', null=True, on_delete=models.SET_NULL, blank=True)
    expected_outcome = models.CharField(null=True, blank=True, max_length=500)
    status = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    is_approved = models.CharField(max_length=45, default='pending', choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')])
    comment = models.TextField(blank=True)


class StrategicGoal(models.Model):
    name = models.CharField(max_length=500)
    weight = models.FloatField(null=True, blank=True)
    sector_id = models.ManyToManyField('userApp.Sector', blank=True)
    description= models.TextField(null=True,blank=True)
    assigned = models.BooleanField(null=True, blank=True,default=False)
    added_by = models.ForeignKey('userApp.User', related_name='added_strategic_goals', null=True, on_delete=models.SET_NULL,blank=True)
    updated_by = models.ForeignKey('userApp.User', related_name='updated_strategic_goals', null=True, on_delete=models.SET_NULL,blank=True)
    deleted_by = models.ForeignKey('userApp.User', related_name='deleted_strategic_goals', null=True, on_delete=models.SET_NULL,blank=True)
    status = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name



    def save(self, *args, **kwargs):
        if self.pk is None:  # Check if the instance is being created
            if self.weight is None:
                self.weight = 0
            elif not isinstance(self.weight, (int, float)):
                raise ValidationError("Weight must be an integer or float.")

            existing_total_weight = StrategicGoal.objects.filter(is_deleted=False).aggregate(total_weight=Sum('weight'))['total_weight'] or 0
            total_weight = existing_total_weight + self.weight
            left_weight = 100 - existing_total_weight

            if total_weight > 100:
                raise ValidationError("Total weight of Strategic Goals cannot exceed 100. Current weight is: {}, the remaining weight is: {}".format(existing_total_weight, left_weight))
        
        else:  # Check if the instance is being updated
            original_instance = StrategicGoal.objects.get(pk=self.pk)
            existing_total_weight = (StrategicGoal.objects.filter(is_deleted=False).exclude(pk=self.pk).aggregate(total_weight=Sum('weight'))['total_weight'] or 0) + original_instance.weight
            total_weight = existing_total_weight + (self.weight or 0) - original_instance.weight
            left_weight = 100 - existing_total_weight

            if total_weight > 100:
                raise ValidationError("Total weight of Strategic Goals cannot exceed 100. Current weight is: {}, the remaining weight is: {}".format(existing_total_weight, left_weight))

        super(StrategicGoal, self).save(*args, **kwargs)



# Narration Models

class PlanDocument(models.Model):
    title = models.CharField(max_length=255)
    year = models.PositiveIntegerField(null=True)
    quarter = models.PositiveSmallIntegerField(null=True)
    added_by = models.ForeignKey('userApp.User', on_delete=models.SET_NULL, null=True, blank=True)
    sector_id = models.ForeignKey('userApp.Sector', on_delete=models.SET_NULL, null=True, blank=True)
    monitoring_id = models.ForeignKey('userApp.Monitoring', on_delete=models.SET_NULL, null=True, blank=True)
    division_id = models.ForeignKey('userApp.Division', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=False, verbose_name='Approval Status', help_text='Indicates if the plan document is approved by its sector.')
    submitted = models.BooleanField(default=False, verbose_name='Submition Status', help_text='Indicates if the plan document is submitted.')
    late = models.BooleanField(default=False,verbose_name='On time status',help_text="This will indicate if the user subitted the document late or not.")
    def __str__(self):
        return self.title


class PlanNarration(models.Model):
    SECTION_TYPE_CHOICES = [
        ('መግቢያ', 'መግቢያ'),
        ('የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች', 'የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች'),
        ('የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር', 'የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር'),
        ('የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች', 'የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች'),
    ]

    plan_document = models.ForeignKey(PlanDocument, null=True,blank=True,on_delete=models.CASCADE, related_name='plan_narrations')
    section_type = models.CharField(max_length=255, choices=SECTION_TYPE_CHOICES)
    title = models.CharField(max_length=255,null=True,blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f'{self.title} ({self.get_section_type_display()})'


class Subtitle(models.Model):
    plan_narration = models.ForeignKey(PlanNarration, on_delete=models.CASCADE, related_name='subtitles')
    subtitle = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.subtitle
    
class Planphotos(models.Model):
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, null=True, blank=True, related_name='Plan_photos')
    plan_narration = models.ForeignKey(PlanNarration, on_delete=models.CASCADE, null=True, blank=True, related_name='Plan_photos')
    photos = models.FileField(upload_to='plandoc/files', null=True, blank=True)

    def __str__(self):
        return f"Photo {self.id}"