from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from .views import *
from .generate_table import *
from .generate_docx import *
from .plan_doc_comment import(plan_doc_comment,comment_reply)
from .dashboard import (dashboard_data)




urlpatterns = [
        path('strategicGoals/', handle_strategic_goal, name='strategic_goals'),
        path('strategicGoals/<int:id>/', handle_strategic_goal, name='strategic_goals'),
        path('mainGoals/', handle_main_goal, name='main_goals'),
        path('maingoal/<int:id>/',handle_main_goal,name='main_goal'),
        path('KPI/',handle_kpi,name='KPI'),
        path('KPI/<int:id>/',handle_kpi,name='KPI'),
        path('annualKPI/',handle_Annual_KPI,name='annual_KPI'),
        path('annualKPI/<int:id>/',handle_Annual_KPI,name='annual_KPI'),
        
        path('threeKPI/',handle_three_KPI,name='three_KPI'),
        path('threeKPI/<int:id>/',handle_three_KPI,name='three_KPI'),
        path('three_performance/<int:id>/', set_three_performance, name='performance'),
        path('three_performance/', set_three_performance, name='performance'),



        path('table-data/', generate_table_data, name='table-data'),
        path('threeyear-table-data/', three_year_table_data, name='three_year-data'),
        path('assignGoal/', assignStrategicGoal, name='assign'),
        path('assignMainGoal/', assignMainGoal, name='assignMaingoal'),
        path('assignkpis/', assignkpi, name='assign-kpi'),

        path('performance/<int:id>/', set_performance, name='performance'),
        path('performance/', set_performance, name='performance'),
        path('getDocument/', generate_docx, name='get_Document'),
        path('plan-document/', plan_document_view, name='plan_document_list'),
        path('plan-document/<int:id>/', plan_document_view, name='plan_document_detail'),
        path('pdf/', generate_pdf, name='generate_pdf'),
        path('word/',generate_word, name='generate_word'),
        path('threepdf/', generate_pdf_three, name='generate_pdf'),
        path('threeword/',generate_word_three, name='generate_word'),
        path('threepdf_performance/', generate_pdf_three_performance, name='generate_pdf_performance'),
        path('threeword_performance/',generate_word_three_performance, name='generate_word_performance'),
        path('mergeDocuments/',merge_doc,name='merge_doc'),
        path('plancomments/', plan_doc_comment, name='plan-doc-comment-list-create'),
        path('plancomments/<int:id>/', plan_doc_comment, name='plan-doc-comment-detail'),
        path('plancomments/<int:comment_id>/replies/', comment_reply, name='comment-reply-list-create'),
        path('plancomments/<int:comment_id>/replies/<int:id>/', comment_reply, name='comment-reply-detail'),
        path('units/', unit_handler, name='units'),  # For GET all and POST
        path('units/<int:id>/', unit_handler, name='unit-detail'),  # For GET, PUT, DELETE on a specific unit
        path('dashboard/', dashboard_data, name='dashboard-data'),  # For GET, PUT, DELETE on a specific unit

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)