from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    path("planApp/", include("planApp.urls")),
    #('api-auth/', include('rest_framework.urls')),
    path("", include("django_prometheus.urls")),


    path('roleApp/',include('roleApp.urls')),
    path('userApp/', include('userApp.urls')),
    path('reportApp/', include('reportApp.urls')),
    path("tracking/", include("monApp.urls")),
    path('comApp/', include('comApp.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
