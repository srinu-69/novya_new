from rest_framework import serializers
from .models import (
    Attendance, Assignment, AssignmentSubmission, Grade, StudyPlan,
    StudyPlanItem, StudentProgress, Achievement
)
from courses.serializers import SubjectSerializer
from courses.models import Course, CourseEnrollment
from authentication.serializers import UserSerializer
from authentication.models import TeacherRegistration, Student, StudentRegistration


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model
    """
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    teacher_name = serializers.SerializerMethodField()
    student_id = serializers.IntegerField(write_only=True)
    course_id = serializers.IntegerField(write_only=True, required=False)
    teacher_id = serializers.IntegerField(write_only=True, required=False)
    # Support subject_id for backward compatibility - will map to course_id
    subject_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Attendance
        fields = [
            'id', 'student_name', 'student_email', 'student_id', 'date', 'status', 'course_id',
            'course_name', 'subject_id', 'teacher_id', 'teacher_name',
            'remarks', 'check_in_time', 'check_out_time', 'hours_attended',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'teacher_name', 'student_name', 'student_email']
    
    def get_student_name(self, obj):
        """Get student's full name"""
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return None
    
    def get_student_email(self, obj):
        """Get student's email"""
        if obj.student:
            return obj.student.student_email or obj.student.student_username
        return None
    
    def get_teacher_name(self, obj):
        """Get teacher's full name"""
        if obj.teacher:
            return f"{obj.teacher.first_name} {obj.teacher.last_name}"
        return None
    
    def create(self, validated_data):
        # Handle subject_id -> course_id mapping if provided
        if 'subject_id' in validated_data and 'course_id' not in validated_data:
            validated_data['course_id'] = validated_data.pop('subject_id')
        elif 'subject_id' in validated_data:
            validated_data.pop('subject_id')
        
        # Get student_id and resolve course_id if not provided
        student_id = validated_data.pop('student_id', None)
        course_id = validated_data.pop('course_id', None)  # Remove immediately to prevent it from being used
        
        if not student_id:
            raise serializers.ValidationError({
                'student_id': 'Student ID is required.'
            })
        
        # Convert student_id to StudentRegistration object (database uses student_registration table)
        try:
            student_reg = StudentRegistration.objects.get(student_id=student_id)
            validated_data['student'] = student_reg
        except StudentRegistration.DoesNotExist:
            raise serializers.ValidationError({
                'student_id': f'Student with ID {student_id} not found in student_registration table.'
            })
        
        # Convert course_id to Course object if it exists
        course_obj = None
        if course_id:
            try:
                course_obj = Course.objects.get(course_id=course_id)
                print(f'Using provided course_id: {course_id}')
            except Course.DoesNotExist:
                # Course doesn't exist, will resolve below
                course_obj = None
                print(f'Warning: Course with ID {course_id} does not exist. Will resolve from student enrollment or use first available course.')
        
        # If course_id is not provided or doesn't exist, try to get it from student
        if not course_obj:
            student_reg = validated_data.get('student')  # This is StudentRegistration now
            if student_reg:
                try:
                    # Try to get course from student's enrollment (if Student model exists and is linked)
                    # First, try to find Student from User if it exists
                    enrollment = None
                    try:
                        from authentication.models import User
                        user = User.objects.filter(username=student_reg.student_username).first()
                        if user:
                            try:
                                student = Student.objects.get(student=user)
                                enrollment = CourseEnrollment.objects.filter(
                                    student=student,
                                    is_active=True
                                ).first()
                            except Student.DoesNotExist:
                                pass
                    except Exception:
                        pass
                    
                    if enrollment:
                        course_obj = enrollment.course
                    else:
                        # Try to get from student profile
                        try:
                            from authentication.models import StudentProfile
                            # Get profile using student_registration student_id directly
                            profile = StudentProfile.objects.filter(student_id=student_reg.student_id).first()
                            if profile and profile.course_id:
                                try:
                                    course_obj = Course.objects.get(course_id=profile.course_id)
                                except Course.DoesNotExist:
                                    # Get first available course
                                    course_obj = Course.objects.first()
                            else:
                                # Get first available course
                                course_obj = Course.objects.first()
                        except Exception as e:
                            # Get first available course as fallback
                            course_obj = Course.objects.first()
                            print(f'Error getting course from profile: {e}')
                    
                    # If still no course, get first available
                    if not course_obj:
                        course_obj = Course.objects.first()
                    
                except Exception as e:
                    # Get first available course as fallback
                    course_obj = Course.objects.first()
                    print(f'Error getting course from enrollment: {e}')
                
                if course_obj:
                    validated_data['course'] = course_obj
                    print(f'Using course from student enrollment/profile: {course_obj.course_id} - {course_obj.course_name}')
                else:
                    raise serializers.ValidationError({
                        'course_id': 'No courses available. Please create a course first.'
                    })
        else:
            # course_obj was found from provided course_id, set it
            validated_data['course'] = course_obj
            print(f'Using provided course: {course_obj.course_id} - {course_obj.course_name}')
        
        # Ensure course is set (required by model) - should be set by now
        if 'course' not in validated_data:
            # Last resort: get first available course
            first_course = Course.objects.first()
            if first_course:
                validated_data['course'] = first_course
                print(f'Using first available course (fallback): {first_course.course_id} - {first_course.course_name}')
            else:
                raise serializers.ValidationError({
                    'course_id': 'Course is required. Please provide a valid course_id or ensure student has a course enrollment.'
                })
        
        # Make absolutely sure course_id is not in validated_data (use course object instead)
        validated_data.pop('course_id', None)
        
        # Handle teacher_id - get from request user if not provided
        if 'teacher_id' not in validated_data or not validated_data.get('teacher_id'):
            # Try to get teacher_id from request user
            request = self.context.get('request')
            if request and request.user:
                try:
                    # Get teacher registration for the current user
                    # Try by email first
                    try:
                        teacher_reg = TeacherRegistration.objects.get(
                            email=request.user.email
                        )
                        validated_data['teacher'] = teacher_reg
                    except TeacherRegistration.DoesNotExist:
                        # Try by username
                        try:
                            teacher_reg = TeacherRegistration.objects.get(
                                teacher_username=request.user.username
                            )
                            validated_data['teacher'] = teacher_reg
                        except TeacherRegistration.DoesNotExist:
                            # If user is not a teacher, set to None (optional field)
                            validated_data['teacher'] = None
                except Exception as e:
                    print(f'Error getting teacher registration: {e}')
                    validated_data['teacher'] = None
        elif 'teacher_id' in validated_data:
            # If teacher_id is provided, get the TeacherRegistration object
            try:
                teacher_reg = TeacherRegistration.objects.get(
                    teacher_id=validated_data.pop('teacher_id')
                )
                validated_data['teacher'] = teacher_reg
            except TeacherRegistration.DoesNotExist:
                validated_data['teacher'] = None
        
        # Calculate hours_attended if check_in_time and check_out_time are provided
        if validated_data.get('check_in_time') and validated_data.get('check_out_time'):
            from datetime import datetime, timedelta
            check_in = datetime.combine(datetime.today(), validated_data['check_in_time'])
            check_out = datetime.combine(datetime.today(), validated_data['check_out_time'])
            if check_out > check_in:
                hours = (check_out - check_in).total_seconds() / 3600
                validated_data['hours_attended'] = round(hours, 2)
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle subject_id -> course_id mapping if provided
        if 'subject_id' in validated_data and 'course_id' not in validated_data:
            validated_data['course_id'] = validated_data.pop('subject_id')
        elif 'subject_id' in validated_data:
            validated_data.pop('subject_id')
        
        # Handle course_id - convert to Course object
        if 'course_id' in validated_data:
            course_id = validated_data.pop('course_id')
            try:
                course_obj = Course.objects.get(course_id=course_id)
                validated_data['course'] = course_obj
            except Course.DoesNotExist:
                # If course doesn't exist, try to get first available course or keep existing
                first_course = Course.objects.first()
                if first_course:
                    validated_data['course'] = first_course
                    print(f'Warning: Course {course_id} not found, using first available: {first_course.course_id}')
                else:
                    # Keep existing course if no courses available
                    validated_data.pop('course', None)
                    print(f'Warning: Course {course_id} not found and no courses available, keeping existing course')
        
        # Handle student_id - convert to StudentRegistration object if provided
        # Note: Usually we don't change student_id on update, but handle it if provided
        if 'student_id' in validated_data:
            student_id = validated_data.pop('student_id')
            try:
                student_reg = StudentRegistration.objects.get(student_id=student_id)
                validated_data['student'] = student_reg
            except StudentRegistration.DoesNotExist:
                # Keep existing student if not found
                validated_data.pop('student', None)
                print(f'Warning: Student {student_id} not found, keeping existing student')
        
        # Update teacher if provided
        if 'teacher_id' in validated_data:
            teacher_id = validated_data.pop('teacher_id')
            if teacher_id:
                try:
                    teacher_reg = TeacherRegistration.objects.get(teacher_id=teacher_id)
                    validated_data['teacher'] = teacher_reg
                except TeacherRegistration.DoesNotExist:
                    validated_data['teacher'] = None
            else:
                # If teacher_id is None/empty, try to get from request user
                request = self.context.get('request')
                if request and request.user:
                    try:
                        teacher_reg = TeacherRegistration.objects.get(
                            email=request.user.email
                        )
                        validated_data['teacher'] = teacher_reg
                    except TeacherRegistration.DoesNotExist:
                        try:
                            teacher_reg = TeacherRegistration.objects.get(
                                teacher_username=request.user.username
                            )
                            validated_data['teacher'] = teacher_reg
                        except TeacherRegistration.DoesNotExist:
                            validated_data['teacher'] = None
        
        # Calculate hours_attended if check_in_time and check_out_time are provided
        if validated_data.get('check_in_time') and validated_data.get('check_out_time'):
            from datetime import datetime
            check_in = datetime.combine(datetime.today(), validated_data['check_in_time'])
            check_out = datetime.combine(datetime.today(), validated_data['check_out_time'])
            if check_out > check_in:
                hours = (check_out - check_in).total_seconds() / 3600
                validated_data['hours_attended'] = round(hours, 2)
        
        return super().update(instance, validated_data)


class AssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Assignment model
    """
    subject = SubjectSerializer(read_only=True)
    assigned_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(many=True, read_only=True)
    subject_id = serializers.IntegerField(write_only=True)
    assigned_by_id = serializers.IntegerField(write_only=True)
    assigned_to_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    submissions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 'subject', 'subject_id',
            'assigned_by', 'assigned_by_id', 'assigned_to', 'assigned_to_ids',
            'due_date', 'max_marks', 'attachment', 'is_published',
            'submissions_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_submissions_count(self, obj):
        return obj.submissions.count()


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for AssignmentSubmission model
    """
    assignment = AssignmentSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    graded_by = UserSerializer(read_only=True)
    assignment_id = serializers.IntegerField(write_only=True)
    student_id = serializers.IntegerField(write_only=True)
    graded_by_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = AssignmentSubmission
        fields = [
            'id', 'assignment', 'assignment_id', 'student', 'student_id',
            'submission_text', 'submission_file', 'submitted_at',
            'marks_obtained', 'feedback', 'graded_by', 'graded_by_id', 'graded_at'
        ]
        read_only_fields = ['id', 'submitted_at', 'graded_at']


class GradeSerializer(serializers.ModelSerializer):
    """
    Serializer for Grade model
    """
    student = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    graded_by = UserSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    subject_id = serializers.IntegerField(write_only=True)
    graded_by_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Grade
        fields = [
            'id', 'student', 'student_id', 'subject', 'subject_id',
            'grade_type', 'title', 'max_marks', 'marks_obtained',
            'percentage', 'grade_letter', 'remarks', 'graded_by',
            'graded_by_id', 'graded_at'
        ]
        read_only_fields = ['id', 'graded_at']


