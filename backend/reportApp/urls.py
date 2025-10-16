from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from.views import *  # noqa: F403


urlpatterns = [
    path('kpidescription/', KPIDescriptionListCreate.as_view(), name= 'Create-KPID-List'),  # noqa: F405
    path('kpidescription/<int:pk>/', KPIDescriptionRetrieveUpdateDelete.as_view(), name= 'KPID-Details'),
    
    path('kpiphoto/', KPIPhotosListCreate.as_view(), name= 'Create-KPIP-List'),
    path('kpiphoto/<int:pk>/', KPIPhotosRetrieveUpdateDelete.as_view(), name= 'KPIP-Details'),

    path('summary/', SummaryListCreate.as_view(), name = 'Create-Summary-List' ),
    path('summary/<int:pk>/', SummaryRetrieveUpdateDelete.as_view(), name = 'Summary-Details'),
    
    path('measure/', MeasureListCreate.as_view(), name = 'Create-Measure-List' ),
    path('measure/<int:pk>/', MeasureRetrieveUpdateDelete.as_view(), name = 'Measure-Details'),
    
    path('units/', UnitListCreate.as_view(), name = 'Create-Unit-List' ),
    path('units/<int:pk>/', UnitRetrieveUpdateDelete.as_view(), name = 'Unit-Details'),


    path('summaryfiles/', SummaryFilesListCreate.as_view(), name = 'Create-Summaryfiles-List' ),
    path('summaryfiles/<int:pk>/', SummaryFilesRetrieveUpdateDelete.as_view(), name = 'Summaryfiles-Details'),  # noqa: F405

     path('summariesubtitles/', SummarySubtitleListCreateView.as_view(), name='summarysubtitle-list-create'),
    path('summariesubtitles/<int:pk>/', SummarySubtitleRetrieveUpdateDestroyView.as_view(), name='summarysubtitle-detail'),
    
    path('subtitlefiles/', SubtitleFilesListCreateView.as_view(), name='subtitlefiles-list-create'),
    path('subtitlefiles/<int:pk>/', SubtitleFilesRetrieveUpdateDestroyView.as_view(), name='subtitlefiles-detail'),

    path('reportsummary/', ReportSummaryListCreateView.as_view(), name='reportsummary-list-create'),
    path('reportsummary/<int:pk>/', ReportSummaryDetailView.as_view(), name='reportsummary-detail'),
    

    
    path('generate_report_document_data/', GenerateReportDocument.as_view(), name='generate_report_document_data'),
    
    
    path('tables/', filter_and_generate_kpi_report, name='report_table'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
