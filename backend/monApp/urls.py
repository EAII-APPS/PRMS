from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("systemsetting", views.SystemSettingViewSet, basename="system-setting")


urlpatterns = [
    path("", include(router.urls)),
    path(
        "trackSector/",
        views.CreateTrackingForSectorViews.as_view(),
        name="tracking-sector",
    ),
    path(
        "trackSector/<int:pk>/",
        views.TrackingDetailForSectorViews.as_view(),
        name="tracking-detail-sector",
    ),
    path(
        "feedback/<int:tracking_id>/comments/",
        views.CommentCreate.as_view(),
        name="tracking-comments",
    ),
    path(
        "feedback/<int:tracking_id>/comments/<int:pk>/",
        views.CommentDetail.as_view(),
        name="comment-detail",
    ),
    path(
        "feedbackOnreport/sector/<int:sector_id>/comments/",
        views.CommentCreateForReportSector.as_view(),
        name="comments-creation-forsector",
    ),
    path(
        "feedbackOnreport/division/<int:division_id>/comments/",
        views.CommentCreateForReportDivision.as_view(),
        name="comments-creation-fordivision",
    ),
    path(
        "feedbackOnreport/sector/<int:sector_id>/comments/<int:pk>/",
        views.CommentDetailForreportSector.as_view(),
        name="detail-comment-forsector",
    ),
    path(
        "feedbackOnreport/division/<int:division_id>/comments/<int:pk>/",
        views.CommentDetailForreportDivision.as_view(),
        name="detail-comment-fordivision",
    ),
    path(
        "feedbackOnreport/sector/<int:sector_id>/comments/<int:comment_id>/replies/",
        views.ReplyCreate.as_view(),
        name="create-reply-forsector",
    ),
    path(
        "feedbackOnreport/division/<int:division_id>/comments/<int:comment_id>/replies/",
        views.ReplyCreate.as_view(),
        name="create-reply-fordivision",
    ),
    path(
        "feedbackOnreport/sector/<int:sector_id>/comments/<int:comment_id>/replies/<int:pk>/",
        views.ReplyDetail.as_view(),
        name="detail-reply-forsector",
    ),
    path(
        "feedbackOnreport/division/<int:division_id>/comments/<int:comment_id>/replies/<int:pk>/",
        views.ReplyDetail.as_view(),
        name="detail-reply-fordivision",
    ),
    path(
        "feedback/<int:tracking_id>/comments/<int:comment_id>/replies/",
        views.ReplyCreate.as_view(),
        name="comment-replies",
    ),
    path(
        "feedback/<int:tracking_id>/comments/<int:comment_id>/replies/<int:pk>/",
        views.ReplyDetail.as_view(),
        name="reply-detail",
    ),
    path(
        "trackDivision/",
        views.CreateTrackingForDivisionViews.as_view(),
        name="tracking-division",
    ),
    path(
        "trackDivision/<int:pk>/",
        views.TrackingDetailforDivisionViews.as_view(),
        name="tracking-detail-division",
    ),
    path(
        "trackTeam/", views.CreateTrackingForTeamViews.as_view(), name="tracking-team"
    ),
    path(
        "trackTeam/<int:pk>/",
        views.TrackingDetailForTeamViews.as_view(),
        name="tracking-detail-team",
    ),
    path(
        "trackTeam/<int:tracking_id>/comments/",
        views.CommentCreate.as_view(),
        name="tracking-comments",
    ),
    path("tasks/sector/", views.SectorTasksListView.as_view(), name="sector-tasks"),
    path(
        "tasks/division/", views.DivisionTasksListView.as_view(), name="division-tasks"
    ),
    path("tasks/team/", views.TeamTasksListView.as_view(), name="team-tasks"),
]
