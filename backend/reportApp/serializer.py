from rest_framework import serializers
from .models import *
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.uploadedfile import UploadedFile
from PIL import Image


class KPIPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = KPIPhotos
        fields = ['id', 'photos']
        extra_kwargs = {
            'photos': {'required': False}
        }

class DescriptionSerializer(serializers.ModelSerializer):
    description_photo = KPIPhotosSerializer(many=True, read_only=True)

    class Meta:
        model = Description
        fields = ['id', 'description', 'description_photo']

   

class KPIDescriptionSerializer(serializers.ModelSerializer):
    description = DescriptionSerializer(many=True, read_only=True)
    description_payload = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
    )
    kpi_name = serializers.CharField(source='kpi_id.kpi.name', read_only=True)
    kpi_year = serializers.IntegerField(source='kpi_id.year', read_only=True)
    measure_name = serializers.CharField(source='kpi_id.measure.name', read_only=True)

    class Meta:
        model = KPIDescription
        fields = [
            'id',
            'kpi_id',
            'description',
            'description_payload',
            'kpi_name',
            'kpi_year',
            'measure_name',
        ]

    def _sync_descriptions(self, kpidescription, descriptions_data, files_map):
        incoming_description_ids = set()

        for index, description_data in enumerate(descriptions_data):
            description_id = description_data.get('id')
            if description_id not in (None, ''):
                try:
                    description_id = int(description_id)
                except (TypeError, ValueError):
                    description_id = None
            description_text = description_data.get('description', '')
            keep_photo_ids = set()
            for photo_id in description_data.get('existing_photo_ids', []):
                if photo_id in (None, ''):
                    continue
                try:
                    keep_photo_ids.add(int(photo_id))
                except (TypeError, ValueError):
                    continue

            description_instance = None
            if description_id:
                description_instance = Description.objects.filter(
                    pk=description_id,
                    kpid_id=kpidescription,
                ).first()

            if description_instance:
                description_instance.description = description_text
                description_instance.save()
            else:
                description_instance = Description.objects.create(
                    kpid_id=kpidescription,
                    description=description_text,
                )

            incoming_description_ids.add(description_instance.id)

            if description_id:
                existing_photos = KPIPhotos.objects.filter(des_id=description_instance)
                if keep_photo_ids:
                    existing_photos.exclude(id__in=keep_photo_ids).delete()
                else:
                    existing_photos.delete()

            for uploaded_file in files_map.get(index, []):
                KPIPhotos.objects.create(
                    des_id=description_instance,
                    photos=uploaded_file,
                )

        kpidescription.description.exclude(id__in=incoming_description_ids).delete()

    def create(self, validated_data):
        descriptions_data = validated_data.pop('description_payload', [])
        files_map = self.context.get('description_files_map', {})
        kpidescription = KPIDescription.objects.create(**validated_data)
        if descriptions_data:
            self._sync_descriptions(kpidescription, descriptions_data, files_map)
        return kpidescription

    def update(self, instance, validated_data):
        descriptions_data = validated_data.pop('description_payload', None)
        files_map = self.context.get('description_files_map', {})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if descriptions_data is not None:
            self._sync_descriptions(instance, descriptions_data, files_map)

        return instance



    


class MeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measure
        fields = '__all__'
        
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'



class UnitSerializer(serializers.ModelSerializer):
    
    measure_id = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Unit
        fields = ['id', 'name', 'measure_id', 'symbol', 'conversionFactor', 'isBaseUnit']


class SubtitleFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubtitleFiles
        fields = ['id', 'subtitle', 'photos'] 

class SummarySubtitleSerializer(serializers.ModelSerializer):
    photos = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    subtitle_files = SubtitleFilesSerializer(many=True, read_only=True, source='summary_photo', required=False)  # Use the related_name

    
    class Meta:
        model = SummarySubtitle
        fields = ['id', 'summary', 'subtitle', 'description', 'photos', 'subtitle_files']


class SummaryFilesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SummaryFiles
        fields = ['id', 'summary', 'photos']