class StudyPlanItemSerializer(serializers.ModelSerializer):
    """
    Serializer for StudyPlanItem model
    """
    class Meta:
        model = StudyPlanItem
        fields = [
            'id', 'title', 'description', 'scheduled_date', 'scheduled_time',
            'duration_minutes', 'is_completed', 'completed_at', 'order'
        ]
        read_only_fields = ['id', 'completed_at']


class StudyPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for StudyPlan model
    """
    student = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    items = StudyPlanItemSerializer(many=True, read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    subject_id = serializers.IntegerField(write_only=True)
    completed_items_count = serializers.SerializerMethodField()
    total_items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = StudyPlan
        fields = [
            'id', 'student', 'student_id', 'title', 'description',
            'subject', 'subject_id', 'start_date', 'end_date',
            'is_active', 'items', 'completed_items_count', 'total_items_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_completed_items_count(self, obj):
        return obj.items.filter(is_completed=True).count()
    
    def get_total_items_count(self, obj):
        return obj.items.count()


class StudentProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentProgress model
    """
    student = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    subject_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = StudentProgress
        fields = [
            'id', 'student', 'student_id', 'subject', 'subject_id',
            'overall_percentage', 'assignments_completed', 'total_assignments',
            'quizzes_taken', 'average_quiz_score', 'attendance_percentage',
            'last_updated'
        ]
        read_only_fields = ['id', 'last_updated']


class AchievementSerializer(serializers.ModelSerializer):
    """
    Serializer for Achievement model
    """
    student = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    subject_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'student', 'student_id', 'title', 'description',
            'achievement_type', 'subject', 'subject_id', 'icon',
            'points', 'earned_at'
        ]
        read_only_fields = ['id', 'earned_at']


class AttendanceSummarySerializer(serializers.Serializer):
    """
    Serializer for attendance summary
    """
    subject_name = serializers.CharField()
    total_days = serializers.IntegerField()
    present_days = serializers.IntegerField()
    absent_days = serializers.IntegerField()
    late_days = serializers.IntegerField()
    attendance_percentage = serializers.FloatField()


class StudentDashboardSerializer(serializers.Serializer):
    """
    Serializer for student dashboard data
    """
    user = UserSerializer()
    overall_progress = serializers.FloatField()
    active_courses = serializers.IntegerField()
    completed_assignments = serializers.IntegerField()
    pending_assignments = serializers.IntegerField()
    quizzes_taken = serializers.IntegerField()
    average_quiz_score = serializers.FloatField()
    attendance_percentage = serializers.FloatField()
    recent_achievements = AchievementSerializer(many=True)
    upcoming_assignments = AssignmentSerializer(many=True)
    study_plans = StudyPlanSerializer(many=True)


class ParentDashboardSerializer(serializers.Serializer):
    """
    Serializer for parent dashboard data
    """
    user = UserSerializer()
    children = UserSerializer(many=True)
    children_progress = serializers.ListField(
        child=serializers.DictField()
    )
    recent_notifications = serializers.ListField(
        child=serializers.DictField()
    )
    upcoming_events = serializers.ListField(
        child=serializers.DictField()
    )
