import logging
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.viewsets import ModelViewSet
from monApp.models import Trackings, SystemSetting, Comment, Reply
from userApp.models import Sector, Division
from planApp.models import KPI, MainGoal
from .serializers import (
    SystemSettingSerializer,
    CommentSerializer,
    ReplySerializer,
)
from monApp.serializers import TrackingSerializerForSector
from monApp.serializers import TrackingSerializerForMonitor
from monApp.serializers import TrackingSerializerForDivision
from monApp.serializers import CommentSerializerForreportSector
from monApp.serializers import CommentSerializerForreportDivision

logger = logging.getLogger(__name__)


class SystemSettingViewSet(ModelViewSet):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    """     def list(self, request, *args, **kwargs):
        try:
            queryset = super().get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except SystemSetting.DoesNotExist:
            return Response({"error": "No SystemSettings found."}, status=status.HTTP_404_NOT_FOUND)
     """

    def list(self, request, *args, **kwargs):
        try:
            queryset = super().get_queryset()
            if queryset.exists():  # Check if queryset has at least one instance
                if len(queryset) == 1:  # If queryset has only one instance
                    instance = queryset.first()
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
                else:  # If queryset has more than one instance
                    serializer = self.get_serializer(queryset, many=True)
                    return Response(serializer.data)
            else:  # If queryset is empty
                return Response(
                    {"error": "No SystemSettings found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except SystemSetting.DoesNotExist:
            return Response(
                {"error": "No SystemSettings found."}, status=status.HTTP_404_NOT_FOUND
            )

    # def get_queryset(self):
    #     """
    #     Override to exclude monitor marked as 'is_deleted'.
    #     """
    #     try:
    #         query = SystemSetting.objects.get()
    #         return query
    #     except:
    #         pass

    def perform_create(self, serializer):
        serializer.save()


class CreateTrackingForSectorViews(generics.ListCreateAPIView):
    serializer_class = TrackingSerializerForMonitor
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            logger.info("Creating traking for monitor: %s", serializer.validated_data)
        else:
            logger.error("Failed to create tracking: %s", serializer.validated_data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        for tracking in serializer.data:
            tracking_instance = Trackings.objects.get(id=tracking["id"])
            print("login user", tracking_instance)
            performance_percentage = (
                self.calculate_strategic_goal_performance_percentage(
                    tracking_instance.strategic_goal
                )
            )
            tracking["performance_percentage"] = performance_percentage

        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, kpi):
        print("kpi:-", kpi)
        try:
            plans = [
                float(kpi.first_quarter_plan),
                float(kpi.second_quarter_plan),
                float(kpi.third_quarter_plan),
                float(kpi.fourth_quarter_plan),
            ]
            performances = [
                float(kpi.first_quarter_performance or 0),
                float(kpi.second_quarter_performance or 0),
                float(kpi.third_quarter_performance or 0),
                float(kpi.fourth_quarter_performance or 0),
            ]

            total_plan = 0
            total_performance = 0

            for plan, performance in zip(plans, performances):
                print("(plan, performance)", plan, performance)
                if plan > 0:
                    total_plan += plan
                    total_performance += performance

            if total_plan > 0:
                performance_percentage = (total_performance / total_plan) * 100
            else:
                performance_percentage = 0

            print("(total_plan, total_performance)", total_plan, total_performance)
            print("performance_percentage:-", performance_percentage)

            return round(performance_percentage, 2)
        except (ValueError, TypeError):
            return None

    def calculate_main_goal_performance_percentage(self, main_goal_id_id):
        print("main_goal_id_id:-", main_goal_id_id)
        kpis = KPI.objects.filter(main_goal_id_id=main_goal_id_id)
        if not kpis.exists():
            return 0

        total_percentage = 0
        kpi_count = 0

        for kpi in kpis:
            print("kpi:-", kpi)
            performance_percentage = self.calculate_performance_percentage(kpi)
            print("performance_percentage:-", performance_percentage)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                kpi_count += 1
        print("kpi_count:-", kpi_count)

        if kpi_count == 0:
            return 0

        return round(total_percentage / kpi_count, 2)

    def calculate_strategic_goal_performance_percentage(self, strategic_goal_id_id):
        print("strategic_goal_id_id:-", strategic_goal_id_id)
        main_goals = MainGoal.objects.filter(
            strategic_goal_id_id=strategic_goal_id_id
        )  # Corrected field name
        if not main_goals.exists():
            return 0

        total_percentage = 0
        main_goal_count = 0

        for main_goal in main_goals:
            print("main_goal:-", main_goal)
            performance_percentage = self.calculate_main_goal_performance_percentage(
                main_goal
            )
            print("performance_percentage:-", performance_percentage)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                main_goal_count += 1

        print("main_goal_count:-", main_goal_count)
        print("total_percentage:-", total_percentage)

        if main_goal_count == 0:
            return 0

        return round(total_percentage / main_goal_count, 2)


class TrackingDetailForSectorViews(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrackingSerializerForMonitor
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(user=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Calculate performance percentage for the tracking
        performance_percentage = self.calculate_strategic_goal_performance_percentage(
            instance.strategic_goal
        )
        response_data = serializer.data
        response_data["performance_percentage"] = performance_percentage

        return Response(response_data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, kpi):
        try:
            plans = [
                float(kpi.first_quarter_plan),
                float(kpi.second_quarter_plan),
                float(kpi.third_quarter_plan),
                float(kpi.fourth_quarter_plan),
            ]
            performances = [
                float(kpi.first_quarter_performance or 0),
                float(kpi.second_quarter_performance or 0),
                float(kpi.third_quarter_performance or 0),
                float(kpi.fourth_quarter_performance or 0),
            ]

            total_plan = 0
            total_performance = 0

            for plan, performance in zip(plans, performances):
                if plan > 0:
                    total_plan += plan
                    total_performance += performance

            if total_plan > 0:
                performance_percentage = (total_performance / total_plan) * 100
            else:
                performance_percentage = 0

            return round(performance_percentage, 2)
        except (ValueError, TypeError):
            return None

    def calculate_main_goal_performance_percentage(self, main_goal_id_id):
        kpis = KPI.objects.filter(main_goal_id_id=main_goal_id_id)
        if not kpis.exists():
            return 0

        total_percentage = 0
        kpi_count = 0

        for kpi in kpis:
            performance_percentage = self.calculate_performance_percentage(kpi)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                kpi_count += 1

        if kpi_count == 0:
            return 0

        return round(total_percentage / kpi_count, 2)

    def calculate_strategic_goal_performance_percentage(self, strategic_goal_id_id):
        main_goals = MainGoal.objects.filter(strategic_goal_id_id=strategic_goal_id_id)
        if not main_goals.exists():
            return 0

        total_percentage = 0
        main_goal_count = 0

        for main_goal in main_goals:
            performance_percentage = self.calculate_main_goal_performance_percentage(
                main_goal
            )
            if performance_percentage is not None:
                total_percentage += performance_percentage
                main_goal_count += 1

        if main_goal_count == 0:
            return 0

        return round(total_percentage / main_goal_count, 2)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            logger.info("Updating tracking: %s", serializer.validated_data)
        else:
            logger.error("Failed to update tracking: %s", serializer.errors)
            raise ValidationError(serializer.errors)

    def perform_destroy(self, instance):
        instance.delete()
        logger.info("Deleted tracking with ID: %s", instance.id)


class CreateTrackingForDivisionViews(generics.ListCreateAPIView):
    serializer_class = TrackingSerializerForSector
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            logger.info("Creating traking for monitor: %s", serializer.validated_data)
        else:
            logger.error("Failed to create tracking: %s", serializer.validated_data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calculate performance percentage for each tracking
        for tracking in serializer.data:
            tracking_instance = Trackings.objects.get(id=tracking["id"])
            print("login user", tracking_instance)
            performance_percentage = self.calculate_main_goal_performance_percentage(
                tracking_instance.main_goal
            )
            tracking["performance_percentage"] = performance_percentage

        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, kpi):
        print("kpi", kpi)
        try:
            plans = [
                float(kpi.first_quarter_plan),
                float(kpi.second_quarter_plan),
                float(kpi.third_quarter_plan),
                float(kpi.fourth_quarter_plan),
            ]
            performances = [
                float(kpi.first_quarter_performance or 0),
                float(kpi.second_quarter_performance or 0),
                float(kpi.third_quarter_performance or 0),
                float(kpi.fourth_quarter_performance or 0),
            ]

            total_plan = 0
            total_performance = 0

            for plan, performance in zip(plans, performances):
                print("(plan,performance)", plan, performance)
                if plan > 0:
                    total_plan += plan
                    total_performance += performance

            if total_plan > 0:
                performance_percentage = (total_performance / total_plan) * 100
            else:
                performance_percentage = 0
            print("(total_plan, total_performance)", total_plan, total_performance)
            print("performance_percentage", performance_percentage)

            return round(performance_percentage, 2)
        except (ValueError, TypeError):
            return None

    def calculate_main_goal_performance_percentage(self, main_goal):
        print("main_goal:-", main_goal)
        kpis = KPI.objects.filter(main_goal_id=main_goal)
        print("kpis:", kpis)
        if not kpis.exists():
            return 0

        total_percentage = 0
        kpi_count = 0

        for kpi in kpis:
            performance_percentage = self.calculate_performance_percentage(kpi)
            print("kpi", kpi)
            print("performance_percentage", performance_percentage)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                kpi_count += 1

        if kpi_count == 0:
            return 0

        print("total_percentage:-", total_percentage)
        print("kpi_count:-", kpi_count)

        return round(total_percentage / kpi_count, 2)


class TrackingDetailforDivisionViews(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrackingSerializerForSector
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(user=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Calculate performance percentage for the tracking
        performance_percentage = self.calculate_main_goal_performance_percentage(
            instance.main_goal
        )
        response_data = serializer.data
        response_data["performance_percentage"] = performance_percentage

        return Response(response_data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, kpi):
        try:
            plans = [
                float(kpi.first_quarter_plan),
                float(kpi.second_quarter_plan),
                float(kpi.third_quarter_plan),
                float(kpi.fourth_quarter_plan),
            ]
            performances = [
                float(kpi.first_quarter_performance or 0),
                float(kpi.second_quarter_performance or 0),
                float(kpi.third_quarter_performance or 0),
                float(kpi.fourth_quarter_performance or 0),
            ]

            total_plan = 0
            total_performance = 0

            for plan, performance in zip(plans, performances):
                if plan > 0:
                    total_plan += plan
                    total_performance += performance

            if total_plan > 0:
                performance_percentage = (total_performance / total_plan) * 100
            else:
                performance_percentage = 0

            return round(performance_percentage, 2)
        except (ValueError, TypeError):
            return None

    def calculate_main_goal_performance_percentage(self, main_goal):
        kpis = KPI.objects.filter(main_goal_id=main_goal)
        if not kpis.exists():
            return 0

        total_percentage = 0
        kpi_count = 0

        for kpi in kpis:
            performance_percentage = self.calculate_performance_percentage(kpi)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                kpi_count += 1

        if kpi_count == 0:
            return 0

        return round(total_percentage / kpi_count, 2)


class CreateTrackingForTeamViews(generics.ListCreateAPIView):
    serializer_class = TrackingSerializerForDivision
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            logger.info("Creating traking for team: %s", serializer.validated_data)
        else:
            logger.error("Failed to create tracking: %s", serializer.validated_data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calculate performance percentage for each tracking
        for tracking in serializer.data:
            tracking_instance = Trackings.objects.get(id=tracking["id"])
            print("login user:-", tracking_instance)
            performance_percentage = self.calculate_performance_percentage(
                tracking_instance
            )
            tracking["performance_percentage"] = performance_percentage

        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, tracking):
        kpi = tracking.kpi
        print("kpi:-", kpi)
        if kpi:
            try:
                plans = [
                    float(kpi.first_quarter_plan),
                    float(kpi.second_quarter_plan),
                    float(kpi.third_quarter_plan),
                    float(kpi.fourth_quarter_plan),
                ]
                performances = [
                    float(kpi.first_quarter_performance or 0),
                    float(kpi.second_quarter_performance or 0),
                    float(kpi.third_quarter_performance or 0),
                    float(kpi.fourth_quarter_performance or 0),
                ]

                total_plan = 0
                total_performance = 0

                for plan, performance in zip(plans, performances):
                    print("(plan , performance) ", plan, performance)
                    if plan > 0 and performance > 0:
                        total_plan += plan
                        total_performance += performance

                if total_plan > 0:
                    performance_percentage = (total_performance / total_plan) * 100
                else:
                    performance_percentage = 0
                print("(total plan , total performance)", total_plan, total_performance)
                print("performance percentage:-", performance_percentage)

                return round(performance_percentage, 2)
            except (ValueError, TypeError):
                return None
        return None


class TrackingDetailForTeamViews(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrackingSerializerForDivision
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(user=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        # Calculate performance percentage for the retrieved tracking
        performance_percentage = self.calculate_performance_percentage(instance)
        data["performance_percentage"] = performance_percentage

        return Response(data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, tracking):
        kpi = tracking.kpi
        if kpi:
            try:
                plans = [
                    float(kpi.first_quarter_plan),
                    float(kpi.second_quarter_plan),
                    float(kpi.third_quarter_plan),
                    float(kpi.fourth_quarter_plan),
                ]
                performances = [
                    float(kpi.first_quarter_performance or 0),
                    float(kpi.second_quarter_performance or 0),
                    float(kpi.third_quarter_performance or 0),
                    float(kpi.fourth_quarter_performance or 0),
                ]

                total_plan = 0
                total_performance = 0

                for plan, performance in zip(plans, performances):
                    if plan > 0 and performance > 0:
                        total_plan += plan
                        total_performance += performance

                if total_plan > 0:
                    performance_percentage = (total_performance / total_plan) * 100
                else:
                    performance_percentage = 0

                return round(performance_percentage, 2)
            except (ValueError, TypeError):
                return None
        return None

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
            logger.info("Updating tracking: %s", serializer.validated_data)
        else:
            logger.error("Failed to update tracking: %s", serializer.errors)
            raise ValidationError(serializer.errors)

    def perform_destroy(self, instance):
        instance.delete()
        logger.info("Deleted tracking with ID: %s", instance.id)


class CommentCreate(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(tracking_id=self.kwargs["tracking_id"])

    def perform_create(self, serializer):
        tracking = Trackings.objects.get(pk=self.kwargs["tracking_id"])
        serializer.save(user=self.request.user, tracking=tracking)
        logger.info("Creating comment: %s", serializer.validated_data)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(tracking_id=self.kwargs["tracking_id"])


class ReplyCreate(generics.ListCreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reply.objects.filter(
            comment_id=self.kwargs["comment_id"]
        )  # Use comment_id here

    def perform_create(self, serializer):
        comment = Comment.objects.get(
            pk=self.kwargs["comment_id"]
        )  # Use comment_id here
        serializer.save(user=self.request.user, comment=comment)
        logger.info("Creating reply: %s", serializer.validated_data)


class ReplyDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reply.objects.filter(comment_id=self.kwargs["comment_id"])


class SectorTasksListView(generics.ListAPIView):
    serializer_class = TrackingSerializerForMonitor
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(user)
        print(user.sector_id)
        if user.sector_id:
            return Trackings.objects.filter(sector=user.sector_id)
        return Trackings.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        for tracking in serializer.data:
            tracking_instance = Trackings.objects.get(id=tracking["id"])
            print("login user", tracking_instance)
            performance_percentage = (
                self.calculate_strategic_goal_performance_percentage(
                    tracking_instance.strategic_goal
                )
            )
            tracking["performance_percentage"] = performance_percentage

        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, kpi):
        print("kpi:-", kpi)
        try:
            plans = [
                float(kpi.first_quarter_plan),
                float(kpi.second_quarter_plan),
                float(kpi.third_quarter_plan),
                float(kpi.fourth_quarter_plan),
            ]
            performances = [
                float(kpi.first_quarter_performance or 0),
                float(kpi.second_quarter_performance or 0),
                float(kpi.third_quarter_performance or 0),
                float(kpi.fourth_quarter_performance or 0),
            ]

            total_plan = 0
            total_performance = 0

            for plan, performance in zip(plans, performances):
                print("(plan, performance)", plan, performance)
                if plan > 0:
                    total_plan += plan
                    total_performance += performance

            if total_plan > 0:
                performance_percentage = (total_performance / total_plan) * 100
            else:
                performance_percentage = 0

            print("(total_plan, total_performance)", total_plan, total_performance)
            print("performance_percentage:-", performance_percentage)

            return round(performance_percentage, 2)
        except (ValueError, TypeError):
            return None

    def calculate_main_goal_performance_percentage(self, main_goal_id_id):
        print("main_goal_id_id:-", main_goal_id_id)
        kpis = KPI.objects.filter(main_goal_id_id=main_goal_id_id)
        if not kpis.exists():
            return 0

        total_percentage = 0
        kpi_count = 0

        for kpi in kpis:
            print("kpi:-", kpi)
            performance_percentage = self.calculate_performance_percentage(kpi)
            print("performance_percentage:-", performance_percentage)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                kpi_count += 1
        print("kpi_count:-", kpi_count)

        if kpi_count == 0:
            return 0

        return round(total_percentage / kpi_count, 2)

    def calculate_strategic_goal_performance_percentage(self, strategic_goal_id_id):
        print("strategic_goal_id_id:-", strategic_goal_id_id)
        main_goals = MainGoal.objects.filter(
            strategic_goal_id_id=strategic_goal_id_id
        )  # Corrected field name
        if not main_goals.exists():
            return 0

        total_percentage = 0
        main_goal_count = 0

        for main_goal in main_goals:
            print("main_goal:-", main_goal)
            performance_percentage = self.calculate_main_goal_performance_percentage(
                main_goal
            )
            print("performance_percentage:-", performance_percentage)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                main_goal_count += 1

        print("main_goal_count:-", main_goal_count)
        print("total_percentage:-", total_percentage)

        if main_goal_count == 0:
            return 0

        return round(total_percentage / main_goal_count, 2)


class DivisionTasksListView(generics.ListAPIView):
    serializer_class = TrackingSerializerForSector
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(user)
        print(user.division_id)
        if user.division_id:
            return Trackings.objects.filter(division=user.division_id)
        return Trackings.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calculate performance percentage for each tracking
        for tracking in serializer.data:
            tracking_instance = Trackings.objects.get(id=tracking["id"])
            print("login user", tracking_instance)
            performance_percentage = self.calculate_main_goal_performance_percentage(
                tracking_instance.main_goal
            )
            tracking["performance_percentage"] = performance_percentage

        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, kpi):
        print("kpi", kpi)
        try:
            plans = [
                float(kpi.first_quarter_plan),
                float(kpi.second_quarter_plan),
                float(kpi.third_quarter_plan),
                float(kpi.fourth_quarter_plan),
            ]
            performances = [
                float(kpi.first_quarter_performance or 0),
                float(kpi.second_quarter_performance or 0),
                float(kpi.third_quarter_performance or 0),
                float(kpi.fourth_quarter_performance or 0),
            ]

            total_plan = 0
            total_performance = 0

            for plan, performance in zip(plans, performances):
                print("(plan,performance)", plan, performance)
                if plan > 0:
                    total_plan += plan
                    total_performance += performance

            if total_plan > 0:
                performance_percentage = (total_performance / total_plan) * 100
            else:
                performance_percentage = 0
            print("(total_plan, total_performance)", total_plan, total_performance)
            print("performance_percentage", performance_percentage)

            return round(performance_percentage, 2)
        except (ValueError, TypeError):
            return None

    def calculate_main_goal_performance_percentage(self, main_goal):
        print("main_goal:-", main_goal)
        kpis = KPI.objects.filter(main_goal_id=main_goal)
        print("kpis:", kpis)
        if not kpis.exists():
            return 0

        total_percentage = 0
        kpi_count = 0

        for kpi in kpis:
            performance_percentage = self.calculate_performance_percentage(kpi)
            print("kpi", kpi)
            print("performance_percentage", performance_percentage)
            if performance_percentage is not None:
                total_percentage += performance_percentage
                kpi_count += 1

        if kpi_count == 0:
            return 0

        print("total_percentage:-", total_percentage)
        print("kpi_count:-", kpi_count)

        return round(total_percentage / kpi_count, 2)


class TeamTasksListView(generics.ListAPIView):
    serializer_class = TrackingSerializerForDivision
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trackings.objects.filter(team=user.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calculate performance percentage for each tracking
        for tracking in serializer.data:
            tracking_instance = Trackings.objects.get(id=tracking["id"])
            print("login user:-", tracking_instance)
            performance_percentage = self.calculate_performance_percentage(
                tracking_instance
            )
            tracking["performance_percentage"] = performance_percentage

        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_performance_percentage(self, tracking):
        kpi = tracking.kpi
        print("kpi:-", kpi)
        if kpi:
            try:
                plans = [
                    float(kpi.first_quarter_plan),
                    float(kpi.second_quarter_plan),
                    float(kpi.third_quarter_plan),
                    float(kpi.fourth_quarter_plan),
                ]
                performances = [
                    float(kpi.first_quarter_performance or 0),
                    float(kpi.second_quarter_performance or 0),
                    float(kpi.third_quarter_performance or 0),
                    float(kpi.fourth_quarter_performance or 0),
                ]

                total_plan = 0
                total_performance = 0

                for plan, performance in zip(plans, performances):
                    print("(plan , performance) ", plan, performance)
                    if plan > 0 and performance > 0:
                        total_plan += plan
                        total_performance += performance

                if total_plan > 0:
                    performance_percentage = (total_performance / total_plan) * 100
                else:
                    performance_percentage = 0
                print("(total plan , total performance)", total_plan, total_performance)
                print("performance percentage:-", performance_percentage)

                return round(performance_percentage, 2)
            except (ValueError, TypeError):
                return None
        return None


class CommentCreateForReportSector(generics.ListCreateAPIView):
    serializer_class = CommentSerializerForreportSector
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sector_id = self.kwargs.get("sector_id")

        if sector_id:
            return Comment.objects.filter(sector_id=sector_id)
        else:
            return Comment.objects.none()

    def perform_create(self, serializer):
        sector_id = self.kwargs.get("sector_id")
        if sector_id:
            sector = Sector.objects.get(pk=sector_id)
            serializer.save(user=self.request.user, sector=sector)
        logger.info("Creating comment: %s", serializer.validated_data)


class CommentCreateForReportDivision(generics.ListCreateAPIView):
    serializer_class = CommentSerializerForreportDivision
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        division_id = self.kwargs.get("division_id")

        if division_id:
            return Comment.objects.filter(division_id=division_id)
        else:
            return Comment.objects.none()

    def perform_create(self, serializer):

        division_id = self.kwargs.get("division_id")

        if division_id:
            division = Division.objects.get(pk=division_id)
            serializer.save(user=self.request.user, division=division)
        logger.info("Creating comment: %s", serializer.validated_data)


class CommentDetailForreportSector(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializerForreportSector
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sector_id = self.kwargs.get("sector_id")
        if sector_id:
            return Comment.objects.filter(sector_id=sector_id)
        else:
            return Comment.objects.none()


class CommentDetailForreportDivision(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializerForreportDivision
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        division_id = self.kwargs.get("division_id")

        if division_id:
            return Comment.objects.filter(division_id=division_id)
        else:
            return Comment.objects.none()