class SummarySerializer(serializers.ModelSerializer):
    subtitle = SummarySubtitleSerializer(many=True, write_only=True, required=False)
    photos = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)
    summary_subtitle = SummarySubtitleSerializer(many=True, required=False)
    summary_files = SummaryFilesSerializer(many=True, required=False)
    
    sector_name = serializers.CharField(source='sector_id.name', read_only=True)
    division_name = serializers.CharField(source='division_id.name', read_only=True)
    monitoring_name = serializers.CharField(source='monitoring_id.name', read_only=True)
    
    class Meta:
        model = Summary
        fields = ['id', 'type', 'title', 'year', 'quarter', 'description', 'subtitle', 
                  'photos', 'sector_id', 'monitoring_id', 'division_id', 'summary_subtitle', 'summary_files',
                  'sector_name', 'division_name', 'monitoring_name'
                  ]

    def create(self, validated_data):
        subtitles_data = validated_data.pop('subtitle', [])
        summary_photos = validated_data.pop('photos', [])
        summary = Summary.objects.create(**validated_data)

        # Create SummaryFiles
        if summary_photos is not None:
            for photo in summary_photos:
                SummaryFiles.objects.create(summary=summary, photos=photo)

        # Create SummarySubtitle and SubtitleFiles
        if subtitles_data is not None:
            for subtitle_data in subtitles_data:
                photos_data = subtitle_data.pop('photos', [])
                subtitle = SummarySubtitle.objects.create(summary=summary, **subtitle_data)
                if photos_data is not None:
                    for photo in photos_data:
                        SubtitleFiles.objects.create(subtitle=subtitle, photos=photo)

        return summary

    def update(self, instance, validated_data):
        subtitles_data = validated_data.pop('summary_subtitle', None)
        summary_photos = validated_data.pop('summary_files', None)

        # Update Summary fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update summary_files only if new data is provided
        if summary_photos is not None:
            instance.summary_files.all().delete()
            for photo in summary_photos:
                SummaryFiles.objects.create(summary=instance, photos=photo['photos'])

        # Update summary_subtitle and subtitle_files only if new data is provided
        if subtitles_data is not None:
            instance.summary_subtitle.all().delete()
            for subtitle_data in subtitles_data:
                photos_data = subtitle_data.pop('subtitle_files', None)
                subtitle = SummarySubtitle.objects.create(summary=instance, **subtitle_data)
                if photos_data is not None:
                    for photo in photos_data:
                        SubtitleFiles.objects.create(subtitle=subtitle, photos=photo['photos'])

        return instance


class ReportSummarySerializer(serializers.ModelSerializer):
    summary = SummarySerializer(many=True, write_only=True, required=False)
    summary_report = SummarySerializer(many=True, required=False)

    class Meta:
        model = ReportSummary
        fields = ['titles', 'is_submitted', 'is_approved', 'summary', 'summary_report']

    def create(self, validated_data):
        summaries_data = validated_data.pop('summary', [])
        report_summary = ReportSummary.objects.create(**validated_data)

        # Create Summaries
        for summary_data in summaries_data:
            subtitles_data = summary_data.pop('subtitle', [])
            summary_photos = summary_data.pop('photos', [])
            summary = Summary.objects.create(reportsummary=report_summary, **summary_data)

            # Create SummaryFiles
            for photo in summary_photos:
                SummaryFiles.objects.create(summary=summary, photos=photo)

            # Create SummarySubtitle and SubtitleFiles
            for subtitle_data in subtitles_data:
                photos_data = subtitle_data.pop('photos', [])
                subtitle = SummarySubtitle.objects.create(summary=summary, **subtitle_data)
                for photo in photos_data:
                    SubtitleFiles.objects.create(subtitle=subtitle, photos=photo)

        return report_summary

    def update(self, instance, validated_data):
        summaries_data = validated_data.pop('summary_report', None)

        # Update ReportSummary fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update Summaries if new data is provided
        if summaries_data is not None:
            instance.summary_report.all().delete()
            for summary_data in summaries_data:
                subtitles_data = summary_data.pop('summary_subtitle', None)
                summary_photos = summary_data.pop('summary_files', None)
                summary = Summary.objects.create(reportsummary=instance, **summary_data)

                # Update SummaryFiles only if new data is provided
                if summary_photos is not None:
                    for photo in summary_photos:
                        SummaryFiles.objects.create(summary=summary, photos=photo['photos'])

                # Update SummarySubtitle and SubtitleFiles only if new data is provided
                if subtitles_data is not None:
                    for subtitle_data in subtitles_data:
                        photos_data = subtitle_data.pop('subtitle_files', None)
                        subtitle = SummarySubtitle.objects.create(summary=summary, **subtitle_data)
                        for photo in photos_data:
                            SubtitleFiles.objects.create(subtitle=subtitle, photos=photo['photos'])

        return instance
