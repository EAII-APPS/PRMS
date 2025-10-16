from django.db import models
from django.forms import ValidationError
from userApp.models import User
from planApp.models import MainGoal, StrategicGoal , PlanDocument
from planApp.models import KPI
from userApp.models import Division
from userApp.models import Sector, Monitoring
from datetime import timedelta


class Trackings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    team = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="team"
    )
    monitor = models.ForeignKey(
        Monitoring, on_delete=models.CASCADE, null=True, blank=True
    )
    strategic_goal = models.ForeignKey(
        StrategicGoal, on_delete=models.CASCADE, null=True, blank=True
    )
    main_goal = models.ForeignKey(
        MainGoal, on_delete=models.CASCADE, null=True, blank=True
    )
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True)
    division = models.ForeignKey(
        Division, on_delete=models.SET_NULL, null=True, blank=True
    )
    kpi = models.ForeignKey(KPI, on_delete=models.SET_NULL, null=True, blank=True)
    ratting = models.CharField(max_length=250, null=True, blank=True)
    status = models.CharField(max_length=250, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user}"


class SystemSetting(models.Model):
    logo_image = models.ImageField(upload_to="logo")


class Comment(models.Model):
    tracking = models.ForeignKey(Trackings, related_name="comments", on_delete=models.CASCADE,null=True,blank=True)
    planDocument = models.ForeignKey(PlanDocument,related_name="planDoc_comments",on_delete=models.CASCADE,null=True,blank=True)
    sector = models.ForeignKey(Sector, related_name="comments", on_delete=models.CASCADE, null=True, blank=True)
    division = models.ForeignKey(Division,on_delete=models.CASCADE,related_name="comments",null=True,blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.TextField(null=True,blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.id}"


class Reply(models.Model):
    comment = models.ForeignKey(Comment, related_name="replies", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.TextField(null=True,blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply {self.id} on Comment {self.comment.id} by {self.user.username}"
