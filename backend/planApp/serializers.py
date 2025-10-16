# serializers.py
from rest_framework import serializers
from .models import *
from reportApp.models import Measure

class StrategicGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = StrategicGoal
        fields =  '__all__' 

    def create(self, validated_data):
        return StrategicGoal.objects.create(**validated_data)
        fields = ['id', 'name', 'weight']  


class MainGoalSerializer(serializers.ModelSerializer):
    strategic_name = serializers.CharField(source='strategic_goal_id.name', read_only=True)
    sector_id = serializers.PrimaryKeyRelatedField(queryset=Sector.objects.all(), many=True, required=False)
    class Meta:
        model = MainGoal
        fields = ['id', 'name', 'strategic_name', 'strategic_goal_id', 'weight', 'expected_outcome', 'added_by', 'sector_id', 'monitoring_id', 'division_id']

    def create(self, validated_data):
        # Remove the 'sector_id' field from validated_data so we can handle it separately
        sector_data = validated_data.pop('sector_id', [])

        # Create the MainGoal object first
        main_goal = MainGoal.objects.create(**validated_data)

        # Now associate the sectors (ManyToManyField)
        if sector_data:
            main_goal.sector_id.set(sector_data)  # Use .set() to associate the ManyToManyField

        return main_goal
    
    def update(self, instance, validated_data):
        # Pop sector_id from validated data to handle separately
        sector_data = validated_data.pop('sector_id', None)

        # Update the MainGoal instance with other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Save the instance first
        instance.save()

        # If there's a sector_id update, handle it separately
        if sector_data is not None:
            instance.sector_id.set(sector_data)

        return instance


class KPISerializer(serializers.ModelSerializer):
    maingoal_name = serializers.CharField(source='main_goal_id.name', read_only=True) 
    sector_id = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
        source='main_goal_id.sector_id'
    )
    class Meta:
        model = KPI
        fields = ['id', 'name', 'main_goal_id', 'maingoal_name','sector_id','division_id','status']

    def create(self, validated_data):
        division_data = validated_data.pop('division_id', [])
        kpi = KPI.objects.create(**validated_data)
        if division_data:
            kpi.division_id.set(division_data)
        return kpi

class AnnualKPISerializer(serializers.ModelSerializer):
    kpi_name = serializers.CharField(source='kpi.name', read_only=True)
    maingoal_name = serializers.CharField(source='kpi.main_goal_id.name', read_only=True)
  # Ensure this matches the method name below

    class Meta:
        model = AnnualKPI
        fields = [
            'id',
            'kpi',
            'kpi_name',
            'division_id',
            'maingoal_name',  # This will use the get_maingoal_name method
            'measure',
            'annual',
            'annual_unit_id',
            'year',
            'initial',
            'initial_unit_id',
            'weight',
            'pl1', 'pl2', 'pl3', 'pl4',
            'pl1_unit_id', 'pl2_unit_id', 'pl3_unit_id', 'pl4_unit_id',
            'pr1', 'pr2', 'pr3', 'pr4',
            'pr1_unit_id', 'pr2_unit_id', 'pr3_unit_id', 'pr4_unit_id',
            'operation',
            'incremental',
        ]

    def get_maingoal_name(self, obj):
        """Retrieve the main goal name dynamically."""
        maingoal = MainGoal.objects.filter(id=obj.kpi.main_goal_id).first()
        return maingoal.name if maingoal else None
    
    
class ThreeyearKPISerializer(serializers.ModelSerializer):
    kpi_name = serializers.CharField(source='kpi.name', read_only=True)
    maingoal_name = serializers.CharField(source='kpi.main_goal_id.name', read_only=True)
  # Ensure this matches the method name below

    class Meta:
        model = ThreeyearKPI
        fields = ['id','kpi','measure','initial','initial_unit_id',"three_year","three_year_unit_id", 'year_one','year_one_value','year_one_unit','year_one_performance','year_one_performance_unit',  'year_two', 'year_two_value', 
                  'year_two_unit','year_two_performance','year_two_performance_unit', 'year_three', 'year_three_value', 'year_three_unit','year_three_performance','year_three_performance_unit', 'maingoal_name', 'kpi_name', 'division_id','operation',]



class PlanphotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planphotos
        fields = ('id', 'photos', 'subtitle', 'plan_narration')

class SubtitleSerializer(serializers.ModelSerializer):
    Plan_photos = PlanphotosSerializer(many=True, required=False)

    class Meta:
        model = Subtitle
        fields = ('id', 'subtitle', 'description', 'Plan_photos')

    def create(self, validated_data):
        photos_data = validated_data.pop('Plan_photos', [])
        subtitle = Subtitle.objects.create(**validated_data)
        for photo_data in photos_data:
            Planphotos.objects.create(subtitle=subtitle, **photo_data)
        return subtitle

    def update(self, instance, validated_data):
        photos_data = validated_data.pop('Plan_photos', [])
        instance.subtitle = validated_data.get('subtitle', instance.subtitle)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        if photos_data:
            instance.photos.all().delete()
            for photo_data in photos_data:
                Planphotos.objects.create(subtitle=instance, **photo_data)
        return instance

