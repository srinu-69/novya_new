from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count
from django.db import transaction, connection
from django.utils import timezone
from datetime import datetime, timedelta
import sys

from .models import Review, Rating, Report, StudentNotification
from .serializers import (
    ReviewSerializer, RatingSerializer, ReportSerializer, StudentNotificationSerializer
)
from authentication.models import StudentRegistration


class ReviewListCreateView(generics.ListCreateAPIView):
    """
    List and create reviews
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        topic_id = self.request.query_params.get('topic_id')
        
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if topic_id:
            queryset = queryset.filter(topic_id=topic_id)
            
        return queryset.order_by('-created_at')


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a review
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]


class RatingListCreateView(generics.ListCreateAPIView):
    """
    List and create ratings
    """
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        topic_id = self.request.query_params.get('topic_id')
        
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if topic_id:
            queryset = queryset.filter(topic_id=topic_id)
            
        return queryset.order_by('-rated_at')


class RatingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a rating
    """
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReportListCreateView(generics.ListCreateAPIView):
    """
    List and create reports
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-created_at')


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a report
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_notification_dashboard(request):
    """
    Get notification dashboard data
    """
    user = request.user
    
    # Get recent reviews by user
    recent_reviews = Review.objects.filter(
        reviewer_id=user
    ).order_by('-created_at')[:5]
    
    # Get recent ratings by user
    recent_ratings = Rating.objects.filter(
        user_id=user
    ).order_by('-rated_at')[:5]
    
    # Get reports by user
    user_reports = Report.objects.filter(
        reported_by=user
    ).order_by('-created_at')[:5]
    
    dashboard_data = {
        'recent_reviews': ReviewSerializer(recent_reviews, many=True).data,
        'recent_ratings': RatingSerializer(recent_ratings, many=True).data,
        'user_reports': ReportSerializer(user_reports, many=True).data,
        'total_reviews': Review.objects.filter(reviewer_id=user).count(),
        'total_ratings': Rating.objects.filter(user_id=user).count(),
        'total_reports': Report.objects.filter(reported_by=user).count(),
    }
    
    return Response(dashboard_data, status=status.HTTP_200_OK)


def get_student_id_from_user(user):
    """
    Helper function to get student_id from StudentRegistration for a given User.
    Returns the student_id from student_registration table.
    """
    try:
        student_reg = StudentRegistration.objects.get(student_username=user.username)
        return student_reg.student_id
    except StudentRegistration.DoesNotExist:
        # Try to find by email as fallback
        try:
            student_reg = StudentRegistration.objects.get(student_email=user.email)
            return student_reg.student_id
        except StudentRegistration.DoesNotExist:
            return None


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_student_notification(request):
    """
    Save a student notification (e.g., when study plan is created)
    """
    try:
        print(f"📥 save_student_notification called - User: {request.user.username}", file=sys.stderr, flush=True)
        print(f"📥 Request data: {request.data}", file=sys.stderr, flush=True)
        print(f"📥 IMPORTANT: Saving to 'student_notifications' table, NOT 'notifications' table!", file=sys.stderr, flush=True)
        
        student_id = get_student_id_from_user(request.user)
        print(f"📥 Student ID: {student_id}", file=sys.stderr, flush=True)
        
        if student_id is None:
            print(f"❌ Student registration not found for user: {request.user.username}", file=sys.stderr, flush=True)
            return Response({
                'error': 'Student registration not found. Please complete your registration first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['student_id'] = student_id
        print(f"📥 Prepared data: {data}", file=sys.stderr, flush=True)
        
        # Verify student_id exists in student_registration (for foreign key constraint)
        try:
            student_reg = StudentRegistration.objects.get(student_id=student_id)
            print(f"✅ Verified student_id {student_id} exists in student_registration", file=sys.stderr, flush=True)
        except StudentRegistration.DoesNotExist:
            print(f"❌ CRITICAL: student_id {student_id} does NOT exist in student_registration table!")
            return Response({
                'error': f'Student ID {student_id} not found in student_registration table'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"❌ Error checking student_registration: {str(e)}")
            return Response({
                'error': f'Error verifying student registration: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Check for duplicate notifications based on multiple criteria to prevent duplicates
        plan_id = data.get('plan_id')
        title = data.get('title', '').strip()
        message = data.get('message', '').strip()
        
        # Check for duplicates:
        # 1. By plan_id (if provided)
        # 2. By title + message + student_id (within last 5 minutes to catch rapid duplicates)
        from django.utils import timezone
        from datetime import timedelta
        
        duplicate_query = StudentNotification.objects.filter(
            student_id=student_id
        )
        
        # If plan_id exists, check by plan_id
        if plan_id:
            duplicate_query = duplicate_query.filter(plan_id=plan_id)
            print(f"📥 Checking for duplicate with plan_id: {plan_id}")
        else:
            # If no plan_id, check by title + message (within last 5 minutes)
            if title and message:
                five_minutes_ago = timezone.now() - timedelta(minutes=5)
                duplicate_query = duplicate_query.filter(
                    title=title,
                    message=message,
                    created_at__gte=five_minutes_ago
                )
                print(f"📥 Checking for duplicate by title + message (within 5 minutes): {title[:50]}...")
        
        existing_notification = duplicate_query.first()
        
        if existing_notification:
            print(f"⚠️ Duplicate notification found: {existing_notification.notification_id}")
            return Response({
                'message': 'Notification already exists',
                'notification': StudentNotificationSerializer(existing_notification).data
            }, status=status.HTTP_200_OK)
        
        print(f"📥 Creating new notification...", file=sys.stderr)
        print(f"📥 Creating new notification...", flush=True)
        
        serializer = StudentNotificationSerializer(data=data)
        if serializer.is_valid():
            print(f"✅ Serializer is valid", file=sys.stderr, flush=True)
            print(f"✅ Serializer is valid", flush=True)
            
            # Use atomic transaction to ensure save commits
            with transaction.atomic():
                notification = serializer.save()
                print(f"✅ Notification object created: {notification}", file=sys.stderr, flush=True)
                print(f"✅ Notification ID: {notification.notification_id}", file=sys.stderr, flush=True)
                
                # Force refresh from database to ensure it's actually saved
                notification.refresh_from_db()
                
                print(f"✅ Notification saved successfully - ID: {notification.notification_id}", file=sys.stderr, flush=True)
                print(f"✅ Notification title: {notification.title}", file=sys.stderr, flush=True)
                print(f"✅ Notification student_id: {notification.student_id}", file=sys.stderr, flush=True)
                print(f"✅ Notification plan_id: {notification.plan_id}", file=sys.stderr, flush=True)
                
                # Verify it was actually saved to database by querying immediately
                try:
                    saved_notification = StudentNotification.objects.get(notification_id=notification.notification_id)
                    print(f"✅ Verified notification exists in database: {saved_notification.notification_id}", file=sys.stderr, flush=True)
                    
                    # Count total notifications for this student
                    total_count = StudentNotification.objects.filter(student_id=student_id).count()
                    print(f"✅ Total notifications for student_id {student_id}: {total_count}", file=sys.stderr, flush=True)
                    
                    # Also verify using raw SQL
                    with connection.cursor() as cursor:
                        cursor.execute(
                            "SELECT notification_id, title, student_id FROM student_notifications WHERE notification_id = %s",
                            [notification.notification_id]
                        )
                        row = cursor.fetchone()
                        if row:
                            print(f"✅ Raw SQL verification: Found notification_id={row[0]}, title={row[1]}, student_id={row[2]}", file=sys.stderr, flush=True)
                        else:
                            print(f"❌ Raw SQL verification: Notification NOT found!", file=sys.stderr, flush=True)
                    
                except StudentNotification.DoesNotExist:
                    print(f"❌ CRITICAL: Notification was not saved to database!", file=sys.stderr, flush=True)
                    print(f"❌ Attempted to save notification_id: {notification.notification_id}", file=sys.stderr, flush=True)
                    return Response({
                        'error': 'Notification was not saved to database'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'message': 'Notification saved successfully',
                'notification': StudentNotificationSerializer(notification).data
            }, status=status.HTTP_201_CREATED)
        else:
            print(f"❌ Serializer errors: {serializer.errors}")
            print(f"❌ Invalid data: {data}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        import traceback
        print(f"❌ Exception in save_student_notification: {str(e)}")
        traceback.print_exc()
        return Response({
            'error': f'Failed to save notification: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_notifications(request):
    """
    Get all notifications for the authenticated student
    """
    try:
        print(f"📥 get_student_notifications called - User: {request.user.username}")
        student_id = get_student_id_from_user(request.user)
        print(f"📥 Student ID: {student_id}")
        
        if student_id is None:
            print(f"❌ Student registration not found for user: {request.user.username}")
            return Response({
                'error': 'Student registration not found. Please complete your registration first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        notifications = StudentNotification.objects.filter(
            student_id=student_id
        ).order_by('-created_at')
        
        notification_count = notifications.count()
        print(f"📥 Found {notification_count} notifications for student_id: {student_id}")
        
        # Log each notification for debugging
        if notification_count > 0:
            print(f"📥 Notification IDs: {[n.notification_id for n in notifications]}")
            for notif in notifications[:5]:  # Log first 5
                print(f"📥 - ID: {notif.notification_id}, Title: {notif.title}, Plan ID: {notif.plan_id}")
        else:
            print(f"⚠️ No notifications found in database for student_id: {student_id}")
            # Check if there are any notifications at all
            total_notifications = StudentNotification.objects.all().count()
            print(f"📥 Total notifications in database: {total_notifications}")
        
        serializer = StudentNotificationSerializer(notifications, many=True)
        print(f"📥 Serialized {len(serializer.data)} notifications")
        return Response({
            'notifications': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        print(f"❌ Exception in get_student_notifications: {str(e)}")
        traceback.print_exc()
        return Response({
            'error': f'Failed to get notifications: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    """
    Mark a notification as read
    """
    try:
        student_id = get_student_id_from_user(request.user)
        if student_id is None:
            return Response({
                'error': 'Student registration not found. Please complete your registration first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            notification = StudentNotification.objects.get(
                notification_id=notification_id,
                student_id=student_id
            )
        except StudentNotification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        
        return Response({
            'message': 'Notification marked as read',
            'notification': StudentNotificationSerializer(notification).data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to mark notification as read: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_student_notification(request, notification_id):
    """
    Delete a single notification
    """
    try:
        student_id = get_student_id_from_user(request.user)
        if student_id is None:
            return Response({
                'error': 'Student registration not found. Please complete your registration first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            notification = StudentNotification.objects.get(
                notification_id=notification_id,
                student_id=student_id
            )
        except StudentNotification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        notification.delete()
        
        return Response({
            'message': 'Notification deleted successfully'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to delete notification: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_all_student_notifications(request):
    """
    Clear all notifications for the authenticated student
    """
    try:
        student_id = get_student_id_from_user(request.user)
        if student_id is None:
            return Response({
                'error': 'Student registration not found. Please complete your registration first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        deleted_count = StudentNotification.objects.filter(student_id=student_id).delete()[0]
        
        return Response({
            'message': f'All notifications cleared successfully',
            'deleted_count': deleted_count
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to clear notifications: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)