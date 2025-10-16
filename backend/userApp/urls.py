from django.contrib import admin
from django.urls import path
from . import views
#from .views import CustomTokenObtainPairView  # Ensure correct import path
from .views import *
from rest_framework import routers
from .api import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()

router.register('users', UserViewSet, 'users')
#router.register('userprofiles', UserProfileViewSet, 'userprofiles')  # Register the UserProfileViewSet
router.register(r'monitoring', MonitoringViewSet)
router.register(r'sector', SectorViewSet)
router.register(r'division', DivisionViewSet)

router.register(r'sector_reminders', SectorReminderViewSet)
router.register(r'division_reminders', DivisionReminderViewSet)
# Start with the router's URLs.
urlpatterns = router.urls

# Then, extend this list with the additional path(s).
urlpatterns += [
    path('endpoints', views.getRoutes, name='endpoints'),
    path('me/', views.me, name='me'),
    #path('reminders/latest/', ReminderViewSet.as_view({'get': 'latest'}), name='reminder-latest'),
    #path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('login', views.user_login, name='login'),
    path('logout', views.logout_view, name='logout'),
    #path('user_profile', views.user_profile, name='user_profile'),

    path('change_password', views.change_password, name='change_password'),
    path('forget_password', views.forget_password, name='forget_password'),
    path('reset_password', views.reset_password, name='reset_password'),
    
    path('keycloak/login', key_clock_login, name='keycloak_login'),

]



