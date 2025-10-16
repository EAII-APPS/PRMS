from django.db import models
from django.core.validators import MinValueValidator
from planApp.models import *
import datetime


# Create your models here.



class KPIDescription(models.Model):
    id = models.AutoField(primary_key=True)
    kpi_id = models.ForeignKey('planApp.AnnualKPI', related_name='kpidescription', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.kpi_id.kpi.name}"

class Description(models.Model):
    id = models.AutoField(primary_key=True)
    kpid_id = models.ForeignKey(KPIDescription, related_name='description', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.kpid_id}"
        
    
class KPIPhotos(models.Model):
    id = models.AutoField(primary_key=True)
    des_id = models.ForeignKey(Description, related_name='description_photo', on_delete=models.CASCADE, null=True, blank=True)
    photos = models.FileField(upload_to='kpidescription/files/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.des_id}"


    
class ReportSummary(models.Model):
    titles = models.CharField(max_length=1000, null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    sector_id = models.ForeignKey('userApp.Sector', related_name='sector_summaryreport', null=True, blank=True, on_delete=models.CASCADE)
    monitoring_id = models.ForeignKey('userApp.Monitoring', related_name='monitoring_summaryreport', null=True, blank=True, on_delete=models.CASCADE)
    division_id = models.ForeignKey('userApp.Division', related_name='division_summaryreport', null=True, blank=True, on_delete=models.CASCADE)



class Summary(models.Model):
    id = models.AutoField(primary_key=True)
    # reportsummary = models.ForeignKey(ReportSummary, on_delete=models.CASCADE, null=True, blank=True, related_name='summary_report')
    year = models.PositiveIntegerField(null=True, blank=True)
    quarter = models.CharField(max_length=1000, null=True, blank=True)
    type = models.CharField(max_length=1000, null=True, blank=True)
    title = models.CharField(max_length=1000, null=True, blank=True)
    description = models.TextField( null=True, blank=True)
    sector_id = models.ForeignKey('userApp.Sector', related_name='sector_summary', null=True, blank=True, on_delete=models.CASCADE)
    monitoring_id = models.ForeignKey('userApp.Monitoring', related_name='monitoring_summary', null=True, blank=True, on_delete=models.CASCADE)
    division_id = models.ForeignKey('userApp.Division', related_name='division_summary', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title}"

class SummarySubtitle(models.Model):
    summary = models.ForeignKey(Summary, related_name='summary_subtitle', null=True, blank=True, on_delete=models.CASCADE)
    subtitle = models.CharField(max_length=1000, null=True, blank=True)
    description = models.TextField( null=True, blank=True)

    def __str__(self):
        return f"{self.subtitle}"


class SummaryFiles(models.Model):
    summary = models.ForeignKey(Summary, related_name='summary_files', null=True, blank=True, on_delete=models.CASCADE)
    photos = models.FileField(upload_to='summary/files/', null=True, blank=True)

    def __str__(self):
        return f"{self.photos}"


class SubtitleFiles(models.Model):
    subtitle = models.ForeignKey(SummarySubtitle, related_name='summary_photo', null=True, blank=True, on_delete=models.CASCADE)
    photos = models.FileField(upload_to='subtitle/files', null=True, blank=True)

    def __str__(self):
        return f"{self.photos}"



class Measure(models.Model):
    name = models.CharField(max_length=450)
    def __str__(self):
        return f"{self.name}"

class Unit(models.Model):
    name = models.CharField(max_length=45)
    measure_id = models.ForeignKey('Measure', related_name='units', on_delete=models.CASCADE, null=True, blank=True)
    symbol = models.CharField(max_length=10, null=True, blank=True)
    conversionFactor = models.FloatField(max_length=45)
    isBaseUnit = models.BooleanField(default=0)

    def __str__(self):
        return self.name



