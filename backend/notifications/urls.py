from django.urls import path
from . import views

urlpatterns = [
    # Reviews
    path('reviews/', views.ReviewListCreateView.as_view(), name='review_list_create'),
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view(), name='review_detail'),
    
    # Ratings
    path('ratings/', views.RatingListCreateView.as_view(), name='rating_list_create'),
    path('ratings/<int:pk>/', views.RatingDetailView.as_view(), name='rating_detail'),
    
    # Reports
    path('reports/', views.ReportListCreateView.as_view(), name='report_list_create'),
    path('reports/<int:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    
    # Dashboard
    path('dashboard/', views.get_notification_dashboard, name='notification_dashboard'),
    
    # Student Notifications
    path('student/save/', views.save_student_notification, name='save_student_notification'),
    path('student/list/', views.get_student_notifications, name='get_student_notifications'),
    path('student/<int:notification_id>/mark-read/', views.mark_notification_as_read, name='mark_notification_as_read'),
    path('student/<int:notification_id>/delete/', views.delete_student_notification, name='delete_student_notification'),
    path('student/clear-all/', views.clear_all_student_notifications, name='clear_all_student_notifications'),
]