class PlanNarrationSerializer(serializers.ModelSerializer):
    subtitles = SubtitleSerializer(many=True, required=False)
    Plan_photos = PlanphotosSerializer(many=True, required=False)

    class Meta:
        model = PlanNarration
        fields = ('id', 'section_type','title','description', 'subtitles', 'Plan_photos')

    def create(self, validated_data):
        subtitles_data = validated_data.pop('subtitles', [])
        photos_data = validated_data.pop('Plan_photos', [])
        plan_narration = PlanNarration.objects.create(**validated_data)
        for subtitle_data in subtitles_data:
            photos_data_for_subtitle = subtitle_data.pop('Plan_photos', [])
            subtitle = Subtitle.objects.create(plan_narration=plan_narration, **subtitle_data)
            for photo_data in photos_data_for_subtitle:
                Planphotos.objects.create(subtitle=subtitle, **photo_data)
        for photo_data in photos_data:
            Planphotos.objects.create(plan_narration=plan_narration, **photo_data)
        return plan_narration

    def update(self, instance, validated_data):
        subtitles_data = validated_data.pop('subtitles', [])
        photos_data = validated_data.pop('Plan_photos', None)
        instance.section_type = validated_data.get('section_type', instance.section_type)
        instance.description = validated_data.get('description', instance.description)
        instance.title = validated_data.get('title', instance.title)
        instance.save()

        if subtitles_data:
            for subtitle_data in subtitles_data:
                photos_data_for_subtitle = subtitle_data.pop('Plan_photos', None)
                subtitle_instance = instance.subtitles.get(id=subtitle_data.get('id'))
                if subtitle_instance:
                    subtitle_instance.subtitle = subtitle_data.get('subtitle', subtitle_instance.subtitle)
                    subtitle_instance.description = subtitle_data.get('description', subtitle_instance.description)
                    subtitle_instance.save()

                    if photos_data_for_subtitle is not None:
                        for photo_data in photos_data_for_subtitle:
                            Planphotos.objects.create(subtitle=subtitle_instance, **photo_data)

        if photos_data is not None:
            for photo_data in photos_data:
                Planphotos.objects.create(plan_narration=instance, **photo_data)

        return instance

class PlanDocumentSerializer(serializers.ModelSerializer):
    plan_narrations = PlanNarrationSerializer(many=True, required=False)

    class Meta:
        model = PlanDocument
        fields = ('id', 'title', 'year', 'quarter', 'added_by', 'sector_id', 'monitoring_id', 'division_id', 'created_at','status','submitted','late', 'updated_at', 'plan_narrations')

    def create(self, validated_data):
        plan_narrations_data = validated_data.pop('plan_narrations', [])
        plan_document = PlanDocument.objects.create(**validated_data)
        for plan_narration_data in plan_narrations_data:
            subtitles_data = plan_narration_data.pop('subtitles', [])
            photos_data = plan_narration_data.pop('Plan_photos', [])
            plan_narration = PlanNarration.objects.create(plan_document=plan_document, **plan_narration_data)
            for subtitle_data in subtitles_data:
                photos_data_for_subtitle = subtitle_data.pop('Plan_photos', [])
                subtitle = Subtitle.objects.create(plan_narration=plan_narration, **subtitle_data)
                for photo_data in photos_data_for_subtitle:
                    Planphotos.objects.create(subtitle=subtitle, **photo_data)
            for photo_data in photos_data:
                Planphotos.objects.create(plan_narration=plan_narration, **photo_data)
        return plan_document

    def update(self, instance, validated_data):
        plan_narrations_data = validated_data.pop('plan_narrations', [])
        instance.title = validated_data.get('title', instance.title)
        instance.year = validated_data.get('year', instance.year)
        instance.quarter = validated_data.get('quarter', instance.quarter)
        instance.added_by = validated_data.get('added_by', instance.added_by)
        instance.sector_id = validated_data.get('sector_id', instance.sector_id)
        instance.monitoring_id = validated_data.get('monitoring_id', instance.monitoring_id)
        instance.division_id = validated_data.get('division_id', instance.division_id)
        instance.status = validated_data.get('status', instance.status)
        instance.submitted = validated_data.get('submitted', instance.submitted)
        instance.save()

        if plan_narrations_data:
            instance.plan_narrations.all().delete()
            for plan_narration_data in plan_narrations_data:
                subtitles_data = plan_narration_data.pop('subtitles', [])
                photos_data = plan_narration_data.pop('Plan_photos', [])
                plan_narration = PlanNarration.objects.create(plan_document=instance, **plan_narration_data)
                for subtitle_data in subtitles_data:
                    photos_data_for_subtitle = subtitle_data.pop('Plan_photos', [])
                    subtitle = Subtitle.objects.create(plan_narration=plan_narration, **subtitle_data)
                    for photo_data in photos_data_for_subtitle:
                        Planphotos.objects.create(subtitle=subtitle, **photo_data)
                for photo_data in photos_data:
                    Planphotos.objects.create(plan_narration=plan_narration, **photo_data)

        return instance