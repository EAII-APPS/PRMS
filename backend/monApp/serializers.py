from rest_framework import serializers
from .models import Trackings, SystemSetting, Reply, Comment
from userApp.models import Division, User, Sector
from planApp.models import MainGoal
from planApp.models import KPI, StrategicGoal
from userApp.serializers import DivisionSerializer
from django.core.files.storage import default_storage
from django.utils import timezone


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ["id", "comment", "user","username", "content", "created_at"]
        extra_kwargs = {"user": {"read_only": True}, "comment": {"read_only": True}}

class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "tracking","planDocument", "user","username", "content", "created_at", "replies"]
        extra_kwargs = {"user": {"read_only": True}, "tracking": {"read_only": True}}

class CommentSerializerForPlan(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ["id" ,"planDocument", "user","username", "content", "created_at", "replies"]
        extra_kwargs = {"user": {"read_only": True}, }


class CommentSerializerForreportSector(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "created_at",
            "replies",
            "sector",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "sector": {"read_only": True},
        }


class CommentSerializerForreportDivision(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "created_at",
            "replies",
            "division",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "division": {"read_only": True},
        }


class TrackingSerializerForMonitor(serializers.ModelSerializer):
    sector = serializers.PrimaryKeyRelatedField(queryset=Sector.objects.all())
    strategic_goal = serializers.PrimaryKeyRelatedField(
        queryset=StrategicGoal.objects.all()
    )
    comments = CommentSerializer(many=True, read_only=True)
    given_date = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()

    class Meta:
        model = Trackings
        fields = [
            "id",
            "user",
            "sector",
            "strategic_goal",
            "ratting",
            "comments",
            "start_date",
            "end_date",
            "status",
            "given_date",
            "days_left",
        ]
        extra_kwargs = {"user": {"read_only": True}}

    def get_given_date(self, tracking):
        start_date = tracking.start_date
        end_date = tracking.end_date
        if start_date and end_date:
            return (end_date - start_date).days
        return None

    def get_days_left(self, tracking):
        current_date = timezone.now().date()
        start_date = tracking.start_date
        given_days = self.get_given_date(tracking)

        if start_date and given_days is not None:
            days_passed = (current_date - start_date).days
            days_left = given_days - days_passed
            return days_left
        return None

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        request_method = self.context["request"].method

        # Only apply this validation during creation (POST)
        if (
            request_method == "POST"
            and start_date
            and start_date < timezone.now().date()
        ):
            raise serializers.ValidationError("Start date cannot be in the past.")

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "Start date cannot be greater than end date."
            )

        return data

    def create(self, validated_data):
        sector_data = validated_data.pop("sector")
        strategic_goal_data = validated_data.pop("strategic_goal")
        trackings = Trackings.objects.create(**validated_data)
        trackings.sector = sector_data
        trackings.strategic_goal = strategic_goal_data
        trackings.save()
        return trackings


class TrackingSerializerForSector(serializers.ModelSerializer):
    division = serializers.PrimaryKeyRelatedField(queryset=Division.objects.all())
    main_goal = serializers.PrimaryKeyRelatedField(queryset=MainGoal.objects.all())
    comments = CommentSerializer(many=True, read_only=True)
    given_date = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()

    class Meta:
        model = Trackings
        fields = [
            "id",
            "user",
            "division",
            "main_goal",
            "ratting",
            "comments",
            "start_date",
            "end_date",
            "status",
            "given_date",
            "days_left",
        ]
        extra_kwargs = {"user": {"read_only": True}}

    def get_given_date(self, tracking):
        start_date = tracking.start_date
        end_date = tracking.end_date
        if start_date and end_date:
            return (end_date - start_date).days
        return None

    def get_days_left(self, tracking):
        current_date = timezone.now().date()
        start_date = tracking.start_date
        given_days = self.get_given_date(tracking)

        if start_date and given_days is not None:
            days_passed = (current_date - start_date).days
            days_left = given_days - days_passed
            return days_left
        return None

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        request_method = self.context["request"].method

        # Only apply this validation during creation (POST)
        if (
            request_method == "POST"
            and start_date
            and start_date < timezone.now().date()
        ):
            raise serializers.ValidationError("Start date cannot be in the past.")

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "Start date cannot be greater than end date."
            )

        return data

    def create(self, validated_data):
        division_data = validated_data.pop("division")
        main_goal_data = validated_data.pop("main_goal")
        trackings = Trackings.objects.create(**validated_data)
        trackings.division = division_data
        trackings.main_goal = main_goal_data
        trackings.save()
        return trackings


class TrackingSerializerForDivision(serializers.ModelSerializer):
    kpi = serializers.PrimaryKeyRelatedField(queryset=KPI.objects.all())
    comments = CommentSerializer(many=True, read_only=True)
    given_date = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()
    team = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Trackings
        fields = [
            "id",
            "user",
            "team",
            "kpi",
            "ratting",
            "status",
            "start_date",
            "end_date",
            "comments",
            "given_date",
            "days_left",
        ]
        extra_kwargs = {"user": {"read_only": True}}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request", None)
        if request and request.user:
            division_id = request.user.division_id
            self.fields["team"].queryset = User.objects.filter(
                is_deleted=False, added_by__division_id=division_id
            )

    def get_given_date(self, tracking):
        start_date = tracking.start_date
        end_date = tracking.end_date
        if start_date and end_date:
            return (end_date - start_date).days
        return None

    def get_days_left(self, tracking):
        current_date = timezone.now().date()
        start_date = tracking.start_date
        given_days = self.get_given_date(tracking)

        if start_date and given_days is not None:
            days_passed = (current_date - start_date).days
            days_left = given_days - days_passed
            return days_left
        return None

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        request_method = self.context["request"].method

        # Only apply this validation during creation (POST)
        if (
            request_method == "POST"
            and start_date
            and start_date < timezone.now().date()
        ):
            raise serializers.ValidationError("Start date cannot be in the past.")

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "Start date cannot be greater than end date."
            )

        return data

    def create(self, validated_data):
        kpi_data = validated_data.pop("kpi")
        team_data = validated_data.pop("team", None)
        trackings = Trackings.objects.create(**validated_data)
        trackings.kpi = kpi_data
        if team_data:
            trackings.team = team_data
        trackings.save()
        return trackings

    def update(self, instance, validated_data):
        kpi_data = validated_data.pop("kpi", None)
        team_data = validated_data.pop("team", None)

        instance.start_date = validated_data.get("start_date", instance.start_date)
        instance.end_date = validated_data.get("end_date", instance.end_date)
        instance.ratting = validated_data.get("ratting", instance.ratting)
        instance.status = validated_data.get("status", instance.status)

        if kpi_data:
            instance.kpi = kpi_data
        if team_data:
            instance.team = team_data

        instance.save()
        return instance


class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ["id", "logo_image"]

    def create(self, validated_data):
        if SystemSetting.objects.exists():
            existing_setting = SystemSetting.objects.first()
            if existing_setting.logo_image:
                if default_storage.exists(existing_setting.logo_image.path):
                    default_storage.delete(existing_setting.logo_image.path)
            existing_setting.delete()
        return SystemSetting.objects.create(**validated_data)
