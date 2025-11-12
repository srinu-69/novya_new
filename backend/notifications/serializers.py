from rest_framework import serializers
from .models import Review, Rating, Report, StudentNotification
from authentication.models import User
from courses.models import Course, Topic


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for Review model
    """
    reviewer_name = serializers.CharField(source='reviewer_id.firstname', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)
    topic_name = serializers.CharField(source='topic_id.topic_name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'review_id', 'reviewer_id', 'course_id', 'instructor_id', 
            'topic_id', 'review_text', 'created_at',
            'reviewer_name', 'course_name', 'topic_name'
        ]
        read_only_fields = ['review_id', 'created_at']


class RatingSerializer(serializers.ModelSerializer):
    """
    Serializer for Rating model
    """
    user_name = serializers.CharField(source='user_id.firstname', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)
    topic_name = serializers.CharField(source='topic_id.topic_name', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            'rating_id', 'user_id', 'course_id', 'instructor_id',
            'topic_id', 'rating_value', 'rated_at',
            'user_name', 'course_name', 'topic_name'
        ]
        read_only_fields = ['rating_id', 'rated_at']


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer for Report model
    """
    reporter_name = serializers.CharField(source='reported_by.firstname', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'report_id', 'reported_by', 'report_type', 'reference_id',
            'description', 'status', 'created_at', 'resolved_at',
            'reporter_name'
        ]
        read_only_fields = ['report_id', 'created_at', 'resolved_at']


class StudentNotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentNotification model
    """
    class Meta:
        model = StudentNotification
        fields = [
            'notification_id', 'student_id', 'notification_type', 'title',
            'message', 'plan_id', 'is_read', 'read_at', 'created_at'
        ]
        read_only_fields = ['notification_id', 'created_at']
    
    def validate(self, data):
        """Validate notification data"""
        # Ensure required fields are present
        if not data.get('title'):
            raise serializers.ValidationError({'title': 'Title is required'})
        if not data.get('message'):
            raise serializers.ValidationError({'message': 'Message is required'})
        if not data.get('student_id'):
            raise serializers.ValidationError({'student_id': 'Student ID is required'})
        return data