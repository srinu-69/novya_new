from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.db import transaction
from datetime import datetime, timedelta
import uuid

from .models import (
    User, Student, Parent, PasswordResetToken,
    ParentRegistration, StudentRegistration, TeacherRegistration, ParentStudentMapping, StudentProfile, TeacherProfile,
    CoinTransaction, UserCoinBalance, StudentFeedback,
    UserBadge, UserStreak, DailyActivity, LeaderboardEntry
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    PasswordChangeSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, StudentSerializer, ParentSerializer,
    ProfileUpdateSerializer, ParentRegistrationSerializer, StudentRegistrationSerializer,
    ParentStudentMappingSerializer, StudentProfileSerializer, TeacherProfileSerializer,
    ParentRegistrationCreateSerializer, StudentRegistrationCreateSerializer, TeacherRegistrationCreateSerializer,
    CoinTransactionSerializer, AddCoinTransactionSerializer, UserCoinBalanceSerializer,
    StudentFeedbackSerializer, StudentFeedbackCreateSerializer,
    UserBadgeSerializer, UserStreakSerializer, DailyActivitySerializer, LeaderboardEntrySerializer
)


def get_student_from_request(request):
    """
    Helper function to get StudentRegistration from authenticated request
    """
    try:
        user = request.user
        if not user or not user.is_authenticated:
            return None
        
        # Try to get student registration by username
        try:
            student = StudentRegistration.objects.get(student_username=user.username)
            return student
        except StudentRegistration.DoesNotExist:
            # Try to get by email
            try:
                student = StudentRegistration.objects.get(student_email=user.email)
                return student
            except StudentRegistration.DoesNotExist:
                return None
    except Exception as e:
        print(f"Error in get_student_from_request: {str(e)}")
        return None


def update_streak_for_student(student):
    """
    Helper function to update streak for a student (called during login)
    Uses direct SQL to ensure persistence
    """
    try:
        if not student:
            print(f"❌ update_streak_for_student: student is None")
            return None
        
        from django.db import connection
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        
        print(f"🔍 Updating streak for student {student.student_username} (ID: {student.student_id}) on {today}")
        
        # Use direct SQL to get or create and update streak
        with connection.cursor() as cursor:
            # First, check if streak exists
            cursor.execute("""
                SELECT streak_id, current_streak, longest_streak, last_activity_date, 
                       total_days_active, streak_started_at
                FROM user_streak 
                WHERE student_id = %s
            """, [student.student_id])
            
            row = cursor.fetchone()
            
            if not row:
                # Create new streak - use direct SQL INSERT
                print(f"🆕 Creating NEW streak record for {student.student_username}")
                cursor.execute("""
                    INSERT INTO user_streak 
                    (student_id, current_streak, longest_streak, last_activity_date, 
                     total_days_active, streak_started_at, updated_at)
                    VALUES (%s, 1, 1, %s, 1, %s, CURRENT_TIMESTAMP)
                    RETURNING streak_id
                """, [student.student_id, today, today])
                
                streak_id = cursor.fetchone()[0]
                new_current_streak = 1
                print(f"✅ Created new streak: streak_id={streak_id}, current_streak=1")
                
            else:
                streak_id, current_streak, longest_streak, last_activity_date, total_days_active, streak_started_at = row
                
                print(f"📊 Found EXISTING streak: streak_id={streak_id}, current_streak={current_streak}, last_activity={last_activity_date}")
                
                needs_update = True
                
                # Determine new streak value
                if last_activity_date is None:
                    # First time login - initialize to 1
                    print(f"⚠️ First login detected (last_activity_date is NULL), initializing to 1")
                    new_current_streak = 1
                    new_longest_streak = max(1, longest_streak or 0)
                    new_total_days = max(1, total_days_active or 0)
                    new_started_at = today
                    
                elif last_activity_date == today:
                    # Already logged in today - keep current streak (but fix if 0)
                    print(f"ℹ️ Already logged in today (current_streak={current_streak})")
                    if current_streak == 0:
                        new_current_streak = 1
                        new_longest_streak = max(1, longest_streak or 0)
                        new_total_days = max(1, total_days_active or 0)
                        new_started_at = today if streak_started_at is None else streak_started_at
                        print(f"⚠️ Fixed zero streak to 1")
                    else:
                        # No change needed - skip update
                        needs_update = False
                        print(f"✅ Streak unchanged: {current_streak} days (already logged in today)")
                        
                elif last_activity_date == yesterday:
                    # Consecutive day - increment
                    new_current_streak = (current_streak or 0) + 1
                    new_longest_streak = max(new_current_streak, longest_streak or 0)
                    new_total_days = (total_days_active or 0) + 1
                    new_started_at = streak_started_at or yesterday
                    print(f"🔥 Consecutive day: incrementing streak from {current_streak} to {new_current_streak}")
                    
                else:
                    # Streak broken - reset to 1
                    new_current_streak = 1
                    new_longest_streak = max(1, longest_streak or 0)
                    new_total_days = (total_days_active or 0) + 1
                    new_started_at = today
                    print(f"🔥 Streak broken (last: {last_activity_date}), resetting to 1")
                
                # Update using direct SQL if needed
                if needs_update:
                    cursor.execute("""
                        UPDATE user_streak 
                        SET current_streak = %s,
                            longest_streak = %s,
                            last_activity_date = %s,
                            total_days_active = %s,
                            streak_started_at = %s,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE streak_id = %s
                    """, [new_current_streak, new_longest_streak, today, new_total_days, new_started_at, streak_id])
                    
                    print(f"✅ Updated streak via SQL: streak_id={streak_id}, current_streak={new_current_streak}, last_activity={today}")
        
        # Verify and return the updated streak
        try:
            streak = UserStreak.objects.get(streak_id=streak_id)
            print(f"✅ Verified streak after update: streak_id={streak.streak_id}, current_streak={streak.current_streak}, last_activity={streak.last_activity_date}")
            
            # Award milestone badges if needed
            milestones = {7: 'streak_7', 15: 'streak_15', 30: 'streak_30'}
            for days, badge_type in milestones.items():
                if streak.current_streak == days:
                    badge_titles = {
                        'streak_7': 'Steady Learner',
                        'streak_15': 'Focused Mind',
                        'streak_30': 'Learning Legend'
                    }
                    badge, badge_created = UserBadge.objects.get_or_create(
                        student_id=student,
                        badge_type=badge_type,
                        defaults={
                            'badge_title': badge_titles[badge_type],
                            'badge_description': f'Awarded for {days} day streak',
                            'is_active': True
                        }
                    )
                    if badge_created:
                        print(f"🏆 Badge awarded: {badge_titles[badge_type]} to {student.student_username}")
            
            return streak
        except UserStreak.DoesNotExist:
            print(f"❌ ERROR: Streak record not found after update! streak_id={streak_id}")
            return None
        
    except Exception as e:
        print(f"❌ Error updating streak for student {student.student_username if student else 'Unknown'}: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view that includes user data in response
    Validates that user exists in the correct registration table based on role
    """
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        role = request.data.get('role', '').lower().strip()  # Get role from request (student/parent/teacher)
        print(f"🔍 LOGIN ATTEMPT: username={username}, role='{role}' (raw: {request.data.get('role')})")
        
        # Require role for login - reject if not provided
        if not role:
            print(f"❌ LOGIN REJECTED: No role provided in login request")
            return Response(
                {'detail': 'Role is required for login. Please specify student, parent, or teacher.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate role is one of the allowed values
        if role not in ['student', 'parent', 'teacher']:
            print(f"❌ LOGIN REJECTED: Invalid role '{role}'")
            return Response(
                {'detail': f'Invalid role: {role}. Role must be student, parent, or teacher.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # VALIDATE USER EXISTS IN CORRECT REGISTRATION TABLE BEFORE AUTHENTICATION
        # Check registration tables directly by username (most reliable)
        validation_error = None
        
        if role == 'student':
            # Check if username exists in StudentRegistration
            student_found = StudentRegistration.objects.filter(student_username=username).exists()
            
            if not student_found:
                # Check if they're in other tables
                in_teacher = TeacherRegistration.objects.filter(teacher_username=username).exists()
                in_parent = ParentRegistration.objects.filter(parent_username=username).exists()
                
                if in_teacher:
                    validation_error = "Invalid login: This account is registered as a teacher, not a student. Please use the teacher login."
                elif in_parent:
                    validation_error = "Invalid login: This account is registered as a parent, not a student. Please use the parent login."
                else:
                    validation_error = "Invalid login: This account is not registered as a student. Please use the correct login type."
        
        elif role == 'parent':
            parent_found = ParentRegistration.objects.filter(parent_username=username).exists()
            
            if not parent_found:
                in_student = StudentRegistration.objects.filter(student_username=username).exists()
                in_teacher = TeacherRegistration.objects.filter(teacher_username=username).exists()
                
                if in_student:
                    validation_error = "Invalid login: This account is registered as a student, not a parent. Please use the student login."
                elif in_teacher:
                    validation_error = "Invalid login: This account is registered as a teacher, not a parent. Please use the teacher login."
                else:
                    validation_error = "Invalid login: This account is not registered as a parent. Please use the correct login type."
        
        elif role == 'teacher':
            teacher_found = TeacherRegistration.objects.filter(teacher_username=username).exists()
            
            if not teacher_found:
                in_student = StudentRegistration.objects.filter(student_username=username).exists()
                in_parent = ParentRegistration.objects.filter(parent_username=username).exists()
                
                if in_student:
                    validation_error = "Invalid login: This account is registered as a student, not a teacher. Please use the student login."
                elif in_parent:
                    validation_error = "Invalid login: This account is registered as a parent, not a teacher. Please use the parent login."
                else:
                    validation_error = "Invalid login: This account is not registered as a teacher. Please use the correct login type."
        
        # Reject login BEFORE authentication if validation fails
        if validation_error:
            print(f"🚫 LOGIN REJECTED BEFORE AUTH: {validation_error}")
            return Response(
                {'detail': validation_error},
                status=status.HTTP_403_FORBIDDEN
            )
        
        response = super().post(request, *args, **kwargs)
        print(f"🔍 LOGIN RESPONSE STATUS: {response.status_code}")
        if response.status_code == 200:
            # ALWAYS validate role if provided - this is critical for security
            if role:
                try:
                    user = User.objects.get(username=username)
                    print(f"🔍 Validating user role: User.role='{user.role}', requested role='{role}'")
                    validation_error = None
                    
                    if role == 'student':
                        # Check if user exists in StudentRegistration table
                        student_found = False
                        try:
                            StudentRegistration.objects.get(student_username=username)
                            student_found = True
                            print(f"✅ Student validation passed: {username} exists in StudentRegistration")
                        except StudentRegistration.DoesNotExist:
                            # Try by email as fallback
                            try:
                                StudentRegistration.objects.get(student_email=user.email)
                                student_found = True
                                print(f"✅ Student validation passed: {user.email} exists in StudentRegistration")
                            except StudentRegistration.DoesNotExist:
                                pass
                        
                        if not student_found:
                            # Also check if user exists in OTHER registration tables (should not)
                            in_parent = ParentRegistration.objects.filter(parent_username=username).exists() or ParentRegistration.objects.filter(email=user.email).exists()
                            in_teacher = TeacherRegistration.objects.filter(teacher_username=username).exists() or TeacherRegistration.objects.filter(email=user.email).exists()
                            
                            if in_parent:
                                validation_error = "Invalid login: This account is registered as a parent, not a student. Please use the parent login."
                            elif in_teacher:
                                validation_error = "Invalid login: This account is registered as a teacher, not a student. Please use the teacher login."
                            else:
                                validation_error = "Invalid login: This account is not registered as a student. Please use the correct login type."
                            print(f"❌ Student validation failed: {username} not found in StudentRegistration (in_parent={in_parent}, in_teacher={in_teacher})")
                    
                    elif role == 'parent':
                        # Check if user exists in ParentRegistration table
                        parent_found = False
                        try:
                            ParentRegistration.objects.get(parent_username=username)
                            parent_found = True
                            print(f"✅ Parent validation passed: {username} exists in ParentRegistration")
                        except ParentRegistration.DoesNotExist:
                            # Try by email as fallback
                            try:
                                ParentRegistration.objects.get(email=user.email)
                                parent_found = True
                                print(f"✅ Parent validation passed: {user.email} exists in ParentRegistration")
                            except ParentRegistration.DoesNotExist:
                                pass
                        
                        if not parent_found:
                            # Also check if user exists in OTHER registration tables (should not)
                            in_student = StudentRegistration.objects.filter(student_username=username).exists() or StudentRegistration.objects.filter(student_email=user.email).exists()
                            in_teacher = TeacherRegistration.objects.filter(teacher_username=username).exists() or TeacherRegistration.objects.filter(email=user.email).exists()
                            
                            if in_student:
                                validation_error = "Invalid login: This account is registered as a student, not a parent. Please use the student login."
                            elif in_teacher:
                                validation_error = "Invalid login: This account is registered as a teacher, not a parent. Please use the teacher login."
                            else:
                                validation_error = "Invalid login: This account is not registered as a parent. Please use the correct login type."
                            print(f"❌ Parent validation failed: {username} not found in ParentRegistration (in_student={in_student}, in_teacher={in_teacher})")
                    
                    elif role == 'teacher':
                        # Check if user exists in TeacherRegistration table
                        teacher_found = False
                        try:
                            TeacherRegistration.objects.get(teacher_username=username)
                            teacher_found = True
                            print(f"✅ Teacher validation passed: {username} exists in TeacherRegistration")
                        except TeacherRegistration.DoesNotExist:
                            # Try by email as fallback
                            try:
                                TeacherRegistration.objects.get(email=user.email)
                                teacher_found = True
                                print(f"✅ Teacher validation passed: {user.email} exists in TeacherRegistration")
                            except TeacherRegistration.DoesNotExist:
                                pass
                        
                        if not teacher_found:
                            # Also check if user exists in OTHER registration tables (should not)
                            in_student = StudentRegistration.objects.filter(student_username=username).exists() or StudentRegistration.objects.filter(student_email=user.email).exists()
                            in_parent = ParentRegistration.objects.filter(parent_username=username).exists() or ParentRegistration.objects.filter(email=user.email).exists()
                            
                            if in_student:
                                validation_error = "Invalid login: This account is registered as a student, not a teacher. Please use the student login."
                            elif in_parent:
                                validation_error = "Invalid login: This account is registered as a parent, not a teacher. Please use the parent login."
                            else:
                                validation_error = "Invalid login: This account is not registered as a teacher. Please use the correct login type."
                            print(f"❌ Teacher validation failed: {username} not found in TeacherRegistration (in_student={in_student}, in_parent={in_parent})")
                    
                    # If validation failed, return error response
                    if validation_error:
                        print(f"🚫 LOGIN REJECTED: {validation_error}")
                        return Response(
                            {'detail': validation_error},
                            status=status.HTTP_403_FORBIDDEN
                        )
                    else:
                        print(f"✅ Role validation passed for {username} as {role}")
                except User.DoesNotExist:
                    print(f"❌ User {username} not found in User table")
                    return Response(
                        {'detail': 'User not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            # Get user data (only reached if validation passed)
            username = request.data.get('username')
            print(f"🔍 LOGIN SUCCESS: Fetching user {username}")
            user = User.objects.get(username=username)
            user_data = UserSerializer(user).data
            
            # Add user data to response
            response.data['user'] = user_data
            print(f"🔍 User data added: role={user.role}, email={user.email}")
            
            # Add role-specific data (optional - don't fail if profile doesn't exist)
            try:
                if user.role == 'Student' and hasattr(user, 'student'):
                    response.data['student_profile'] = StudentSerializer(user.student).data
                elif user.role == 'Parent' and hasattr(user, 'parent'):
                    response.data['parent_profile'] = ParentSerializer(user.parent).data
            except Exception as e:
                # Profile doesn't exist yet - that's okay for now
                pass
            
            # Update streak for students on login
            print(f"🔍 Login: user.role = '{user.role}', username = '{user.username}'")
            if user.role == 'Student':
                try:
                    print(f"🔍 Attempting to update streak for student: {user.username}")
                    # Get student registration by username (request.user not authenticated yet)
                    try:
                        student = StudentRegistration.objects.get(student_username=user.username)
                        print(f"✅ Found StudentRegistration by username: {student.student_id}")
                    except StudentRegistration.DoesNotExist:
                        # Try by email
                        try:
                            student = StudentRegistration.objects.get(student_email=user.email)
                            print(f"✅ Found StudentRegistration by email: {student.student_id}")
                        except StudentRegistration.DoesNotExist:
                            print(f"❌ StudentRegistration not found for username: {user.username} or email: {user.email}")
                            # List all students to debug
                            all_students = StudentRegistration.objects.all()[:5]
                            print(f"📋 Available students (first 5): {[(s.student_id, s.student_username, s.student_email) for s in all_students]}")
                            student = None
                    
                    if student:
                        print(f"🔍 Calling update_streak_for_student for student_id: {student.student_id}")
                        try:
                            streak = update_streak_for_student(student)
                            if streak:
                                try:
                                    # Add streak data to response
                                    streak_serializer = UserStreakSerializer(streak)
                                    response.data['streak'] = streak_serializer.data
                                    print(f"✅ Streak updated on login for {user.username}: {streak.current_streak} days")
                                    print(f"✅ Streak data in response: {response.data.get('streak', 'NOT IN RESPONSE')}")
                                except Exception as ser_error:
                                    print(f"❌ ERROR serializing streak: {ser_error}")
                                    import traceback
                                    traceback.print_exc()
                            else:
                                print(f"⚠️ update_streak_for_student returned None for {user.username}")
                        except Exception as streak_error:
                            print(f"❌ ERROR in update_streak_for_student: {streak_error}")
                            import traceback
                            traceback.print_exc()
                    else:
                        print(f"⚠️ Student is None, cannot update streak for {user.username}")
                except Exception as e:
                    print(f"❌ Error: Could not update streak on login for {user.username}: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    # Don't fail login if streak update fails
                    pass
            else:
                print(f"ℹ️ User role is '{user.role}', not 'Student', skipping streak update")
        
        return response


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Register a new user - Creates records in both User table and role-specific registration tables
    Also handles case where user exists in users table but missing registration record
    """
    print(f"📥 Registration request received for username: {request.data.get('username', 'N/A')}")
    print(f"📋 Request data: {request.data}")
    
    username = request.data.get('username')
    email = request.data.get('email')
    role = request.data.get('role', 'Student')
    
    # Check if user already exists in users table
    existing_user = None
    try:
        existing_user = User.objects.get(username=username)
        print(f"⚠️ User {username} already exists in users table")
        
        # Check if student_registration exists for this user
        if role == 'Student':
            try:
                student_reg = StudentRegistration.objects.get(student_username=username)
                print(f"✅ StudentRegistration already exists for {username}")
                # User and registration both exist - return error
                return Response({
                    'errors': {
                        'username': ['Username already exists. Please choose a different username.'],
                        'email': ['Email already registered. Please use a different email.'],
                    },
                    'message': 'User already fully registered'
                }, status=status.HTTP_400_BAD_REQUEST)
            except StudentRegistration.DoesNotExist:
                print(f"⚠️ User exists but StudentRegistration missing - will create it")
                # User exists but student_registration doesn't - we'll create it below
        elif role == 'Parent':
            try:
                parent_reg = ParentRegistration.objects.get(parent_username=username)
                print(f"✅ ParentRegistration already exists for {username}")
                # User and registration both exist - return error
                return Response({
                    'errors': {
                        'username': ['Username already exists. Please choose a different username.'],
                        'email': ['Email already registered. Please use a different email.'],
                    },
                    'message': 'User already fully registered'
                }, status=status.HTTP_400_BAD_REQUEST)
            except ParentRegistration.DoesNotExist:
                print(f"⚠️ User exists but ParentRegistration missing - will create it")
                # User exists but parent_registration doesn't - we'll create it below
        elif role == 'Teacher':
            try:
                teacher_reg = TeacherRegistration.objects.get(teacher_username=username)
                print(f"✅ TeacherRegistration already exists for {username}")
                # User and registration both exist - return error
                return Response({
                    'errors': {
                        'username': ['Username already exists. Please choose a different username.'],
                        'email': ['Email already registered. Please use a different email.'],
                    },
                    'message': 'User already fully registered'
                }, status=status.HTTP_400_BAD_REQUEST)
            except TeacherRegistration.DoesNotExist:
                print(f"⚠️ User exists but TeacherRegistration missing - will create it")
                # User exists but teacher_registration doesn't - we'll create it below
    except User.DoesNotExist:
        print(f"✅ User {username} does not exist - will create new user")
        existing_user = None
    
    # If user exists but missing registration, create registration record directly
    if existing_user:
        print(f"🔧 Completing registration for existing user: {existing_user.username}")
        
        if existing_user.role == 'Student':
            # Create StudentRegistration for existing user
            try:
                parent_email = request.data.get('parent_email', '').strip()
                
                # Ensure parent exists
                if not parent_email:
                    first_parent = ParentRegistration.objects.first()
                    if first_parent:
                        parent_email = first_parent.email
                    else:
                        # Create default system parent
                        default_parent = ParentRegistration.objects.create(
                            email='system@novya.com',
                            first_name='System',
                            last_name='Parent',
                            phone_number=None,
                            parent_username='system_parent',
                            parent_password='system'
                        )
                        parent_email = default_parent.email
                
                # Verify parent exists
                if not ParentRegistration.objects.filter(email=parent_email).exists():
                    raise Exception(f"Parent with email {parent_email} does not exist")
                
                # Create StudentRegistration
                student_reg = StudentRegistration.objects.create(
                    student_username=existing_user.username,
                    student_email=existing_user.email,
                    first_name=existing_user.firstname or '',
                    last_name=existing_user.lastname or '',
                    phone_number=existing_user.phonenumber or None,
                    parent_email=parent_email
                )
                print(f"✅ Created StudentRegistration for existing user: {student_reg.student_id}")
                
                # Create StudentProfile
                try:
                    StudentProfile.objects.create(
                        student_id=student_reg.student_id,
                        student_username=existing_user.username,
                        parent_email=parent_email,
                        grade='',
                        school='',
                        course_id=None,
                        address=''
                    )
                    print(f"✅ Created StudentProfile for existing user")
                except Exception as e:
                    print(f"⚠️ Warning: Could not create StudentProfile: {e}")
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(existing_user)
                
                return Response({
                    'message': 'Registration completed successfully for existing user',
                    'user': UserSerializer(existing_user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(f"❌ Error completing registration for existing user: {e}")
                import traceback
                traceback.print_exc()
                return Response({
                    'error': f'Failed to complete registration: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif existing_user.role == 'Parent':
            # Create ParentRegistration for existing user
            try:
                ParentRegistration.objects.create(
                    email=existing_user.email,
                    first_name=existing_user.firstname or '',
                    last_name=existing_user.lastname or '',
                    phone_number=existing_user.phonenumber or None,
                    parent_username=existing_user.username,
                    parent_password=existing_user.password  # Already hashed
                )
                print(f"✅ Created ParentRegistration for existing user")
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(existing_user)
                
                return Response({
                    'message': 'Registration completed successfully for existing user',
                    'user': UserSerializer(existing_user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(f"❌ Error completing registration for existing user: {e}")
                import traceback
                traceback.print_exc()
                return Response({
                    'error': f'Failed to complete registration: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif existing_user.role == 'Teacher':
            # Create TeacherRegistration for existing user
            try:
                TeacherRegistration.objects.create(
                    email=existing_user.email,
                    first_name=existing_user.firstname or '',
                    last_name=existing_user.lastname or '',
                    phone_number=existing_user.phonenumber or None,
                    teacher_username=existing_user.username,
                    teacher_password=existing_user.password  # Already hashed
                )
                print(f"✅ Created TeacherRegistration for existing user")
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(existing_user)
                
                return Response({
                    'message': 'Registration completed successfully for existing user',
                    'user': UserSerializer(existing_user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(f"❌ Error completing registration for existing user: {e}")
                import traceback
                traceback.print_exc()
                return Response({
                    'error': f'Failed to complete registration: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Normal registration flow for new users
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        print(f"✅ Serializer is valid")
        user = serializer.save()
        
        # Create role-specific records in registration tables (only tables that exist)
        if user.role == 'Student':
            # CRITICAL: The database has a FK constraint on parent_email -> parent_registration
            # We MUST ensure parent_email exists in parent_registration before creating StudentRegistration
            
            parent_email = request.data.get('parent_email', '').strip()
            print(f"📧 Parent email from request: {parent_email}")
            
            # Step 1: If parent_email is provided, verify or create it
            if parent_email:
                try:
                    # Check if parent exists in parent_registration table
                    parent_exists = ParentRegistration.objects.filter(email=parent_email).exists()
                    if not parent_exists:
                        print(f"⚠️ Parent with email {parent_email} not found. Creating parent in parent_registration.")
                        # Create parent registration if it doesn't exist
                        try:
                            # Get parent details from request if available
                            parent_first_name = request.data.get('parent_first_name', 'Parent') or 'Parent'
                            parent_last_name = request.data.get('parent_last_name', '') or ''
                            parent_phone = request.data.get('parent_phone_number') or None
                            parent_username = request.data.get('parent_username') or f"parent_{user.username}"
                            
                            # Create parent registration
                            placeholder_parent = ParentRegistration.objects.create(
                                email=parent_email,
                                first_name=parent_first_name,
                                last_name=parent_last_name,
                                phone_number=parent_phone,
                                parent_username=parent_username,
                                parent_password='placeholder'  # Placeholder password
                            )
                            print(f"✅ Created ParentRegistration for {parent_email}")
                            
                            # Also create User record for the parent if it doesn't exist
                            try:
                                User.objects.get(email=parent_email)
                            except User.DoesNotExist:
                                # Create User for parent
                                parent_user = User.objects.create_user(
                                    username=parent_username,
                                    email=parent_email,
                                    firstname=parent_first_name,
                                    lastname=parent_last_name,
                                    phonenumber=parent_phone,
                                    role='Parent',
                                    password='placeholder'
                                )
                                print(f"✅ Created User for parent: {parent_user.username}")
                        except Exception as parent_create_error:
                            print(f"⚠️ Could not create parent: {parent_create_error}")
                            # Try to use any existing parent
                            first_parent = ParentRegistration.objects.first()
                            if first_parent:
                                parent_email = first_parent.email
                                print(f"⚠️ Using existing parent email: {parent_email}")
                            else:
                                parent_email = None
                except Exception as e:
                    print(f"⚠️ Error checking parent: {e}")
                    parent_email = None
            
            # Step 2: If no parent_email, find or create a default parent
            if not parent_email:
                first_parent = ParentRegistration.objects.first()
                if first_parent:
                    parent_email = first_parent.email
                    print(f"⚠️ No parent provided, using existing parent: {parent_email}")
                else:
                    # Create default system parent
                    print(f"⚠️ No parents exist. Creating default system parent.")
                    try:
                        # Check if system parent User exists
                        system_user, user_created = User.objects.get_or_create(
                            username='system_parent',
                            defaults={
                                'email': 'system@novya.com',
                                'firstname': 'System',
                                'lastname': 'Parent',
                                'role': 'Parent',
                                'password': 'system'
                            }
                        )
                        
                        # Create system parent registration
                        default_parent = ParentRegistration.objects.create(
                            email='system@novya.com',
                            first_name='System',
                            last_name='Parent',
                            phone_number=None,
                            parent_username='system_parent',
                            parent_password='system'
                        )
                        parent_email = default_parent.email
                        print(f"✅ Created default system parent (User + ParentRegistration): {parent_email}")
                    except Exception as e:
                        print(f"❌ Failed to create default parent: {e}")
                        import traceback
                        traceback.print_exc()
                        # This is critical - we cannot create StudentRegistration without a parent
                        raise Exception(f"Cannot create StudentRegistration: No parent exists and cannot create default parent. Error: {e}")
            
            # Create StudentRegistration record (for database compatibility)
            # At this point, parent_email should be verified to exist in parent_registration
            try:
                # Final verification: parent MUST exist before creating student
                if not parent_email:
                    raise Exception("Cannot create StudentRegistration: parent_email is required but not set")
                
                if not ParentRegistration.objects.filter(email=parent_email).exists():
                    raise Exception(f"Parent with email {parent_email} must exist in parent_registration table. Cannot create StudentRegistration.")
                
                print(f"🔍 Creating StudentRegistration with verified parent_email: {parent_email}")
                student_reg = StudentRegistration.objects.create(
                    student_username=user.username,
                    student_email=user.email,
                    first_name=user.firstname,
                    last_name=user.lastname,
                    phone_number=user.phonenumber,
                    parent_email=parent_email  # Use verified parent_email that exists in parent_registration
                )
                print(f"✅ Created StudentRegistration for {user.username} with student_id={student_reg.student_id}, parent_email={student_reg.parent_email}")
                
                # Create StudentProfile record (only with fields that exist in database)
                # Use student_reg.student_id (not user.userid) to satisfy foreign key constraint
                try:
                    StudentProfile.objects.create(
                        student_id=student_reg.student_id,  # Use StudentRegistration's student_id
                        student_username=user.username,
                        parent_email=student_reg.parent_email,
                        grade='',  # Empty for now
                        school='',  # Empty for now
                        course_id=None,  # Empty for now
                        address=''  # Empty for now
                    )
                    print(f"✅ Created StudentProfile for {user.username} with student_id={student_reg.student_id}")
                except Exception as e:
                    print(f"⚠️ Warning: Error creating StudentProfile: {e}")
                    import traceback
                    traceback.print_exc()
                    # Don't fail registration if profile creation fails - StudentRegistration is created
                    
            except Exception as e:
                print(f"❌ CRITICAL: Error creating StudentRegistration: {e}")
                import traceback
                traceback.print_exc()
                # IMPORTANT: If StudentRegistration creation fails, we need to delete the User
                # to maintain consistency, OR ensure it gets created properly
                # For now, let's retry with better error handling
                try:
                    # Try one more time with a guaranteed valid parent
                    print(f"🔄 Retrying StudentRegistration creation with guaranteed parent...")
                    guaranteed_parent = ParentRegistration.objects.first()
                    if not guaranteed_parent:
                        # Create system parent if none exists
                        guaranteed_parent = ParentRegistration.objects.create(
                            email='system@novya.com',
                            first_name='System',
                            last_name='Parent',
                            phone_number=None,
                            parent_username='system_parent',
                            parent_password='system'
                        )
                    
                    student_reg = StudentRegistration.objects.create(
                        student_username=user.username,
                        student_email=user.email,
                        first_name=user.firstname,
                        last_name=user.lastname,
                        phone_number=user.phonenumber,
                        parent_email=guaranteed_parent.email
                    )
                    print(f"✅ Successfully created StudentRegistration on retry: {student_reg.student_id}")
                except Exception as retry_error:
                    print(f"❌ Failed to create StudentRegistration even on retry: {retry_error}")
                    # User is already created - StudentRegistration will be auto-created later when needed
                    # Don't delete user as it might have been used for other purposes
                
        elif user.role == 'Parent':
            # Create ParentRegistration record (for database compatibility)
            try:
                ParentRegistration.objects.create(
                    email=user.email,
                    first_name=user.firstname,
                    last_name=user.lastname,
                    phone_number=user.phonenumber,
                    parent_username=user.username,
                    parent_password=user.password  # Already hashed
                )
                print(f"✅ Created ParentRegistration for {user.username}")
            except Exception as e:
                print(f"❌ Error creating ParentRegistration: {e}")
                # Continue anyway - user is still created
        
        elif user.role == 'Teacher':
            # Create TeacherRegistration record (for database compatibility)
            try:
                TeacherRegistration.objects.create(
                    email=user.email,
                    first_name=user.firstname,
                    last_name=user.lastname,
                    phone_number=user.phonenumber,
                    teacher_username=user.username,
                    teacher_password=user.password  # Already hashed
                )
                print(f"✅ Created TeacherRegistration for {user.username}")
            except Exception as e:
                print(f"❌ Error creating TeacherRegistration: {e}")
                # Continue anyway - user is still created
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    # Log validation errors for debugging
    print(f"❌ Serializer validation failed!")
    print(f"📋 Validation errors: {serializer.errors}")
    print(f"📋 Request data was: {request.data}")
    
    # Show table counts for debugging
    try:
        # Note: User, ParentRegistration, StudentRegistration are already imported at top of file
        print(f"\n📊 Current table row counts:")
        print(f"  users: {User.objects.count()}")
        print(f"  parent_registration: {ParentRegistration.objects.count()}")
        print(f"  student_registration: {StudentRegistration.objects.count()}")
        
        # Check if the submitted data exists in any table
        username = request.data.get('username')
        email = request.data.get('email')
        phone = request.data.get('phonenumber')
        
        if username:
            print(f"\n🔍 Checking username '{username}':")
            print(f"  In users table: {User.objects.filter(username=username).exists()}")
            print(f"  In parent_registration table: {ParentRegistration.objects.filter(parent_username=username).exists()}")
            print(f"  In student_registration table: {StudentRegistration.objects.filter(student_username=username).exists()}")
        
        if email:
            print(f"\n🔍 Checking email '{email}':")
            print(f"  In users table: {User.objects.filter(email=email).exists()}")
            print(f"  In parent_registration table: {ParentRegistration.objects.filter(email=email).exists()}")
            print(f"  In student_registration table: {StudentRegistration.objects.filter(student_email=email).exists()}")
        
        if phone:
            print(f"\n🔍 Checking phone '{phone}':")
            print(f"  In users table: {User.objects.filter(phonenumber=phone).exists()}")
            print(f"  In parent_registration table: {ParentRegistration.objects.filter(phone_number=phone).exists()}")
            print(f"  In student_registration table: {StudentRegistration.objects.filter(phone_number=phone).exists()}")
    except Exception as e:
        print(f"⚠️ Error checking table counts: {e}")
    
    # Add detailed error information
    error_response = {
        'errors': serializer.errors,
        'message': 'Registration failed. Please check the errors below.',
        'request_data_summary': {
            'username': request.data.get('username'),
            'email': request.data.get('email'),
            'role': request.data.get('role')
        }
    }
    
    return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Temporarily disabled for testing
def get_user_profile(request):
    """
    Get current user profile
    """
    user = request.user
    
    # Handle unauthenticated requests (for testing)
    if not user.is_authenticated:
        # Try to find srinu123 specifically for testing
        try:
            student_registration = StudentRegistration.objects.get(student_username='srinu123')
            # Create a mock user data structure
            response_data = {
                'userid': student_registration.student_id,
                'username': student_registration.student_username,
                'email': student_registration.student_email,
                'firstname': student_registration.first_name,
                'lastname': student_registration.last_name,
                'phonenumber': student_registration.phone_number,
                'role': 'Student',
                'createdat': student_registration.created_at
            }
            
            # Get student profile data
            try:
                student_profile = StudentProfile.objects.get(student_id=student_registration.student_id)
                response_data['student_profile'] = {
                    'student_username': student_profile.student_username,
                    'parent_email': student_profile.parent_email,
                    'grade': student_profile.grade,
                    'school': student_profile.school,
                    'address': student_profile.address
                }
            except StudentProfile.DoesNotExist:
                response_data['student_profile'] = {
                    'student_username': '',
                    'parent_email': '',
                    'grade': '',
                    'school': '',
                    'address': ''
                }
            
            return Response(response_data)
        except StudentRegistration.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Failed to fetch profile: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Handle authenticated requests
    try:
        if user.role == 'Student':
            try:
                # Get student registration data
                student_registration = StudentRegistration.objects.get(student_username=user.username)
                response_data['student_registration'] = {
                    'first_name': student_registration.first_name,
                    'last_name': student_registration.last_name,
                    'phone_number': student_registration.phone_number,
                    'student_email': student_registration.student_email,
                    'student_username': student_registration.student_username,
                    'parent_email': student_registration.parent_email
                }
                
                # Get student profile data if exists
                try:
                    student_profile = StudentProfile.objects.get(student_id=student_registration.student_id)
                    response_data['student_profile'] = {
                        'student_username': student_profile.student_username,
                        'parent_email': student_profile.parent_email,
                        'grade': student_profile.grade,
                        'school': student_profile.school,
                        'address': student_profile.address
                    }
                except StudentProfile.DoesNotExist:
                    response_data['student_profile'] = {
                        'student_username': '',
                        'parent_email': '',
                        'grade': '',
                        'school': '',
                        'address': ''
                    }
                
                # Get parent details automatically if parent_email exists
                if student_registration.parent_email and student_registration.parent_email != 'no-parent@example.com':
                    try:
                        parent_registration = ParentRegistration.objects.get(email=student_registration.parent_email)
                        response_data['parent_details'] = {
                            'parent_name': f"{parent_registration.first_name} {parent_registration.last_name}",
                            'parent_email': parent_registration.email,
                            'parent_phone': parent_registration.phone_number
                        }
                    except ParentRegistration.DoesNotExist:
                        response_data['parent_details'] = {
                            'parent_name': 'Not provided',
                            'parent_email': 'Not provided',
                            'parent_phone': 'Not provided'
                        }
                else:
                    response_data['parent_details'] = {
                        'parent_name': 'Not provided',
                        'parent_email': 'Not provided',
                        'parent_phone': 'Not provided'
                    }
                    
            except StudentRegistration.DoesNotExist:
                response_data['student_registration'] = None
                response_data['student_profile'] = None
                response_data['parent_details'] = None
                
        elif user.role == 'Parent':
            try:
                # Get parent registration data
                parent_registration = ParentRegistration.objects.get(parent_username=user.username)
                response_data['parent_registration'] = {
                    'first_name': parent_registration.first_name,
                    'last_name': parent_registration.last_name,
                    'phone_number': parent_registration.phone_number,
                    'email': parent_registration.email,
                    'parent_username': parent_registration.parent_username
                }
            except ParentRegistration.DoesNotExist:
                response_data['parent_registration'] = None
        
        return Response(response_data)
    except Exception as e:
        return Response({'error': f'Failed to fetch profile: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_child_profile_for_parent(request):
    """
    Get child profile data for a parent user.
    Fetches student data from StudentRegistration and StudentProfile tables.
    """
    user = request.user
    
    if user.role != 'Parent':
        return Response({'error': 'Access denied. Only parent users can access this endpoint.'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Get parent registration data
        parent_registration = ParentRegistration.objects.get(parent_username=user.username)
        
        # Find student(s) linked to this parent via parent_email
        student_registrations = StudentRegistration.objects.filter(parent_email=parent_registration.email)
        
        if not student_registrations.exists():
            return Response({'error': 'No child found linked to this parent account.'}, 
                           status=status.HTTP_404_NOT_FOUND)

        # Allow selecting a specific child by email (case-insensitive)
        child_email_param = (
            request.query_params.get('child_email')
            or request.query_params.get('childEmail')
            or request.query_params.get('student_email')
        )
        selected_student_qs = student_registrations
        if child_email_param:
            child_email_param = child_email_param.strip()
            selected_student_qs = student_registrations.filter(student_email__iexact=child_email_param)
            if not selected_student_qs.exists():
                return Response(
                    {'error': f'No child found with email {child_email_param} for this parent.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Select the requested child, or default to the first linked child
        student_reg = selected_student_qs.order_by('student_id').first()
        
        # Get student profile data
        try:
            student_profile = StudentProfile.objects.get(student_id=student_reg.student_id)
        except StudentProfile.DoesNotExist:
            student_profile = None
        
        # Get user data for the student
        try:
            student_user = User.objects.get(username=student_reg.student_username)
        except User.DoesNotExist:
            student_user = None
        
        # Build response data
        response_data = {
            'student_registration': {
                'student_id': student_reg.student_id,
                'first_name': student_reg.first_name,
                'last_name': student_reg.last_name,
                'student_username': student_reg.student_username,
                'student_email': student_reg.student_email,
                'phone_number': student_reg.phone_number,
                'parent_email': student_reg.parent_email,
                'created_at': student_reg.created_at
            },
            'student_profile': {
                'profile_id': student_profile.profile_id if student_profile else None,
                'grade': student_profile.grade if student_profile else None,
                'school': student_profile.school if student_profile else None,
                'address': student_profile.address if student_profile else None,
                'course_id': student_profile.course_id if student_profile else None
            },
            'student_user': {
                'userid': student_user.userid if student_user else None,
                'username': student_user.username if student_user else None,
                'email': student_user.email if student_user else None,
                'phonenumber': student_user.phonenumber if student_user else None,
                'firstname': student_user.firstname if student_user else None,
                'lastname': student_user.lastname if student_user else None
            }
        }
        
        return Response(response_data)
        
    except ParentRegistration.DoesNotExist:
        return Response({'error': 'Parent registration not found.'}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Failed to fetch child profile: {str(e)}'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_parent_profile_with_child_address(request):
    """
    Get parent profile data with child's address.
    Fetches parent contact info from ParentRegistration and child's address from StudentProfile.
    """
    user = request.user
    
    if user.role != 'Parent':
        return Response({'error': 'Access denied. Only parent users can access this endpoint.'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Get parent registration data
        parent_registration = ParentRegistration.objects.get(parent_username=user.username)
        
        # Find student(s) linked to this parent via parent_email
        student_registrations = StudentRegistration.objects.filter(parent_email=parent_registration.email)
        
        # Determine which child to use (defaults to first linked child)
        child_address = 'Not specified'
        student_reg = None
        if student_registrations.exists():
            child_email_param = (
                request.query_params.get('child_email')
                or request.query_params.get('childEmail')
                or request.query_params.get('student_email')
            )
            selected_students = student_registrations
            if child_email_param:
                child_email_param = child_email_param.strip()
                selected_students = student_registrations.filter(student_email__iexact=child_email_param)
                if not selected_students.exists():
                    return Response(
                        {'error': f'No child found with email {child_email_param} for this parent.'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            student_reg = selected_students.order_by('student_id').first()
            try:
                student_profile = StudentProfile.objects.get(student_id=student_reg.student_id)
                child_address = student_profile.address if student_profile.address else 'Not specified'
            except StudentProfile.DoesNotExist:
                child_address = 'Not specified'
        
        # Build response data
        response_data = {
            'parent_registration': {
                'parent_id': parent_registration.parent_id,
                'first_name': parent_registration.first_name,
                'last_name': parent_registration.last_name,
                'email': parent_registration.email,
                'phone_number': parent_registration.phone_number,
                'parent_username': parent_registration.parent_username,
                'created_at': parent_registration.created_at
            },
            'child_address': child_address
        }
        
        return Response(response_data)
        
    except ParentRegistration.DoesNotExist:
        return Response({'error': 'Parent registration not found.'}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Failed to fetch parent profile: {str(e)}'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_user_profile(request):
    """
    Update current user profile
    """
    user = request.user
    serializer = ProfileUpdateSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': UserSerializer(user).data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """
    Change user password
    """
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_password_reset(request):
    """
    Request password reset
    """
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if user exists in User model
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'No user found with this email address'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate reset token
    token = get_random_string(32)
    expires_at = datetime.now() + timedelta(hours=1)
    
    # Create or update reset token
    reset_token, created = PasswordResetToken.objects.get_or_create(
        user=user,
        defaults={'token': token, 'expires_at': expires_at}
    )
    
    if not created:
        reset_token.token = token
        reset_token.expires_at = expires_at
        reset_token.is_used = False
        reset_token.save()
    
    # For development, return the token (in production, send email)
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    
    return Response({
        'message': 'Password reset link sent to your email',
        'reset_url': reset_url,  # Remove this in production
        'token': token  # Remove this in production
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def confirm_password_reset(request):
    """
    Confirm password reset
    """
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not token or not new_password or not confirm_password:
        return Response({'error': 'Token, new password, and confirm password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({'error': 'Password must be at least 6 characters long'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        reset_token = PasswordResetToken.objects.get(
            token=token,
            is_used=False,
            expires_at__gt=datetime.now()
        )
        
        # Update user password
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        # Also update password in the new schema if it exists
        if user.role == 'Parent':
            try:
                parent = ParentRegistration.objects.get(email=user.email)
                from django.contrib.auth.hashers import make_password
                parent.parent_password = make_password(new_password)
                parent.save()
            except ParentRegistration.DoesNotExist:
                pass
        
        # Mark token as used
        reset_token.is_used = True
        reset_token.save()
        
        return Response({'message': 'Password reset successfully'})
    
    except PasswordResetToken.DoesNotExist:
        return Response(
            {'error': 'Invalid or expired reset token'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """
    Logout user (blacklist refresh token)
    """
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logged out successfully'})
    except Exception as e:
        return Response(
            {'error': 'Invalid token'},
            status=status.HTTP_400_BAD_REQUEST
        )


class StudentListCreateView(generics.ListCreateAPIView):
    """
    List and create students
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Parents can only see their children
        if self.request.user.role == 'parent':
            return Student.objects.filter(parent__parent=self.request.user)
        return Student.objects.all()


class ParentListCreateView(generics.ListCreateAPIView):
    """
    List and create parents
    """
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [permissions.IsAuthenticated]




@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_dashboard_data(request):
    """
    Get dashboard data based on user role
    """
    user = request.user
    
    if user.role == 'student':
        # Student dashboard data
        from courses.models import CourseEnrollment
        from progress.models import StudentProgress, Assignment
        from quizzes.models import QuizAttempt
        
        enrollments = CourseEnrollment.objects.filter(student=user, is_active=True)
        progress_records = StudentProgress.objects.filter(student=user)
        assignments = Assignment.objects.filter(assigned_to=user)
        quiz_attempts = QuizAttempt.objects.filter(student=user)
        
        dashboard_data = {
            'user': UserSerializer(user).data,
            'enrolled_courses': enrollments.count(),
            'overall_progress': sum([p.overall_percentage for p in progress_records]) / len(progress_records) if progress_records else 0,
            'pending_assignments': assignments.filter(due_date__gt=datetime.now()).count(),
            'completed_assignments': assignments.filter(submissions__student=user).count(),
            'quizzes_taken': quiz_attempts.count(),
            'average_quiz_score': sum([a.score for a in quiz_attempts]) / len(quiz_attempts) if quiz_attempts else 0,
        }
        
    elif user.role == 'parent':
        # Parent dashboard data
        from progress.models import StudentProgress
        
        children = Student.objects.filter(parent__parent=user)
        children_progress = []
        
        for child in children:
            progress_records = StudentProgress.objects.filter(student=child.student)
            children_progress.append({
                'child': UserSerializer(child.student).data,
                'overall_progress': sum([p.overall_percentage for p in progress_records]) / len(progress_records) if progress_records else 0,
                'subjects_count': progress_records.count(),
            })
        
        dashboard_data = {
            'user': UserSerializer(user).data,
            'children': [UserSerializer(child.student).data for child in children],
            'children_progress': children_progress,
        }
        
    
    else:
        dashboard_data = {
            'user': UserSerializer(user).data,
        }
    
    return Response(dashboard_data)


# New views for the updated schema

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_parent(request):
    """
    Register a new parent
    """
    serializer = ParentRegistrationCreateSerializer(data=request.data)
    if serializer.is_valid():
        parent = serializer.save()
        
        # Also create a User entry for authentication
        try:
            user = User.objects.create_user(
                username=parent.parent_username,
                email=parent.email,
                firstname=parent.first_name,
                lastname=parent.last_name,
                phonenumber=parent.phone_number,
                role='Parent',
                password=request.data.get('parent_password')  # This will be hashed by create_user
            )
            
            # Create Parent profile
            Parent.objects.create(parent=user)
            
        except Exception as e:
            # If User creation fails, delete the parent registration
            parent.delete()
            return Response({
                'error': f'Failed to create user account: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Parent registered successfully',
            'parent': ParentRegistrationSerializer(parent).data,
            'user_id': user.userid
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_student(request):
    """
    Register a new student
    """
    serializer = StudentRegistrationCreateSerializer(data=request.data)
    if serializer.is_valid():
        student = serializer.save()
        
        # Get password from the serializer's validated data
        password = request.data.get('password')
        
        # Also create a User entry for authentication
        try:
            # Ensure we have a valid email for the user
            user_email = student.student_email
            if not user_email:
                user_email = f"{student.student_username}@student.novya.com"
            
            # Check if phone number is already in use
            phone_number = student.phone_number
            if User.objects.filter(phonenumber=phone_number).exists():
                # Generate a unique phone number by appending a suffix
                counter = 1
                while User.objects.filter(phonenumber=f"{phone_number}_{counter}").exists():
                    counter += 1
                phone_number = f"{phone_number}_{counter}"
                print(f"Warning: Phone number conflict resolved by using: {phone_number}")
            
            user = User.objects.create_user(
                username=student.student_username,
                email=user_email,
                firstname=student.first_name,
                lastname=student.last_name,
                phonenumber=phone_number,
                role='Student',
                password=password  # Add password here
            )
            
            # Create Student profile
            # Try to find the parent if it exists
            parent_obj = None
            try:
                parent_registration = ParentRegistration.objects.get(email=student.parent_email)
                # Find the corresponding User and Parent objects
                parent_user = User.objects.get(email=student.parent_email)
                parent_obj = Parent.objects.get(parent=parent_user)
            except (ParentRegistration.DoesNotExist, User.DoesNotExist, Parent.DoesNotExist):
                # Parent doesn't exist yet, create student without parent link
                pass
            
            # Create Student model with error handling
            try:
                Student.objects.create(student=user, parent=parent_obj)
            except Exception as student_error:
                # If Student creation fails, log the error but don't fail the registration
                print(f"Warning: Could not create Student model: {student_error}")
                # Continue with registration even if Student model creation fails
            
            # Auto-create StudentProfile with registration data
            try:
                StudentProfile.objects.get_or_create(
                    student_id=student.student_id,
                    defaults={
                        'student_username': student.student_username,
                        'parent_email': student.parent_email,
                        'grade': request.data.get('grade', ''),
                        'school': request.data.get('school', ''),
                        'address': request.data.get('address', ''),
                    }
                )
                print(f"✅ Auto-created StudentProfile for student: {student.student_username}")
            except Exception as profile_error:
                print(f"Warning: Could not create StudentProfile: {profile_error}")
            
        except Exception as e:
            # If User creation fails, delete the student registration
            student.delete()
            return Response({
                'error': f'Failed to create user account: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Student registered successfully',
            'student': StudentRegistrationSerializer(student).data,
            'user_id': user.userid
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Changed to AllowAny for testing
def get_parents(request):
    """
    Get all parents
    """
    parents = ParentRegistration.objects.all()
    serializer = ParentRegistrationSerializer(parents, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_students(request):
    """
    Get students filtered by teacher's school (if user is a teacher)
    Otherwise return all students (for admin/parent access)
    """
    user = request.user
    
    # If user is a teacher, filter by school
    if user.role == 'Teacher':
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
            teacher_profile = TeacherProfile.objects.get(teacher_id=teacher_reg.teacher_id)
            teacher_school = teacher_profile.school
            
            if teacher_school and teacher_school.strip():
                # Get student profiles that match the teacher's school (case-insensitive)
                teacher_school_trimmed = teacher_school.strip()
                matching_profiles = StudentProfile.objects.filter(
                    school__iexact=teacher_school_trimmed
                ).exclude(school__isnull=True).exclude(school='')
                
                student_ids = [profile.student_id for profile in matching_profiles]
                students = StudentRegistration.objects.filter(student_id__in=student_ids)
                print(f"🏫 Teacher {user.username} - Filtered {students.count()} students from school '{teacher_school_trimmed}'")
            else:
                # Teacher has no school, return empty list
                students = StudentRegistration.objects.none()
                print(f"⚠️ Teacher {user.username} has no school assigned")
        except (TeacherRegistration.DoesNotExist, TeacherProfile.DoesNotExist):
            # Teacher profile not found, return empty list
            students = StudentRegistration.objects.none()
            print(f"⚠️ Teacher profile not found for {user.username}")
    else:
        # For non-teachers (admin/parent), return all students
        students = StudentRegistration.objects.all()
    
    serializer = StudentRegistrationSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_teacher_students(request):
    """
    Get students filtered by teacher's school name
    Only returns students whose school matches the teacher's school
    """
    try:
        user = request.user
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get teacher's profile to get school name
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
        except TeacherRegistration.DoesNotExist:
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create teacher profile
        try:
            teacher_profile = TeacherProfile.objects.get(teacher_id=teacher_reg.teacher_id)
            teacher_school = teacher_profile.school
        except TeacherProfile.DoesNotExist:
            # If profile doesn't exist, create it
            teacher_profile = TeacherProfile.objects.create(
                teacher_id=teacher_reg.teacher_id,
                teacher_username=teacher_reg.teacher_username,
                teacher_name=f"{teacher_reg.first_name} {teacher_reg.last_name}",
                email=teacher_reg.email,
                phone_number=teacher_reg.phone_number,
                school='',  # Will be empty if not set
            )
            teacher_school = teacher_profile.school
        
        # If teacher has no school set, return empty list
        if not teacher_school or not teacher_school.strip():
            return Response({
                'students': [],
                'message': 'No school assigned to teacher. Please update your profile with school name.',
                'teacher_school': None
            }, status=status.HTTP_200_OK)
        
        # Get all student profiles that match the teacher's school (case-insensitive, trimmed)
        # Use __iexact for case-insensitive matching and handle whitespace
        teacher_school_trimmed = teacher_school.strip() if teacher_school else ''
        matching_profiles = StudentProfile.objects.filter(
            school__iexact=teacher_school_trimmed
        ).exclude(school__isnull=True).exclude(school='')
        
        print(f"🏫 Teacher {user.username} is from school: '{teacher_school_trimmed}'")
        print(f"📋 Found {matching_profiles.count()} student profiles matching school '{teacher_school_trimmed}'")
        
        # Get student IDs from matching profiles
        student_ids = [profile.student_id for profile in matching_profiles]
        
        # Get student registrations for those IDs
        students = StudentRegistration.objects.filter(student_id__in=student_ids)
        print(f"📊 Found {students.count()} students from school '{teacher_school_trimmed}'")
        
        # Serialize the data and add profile information
        students_data = []
        for student in students:
            serializer = StudentRegistrationSerializer(student)
            student_data = serializer.data
            
            # Add profile information
            try:
                profile = StudentProfile.objects.get(student_id=student.student_id)
                student_data['profile'] = {
                    'grade': profile.grade or '',
                    'school': profile.school or '',
                    'address': profile.address or ''
                }
            except StudentProfile.DoesNotExist:
                student_data['profile'] = {
                    'grade': '',
                    'school': '',
                    'address': ''
                }
            
            # Add user information for display
            try:
                user = User.objects.get(username=student.student_username)
                student_data['user_info'] = {
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'email': user.email,
                    'phone': user.phonenumber or student.phone_number or ''
                }
            except User.DoesNotExist:
                student_data['user_info'] = {
                    'firstname': student.first_name,
                    'lastname': student.last_name,
                    'email': student.student_email or '',
                    'phone': student.phone_number or ''
                }
            
            # Add quiz and mock test scores using the EXACT same logic as get_student_performance
            try:
                from quizzes.models import QuizAttempt, MockTestAttempt
                
                # Get quiz attempts for this student (student_id is ForeignKey to StudentRegistration)
                # Get ALL attempts, not just completed ones, to match career page logic
                quiz_attempts = QuizAttempt.objects.filter(student_id=student)
                print(f"  📊 Found {quiz_attempts.count()} quiz attempts for student {student.student_id}")
                
                # Get mock test attempts for this student
                mock_test_attempts = MockTestAttempt.objects.filter(student_id=student)
                print(f"  📊 Found {mock_test_attempts.count()} mock test attempts for student {student.student_id}")
                
                # Calculate quiz percentage: (total_correct_answers / total_questions_answered) * 100
                # This matches the career page calculation EXACTLY
                total_questions_answered = sum(attempt.total_questions or 0 for attempt in quiz_attempts)
                total_correct_answers = sum(attempt.correct_answers or 0 for attempt in quiz_attempts)
                
                quiz_score = None
                if total_questions_answered > 0:
                    quiz_percentage = (total_correct_answers / total_questions_answered) * 100
                    # Round to 1 decimal place to match career page: Math.round(quizPercentage * 10) / 10
                    quiz_score = round(quiz_percentage * 10) / 10
                    print(f"  ✅ Quiz score calculated: {total_correct_answers}/{total_questions_answered} = {quiz_score}%")
                else:
                    # Fallback: use average of score field if available (some attempts might only have score, not total_questions)
                    quiz_scores = [attempt.score for attempt in quiz_attempts if attempt.score is not None and attempt.score >= 0]
                    if quiz_scores:
                        quiz_score = round((sum(quiz_scores) / len(quiz_scores)) * 10) / 10
                        print(f"  ✅ Quiz score from score field: {quiz_score}% (from {len(quiz_scores)} attempts)")
                    else:
                        print(f"  ⚠️ No quiz score available (no attempts with scores)")
                
                # Calculate mock test percentage: (mock_test_correct_answers / mock_test_questions_answered) * 100
                # This matches the career page calculation EXACTLY
                mock_test_questions_answered = sum(attempt.total_questions or 0 for attempt in mock_test_attempts)
                mock_test_correct_answers = sum(attempt.correct_answers or 0 for attempt in mock_test_attempts)
                
                mock_score = None
                if mock_test_questions_answered > 0:
                    mock_percentage = (mock_test_correct_answers / mock_test_questions_answered) * 100
                    # Round to 1 decimal place to match career page: Math.round(mockTestPercentage * 10) / 10
                    mock_score = round(mock_percentage * 10) / 10
                    print(f"  ✅ Mock score calculated: {mock_test_correct_answers}/{mock_test_questions_answered} = {mock_score}%")
                else:
                    # Fallback: use average of score field if available
                    mock_scores = [attempt.score for attempt in mock_test_attempts if attempt.score is not None and attempt.score >= 0]
                    if mock_scores:
                        mock_score = round((sum(mock_scores) / len(mock_scores)) * 10) / 10
                        print(f"  ✅ Mock score from score field: {mock_score}% (from {len(mock_scores)} attempts)")
                    else:
                        print(f"  ⚠️ No mock score available (no attempts with scores)")
                
                # Calculate average of quiz and mock percentages
                average_score = None
                if quiz_score is not None and mock_score is not None:
                    average_score = round(((quiz_score + mock_score) / 2) * 10) / 10
                elif quiz_score is not None:
                    average_score = quiz_score
                elif mock_score is not None:
                    average_score = mock_score
                
                # Get completion dates (latest attempt dates)
                quiz_completion_date = None
                if quiz_attempts.exists():
                    latest_quiz = quiz_attempts.order_by('-attempted_at').first()
                    if latest_quiz and latest_quiz.attempted_at:
                        quiz_completion_date = latest_quiz.attempted_at.strftime('%Y-%m-%d')
                
                mock_completion_date = None
                if mock_test_attempts.exists():
                    latest_mock = mock_test_attempts.order_by('-attempted_at').first()
                    if latest_mock and latest_mock.attempted_at:
                        mock_completion_date = latest_mock.attempted_at.strftime('%Y-%m-%d')
                
                # Calculate real time spent (from time_taken_seconds)
                total_quiz_time_seconds = sum(a.time_taken_seconds or 0 for a in quiz_attempts)
                total_mock_time_seconds = sum(a.time_taken_seconds or 0 for a in mock_test_attempts)
                total_quiz_time_minutes = int(total_quiz_time_seconds / 60)
                total_mock_time_minutes = int(total_mock_time_seconds / 60)
                
                student_data['quiz_score'] = quiz_score
                student_data['mock_score'] = mock_score
                student_data['average_score'] = average_score
                student_data['quiz_attempts_count'] = quiz_attempts.count()
                student_data['mock_attempts_count'] = mock_test_attempts.count()
                student_data['quiz_completion_date'] = quiz_completion_date
                student_data['mock_completion_date'] = mock_completion_date
                student_data['quiz_time_minutes'] = total_quiz_time_minutes
                student_data['mock_time_minutes'] = total_mock_time_minutes
                
                # Calculate subject-wise performance - Use same approach as get_student_performance
                # First, collect all attempts by actual subject name from database (like student portal)
                raw_subject_data = {}
                
                # Process quiz attempts - use actual subject names from database
                for attempt in quiz_attempts:
                    subject = (attempt.subject or 'Unknown').strip()
                    if subject not in raw_subject_data:
                        raw_subject_data[subject] = {
                            'quiz_attempts': [],
                            'mock_attempts': [],
                            'quiz_total_q': 0,
                            'quiz_total_correct': 0,
                            'quiz_total_time': 0,
                            'mock_total_q': 0,
                            'mock_total_correct': 0,
                            'mock_total_time': 0
                        }
                    
                    raw_subject_data[subject]['quiz_attempts'].append(attempt)
                    raw_subject_data[subject]['quiz_total_q'] += attempt.total_questions or 0
                    raw_subject_data[subject]['quiz_total_correct'] += attempt.correct_answers or 0
                    raw_subject_data[subject]['quiz_total_time'] += attempt.time_taken_seconds or 0
                
                # Process mock test attempts - use actual subject names from database
                for attempt in mock_test_attempts:
                    subject = (attempt.subject or 'Unknown').strip()
                    if subject not in raw_subject_data:
                        raw_subject_data[subject] = {
                            'quiz_attempts': [],
                            'mock_attempts': [],
                            'quiz_total_q': 0,
                            'quiz_total_correct': 0,
                            'quiz_total_time': 0,
                            'mock_total_q': 0,
                            'mock_total_correct': 0,
                            'mock_total_time': 0
                        }
                    
                    raw_subject_data[subject]['mock_attempts'].append(attempt)
                    raw_subject_data[subject]['mock_total_q'] += attempt.total_questions or 0
                    raw_subject_data[subject]['mock_total_correct'] += attempt.correct_answers or 0
                    raw_subject_data[subject]['mock_total_time'] += attempt.time_taken_seconds or 0
                
                # Now map raw subjects to standard 5 subjects (flexible matching like student portal)
                def normalize_subject_name(subject_name):
                    """Map any subject name to one of the 5 standard subjects"""
                    if not subject_name:
                        return None
                    subject_lower = subject_name.lower().strip()
                    
                    # Mathematics matching
                    if any(keyword in subject_lower for keyword in ['math', 'mathematics', 'maths']):
                        return 'mathematics'
                    # English matching
                    elif any(keyword in subject_lower for keyword in ['english', 'eng']):
                        return 'english'
                    # Science matching
                    elif any(keyword in subject_lower for keyword in ['science', 'sci']):
                        return 'science'
                    # Social Studies matching
                    elif any(keyword in subject_lower for keyword in ['social', 'sst', 'studies']):
                        return 'social'
                    # Computer matching
                    elif any(keyword in subject_lower for keyword in ['computer', 'comp', 'cs', 'computers']):
                        return 'computer'
                    return None
                
                # Map all raw subjects to standard subjects
                subject_performance = {
                    'mathematics': {'quiz_attempts': [], 'mock_attempts': [], 'quiz_total_q': 0, 'quiz_total_correct': 0, 'quiz_total_time': 0, 'mock_total_q': 0, 'mock_total_correct': 0, 'mock_total_time': 0},
                    'english': {'quiz_attempts': [], 'mock_attempts': [], 'quiz_total_q': 0, 'quiz_total_correct': 0, 'quiz_total_time': 0, 'mock_total_q': 0, 'mock_total_correct': 0, 'mock_total_time': 0},
                    'science': {'quiz_attempts': [], 'mock_attempts': [], 'quiz_total_q': 0, 'quiz_total_correct': 0, 'quiz_total_time': 0, 'mock_total_q': 0, 'mock_total_correct': 0, 'mock_total_time': 0},
                    'social': {'quiz_attempts': [], 'mock_attempts': [], 'quiz_total_q': 0, 'quiz_total_correct': 0, 'quiz_total_time': 0, 'mock_total_q': 0, 'mock_total_correct': 0, 'mock_total_time': 0},
                    'computer': {'quiz_attempts': [], 'mock_attempts': [], 'quiz_total_q': 0, 'quiz_total_correct': 0, 'quiz_total_time': 0, 'mock_total_q': 0, 'mock_total_correct': 0, 'mock_total_time': 0}
                }
                
                # Aggregate data by normalized subject
                for raw_subject, data in raw_subject_data.items():
                    normalized = normalize_subject_name(raw_subject)
                    if normalized and normalized in subject_performance:
                        subject_performance[normalized]['quiz_attempts'].extend(data['quiz_attempts'])
                        subject_performance[normalized]['mock_attempts'].extend(data['mock_attempts'])
                        subject_performance[normalized]['quiz_total_q'] += data['quiz_total_q']
                        subject_performance[normalized]['quiz_total_correct'] += data['quiz_total_correct']
                        subject_performance[normalized]['quiz_total_time'] += data['quiz_total_time']
                        subject_performance[normalized]['mock_total_q'] += data['mock_total_q']
                        subject_performance[normalized]['mock_total_correct'] += data['mock_total_correct']
                        subject_performance[normalized]['mock_total_time'] += data['mock_total_time']
                
                # Calculate scores for each standard subject
                final_subject_performance = {}
                for subject_key, data in subject_performance.items():
                    # Calculate quiz score percentage
                    quiz_score = None
                    if data['quiz_total_q'] > 0:
                        quiz_score = round((data['quiz_total_correct'] / data['quiz_total_q']) * 100, 1)
                    
                    # Calculate mock score percentage
                    mock_score = None
                    if data['mock_total_q'] > 0:
                        mock_score = round((data['mock_total_correct'] / data['mock_total_q']) * 100, 1)
                    
                    # Calculate overall subject score (average of quiz and mock if both exist)
                    subject_average = None
                    if quiz_score is not None and mock_score is not None:
                        subject_average = round((quiz_score + mock_score) / 2, 1)
                    elif quiz_score is not None:
                        subject_average = quiz_score
                    elif mock_score is not None:
                        subject_average = mock_score
                    
                    # Calculate total time in minutes
                    total_time_minutes = int((data['quiz_total_time'] + data['mock_total_time']) / 60)
                    
                    # ALWAYS include the subject, even if no data (for UI consistency)
                    final_subject_performance[subject_key] = {
                        'score': subject_average,
                        'quiz_score': quiz_score,
                        'mock_score': mock_score,
                        'time_minutes': total_time_minutes,
                        'status': 'Complete' if subject_average is not None else 'Pending',
                        'quiz_attempts': len(data['quiz_attempts']),
                        'mock_attempts': len(data['mock_attempts'])
                    }
                
                student_data['subject_performance'] = final_subject_performance
                
                print(f"✅ Student {student.student_id} ({student.student_username}): quiz={quiz_score}%, mock={mock_score}%, avg={average_score}%")
                print(f"   📚 Subject performance: {len(final_subject_performance)} subjects")
                for subj_key, subj_data in final_subject_performance.items():
                    if subj_data['score'] is not None:
                        print(f"      - {subj_key}: {subj_data['score']}% ({subj_data['quiz_attempts']} quiz, {subj_data['mock_attempts']} mock)")
            except Exception as e:
                import traceback
                print(f"❌ Error fetching scores for student {student.student_id}: {e}")
                print(traceback.format_exc())
                student_data['quiz_score'] = None
                student_data['mock_score'] = None
                student_data['average_score'] = None
                student_data['quiz_attempts_count'] = 0
                student_data['mock_attempts_count'] = 0
            
            students_data.append(student_data)
        
        # Log summary of scores
        students_with_scores = [s for s in students_data if s.get('quiz_score') is not None or s.get('mock_score') is not None]
        print(f"📊 Summary: {len(students_with_scores)}/{len(students_data)} students have scores")
        
        return Response({
            'students': students_data,
            'teacher_school': teacher_school,
            'total_count': len(students_data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in get_teacher_students: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to get teacher students: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_teacher_parents(request):
    """
    Get parents of students from the teacher's school
    Only returns parents whose children (students) are in the teacher's school
    """
    try:
        user = request.user
        print(f"🔍 get_teacher_parents called by user: {user.username}, role: {user.role}")
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            print(f"❌ Access denied: User {user.username} is not a teacher (role: {user.role})")
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get teacher registration
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
        except TeacherRegistration.DoesNotExist:
            print(f"❌ Teacher registration not found for user: {user.username}")
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get teacher profile to get school
        teacher_school = None
        try:
            teacher_profile = TeacherProfile.objects.get(teacher_id=teacher_reg.teacher_id)
            teacher_school = teacher_profile.school
            # Clean the school name (strip whitespace, handle empty strings)
            if teacher_school:
                teacher_school = teacher_school.strip()
            print(f"🏫 Teacher {user.username} (ID: {teacher_reg.teacher_id}) is from school: '{teacher_school}'")
        except TeacherProfile.DoesNotExist:
            print(f"⚠️ Teacher profile not found for teacher_id: {teacher_reg.teacher_id}")
            return Response({
                'error': 'Teacher profile not found. Please complete your teacher profile setup.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Filter students by school if teacher has a school
        if teacher_school and teacher_school != '':
            # Get student IDs from StudentProfile that match the teacher's school (case-insensitive, trimmed)
            student_profiles = StudentProfile.objects.filter(
                school__iexact=teacher_school
            ).exclude(school__isnull=True).exclude(school='')
            
            student_ids = [profile.student_id for profile in student_profiles]
            print(f"📋 Found {len(student_ids)} student profiles matching school '{teacher_school}'")
            
            if student_ids:
                # Get students from StudentRegistration
                students = StudentRegistration.objects.filter(student_id__in=student_ids)
                print(f"📊 Found {students.count()} students from school '{teacher_school}'")
                
                # Get unique parent emails from these students
                parent_emails = set()
                student_parent_map = {}  # Map parent_email to list of students
                
                print(f"🔍 Processing {students.count()} students to extract parent emails...")
                for student in students:
                    print(f"   📝 Student {student.student_id}: {student.first_name} {student.last_name}, parent_email='{student.parent_email}'")
                    if student.parent_email and student.parent_email.strip():
                        parent_email = student.parent_email.strip()
                        parent_emails.add(parent_email)
                        
                        # Map parent to students
                        if parent_email not in student_parent_map:
                            student_parent_map[parent_email] = []
                        student_parent_map[parent_email].append({
                            'student_id': student.student_id,
                            'student_name': f"{student.first_name} {student.last_name}".strip(),
                            'student_email': student.student_email or '',
                            'student_username': student.student_username
                        })
                        print(f"      ✅ Added parent_email: {parent_email}")
                    else:
                        print(f"      ⚠️ Student {student.student_id} has no parent_email or empty parent_email")
                
                print(f"👨‍👩‍👧‍👦 Found {len(parent_emails)} unique parent emails from students in school '{teacher_school}'")
                
                # Debug: Print all parent emails found
                print(f"📧 Parent emails found: {list(parent_emails)}")
                
                # Get ParentRegistration records for these parent emails (case-insensitive matching)
                parents_data = []
                for parent_email in parent_emails:
                    # Get all students linked to this parent
                    linked_students = student_parent_map.get(parent_email, [])
                    
                    # Try to find parent in ParentRegistration (case-insensitive)
                    parent = None
                    try:
                        # First try exact match
                        parent = ParentRegistration.objects.get(email=parent_email)
                        print(f"✅ Found parent (exact match): {parent.email}")
                    except ParentRegistration.DoesNotExist:
                        # Try case-insensitive match
                        try:
                            parent = ParentRegistration.objects.get(email__iexact=parent_email)
                            print(f"✅ Found parent (case-insensitive): {parent.email} (searched for: {parent_email})")
                        except ParentRegistration.DoesNotExist:
                            # Try with trimmed/cleaned email
                            try:
                                cleaned_email = parent_email.strip().lower()
                                parent = ParentRegistration.objects.filter(email__iexact=cleaned_email).first()
                                if parent:
                                    print(f"✅ Found parent (cleaned match): {parent.email} (searched for: {parent_email})")
                            except Exception as e:
                                print(f"⚠️ Error finding parent with cleaned email: {e}")
                    
                    # Calculate child performance (average of all children's average scores)
                    from quizzes.models import QuizAttempt, MockTestAttempt
                    child_performances = []
                    
                    for student_info in linked_students:
                        student_id = student_info['student_id']
                        try:
                            # Get student registration object for filtering
                            student_reg = StudentRegistration.objects.get(student_id=student_id)
                            quiz_attempts = QuizAttempt.objects.filter(student_id=student_reg)
                            mock_test_attempts = MockTestAttempt.objects.filter(student_id=student_reg)
                            
                            # Calculate average score for this child
                            total_quiz_q = sum(a.total_questions or 0 for a in quiz_attempts)
                            total_quiz_correct = sum(a.correct_answers or 0 for a in quiz_attempts)
                            quiz_score = None
                            if total_quiz_q > 0:
                                quiz_score = (total_quiz_correct / total_quiz_q) * 100
                            
                            total_mock_q = sum(a.total_questions or 0 for a in mock_test_attempts)
                            total_mock_correct = sum(a.correct_answers or 0 for a in mock_test_attempts)
                            mock_score = None
                            if total_mock_q > 0:
                                mock_score = (total_mock_correct / total_mock_q) * 100
                            
                            # Calculate child average
                            child_avg = None
                            valid_scores = []
                            if quiz_score is not None:
                                valid_scores.append(quiz_score)
                            if mock_score is not None:
                                valid_scores.append(mock_score)
                            
                            if valid_scores:
                                child_avg = sum(valid_scores) / len(valid_scores)
                                child_performances.append(child_avg)
                        except StudentRegistration.DoesNotExist:
                            print(f"⚠️ StudentRegistration not found for student_id: {student_id}")
                            continue
                    
                    # Determine overall performance badge
                    overall_performance = 'average'
                    if child_performances:
                        avg_performance = sum(child_performances) / len(child_performances)
                        if avg_performance >= 85:
                            overall_performance = 'excellent'
                        elif avg_performance >= 70:
                            overall_performance = 'good'
                        else:
                            overall_performance = 'average'
                    
                    # For now, use first child's name (can be enhanced to show all children)
                    primary_child = linked_students[0] if linked_students else None
                    child_name = primary_child['student_name'] if primary_child else 'N/A'
                    
                    # Create parent data - use ParentRegistration if found, otherwise use email from StudentRegistration
                    if parent:
                        parent_data = {
                            'parent_id': parent.parent_id,
                            'parent_name': f"{parent.first_name} {parent.last_name}".strip(),
                            'parent_email': parent.email,
                            'parent_phone': parent.phone_number or '',
                            'child_name': child_name,
                            'child_performance': overall_performance,
                            'unread_messages': 0,  # Can be enhanced later with actual message count
                            'last_contact': '1 day ago',  # Can be enhanced later with actual last contact date
                            'linked_students': linked_students  # All students linked to this parent
                        }
                    else:
                        # Parent not found in ParentRegistration, but we have the email from StudentRegistration
                        # Extract name from email or use a default
                        email_parts = parent_email.split('@')
                        email_name = email_parts[0] if email_parts else 'Parent'
                        parent_data = {
                            'parent_id': None,  # No parent registration ID
                            'parent_name': email_name.replace('.', ' ').replace('_', ' ').title(),  # Try to make it readable
                            'parent_email': parent_email,
                            'parent_phone': '',  # No phone available
                            'child_name': child_name,
                            'child_performance': overall_performance,
                            'unread_messages': 0,
                            'last_contact': '1 day ago',
                            'linked_students': linked_students
                        }
                        print(f"⚠️ ParentRegistration not found for email: {parent_email}, using email-based parent data")
                    
                    parents_data.append(parent_data)
                    print(f"✅ Added parent: {parent_data['parent_name']} (email: {parent_data['parent_email']}) with {len(linked_students)} child(ren)")
                
                print(f"✅ Returning {len(parents_data)} parents for teacher {user.username}")
                
                return Response({
                    'parents': parents_data,
                    'teacher_school': teacher_school,
                    'total_count': len(parents_data)
                }, status=status.HTTP_200_OK)
            else:
                # No students found with matching school
                print(f"⚠️ No students found with school '{teacher_school}'")
                return Response({
                    'parents': [],
                    'teacher_school': teacher_school,
                    'total_count': 0,
                    'message': f'No students found in school "{teacher_school}". No parents to display.'
                }, status=status.HTTP_200_OK)
        else:
            # If teacher has no school, return error (don't return all parents)
            print(f"❌ Teacher has no school assigned (school='{teacher_school}')")
            return Response({
                'error': 'Teacher has no school assigned. Please update your teacher profile with a school name.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in get_teacher_parents: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to fetch teacher parents: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_school_scores(request):
    """
    Get school test scores (quarterly, half-yearly, annual) for students
    Returns students with their school test scores
    Uses the SAME logic as get_teacher_students to ensure consistency
    """
    try:
        user = request.user
        print(f"🔍 get_student_school_scores called by user: {user.username}, role: {user.role}")
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get teacher registration - use EXACT same logic as get_teacher_students
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
        except TeacherRegistration.DoesNotExist:
            print(f"❌ Teacher registration not found for user: {user.username}")
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create teacher profile - use EXACT same logic as get_teacher_students
        try:
            teacher_profile = TeacherProfile.objects.get(teacher_id=teacher_reg.teacher_id)
            teacher_school = teacher_profile.school
        except TeacherProfile.DoesNotExist:
            # If profile doesn't exist, create it (same as get_teacher_students)
            teacher_profile = TeacherProfile.objects.create(
                teacher_id=teacher_reg.teacher_id,
                teacher_username=teacher_reg.teacher_username,
                teacher_name=f"{teacher_reg.first_name} {teacher_reg.last_name}",
                email=teacher_reg.email,
                phone_number=teacher_reg.phone_number,
                school='',  # Will be empty if not set
            )
            teacher_school = teacher_profile.school
        
        # If teacher has no school set, return empty list (same as get_teacher_students)
        if not teacher_school or not teacher_school.strip():
            return Response({
                'students': [],
                'message': 'No school assigned to teacher. Please update your profile with school name.',
                'teacher_school': None
            }, status=status.HTTP_200_OK)
        
        # Get all student profiles that match the teacher's school - use EXACT same logic
        teacher_school_trimmed = teacher_school.strip() if teacher_school else ''
        matching_profiles = StudentProfile.objects.filter(
            school__iexact=teacher_school_trimmed
        ).exclude(school__isnull=True).exclude(school='')
        
        print(f"🏫 Teacher {user.username} is from school: '{teacher_school_trimmed}'")
        print(f"📋 Found {matching_profiles.count()} student profiles matching school '{teacher_school_trimmed}'")
        
        # Get student IDs from matching profiles
        student_ids = [profile.student_id for profile in matching_profiles]
        
        # Get student registrations for those IDs
        students = StudentRegistration.objects.filter(student_id__in=student_ids)
        print(f"📊 Found {students.count()} students from school '{teacher_school_trimmed}'")
        
        # Get current academic year (e.g., "2024-2025")
        current_year = datetime.now().year
        next_year = current_year + 1
        academic_year = f"{current_year}-{next_year}"
        
        # Build response with school test scores
        from django.db import connection
        students_data = []
        
        for student in students:
            # Get student basic info
            try:
                user_obj = User.objects.get(username=student.student_username)
                first_name = user_obj.firstname
                last_name = user_obj.lastname
                email = user_obj.email
            except User.DoesNotExist:
                first_name = student.first_name
                last_name = student.last_name
                email = student.student_email or ''
            
            try:
                profile = StudentProfile.objects.get(student_id=student.student_id)
                class_name = profile.grade or 'Class 7'
            except StudentProfile.DoesNotExist:
                class_name = 'Class 7'
            
            # Get ALL school test scores from database for this student (simplified approach)
            # We'll get all scores and use the most recent ones
            with connection.cursor() as cursor:
                # First, check what's in the database
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM school_test_scores
                    WHERE student_id = %s
                """, [student.student_id])
                total_count = cursor.fetchone()[0]
                print(f"🔍 Total score records in DB for student {student.student_id}: {total_count}")
                
                # Get all scores for this student, ordered by most recent
                cursor.execute("""
                    SELECT subject, quarterly_score, half_yearly_score, annual_score, overall_score, class_name, academic_year
                    FROM school_test_scores
                    WHERE student_id = %s
                    ORDER BY updated_at DESC, academic_year DESC, subject
                """, [student.student_id])
                
                all_rows = cursor.fetchall()
                print(f"🔍 Found {len(all_rows)} total score records for student {student.student_id}")
                
                # If we have rows, use them (take the latest for each subject)
                rows = []
                seen_subjects = set()
                for row in all_rows:
                    subject_name = row[0]
                    if subject_name and subject_name not in seen_subjects:
                        rows.append(row)
                        seen_subjects.add(subject_name)
                        print(f"  📝 Added subject: {subject_name} (from class_name='{row[5]}', academic_year='{row[6]}')")
                
                print(f"🔍 After deduplication: {len(rows)} unique subjects for student {student.student_id}")
                
                print(f"📊 Found {len(rows)} score records for student {student.student_id} (class_name='{class_name}')")
                
                subjects = {}
                for row in rows:
                    subject_name, quarterly, half_yearly, annual, overall, db_class_name, db_academic_year = row
                    print(f"  📝 Subject: {subject_name}, Q: {quarterly}, HY: {half_yearly}, AN: {annual}, Overall: {overall}")
                    if subject_name:  # Only add if subject_name is not None/empty
                        subjects[subject_name] = {
                            'quarterly': float(quarterly) if quarterly is not None else 0,
                            'halfYearly': float(half_yearly) if half_yearly is not None else 0,
                            'annual': float(annual) if annual is not None else 0,
                            'overall': float(overall) if overall is not None else 0
                        }
                
                print(f"  📊 Subjects dict after processing: {subjects}")
                print(f"  📊 Subjects count: {len(subjects)}")
                
                # Calculate overall score (average of all subjects' overall scores)
                overall_scores = [s['overall'] for s in subjects.values() if s['overall'] > 0]
                overall_score = round(sum(overall_scores) / len(overall_scores)) if overall_scores else 0
                
                print(f"  ✅ Calculated overall score: {overall_score}% (from {len(overall_scores)} subjects)")
                
                # Calculate change (placeholder for now, can be enhanced later)
                change = 0.0
            
            student_data_item = {
                'id': student.student_id,
                'student_id': student.student_id,
                'name': f"{first_name} {last_name}".strip() or 'Unknown',
                'roll': f"T{student.student_id:03d}",
                'className': class_name,
                'score': overall_score,
                'change': change,
                'subjects': subjects
            }
            
            print(f"  ✅ Student data item for {student.student_id}: subjects count = {len(subjects)}, score = {overall_score}")
            print(f"  ✅ Subjects keys: {list(subjects.keys())}")
            
            students_data.append(student_data_item)
        
        print(f"📊 Returning {len(students_data)} students with school scores")
        for student_item in students_data:
            print(f"  📝 Student {student_item['id']}: {student_item['name']}, score={student_item['score']}, subjects={len(student_item['subjects'])}")
            if student_item['subjects']:
                print(f"    Subjects: {list(student_item['subjects'].keys())}")
        
        return Response({
            'students': students_data,
            'academic_year': academic_year,
            'total_count': len(students_data),
            'teacher_school': teacher_school_trimmed
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in get_student_school_scores: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to get student school scores: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_student_school_scores(request):
    """
    Save or update school test scores for a student
    """
    try:
        user = request.user
        print(f"🔍 save_student_school_scores called by user: {user.username}, role: {user.role}")
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get request data
        student_id = request.data.get('student_id')
        class_name = request.data.get('class_name')
        subjects = request.data.get('subjects', {})
        academic_year = request.data.get('academic_year')
        
        if not student_id or not class_name:
            return Response({
                'error': 'student_id and class_name are required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get current academic year if not provided
        if not academic_year:
            current_year = datetime.now().year
            next_year = current_year + 1
            academic_year = f"{current_year}-{next_year}"
        
        # Verify student exists
        try:
            student = StudentRegistration.objects.get(student_id=student_id)
        except StudentRegistration.DoesNotExist:
            return Response({
                'error': f'Student with ID {student_id} not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Save scores to database
        from django.db import connection
        with connection.cursor() as cursor:
            for subject_name, subject_data in subjects.items():
                quarterly = subject_data.get('quarterly')
                half_yearly = subject_data.get('halfYearly')
                annual = subject_data.get('annual')
                
                # Calculate overall: annual OR half_yearly OR quarterly
                overall = annual if annual else (half_yearly if half_yearly else quarterly)
                
                # Convert to float or None
                quarterly = float(quarterly) if quarterly else None
                half_yearly = float(half_yearly) if half_yearly else None
                annual = float(annual) if annual else None
                overall = float(overall) if overall else None
                
                # Insert or update using ON CONFLICT
                cursor.execute("""
                    INSERT INTO school_test_scores 
                    (student_id, class_name, subject, quarterly_score, half_yearly_score, annual_score, overall_score, academic_year, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                    ON CONFLICT (student_id, class_name, subject, academic_year)
                    DO UPDATE SET
                        quarterly_score = EXCLUDED.quarterly_score,
                        half_yearly_score = EXCLUDED.half_yearly_score,
                        annual_score = EXCLUDED.annual_score,
                        overall_score = EXCLUDED.overall_score,
                        updated_at = CURRENT_TIMESTAMP
                """, [student_id, class_name, subject_name, quarterly, half_yearly, annual, overall, academic_year])
        
        # Calculate new overall score
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT AVG(overall_score) 
                FROM school_test_scores
                WHERE student_id = %s AND class_name = %s AND academic_year = %s
                AND overall_score IS NOT NULL AND overall_score > 0
            """, [student_id, class_name, academic_year])
            
            row = cursor.fetchone()
            new_overall_score = round(row[0]) if row and row[0] else 0
        
        return Response({
            'message': 'School test scores saved successfully',
            'student_id': student_id,
            'overall_score': new_overall_score
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in save_student_school_scores: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to save school test scores: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_parent_message(request):
    """
    Teacher sends a message to a parent about a specific student
    """
    try:
        user = request.user
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can send messages to parents.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get required data from request
        parent_email_request = request.data.get('parent_email')
        student_id = request.data.get('student_id')
        message = request.data.get('message')
        title = request.data.get('title', 'Message from Teacher')
        
        # Validate required fields
        if not parent_email_request or not student_id or not message:
            return Response({
                'error': 'Missing required fields: parent_email, student_id, and message are required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get teacher registration to get teacher_id
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
            teacher_id = teacher_reg.teacher_id
        except TeacherRegistration.DoesNotExist:
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify student exists and get the actual parent email from student registration
        try:
            student = StudentRegistration.objects.get(student_id=student_id)
            # Use the parent_email from student registration as the source of truth
            parent_email_from_student = student.parent_email.lower().strip()
            
            # Verify the requested parent email matches the student's parent
            if parent_email_from_student != parent_email_request.lower().strip():
                return Response({
                    'error': 'Student does not belong to the specified parent.'
                }, status=status.HTTP_400_BAD_REQUEST)
        except StudentRegistration.DoesNotExist:
            return Response({
                'error': 'Student not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Find the parent's User account to get the correct email for notifications
        # This ensures we use the same email that will be used when fetching notifications
        from authentication.models import User, ParentRegistration
        
        parent_user_email = parent_email_from_student
        try:
            # First try to find parent by email in User table
            parent_user = User.objects.filter(email=parent_email_from_student, role='Parent').first()
            if parent_user:
                parent_user_email = parent_user.email.lower().strip()
                print(f"✅ Found parent User account with email: {parent_user_email}")
            else:
                # If not found, try to find via parent_registration
                try:
                    parent_reg = ParentRegistration.objects.get(email=parent_email_from_student)
                    # Try to find User with same username
                    parent_user = User.objects.filter(username=parent_reg.parent_username, role='Parent').first()
                    if parent_user:
                        parent_user_email = parent_user.email.lower().strip()
                        print(f"✅ Found parent User account via username: {parent_user_email}")
                    else:
                        # Use parent_registration email as fallback
                        parent_user_email = parent_reg.email.lower().strip()
                        print(f"⚠️ Using parent_registration email as fallback: {parent_user_email}")
                except ParentRegistration.DoesNotExist:
                    print(f"⚠️ Warning: Parent registration not found for email: {parent_email_from_student}")
        except Exception as e:
            print(f"⚠️ Warning: Error looking up parent User account: {str(e)}")
            # Continue with student's parent_email
            pass
        
        # Import ParentNotification model
        from notifications.models import ParentNotification
        
        # Create notification using the verified parent email
        notification = ParentNotification.objects.create(
            parent_email=parent_user_email,
            student_id=student_id,
            teacher_id=teacher_id,
            notification_type='teacher_message',
            title=title,
            message=message
        )
        
        print(f"✅ Created parent notification: {notification.notification_id} for parent {parent_user_email} (requested: {parent_email_request}) about student {student_id}")
        
        return Response({
            'message': 'Message sent to parent successfully',
            'notification_id': notification.notification_id,
            'created_at': notification.created_at
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in send_parent_message: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to send message: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_student_message(request):
    """
    Teacher sends a message to a student
    """
    try:
        user = request.user
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can send messages to students.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get required data from request
        student_id = request.data.get('student_id')
        message = request.data.get('message')
        title = request.data.get('title', 'Message from Teacher')
        
        # Validate required fields
        if not student_id or not message:
            return Response({
                'error': 'Missing required fields: student_id and message are required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get teacher registration to get teacher_id
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
            teacher_id = teacher_reg.teacher_id
        except TeacherRegistration.DoesNotExist:
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify student exists
        try:
            student = StudentRegistration.objects.get(student_id=student_id)
        except StudentRegistration.DoesNotExist:
            return Response({
                'error': 'Student not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Import StudentNotification model
        from notifications.models import StudentNotification
        
        # Create notification
        notification = StudentNotification.objects.create(
            student_id=student_id,
            teacher_id=teacher_id,
            notification_type='teacher_message',
            title=title,
            message=message
        )
        
        print(f"✅ Created student notification: {notification.notification_id} for student {student_id} from teacher {teacher_id}")
        
        return Response({
            'message': 'Message sent to student successfully',
            'notification_id': notification.notification_id,
            'created_at': notification.created_at
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in send_student_message: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to send message: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_parent_notifications(request):
    """
    Get notifications for a parent, filtered by the student email they entered during login
    """
    try:
        user = request.user
        
        # Check if user is a parent
        if user.role != 'Parent':
            return Response({
                'error': 'Access denied. Only parent users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get parent email from User account
        parent_email = user.email.lower().strip()
        print(f"🔍 Fetching notifications for parent: {parent_email} (User: {user.username})")
        
        # Get student email from localStorage (stored during parent login)
        # For now, we'll get it from the child_email query param or from student_registration
        child_email = request.query_params.get('child_email')
        print(f"🔍 Child email from query param: {child_email}")
        
        # Import ParentNotification model
        from notifications.models import ParentNotification
        
        # If child_email is provided, filter by that specific student
        if child_email:
            # Get student_id from email
            try:
                student = StudentRegistration.objects.get(student_email=child_email.lower().strip())
                student_id = student.student_id
                print(f"🔍 Found student: {student.first_name} {student.last_name} (ID: {student_id})")
                
                # Get notifications for this parent about this specific student
                notifications = ParentNotification.objects.filter(
                    parent_email=parent_email,
                    student_id=student_id
                ).order_by('-created_at')
                
                print(f"🔍 Found {notifications.count()} notifications for parent {parent_email} and student {student_id}")
            except StudentRegistration.DoesNotExist:
                print(f"⚠️ Student not found for email: {child_email}")
                notifications = ParentNotification.objects.none()
        else:
            # Get all notifications for this parent (all their children)
            notifications = ParentNotification.objects.filter(
                parent_email=parent_email
            ).order_by('-created_at')
            print(f"🔍 Found {notifications.count()} total notifications for parent {parent_email}")
        
        # Debug: Also check for notifications with different email formats (case sensitivity, etc.)
        if notifications.count() == 0:
            all_notifications = ParentNotification.objects.filter(
                parent_email__iexact=parent_email
            )
            if all_notifications.exists():
                print(f"⚠️ Found {all_notifications.count()} notifications with case-insensitive match")
                notifications = all_notifications.order_by('-created_at')
        
        # Format notifications
        notifications_data = []
        for notif in notifications:
            # Get student name
            try:
                student = StudentRegistration.objects.get(student_id=notif.student_id)
                student_name = f"{student.first_name} {student.last_name}".strip()
            except StudentRegistration.DoesNotExist:
                student_name = 'Unknown Student'
            
            # Get teacher name (if available)
            teacher_name = None
            if notif.teacher_id:
                try:
                    teacher = TeacherRegistration.objects.get(teacher_id=notif.teacher_id)
                    teacher_name = f"{teacher.first_name} {teacher.last_name}".strip()
                except TeacherRegistration.DoesNotExist:
                    teacher_name = None
            
            notifications_data.append({
                'notification_id': notif.notification_id,
                'title': notif.title,
                'message': notif.message,
                'student_id': notif.student_id,
                'student_name': student_name,
                'teacher_id': notif.teacher_id,
                'teacher_name': teacher_name,
                'notification_type': notif.notification_type,
                'is_read': notif.is_read,
                'read_at': notif.read_at,
                'created_at': notif.created_at,
                'time_ago': _get_time_ago(notif.created_at)
            })
        
        # Count unread
        unread_count = sum(1 for n in notifications_data if not n['is_read'])
        
        return Response({
            'notifications': notifications_data,
            'total_count': len(notifications_data),
            'unread_count': unread_count
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in get_parent_notifications: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to fetch notifications: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_parent_notification_read(request, notification_id):
    """
    Mark a parent notification as read
    """
    try:
        user = request.user
        
        # Check if user is a parent
        if user.role != 'Parent':
            return Response({
                'error': 'Access denied. Only parent users can mark notifications as read.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get parent email
        parent_email = user.email.lower().strip()
        
        # Import ParentNotification model
        from notifications.models import ParentNotification
        
        try:
            notification = ParentNotification.objects.get(
                notification_id=notification_id,
                parent_email=parent_email
            )
        except ParentNotification.DoesNotExist:
            return Response({
                'error': 'Notification not found or access denied.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Mark as read
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save()
            print(f"✅ Marked notification {notification_id} as read")
        
        return Response({
            'message': 'Notification marked as read',
            'notification_id': notification.notification_id
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in mark_parent_notification_read: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to mark notification as read: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_parent_notification(request, notification_id):
    """
    Delete a parent notification
    """
    try:
        user = request.user
        
        # Check if user is a parent
        if user.role != 'Parent':
            return Response({
                'error': 'Access denied. Only parent users can delete notifications.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get parent email
        parent_email = user.email.lower().strip()
        
        # Import ParentNotification model
        from notifications.models import ParentNotification
        
        try:
            notification = ParentNotification.objects.get(
                notification_id=notification_id,
                parent_email=parent_email
            )
        except ParentNotification.DoesNotExist:
            return Response({
                'error': 'Notification not found or access denied.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Delete notification
        notification.delete()
        print(f"✅ Deleted notification {notification_id}")
        
        return Response({
            'message': 'Notification deleted successfully',
            'notification_id': notification_id
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in delete_parent_notification: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to delete notification: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _get_time_ago(dt):
    """
    Helper function to get human-readable time ago string
    """
    if not dt:
        return 'Unknown'
    
    now = timezone.now()
    if dt.tzinfo is None:
        dt = timezone.make_aware(dt)
    
    diff = now - dt
    
    if diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds >= 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds >= 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "Just now"


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_by_id(request, student_id):
    """
    Get student by ID
    """
    try:
        student = StudentRegistration.objects.get(student_id=student_id)
        serializer = StudentRegistrationSerializer(student)
        return Response(serializer.data)
    except StudentRegistration.DoesNotExist:
        return Response(
            {'error': 'Student not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_parent_by_email(request, email):
    """
    Get parent by email
    """
    try:
        parent = ParentRegistration.objects.get(email=email)
        serializer = ParentRegistrationSerializer(parent)
        return Response(serializer.data)
    except ParentRegistration.DoesNotExist:
        return Response(
            {'error': 'Parent not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_parent_student_mapping(request):
    """
    Create parent-student mapping
    """
    serializer = ParentStudentMappingSerializer(data=request.data)
    if serializer.is_valid():
        mapping = serializer.save()
        return Response({
            'message': 'Parent-student mapping created successfully',
            'mapping': ParentStudentMappingSerializer(mapping).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_profiles(request):
    """
    Get all student profiles
    """
    profiles = StudentProfile.objects.all()
    serializer = StudentProfileSerializer(profiles, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def student_profile_detail(request, student_id):
    """
    Get or update student profile
    """
    try:
        profile = StudentProfile.objects.get(student_id=student_id)
    except StudentProfile.DoesNotExist:
        return Response(
            {'error': 'Student profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Student profile updated successfully',
                'profile': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_student_profile(request):
    """
    Create student profile
    """
    serializer = StudentProfileSerializer(data=request.data)
    if serializer.is_valid():
        profile = serializer.save()
        return Response({
            'message': 'Student profile created successfully',
            'profile': StudentProfileSerializer(profile).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """
    Get user profile data - used by frontend USER_PROFILE endpoint
    Returns same data as get_user_profile_data but in format expected by frontend
    Updated: 2025-11-29 - Fixed variable scoping and attribute access issues
    """
    user = request.user
    
    try:
        print(f"🔍 get_user_profile called for user: {user.username}, role: {user.role}")
        
        # Handle student users
        if user.role == 'Student':
            # Get student registration data
            student_registration = None
            try:
                student_registration = StudentRegistration.objects.get(student_username=user.username)
                print(f"✅ Found StudentRegistration: {student_registration.student_id}")
            except StudentRegistration.DoesNotExist:
                # Try by email
                try:
                    student_registration = StudentRegistration.objects.get(student_email=user.email)
                    print(f"✅ Found StudentRegistration by email: {student_registration.student_id}")
                except StudentRegistration.DoesNotExist:
                    print(f"❌ StudentRegistration not found for username: {user.username} or email: {user.email}")
                    # Return basic user data if student registration not found
                    return Response({
                        'user': {
                            'firstname': user.firstname,
                            'lastname': user.lastname,
                            'email': user.email,
                            'phonenumber': user.phonenumber or '',
                            'username': user.username
                        },
                        'student_profile': {
                            'grade': '',
                            'school': '',
                            'address': ''
                        },
                        'parent_details': {
                            'parent_name': 'Not provided',
                            'parent_email': 'Not provided',
                            'parent_phone': 'Not provided'
                        }
                    }, status=status.HTTP_200_OK)
            
            if not student_registration:
                return Response({
                    'user': {
                        'firstname': user.firstname,
                        'lastname': user.lastname,
                        'email': user.email,
                        'phonenumber': user.phonenumber or '',
                        'username': user.username
                    },
                    'student_profile': {
                        'grade': '',
                        'school': '',
                        'address': ''
                    },
                    'parent_details': {
                        'parent_name': 'Not provided',
                        'parent_email': 'Not provided',
                        'parent_phone': 'Not provided'
                    }
                }, status=status.HTTP_200_OK)
            
            # Get or create student profile data (auto-create if doesn't exist with registration data)
            student_profile = None
            profile_grade = ''
            profile_school = ''
            profile_address = ''
            profile_parent_email = student_registration.parent_email or ''
            
            try:
                student_profile = StudentProfile.objects.get(student_id=student_registration.student_id)
                print(f"✅ Found StudentProfile: {student_profile.profile_id}")
                profile_grade = student_profile.grade or ''
                profile_school = student_profile.school or ''
                profile_address = student_profile.address or ''
                profile_parent_email = student_profile.parent_email or profile_parent_email
            except StudentProfile.DoesNotExist:
                # Auto-create profile with registration data if it doesn't exist
                print(f"🆕 Creating StudentProfile for student_id: {student_registration.student_id}")
                try:
                    student_profile = StudentProfile.objects.create(
                        student_id=student_registration.student_id,
                        student_username=student_registration.student_username,
                        parent_email=student_registration.parent_email or '',
                        grade='',
                        school='',
                        address=''
                    )
                    print(f"✅ Created StudentProfile: {student_profile.profile_id}")
                    profile_grade = ''
                    profile_school = ''
                    profile_address = ''
                    profile_parent_email = student_profile.parent_email or ''
                except Exception as profile_error:
                    print(f"❌ Error creating StudentProfile: {profile_error}")
                    import traceback
                    print(traceback.format_exc())
                    # Use empty values as fallback
                    student_profile = None
            
            # Get parent details automatically if parent_email exists
            parent_email_to_use = profile_parent_email or (student_registration.parent_email if student_registration else None)
            
            print(f"🔍 Looking for parent with email: {parent_email_to_use}")
            parent_details = {
                'parent_name': 'Not provided',
                'parent_email': 'Not provided',
                'parent_phone': 'Not provided'
            }
            
            if parent_email_to_use and str(parent_email_to_use).strip() and parent_email_to_use != 'no-parent@example.com':
                try:
                    parent_registration = ParentRegistration.objects.get(email=parent_email_to_use)
                    parent_details = {
                        'parent_name': f"{parent_registration.first_name} {parent_registration.last_name}",
                        'parent_email': parent_registration.email,
                        'parent_phone': parent_registration.phone_number or ''
                    }
                    print(f"✅ Found parent: {parent_details['parent_name']}")
                except ParentRegistration.DoesNotExist:
                    print(f"⚠️ ParentRegistration not found for email: {parent_email_to_use}")
                    parent_details = {
                        'parent_name': 'Not provided',
                        'parent_email': parent_email_to_use or 'Not provided',
                        'parent_phone': 'Not provided'
                    }
            else:
                print(f"⚠️ No valid parent_email found")
            
            # Prioritize phone number from StudentRegistration over User model
            phone_number = ''
            if student_registration and student_registration.phone_number:
                phone_number = student_registration.phone_number
            elif user.phonenumber:
                phone_number = user.phonenumber
            
            print(f"📞 Phone number from StudentRegistration: {student_registration.phone_number if student_registration else 'N/A'}")
            print(f"📞 Phone number from User: {user.phonenumber}")
            print(f"📞 Final phone number: {phone_number}")
            
            # Return data in format expected by frontend
            return Response({
                'user': {
                    'firstname': (student_registration.first_name if student_registration and student_registration.first_name else user.firstname),
                    'lastname': (student_registration.last_name if student_registration and student_registration.last_name else user.lastname),
                    'email': (student_registration.student_email if student_registration and student_registration.student_email else user.email),
                    'phonenumber': phone_number,
                    'username': (student_registration.student_username if student_registration and student_registration.student_username else user.username)
                },
                'student_profile': {
                    'grade': profile_grade,
                    'school': profile_school,
                    'address': profile_address
                },
                'parent_details': parent_details
            }, status=status.HTTP_200_OK)
        
        # Handle non-student users (parent, teacher, etc.)
        else:
            print(f"ℹ️ User is not a student (role: {user.role}), returning basic user data")
            return Response({
                'user': {
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'email': user.email,
                    'phonenumber': user.phonenumber or '',
                    'username': user.username
                }
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Error in get_user_profile: {e}")
        print(error_trace)
        return Response({
            'error': f'Failed to get profile: {str(e)}',
            'user': {
                'firstname': user.firstname if user.is_authenticated else '',
                'lastname': user.lastname if user.is_authenticated else '',
                'email': user.email if user.is_authenticated else '',
                'phonenumber': user.phonenumber if user.is_authenticated else '',
                'username': user.username if user.is_authenticated else ''
            },
            'student_profile': {
                'grade': '',
                'school': '',
                'address': ''
            },
            'parent_details': {
                'parent_name': 'Not provided',
                'parent_email': 'Not provided',
                'parent_phone': 'Not provided'
            }
        }, status=status.HTTP_200_OK)  # Return 200 with error message to prevent frontend crash


@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Temporarily disabled for testing
def get_user_profile_data(request):
    """
    Get user profile data including student registration and profile
    """
    user = request.user
    
    # Handle unauthenticated requests (for testing)
    if not user.is_authenticated:
        # Try to find srinu123 specifically for testing
        try:
            student_registration = StudentRegistration.objects.get(student_username='srinu123')
        except StudentRegistration.DoesNotExist:
            # Fallback to first student if srinu123 not found
            try:
                student_registration = StudentRegistration.objects.first()
                if not student_registration:
                    return Response({'error': 'No student data found'}, status=status.HTTP_404_NOT_FOUND)
            except StudentRegistration.DoesNotExist:
                return Response({'error': 'No student registration found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        try:
            # Get student registration data
            student_registration = StudentRegistration.objects.get(student_username=user.username)
        except StudentRegistration.DoesNotExist:
            return Response({'error': 'Student registration not found for this user'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        
        # Get or create student profile data (auto-create if doesn't exist with registration data)
        try:
            student_profile = StudentProfile.objects.get(student_id=student_registration.student_id)
            profile_data = {
                'student_username': student_profile.student_username or student_registration.student_username,
                'parent_email': student_profile.parent_email or student_registration.parent_email,
                'grade': student_profile.grade or '',
                'school': student_profile.school or '',
                'address': student_profile.address or ''
            }
        except StudentProfile.DoesNotExist:
            # Auto-create profile with registration data if it doesn't exist
            student_profile = StudentProfile.objects.create(
                student_id=student_registration.student_id,
                student_username=student_registration.student_username,
                parent_email=student_registration.parent_email,
                grade='',
                school='',
                address=''
            )
            profile_data = {
                'student_username': student_profile.student_username,
                'parent_email': student_profile.parent_email,
                'grade': student_profile.grade or '',
                'school': student_profile.school or '',
                'address': student_profile.address or ''
            }
        
        # Get parent details automatically if parent_email exists - use parent_email from profile or registration
        parent_email_to_use = (student_profile.parent_email if student_profile.parent_email else student_registration.parent_email)
        parent_details = {}
        if parent_email_to_use and parent_email_to_use != 'no-parent@example.com' and parent_email_to_use.strip():
            try:
                parent_registration = ParentRegistration.objects.get(email=parent_email_to_use)
                parent_details = {
                    'parent_name': f"{parent_registration.first_name} {parent_registration.last_name}",
                    'parent_email': parent_registration.email,
                    'parent_phone': parent_registration.phone_number or ''
                }
            except ParentRegistration.DoesNotExist:
                parent_details = {
                    'parent_name': 'Not provided',
                    'parent_email': parent_email_to_use or 'Not provided',
                    'parent_phone': 'Not provided'
                }
        else:
            parent_details = {
                'parent_name': 'Not provided',
                'parent_email': 'Not provided',
                'parent_phone': 'Not provided'
            }
        
        # Prepare user data - prioritize StudentRegistration data over User model
        if user.is_authenticated:
            # Prioritize phone number from StudentRegistration
            phone_number = student_registration.phone_number or user.phonenumber or ''
            user_data = {
                'firstname': student_registration.first_name or user.firstname,
                'lastname': student_registration.last_name or user.lastname,
                'email': student_registration.student_email or user.email,
                'phonenumber': phone_number,
                'username': student_registration.student_username or user.username
            }
        else:
            # Use student registration data for unauthenticated requests
            user_data = {
                'firstname': student_registration.first_name,
                'lastname': student_registration.last_name,
                'email': student_registration.student_email or '',
                'phonenumber': student_registration.phone_number or '',
                'username': student_registration.student_username
            }
        
        return Response({
            'user': user_data,
            'student_registration': {
                'first_name': student_registration.first_name,
                'last_name': student_registration.last_name,
                'phone_number': student_registration.phone_number or '',
                'student_email': student_registration.student_email or '',
                'student_username': student_registration.student_username,
                'parent_email': student_registration.parent_email or ''
            },
            'student_profile': profile_data,
            'parent_details': parent_details
        }, status=status.HTTP_200_OK)
        
    except StudentRegistration.DoesNotExist:
        return Response({
            'error': 'Student registration not found for this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to get profile data: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([permissions.AllowAny])  # Temporarily disabled for testing
def update_user_profile(request):
    """
    Update user profile and student profile together
    """
    user = request.user
    
    try:
        # Handle unauthenticated requests (for testing)
        if not user.is_authenticated:
            # Try to find the student by username from the request data
            requested_username = request.data.get('userName')
            if requested_username:
                try:
                    student_registration = StudentRegistration.objects.get(student_username=requested_username)
                except StudentRegistration.DoesNotExist:
                    # Fallback to first student if username not found
                    student_registration = StudentRegistration.objects.first()
            else:
                # Use the first student for testing
                student_registration = StudentRegistration.objects.first()
            
            if not student_registration:
                return Response({'error': 'No student data found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                # Update User model fields
                user.firstname = request.data.get('firstName', user.firstname)
                user.lastname = request.data.get('lastName', user.lastname)
                user.email = request.data.get('email', user.email)
                user.phonenumber = request.data.get('phone', user.phonenumber)
                user.save()
                
                # Update StudentRegistration fields
                student_registration = StudentRegistration.objects.get(student_username=user.username)
            except StudentRegistration.DoesNotExist:
                return Response({'error': 'Student registration not found for this user'}, status=status.HTTP_404_NOT_FOUND)
        
        # Update StudentRegistration fields
        student_registration.first_name = request.data.get('firstName', student_registration.first_name)
        student_registration.last_name = request.data.get('lastName', student_registration.last_name)
        
        # Only update phone number if it's different to avoid unique constraint violation
        new_phone = request.data.get('phone', student_registration.phone_number)
        if new_phone != student_registration.phone_number:
            # Check if the new phone number is already in use by another student
            if StudentRegistration.objects.filter(phone_number=new_phone).exclude(student_id=student_registration.student_id).exists():
                print(f"Warning: Phone number {new_phone} is already in use by another student")
            else:
                student_registration.phone_number = new_phone
        
        # Only update email if it's different to avoid unique constraint violation
        new_email = request.data.get('email', student_registration.student_email)
        if new_email != student_registration.student_email:
            # Check if the new email is already in use by another student
            if StudentRegistration.objects.filter(student_email=new_email).exclude(student_id=student_registration.student_id).exists():
                print(f"Warning: Email {new_email} is already in use by another student")
            else:
                student_registration.student_email = new_email
        
        # Only update username if it's different to avoid unique constraint violation
        new_username = request.data.get('userName', student_registration.student_username)
        if new_username != student_registration.student_username:
            # Check if the new username is already in use by another student
            if StudentRegistration.objects.filter(student_username=new_username).exclude(student_id=student_registration.student_id).exists():
                print(f"Warning: Username {new_username} is already in use by another student")
            else:
                student_registration.student_username = new_username
        
        # Only update parent_email if it exists in parent_registration table
        new_parent_email = request.data.get('parentEmail', student_registration.parent_email)
        if new_parent_email and new_parent_email != student_registration.parent_email:
            # Check if parent exists (ParentRegistration uses 'email' field, not 'parent_email')
            try:
                ParentRegistration.objects.get(email=new_parent_email)
                student_registration.parent_email = new_parent_email
            except ParentRegistration.DoesNotExist:
                # Keep existing parent_email if new one doesn't exist
                print(f"Warning: Parent email {new_parent_email} not found in parent_registration table")
        
        student_registration.save()
        
        # Get or create StudentProfile
        student_profile, created = StudentProfile.objects.get_or_create(
            student_id=student_registration.student_id,
            defaults={
                'student_username': request.data.get('userName', ''),
                'parent_email': student_registration.parent_email,  # Use the validated parent_email
                'grade': request.data.get('grade', ''),
                'school': request.data.get('school', ''),
                'address': request.data.get('address', ''),
            }
        )
        
        if not created:
            # Update existing profile
            # Only update username if it's different to avoid unique constraint violation
            new_profile_username = request.data.get('userName', student_profile.student_username)
            if new_profile_username != student_profile.student_username:
                # Check if the new username is already in use by another profile
                if StudentProfile.objects.filter(student_username=new_profile_username).exclude(profile_id=student_profile.profile_id).exists():
                    print(f"Warning: Username {new_profile_username} is already in use by another profile")
                else:
                    student_profile.student_username = new_profile_username
            
            student_profile.parent_email = student_registration.parent_email  # Use the validated parent_email
            student_profile.grade = request.data.get('grade', student_profile.grade)
            student_profile.school = request.data.get('school', student_profile.school)
            student_profile.address = request.data.get('address', student_profile.address)
            student_profile.save()
        
        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'firstname': student_registration.first_name,
                'lastname': student_registration.last_name,
                'email': student_registration.student_email,
                'phonenumber': student_registration.phone_number,
                'username': student_registration.student_username
            },
            'student_registration': {
                'first_name': student_registration.first_name,
                'last_name': student_registration.last_name,
                'phone_number': student_registration.phone_number,
                'student_email': student_registration.student_email,
                'student_username': student_registration.student_username,
                'parent_email': student_registration.parent_email
            },
            'student_profile': {
                'student_username': student_profile.student_username,
                'parent_email': student_profile.parent_email,
                'grade': student_profile.grade,
                'school': student_profile.school,
                'address': student_profile.address
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to update profile: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# COIN/REWARDS API ENDPOINTS
# =====================================================

def get_student_from_request(request):
    """
    Helper function to get StudentRegistration from authenticated user.
    If StudentRegistration doesn't exist, automatically creates it from User record.
    """
    try:
        if not request.user or not request.user.is_authenticated:
            print("❌ User not authenticated")
            return None
        
        username = request.user.username
        print(f"🔍 Looking up student with username: {username}")
        
        try:
            student = StudentRegistration.objects.get(student_username=username)
            print(f"✅ Found student: {student.student_id} - {student.student_username}")
            return student
        except StudentRegistration.DoesNotExist:
            print(f"⚠️ StudentRegistration not found for username: {username}")
            # Try to find by email if username doesn't match
            try:
                student = StudentRegistration.objects.get(student_email=request.user.email)
                print(f"✅ Found student by email: {student.student_id} - {student.student_email}")
                return student
            except StudentRegistration.DoesNotExist:
                print(f"⚠️ StudentRegistration not found for email: {request.user.email}")
                
                # Auto-create StudentRegistration from User record if user is a Student
                if request.user.role == 'Student':
                    print(f"🔧 Auto-creating StudentRegistration for user: {username}")
                    try:
                        # Get parent_email - must exist in parent_registration table
                        parent_email = None
                        try:
                            # Try to find any existing parent first
                            first_parent = ParentRegistration.objects.first()
                            if first_parent:
                                parent_email = first_parent.email
                                print(f"  📧 Using existing parent: {parent_email}")
                            
                            # If no parents exist, create a default system parent
                            if not parent_email:
                                print(f"  ⚠️ No parents exist. Creating default system parent.")
                                default_parent = ParentRegistration.objects.create(
                                    email='system@novya.com',
                                    first_name='System',
                                    last_name='Parent',
                                    phone_number=None,
                                    parent_username='system_parent',
                                    parent_password='system'  # Placeholder
                                )
                                parent_email = default_parent.email
                                print(f"  ✅ Created default system parent: {parent_email}")
                        except Exception as e:
                            print(f"  ⚠️ Error finding/creating parent: {e}")
                            # If parent creation fails, try to use any existing parent
                            first_parent = ParentRegistration.objects.first()
                            if first_parent:
                                parent_email = first_parent.email
                        
                        # Ensure we have a valid parent_email
                        if not parent_email:
                            raise Exception("Cannot create StudentRegistration: No valid parent_email available")
                        
                        # Verify parent exists before creating
                        if not ParentRegistration.objects.filter(email=parent_email).exists():
                            raise Exception(f"Parent with email {parent_email} does not exist")
                        
                        # Create StudentRegistration from User data
                        student = StudentRegistration.objects.create(
                            student_username=username,
                            student_email=request.user.email or f"{username}@student.novya.com",
                            first_name=request.user.firstname or '',
                            last_name=request.user.lastname or '',
                            phone_number=request.user.phonenumber or None,
                            parent_email=parent_email
                        )
                        print(f"✅ Auto-created StudentRegistration: {student.student_id} - {student.student_username}, parent_email={parent_email}")
                        return student
                    except Exception as e:
                        print(f"❌ Failed to auto-create StudentRegistration: {e}")
                        import traceback
                        traceback.print_exc()
                        return None
                else:
                    print(f"❌ User is not a Student (role: {request.user.role}), cannot create StudentRegistration")
                    return None
    except Exception as e:
        print(f"❌ Error getting student: {e}")
        import traceback
        traceback.print_exc()
        return None


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_coin_transaction(request):
    """
    Add a coin transaction (earn or spend coins)
    """
    try:
        print(f"💰 Add coin transaction request from user: {request.user.username}")
        student = get_student_from_request(request)
        if not student:
            print("❌ Student not found in add_coin_transaction")
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AddCoinTransactionSerializer(data=request.data)
        if not serializer.is_valid():
            print(f"❌ Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        coins = validated_data['coins']
        source = validated_data['source']
        reason = validated_data.get('reason', '')
        
        # Determine transaction type based on coin value
        # Negative coins = deduction (spent), Positive coins = addition (earned)
        transaction_type = 'spent' if coins < 0 else 'earned'
        coins_absolute = abs(coins)  # Use absolute value for tracking
        
        print(f"💰 Processing coin transaction: {coins} coins ({transaction_type}) from source: {source}, reason: {reason}, student_id: {student.student_id}")
        
        # Get or create user coin balance
        balance, created = UserCoinBalance.objects.get_or_create(
            student_id=student,
            defaults={
                'total_coins': 0,
                'total_earned': 0,
                'total_spent': 0
            }
        )
        
        # If balance is 0 but there are transactions, recalculate from transactions first
        if balance.total_coins == 0:
            transactions = CoinTransaction.objects.filter(student_id=student).order_by('created_at')
            if transactions.exists():
                print(f"🔄 Balance is 0 but transactions exist. Recalculating from transactions...")
                total = 0
                total_earned = 0
                total_spent = 0
                for txn in transactions:
                    total += txn.coins  # coins can be negative
                    if txn.transaction_type == 'earned':
                        total_earned += abs(txn.coins)
                    else:
                        total_spent += abs(txn.coins)
                
                balance.total_coins = total
                balance.total_earned = total_earned
                balance.total_spent = total_spent
                balance.save()
                print(f"✅ Balance recalculated: total_coins={balance.total_coins}")
        
        print(f"📊 Balance before: total_coins={balance.total_coins}, total_earned={balance.total_earned}, total_spent={balance.total_spent}")
        
        # Update balance based on transaction type
        if transaction_type == 'earned':
            # Positive coins: add to balance and total_earned
            balance.total_coins += coins
            balance.total_earned += coins_absolute
        else:  # spent (negative coins)
            # Check if user has sufficient coins
            if balance.total_coins < coins_absolute:
                return Response({
                    'error': f'Insufficient coins. You have {balance.total_coins} coins but need {coins_absolute} coins.'
                }, status=status.HTTP_400_BAD_REQUEST)
            # Negative coins: subtract from balance (add negative value) and add to total_spent
            balance.total_coins += coins  # coins is negative, so this subtracts
            balance.total_spent += coins_absolute
        
        balance.last_transaction_at = timezone.now()
        balance.save()
        
        print(f"📊 Balance after: total_coins={balance.total_coins}, total_earned={balance.total_earned}, total_spent={balance.total_spent}")
        
        # Create transaction record
        # Handle null/empty values properly
        reference_id = validated_data.get('reference_id') if validated_data.get('reference_id') else None
        reference_type = validated_data.get('reference_type') if validated_data.get('reference_type') else None
        reason_text = reason if reason else ''
        
        # Store the actual coin value (can be negative for deductions)
        transaction = CoinTransaction.objects.create(
            student_id=student,
            coins=coins,  # Keep original value (can be negative)
            transaction_type=transaction_type,
            source=source,
            reason=reason_text,
            reference_id=reference_id,
            reference_type=reference_type,
            metadata=validated_data.get('metadata'),
            balance_after=balance.total_coins
        )
        
        print(f"✅ Transaction created: transaction_id={transaction.transaction_id}, balance_after={transaction.balance_after}")
        
        # Update DailyActivity if coins were earned (only for earned transactions)
        if transaction_type == 'earned':
            try:
                update_daily_activity(student, timezone.now().date())
            except Exception as e:
                print(f"⚠️ Warning: Failed to update DailyActivity after coin transaction: {e}")
                import traceback
                traceback.print_exc()
        
        return Response({
            'message': f'Successfully {transaction_type} {coins_absolute} coins',
            'transaction': CoinTransactionSerializer(transaction).data,
            'balance': UserCoinBalanceSerializer(balance).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"❌ Exception in add_coin_transaction: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to add coin transaction: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_coin_balance(request):
    """
    Get current coin balance for the authenticated student
    """
    try:
        print(f"🔍 Get coin balance request from user: {request.user.username}")
        student = get_student_from_request(request)
        if not student:
            print("❌ Student not found in get_coin_balance")
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        balance, created = UserCoinBalance.objects.get_or_create(
            student_id=student,
            defaults={
                'total_coins': 0,
                'total_earned': 0,
                'total_spent': 0
            }
        )
        
        # If balance is 0 but there are transactions, recalculate from transactions
        if balance.total_coins == 0:
            # Check if there are any transactions for this student
            transactions = CoinTransaction.objects.filter(student_id=student).order_by('created_at')
            if transactions.exists():
                # Recalculate balance from transactions
                print(f"🔄 Recalculating balance from transactions for student {student.student_id}")
                total = 0
                total_earned = 0
                total_spent = 0
                for txn in transactions:
                    total += txn.coins  # coins can be negative
                    if txn.transaction_type == 'earned':
                        total_earned += abs(txn.coins)
                    else:
                        total_spent += abs(txn.coins)
                
                balance.total_coins = total
                balance.total_earned = total_earned
                balance.total_spent = total_spent
                balance.save()
                print(f"✅ Balance recalculated: total_coins={balance.total_coins}")
        
        print(f"📊 Balance retrieved: total_coins={balance.total_coins}, student_id={student.student_id}")
        
        return Response({
            'balance': UserCoinBalanceSerializer(balance).data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Exception in get_coin_balance: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to get coin balance: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_coin_transactions(request):
    """
    Get coin transaction history for the authenticated student
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get limit and offset from query parameters
        limit = int(request.query_params.get('limit', 50))
        offset = int(request.query_params.get('offset', 0))
        
        # Filter transactions
        transactions = CoinTransaction.objects.filter(
            student_id=student
        ).order_by('-created_at')[offset:offset+limit]
        
        total = CoinTransaction.objects.filter(student_id=student).count()
        
        return Response({
            'transactions': CoinTransactionSerializer(transactions, many=True).data,
            'total': total,
            'limit': limit,
            'offset': offset
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get coin transactions: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_daily_login_reward(request):
    """
    Check if daily login reward was already given today for the authenticated student
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get today's date in UTC
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        # Check if there's a login reward transaction today
        has_reward_today = CoinTransaction.objects.filter(
            student_id=student,
            source='login',
            reason__icontains='Daily login reward',
            created_at__gte=today_start,
            created_at__lt=today_end
        ).exists()
        
        return Response({
            'has_reward_today': has_reward_today,
            'date': timezone.now().date().isoformat()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to check daily login reward: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_student_feedback(request):
    """
    Submit student feedback and award 20 coins for first feedback
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = StudentFeedbackCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        rating = serializer.validated_data['rating']
        comment = serializer.validated_data.get('comment', '')
        
        # Check if student already submitted feedback (to check if reward was given)
        existing_feedback = StudentFeedback.objects.filter(
            student_id=student,
            reward_received=True
        ).first()
        
        is_first_feedback = existing_feedback is None
        coins_awarded = 20 if is_first_feedback else 0
        
        # Create feedback record
        feedback = StudentFeedback.objects.create(
            student_id=student,
            rating=rating,
            comment=comment,
            coins_awarded=coins_awarded,
            reward_received=is_first_feedback
        )
        
        # Award 20 coins if this is the first feedback
        if is_first_feedback:
            try:
                # Get or create user coin balance
                balance, created = UserCoinBalance.objects.get_or_create(
                    student_id=student,
                    defaults={
                        'total_coins': 0,
                        'total_earned': 0,
                        'total_spent': 0
                    }
                )
                
                # Update balance
                balance.total_coins += 20
                balance.total_earned += 20
                balance.last_transaction_at = timezone.now()
                balance.save()
                
                # Create coin transaction record
                coin_transaction = CoinTransaction.objects.create(
                    student_id=student,
                    coins=20,
                    transaction_type='earned',
                    source='feedback',
                    reason='First feedback submission',
                    reference_id=feedback.feedback_id,
                    reference_type='student_feedback',
                    balance_after=balance.total_coins
                )
                
                print(f"✅ Awarded 20 coins for first feedback submission - Transaction ID: {coin_transaction.transaction_id}")
            except Exception as e:
                print(f"⚠️ Warning: Failed to award coins for feedback: {str(e)}")
                import traceback
                traceback.print_exc()
                # Continue even if coin award fails - feedback is still saved
        
        return Response({
            'message': 'Feedback submitted successfully',
            'feedback': StudentFeedbackSerializer(feedback).data,
            'coins_awarded': coins_awarded,
            'is_first_feedback': is_first_feedback
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"❌ Exception in submit_student_feedback: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to submit feedback: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_feedback_status(request):
    """
    Get feedback status for the authenticated student (whether reward was received)
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if student has submitted feedback with reward
        feedback_with_reward = StudentFeedback.objects.filter(
            student_id=student,
            reward_received=True
        ).order_by('created_at').first()
        
        has_received_reward = feedback_with_reward is not None
        reward_date = feedback_with_reward.created_at.strftime('%d/%m/%Y') if feedback_with_reward else None
        
        # Get latest feedback
        latest_feedback = StudentFeedback.objects.filter(
            student_id=student
        ).order_by('-created_at').first()
        
        return Response({
            'has_received_reward': has_received_reward,
            'reward_date': reward_date,
            'latest_feedback': StudentFeedbackSerializer(latest_feedback).data if latest_feedback else None
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get feedback status: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_video_watching_reward(request):
    """
    Check if video watching reward was already given for a specific video
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get video identifier from query params
        class_name = request.query_params.get('class_name', '')
        subject = request.query_params.get('subject', '')
        chapter = request.query_params.get('chapter', '')
        subtopic = request.query_params.get('subtopic', '')
        
        if not class_name or not subject or not chapter:
            return Response({
                'error': 'Missing required parameters: class_name, subject, chapter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Build video identifier (same format as frontend)
        video_identifier = f"{class_name}_{subject}_{chapter}_{subtopic or 'main'}"
        
        # Check if there's a video watching reward transaction for this video
        has_reward = CoinTransaction.objects.filter(
            student_id=student,
            source='video_watching',
            reason__icontains=video_identifier
        ).exists()
        
        return Response({
            'has_reward': has_reward,
            'video_identifier': video_identifier
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to check video watching reward: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =====================================================
# BADGES API ENDPOINTS
# =====================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_badges(request):
    """
    Get all badges for the authenticated student
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        badges = UserBadge.objects.filter(student_id=student, is_active=True).order_by('-earned_at')
        serializer = UserBadgeSerializer(badges, many=True)
        
        return Response({
            'badges': serializer.data,
            'total_badges': badges.count()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get badges: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def award_badge(request):
    """
    Award a badge to a student (internal use - called by other services)
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        badge_type = request.data.get('badge_type')
        if not badge_type:
            return Response({
                'error': 'badge_type is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Badge titles mapping
        badge_titles = {
            'quick_master': 'Quick Master',
            'mock_master': 'Mock Master',
            'streak_7': 'Steady Learner',
            'streak_15': 'Focused Mind',
            'streak_30': 'Learning Legend'
        }
        
        badge_title = badge_titles.get(badge_type, badge_type.replace('_', ' ').title())
        
        # Check if badge already exists
        badge, created = UserBadge.objects.get_or_create(
            student_id=student,
            badge_type=badge_type,
            defaults={
                'badge_title': badge_title,
                'badge_description': f'Awarded for achieving {badge_title}',
                'is_active': True
            }
        )
        
        print(f"🏆 Badge award attempt for {student.student_username}: {badge_type} - Created: {created}")
        
        if not created:
            print(f"ℹ️ Badge already exists for {student.student_username}: {badge_type}")
            return Response({
                'message': 'Badge already exists',
                'badge': UserBadgeSerializer(badge).data
            }, status=status.HTTP_200_OK)
        
        serializer = UserBadgeSerializer(badge)
        print(f"✅ Badge awarded successfully to {student.student_username}: {badge_title}")
        return Response({
            'message': 'Badge awarded successfully',
            'badge': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Failed to award badge: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =====================================================
# STREAKS API ENDPOINTS
# =====================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_streak(request):
    """
    Get streak information for the authenticated student
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        streak, created = UserStreak.objects.get_or_create(
            student_id=student,
            defaults={
                'current_streak': 0,
                'longest_streak': 0,
                'total_days_active': 0
            }
        )
        
        serializer = UserStreakSerializer(streak)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get streak: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_streak(request):
    """
    Update streak for a student (called when activity is detected)
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Use the helper function to update streak
        streak = update_streak_for_student(student)
        
        if not streak:
            return Response({
                'error': 'Failed to update streak'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
            serializer = UserStreakSerializer(streak)
            return Response({
            'message': 'Streak updated successfully',
                'streak': serializer.data
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to update streak: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =====================================================
# DAILY SUMMARY API ENDPOINTS
# =====================================================

def update_daily_activity(student, activity_date=None):
    """
    Helper function to update or create DailyActivity record for a student on a specific date
    Called automatically when quizzes, mock tests, or coin transactions occur
    """
    from quizzes.models import QuizAttempt, MockTestAttempt
    from django.db.models import Sum
    from django.utils import timezone as tz
    
    if activity_date is None:
        activity_date = timezone.now().date()
    
    try:
        # Get or create daily activity
        daily_activity, created = DailyActivity.objects.get_or_create(
                    student_id=student,
            activity_date=activity_date,
                    defaults={
                'quizzes_completed': 0,
                'mock_tests_completed': 0,
                'quick_practices_completed': 0,
                'classroom_activities': 0,
                'total_study_time_minutes': 0,
                'average_quiz_score': 0.0,
                'average_mock_test_score': 0.0,
                'coins_earned': 0
            }
        )
        
        # Calculate date range for the day
        start_of_day = tz.make_aware(datetime.combine(activity_date, datetime.min.time()))
        end_of_day = tz.make_aware(datetime.combine(activity_date, datetime.max.time()))
        
        # Get quiz attempts for the day
        quiz_attempts = QuizAttempt.objects.filter(
            student_id=student,
            attempted_at__gte=start_of_day,
            attempted_at__lte=end_of_day
        )
        
        # Get mock test attempts for the day
        mock_test_attempts = MockTestAttempt.objects.filter(
            student_id=student,
            attempted_at__gte=start_of_day,
            attempted_at__lte=end_of_day
        )
        
        # Count by quiz_type
        ai_generated_count = quiz_attempts.filter(quiz_type='ai_generated').count()
        database_count = quiz_attempts.filter(quiz_type='database').count()
        quiz_type_count = quiz_attempts.filter(quiz_type='quiz').count()  # Legacy 'quiz' type
        
        # Update counts
        daily_activity.quizzes_completed = ai_generated_count
        daily_activity.quick_practices_completed = database_count + quiz_type_count
        daily_activity.mock_tests_completed = mock_test_attempts.count()
        
        # Calculate average scores
        quiz_scores = [q.score for q in quiz_attempts if q.score is not None]
        mock_scores = [m.score for m in mock_test_attempts if m.score is not None]
        
        daily_activity.average_quiz_score = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0.0
        daily_activity.average_mock_test_score = sum(mock_scores) / len(mock_scores) if mock_scores else 0.0
        
        # Calculate total study time (sum of time_taken_seconds from attempts)
        total_quiz_time = quiz_attempts.aggregate(total=Sum('time_taken_seconds'))['total'] or 0
        total_mock_time = mock_test_attempts.aggregate(total=Sum('time_taken_seconds'))['total'] or 0
        daily_activity.total_study_time_minutes = int((total_quiz_time + total_mock_time) / 60)
        
        # Get coins earned for the day
        coins_earned = CoinTransaction.objects.filter(
            student_id=student,
            transaction_type='earned',
            created_at__gte=start_of_day,
            created_at__lte=end_of_day
        ).aggregate(total=Sum('coins'))['total'] or 0
        
        daily_activity.coins_earned = coins_earned
        
        # Save the updated activity
        daily_activity.save()
        
        print(f"✅ DailyActivity updated for {student.student_username} on {activity_date}: "
              f"quizzes={daily_activity.quizzes_completed}, "
              f"quick_practices={daily_activity.quick_practices_completed}, "
              f"mock_tests={daily_activity.mock_tests_completed}, "
              f"coins={daily_activity.coins_earned}")
        
        return daily_activity
        
    except Exception as e:
        print(f"❌ Error updating DailyActivity: {e}")
        import traceback
        traceback.print_exc()
        return None


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_daily_summary(request):
    """
    Get daily summary for a specific date or today
    """
    try:
        student = get_student_from_request(request)
        if not student:
            return Response({
                'error': 'Student profile not found. Please ensure you are logged in as a student.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get date from query params or use today
        date_str = request.query_params.get('date')
        if date_str:
            try:
                activity_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({
                    'error': 'Invalid date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            activity_date = timezone.now().date()
        
        # Get or create daily activity
        daily_activity, created = DailyActivity.objects.get_or_create(
            student_id=student,
            activity_date=activity_date,
            defaults={
                'quizzes_completed': 0,
                'mock_tests_completed': 0,
                'quick_practices_completed': 0,
                'classroom_activities': 0,
                'total_study_time_minutes': 0,
                'average_quiz_score': 0.0,
                'average_mock_test_score': 0.0,
                'coins_earned': 0
            }
        )
        
        # ALWAYS recalculate from actual data (both for new and existing records)
        from quizzes.models import QuizAttempt, MockTestAttempt
        from django.db.models import Sum
        from django.utils import timezone as tz
        
        # Get quiz attempts for the day (handle timezone properly)
        # Use date range to ensure we catch all attempts for the day
        start_of_day = tz.make_aware(datetime.combine(activity_date, datetime.min.time()))
        end_of_day = tz.make_aware(datetime.combine(activity_date, datetime.max.time()))
        
        quiz_attempts = QuizAttempt.objects.filter(
            student_id=student,
            attempted_at__gte=start_of_day,
            attempted_at__lte=end_of_day
        )
        
        # Get mock test attempts for the day
        mock_test_attempts = MockTestAttempt.objects.filter(
            student_id=student,
            attempted_at__gte=start_of_day,
            attempted_at__lte=end_of_day
        )
        
        # Debug logging
        print(f"📊 Daily Summary Calculation for {student.student_username} on {activity_date}:")
        print(f"   Quiz attempts found: {quiz_attempts.count()}")
        print(f"   Mock test attempts found: {mock_test_attempts.count()}")
        
        # Count by quiz_type (handle all possible types)
        ai_generated_count = quiz_attempts.filter(quiz_type='ai_generated').count()
        database_count = quiz_attempts.filter(quiz_type='database').count()
        quiz_type_count = quiz_attempts.filter(quiz_type='quiz').count()  # Legacy 'quiz' type
        
        print(f"   AI Generated quizzes: {ai_generated_count}")
        print(f"   Database quizzes: {database_count}")
        print(f"   Legacy 'quiz' type: {quiz_type_count}")
        
        # Update counts (combine database and legacy 'quiz' types for quick practices)
        daily_activity.quizzes_completed = ai_generated_count
        daily_activity.quick_practices_completed = database_count + quiz_type_count  # Include legacy 'quiz' type
        daily_activity.mock_tests_completed = mock_test_attempts.count()
        
        # Calculate average scores
        quiz_scores = [q.score for q in quiz_attempts if q.score is not None]
        mock_scores = [m.score for m in mock_test_attempts if m.score is not None]
        
        daily_activity.average_quiz_score = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0.0
        daily_activity.average_mock_test_score = sum(mock_scores) / len(mock_scores) if mock_scores else 0.0
        
        # Get coins earned for the day (handle timezone properly)
        coins_earned = CoinTransaction.objects.filter(
            student_id=student,
            transaction_type='earned',
            created_at__gte=start_of_day,
            created_at__lte=end_of_day
        ).aggregate(total=Sum('coins'))['total'] or 0
        
        print(f"   Coins earned: {coins_earned}")
        
        daily_activity.coins_earned = coins_earned
        
        # Save the updated activity
        daily_activity.save()
        
        serializer = DailyActivitySerializer(daily_activity)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get daily summary: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =====================================================
# LEADERBOARD API ENDPOINTS
# =====================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_leaderboard(request):
    """
    Get leaderboard based on ranking type with subject-wise scores
    """
    try:
        from quizzes.models import QuizAttempt, MockTestAttempt
        import json
        
        ranking_type = request.query_params.get('type', 'overall')
        limit = int(request.query_params.get('limit', 100))
        
        # Subject mapping - normalize subject names from database to leaderboard format
        SUBJECT_MAPPING = {
            'english': ['english', 'English', 'ENGLISH'],
            'maths': ['maths', 'Mathematics', 'Math', 'MATH', 'MATHS', 'Mathematics'],
            'science': ['science', 'Science', 'SCIENCE'],
            'social': ['social', 'Social', 'Social Studies', 'SOCIAL', 'Social Studies'],
            'computer': ['computer', 'Computer', 'Computers', 'COMPUTER', 'COMPUTERS']
        }
        
        def normalize_subject(subject_name):
            """Normalize subject name to leaderboard format"""
            if not subject_name:
                return None
            subject_lower = subject_name.strip().lower()
            for key, variants in SUBJECT_MAPPING.items():
                if subject_lower in [v.lower() for v in variants]:
                    return key
            return None
        
        # Calculate leaderboard (this will populate entries)
        calculate_leaderboard(ranking_type)
        
        # Get leaderboard entries
        entries = LeaderboardEntry.objects.filter(ranking_type=ranking_type).order_by('rank')[:limit]
        
        # Calculate subject scores for each entry on-the-fly
        leaderboard_with_scores = []
        for entry in entries:
            student = entry.student_id
            
            # Get quiz and mock test attempts
            quiz_attempts = QuizAttempt.objects.filter(student_id=student)
            mock_attempts = MockTestAttempt.objects.filter(student_id=student)
            
            # Calculate subject-wise scores using Simple Average (Option 1)
            subject_scores = {
                'english': 0.0,
                'maths': 0.0,
                'science': 0.0,
                'social': 0.0,
                'computer': 0.0
            }
            
            for subject_key in subject_scores.keys():
                # Get quiz attempts for this subject
                quiz_scores_for_subject = []
                for q in quiz_attempts:
                    if q.score is not None and q.subject:
                        normalized = normalize_subject(q.subject)
                        if normalized == subject_key:
                            quiz_scores_for_subject.append(q.score)
                
                # Get mock test attempts for this subject
                mock_scores_for_subject = []
                for m in mock_attempts:
                    if m.score is not None and m.subject:
                        normalized = normalize_subject(m.subject)
                        if normalized == subject_key:
                            mock_scores_for_subject.append(m.score)
                
                # Calculate averages
                quiz_avg = sum(quiz_scores_for_subject) / len(quiz_scores_for_subject) if quiz_scores_for_subject else 0.0
                mock_avg = sum(mock_scores_for_subject) / len(mock_scores_for_subject) if mock_scores_for_subject else 0.0
                
                # Apply Simple Average (Option 1): (Quiz_Avg + Mock_Avg) / 2
                if quiz_avg > 0 and mock_avg > 0:
                    subject_scores[subject_key] = round((quiz_avg + mock_avg) / 2, 2)
                elif quiz_avg > 0:
                    subject_scores[subject_key] = round(quiz_avg, 2)
                elif mock_avg > 0:
                    subject_scores[subject_key] = round(mock_avg, 2)
                else:
                    subject_scores[subject_key] = 0.0  # No attempts = 0
            
            # Calculate total score (sum of all subject scores)
            total_score = round(sum(subject_scores.values()), 2)
            
            # Serialize entry
            serializer = LeaderboardEntrySerializer(entry)
            entry_data = serializer.data
            
            # Add subject scores and total score to entry data
            entry_data['subject_scores'] = subject_scores
            entry_data['total_score'] = total_score
            
            leaderboard_with_scores.append(entry_data)
        
        # Get current user's rank if authenticated
        current_user_rank = None
        try:
            student = get_student_from_request(request)
            if student:
                user_entry = LeaderboardEntry.objects.filter(
                    student_id=student,
                    ranking_type=ranking_type
                ).first()
                if user_entry:
                    # Calculate subject scores for current user
                    quiz_attempts = QuizAttempt.objects.filter(student_id=student)
                    mock_attempts = MockTestAttempt.objects.filter(student_id=student)
                    
                    user_subject_scores = {
                        'english': 0.0,
                        'maths': 0.0,
                        'science': 0.0,
                        'social': 0.0,
                        'computer': 0.0
                    }
                    
                    for subject_key in user_subject_scores.keys():
                        quiz_scores = [q.score for q in quiz_attempts if q.score is not None and q.subject and normalize_subject(q.subject) == subject_key]
                        mock_scores = [m.score for m in mock_attempts if m.score is not None and m.subject and normalize_subject(m.subject) == subject_key]
                        
                        quiz_avg = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0.0
                        mock_avg = sum(mock_scores) / len(mock_scores) if mock_scores else 0.0
                        
                        if quiz_avg > 0 and mock_avg > 0:
                            user_subject_scores[subject_key] = round((quiz_avg + mock_avg) / 2, 2)
                        elif quiz_avg > 0:
                            user_subject_scores[subject_key] = round(quiz_avg, 2)
                        elif mock_avg > 0:
                            user_subject_scores[subject_key] = round(mock_avg, 2)
                        else:
                            user_subject_scores[subject_key] = 0.0
                    
                    user_total_score = round(sum(user_subject_scores.values()), 2)
                    
                    current_user_rank = {
                        'rank': user_entry.rank,
                        'score': user_entry.score,
                        'total_score': user_total_score,
                        'subject_scores': user_subject_scores,
                        'total_quizzes': user_entry.total_quizzes,
                        'total_mock_tests': user_entry.total_mock_tests,
                        'average_score': user_entry.average_score,
                        'total_coins': user_entry.total_coins,
                        'current_streak': user_entry.current_streak
                    }
        except Exception as e:
            print(f"Error getting current user rank: {e}")
            pass
        
        return Response({
            'leaderboard': leaderboard_with_scores,
            'ranking_type': ranking_type,
            'current_user_rank': current_user_rank,
            'total_entries': len(leaderboard_with_scores)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"Error in get_leaderboard: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to get leaderboard: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def calculate_leaderboard(ranking_type='overall'):
    """
    Calculate and update leaderboard entries with subject-wise scores using Simple Average (Option 1)
    Merges quiz and mock test scores: (Quiz_Avg + Mock_Avg) / 2 for each subject
    """
    from django.db.models import Avg, Count, Sum, Q
    from quizzes.models import QuizAttempt, MockTestAttempt
    import json
    
    print(f"📊 Calculating leaderboard for type: {ranking_type}")
    
    # Subject mapping - normalize subject names from database to leaderboard format
    SUBJECT_MAPPING = {
        'english': ['english', 'English', 'ENGLISH'],
        'maths': ['maths', 'Mathematics', 'Math', 'MATH', 'MATHS', 'Mathematics'],
        'science': ['science', 'Science', 'SCIENCE'],
        'social': ['social', 'Social', 'Social Studies', 'SOCIAL', 'Social Studies'],
        'computer': ['computer', 'Computer', 'Computers', 'COMPUTER', 'COMPUTERS']
    }
    
    def normalize_subject(subject_name):
        """Normalize subject name to leaderboard format"""
        if not subject_name:
            return None
        subject_lower = subject_name.strip().lower()
        for key, variants in SUBJECT_MAPPING.items():
            if subject_lower in [v.lower() for v in variants]:
                return key
        return None
    
    # Get all students
    students = StudentRegistration.objects.all()
    print(f"   Found {students.count()} students")
    
    leaderboard_data = []
    
    for student in students:
        # Get quiz and mock test attempts
        quiz_attempts = QuizAttempt.objects.filter(student_id=student)
        mock_attempts = MockTestAttempt.objects.filter(student_id=student)
        
        # Get coin balance
        try:
            coin_balance = UserCoinBalance.objects.get(student_id=student)
            total_coins = coin_balance.total_coins
        except UserCoinBalance.DoesNotExist:
            total_coins = 0
        
        # Get streak
        try:
            streak = UserStreak.objects.get(student_id=student)
            current_streak = streak.current_streak
        except UserStreak.DoesNotExist:
            current_streak = 0
        
        # Calculate metrics
        total_quizzes = quiz_attempts.count()
        total_mock_tests = mock_attempts.count()
        
        all_scores = []
        for q in quiz_attempts:
            if q.score is not None:
                all_scores.append(q.score)
        for m in mock_attempts:
            if m.score is not None:
                all_scores.append(m.score)
        
        average_score = sum(all_scores) / len(all_scores) if all_scores else 0.0
        
        # NEW: Calculate subject-wise scores using Simple Average (Option 1)
        # Initialize subject scores
        subject_scores = {
            'english': 0.0,
            'maths': 0.0,
            'science': 0.0,
            'social': 0.0,
            'computer': 0.0
        }
        
        # Calculate scores for each subject
        for subject_key in subject_scores.keys():
            # Get quiz attempts for this subject
            quiz_scores_for_subject = []
            for q in quiz_attempts:
                if q.score is not None and q.subject:
                    normalized = normalize_subject(q.subject)
                    if normalized == subject_key:
                        quiz_scores_for_subject.append(q.score)
            
            # Get mock test attempts for this subject
            mock_scores_for_subject = []
            for m in mock_attempts:
                if m.score is not None and m.subject:
                    normalized = normalize_subject(m.subject)
                    if normalized == subject_key:
                        mock_scores_for_subject.append(m.score)
            
            # Calculate averages
            quiz_avg = sum(quiz_scores_for_subject) / len(quiz_scores_for_subject) if quiz_scores_for_subject else 0.0
            mock_avg = sum(mock_scores_for_subject) / len(mock_scores_for_subject) if mock_scores_for_subject else 0.0
            
            # Apply Simple Average (Option 1): (Quiz_Avg + Mock_Avg) / 2
            if quiz_avg > 0 and mock_avg > 0:
                subject_scores[subject_key] = (quiz_avg + mock_avg) / 2
            elif quiz_avg > 0:
                subject_scores[subject_key] = quiz_avg
            elif mock_avg > 0:
                subject_scores[subject_key] = mock_avg
            else:
                subject_scores[subject_key] = 0.0  # No attempts = 0
        
        # Calculate total score (sum of all subject scores)
        total_score = sum(subject_scores.values())
        
        # Calculate score for ranking (weighted combination)
        ranking_score = (
            (total_quizzes * 10) +
            (total_mock_tests * 20) +
            (average_score * 2) +
            (total_coins * 0.1) +
            (current_streak * 5)
        )
        
        leaderboard_data.append({
            'student': student,
            'score': ranking_score,  # For ranking/ordering
            'total_score': total_score,  # Sum of subject scores
            'subject_scores': subject_scores,  # Individual subject scores
            'total_quizzes': total_quizzes,
            'total_mock_tests': total_mock_tests,
            'average_score': average_score,
            'total_coins': total_coins,
            'current_streak': current_streak
        })
    
    # Sort by ranking_score descending (use total_score for tie-breaking)
    leaderboard_data.sort(key=lambda x: (x['score'], x['total_score']), reverse=True)
    
    # Update or create leaderboard entries
    print(f"   Updating {len(leaderboard_data)} leaderboard entries...")
    for rank, data in enumerate(leaderboard_data, start=1):
        # Store subject scores as JSON in a custom field (we'll add this to model or use JSONField)
        # For now, we'll calculate it on-the-fly in the API response
        entry, created = LeaderboardEntry.objects.update_or_create(
            student_id=data['student'],
            ranking_type=ranking_type,
            defaults={
                'rank': rank,
                'score': data['score'],
                'total_quizzes': data['total_quizzes'],
                'total_mock_tests': data['total_mock_tests'],
                'average_score': data['average_score'],
                'total_coins': data['total_coins'],
                'current_streak': data['current_streak']
            }
        )
        # Store subject scores temporarily in a dict that we'll pass to serializer
        entry._subject_scores = data['subject_scores']  # Temporary storage for API response
        entry._total_score = data['total_score']  # Store total score
        
        if created:
            print(f"   ✅ Created leaderboard entry for {data['student'].student_username} (rank {rank})")
        else:
            print(f"   🔄 Updated leaderboard entry for {data['student'].student_username} (rank {rank})")
    
    print(f"✅ Leaderboard calculation complete for {ranking_type}")


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def recalculate_leaderboard(request):
    """
    Manually trigger leaderboard recalculation for a specific ranking type
    Useful for admins or after significant data changes
    """
    try:
        ranking_type = request.data.get('type', 'overall')
        
        # Validate ranking type
        valid_types = ['overall', 'weekly', 'monthly']
        if ranking_type not in valid_types:
            return Response({
                'error': f'Invalid ranking type. Must be one of: {", ".join(valid_types)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate leaderboard
        calculate_leaderboard(ranking_type)
        
        return Response({
            'message': f'Leaderboard recalculated successfully for type: {ranking_type}',
            'ranking_type': ranking_type
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"Error in recalculate_leaderboard: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to recalculate leaderboard: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_teacher_profile(request):
    """
    Get teacher profile for the authenticated teacher user
    """
    try:
        user = request.user
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get teacher registration
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
        except TeacherRegistration.DoesNotExist:
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create teacher profile
        teacher_profile, created = TeacherProfile.objects.get_or_create(
            teacher_id=teacher_reg.teacher_id,
            defaults={
                'teacher_username': teacher_reg.teacher_username,
                'teacher_name': f"{teacher_reg.first_name} {teacher_reg.last_name}",
                'email': teacher_reg.email,
                'phone_number': teacher_reg.phone_number,
            }
        )
        
        # If profile was just created or missing basic info, update from registration
        if created or not teacher_profile.teacher_name or not teacher_profile.email:
            teacher_profile.teacher_username = teacher_reg.teacher_username
            if not teacher_profile.teacher_name:
                teacher_profile.teacher_name = f"{teacher_reg.first_name} {teacher_reg.last_name}"
            if not teacher_profile.email:
                teacher_profile.email = teacher_reg.email
            if not teacher_profile.phone_number:
                teacher_profile.phone_number = teacher_reg.phone_number
            teacher_profile.save()
        
        # Serialize and return
        serializer = TeacherProfileSerializer(teacher_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"Error in get_teacher_profile: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to fetch teacher profile: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def update_teacher_profile(request):
    """
    Update teacher profile for the authenticated teacher user
    """
    try:
        user = request.user
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get teacher registration
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
        except TeacherRegistration.DoesNotExist:
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create teacher profile
        teacher_profile, created = TeacherProfile.objects.get_or_create(
            teacher_id=teacher_reg.teacher_id,
            defaults={
                'teacher_username': teacher_reg.teacher_username,
                'teacher_name': f"{teacher_reg.first_name} {teacher_reg.last_name}",
                'email': teacher_reg.email,
                'phone_number': teacher_reg.phone_number,
            }
        )
        
        # Update profile with request data
        serializer = TeacherProfileSerializer(teacher_profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Teacher profile updated successfully',
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        import traceback
        print(f"Error in update_teacher_profile: {e}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to update teacher profile: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_teacher_students(request):
    """
    Get all students with their quiz and mock test scores for the authenticated teacher
    Calculates scores using the same logic as the student portal career page
    """
    try:
        user = request.user
        print(f"🔍 get_teacher_students called by user: {user.username}, role: {user.role}")
        
        # Check if user is a teacher
        if user.role != 'Teacher':
            print(f"❌ Access denied: User {user.username} is not a teacher (role: {user.role})")
            return Response({
                'error': 'Access denied. Only teacher users can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get teacher registration
        try:
            teacher_reg = TeacherRegistration.objects.get(teacher_username=user.username)
        except TeacherRegistration.DoesNotExist:
            print(f"❌ Teacher registration not found for user: {user.username}")
            return Response({
                'error': 'Teacher registration not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get teacher profile to get school
        teacher_school = None
        try:
            teacher_profile = TeacherProfile.objects.get(teacher_id=teacher_reg.teacher_id)
            teacher_school = teacher_profile.school
            # Clean the school name (strip whitespace, handle empty strings)
            if teacher_school:
                teacher_school = teacher_school.strip()
            print(f"🏫 Teacher {user.username} (ID: {teacher_reg.teacher_id}) is from school: '{teacher_school}'")
        except TeacherProfile.DoesNotExist:
            print(f"⚠️ Teacher profile not found for teacher_id: {teacher_reg.teacher_id}")
            return Response({
                'error': 'Teacher profile not found. Please complete your teacher profile setup.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Filter students by school if teacher has a school
        if teacher_school and teacher_school != '':
            # Get student IDs from StudentProfile that match the teacher's school (case-insensitive, trimmed)
            # Use __iexact for case-insensitive matching and handle whitespace
            student_profiles = StudentProfile.objects.filter(
                school__iexact=teacher_school
            ).exclude(school__isnull=True).exclude(school='')
            
            student_ids = [profile.student_id for profile in student_profiles]
            print(f"📋 Found {len(student_ids)} student profiles matching school '{teacher_school}'")
            
            # Debug: Print all student profiles to see what schools exist
            all_profiles = StudentProfile.objects.all()
            print(f"🔍 DEBUG: Total student profiles in database: {all_profiles.count()}")
            for profile in all_profiles[:10]:  # Print first 10 for debugging
                print(f"   Student ID {profile.student_id}: school='{profile.school}'")
            
            if student_ids:
                students = StudentRegistration.objects.filter(student_id__in=student_ids)
                print(f"📊 Found {students.count()} students from school '{teacher_school}' (student IDs: {student_ids})")
            else:
                # No students found with matching school
                students = StudentRegistration.objects.none()
                print(f"⚠️ No students found with school '{teacher_school}'")
                print(f"💡 Tip: Make sure students have StudentProfile records with matching school name")
        else:
            # If teacher has no school, return error (don't return all students)
            print(f"❌ Teacher has no school assigned (school='{teacher_school}')")
            return Response({
                'error': 'Teacher has no school assigned. Please update your teacher profile with a school name.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        students_data = []
        
        for student in students:
            try:
                # Get user info if available
                try:
                    user_obj = User.objects.get(username=student.student_username)
                    user_info = {
                        'firstname': user_obj.firstname,
                        'lastname': user_obj.lastname,
                        'email': user_obj.email
                    }
                except User.DoesNotExist:
                    user_info = {
                        'firstname': student.first_name,
                        'lastname': student.last_name,
                        'email': student.student_email or ''
                    }
                
                # Import quiz models
                from quizzes.models import QuizAttempt, MockTestAttempt
                
                # Get all quiz and mock test attempts for this student
                # Try both by object and by ID to ensure we find all attempts
                quiz_attempts = QuizAttempt.objects.filter(student_id=student.student_id)
                mock_test_attempts = MockTestAttempt.objects.filter(student_id=student.student_id)
                
                print(f"   📝 Student {student.student_username} (ID: {student.student_id}): {len(quiz_attempts)} quiz attempts, {len(mock_test_attempts)} mock test attempts")
                
                # Debug: Print attempt details
                if len(quiz_attempts) > 0:
                    for attempt in quiz_attempts:
                        print(f"      📊 Quiz attempt {attempt.attempt_id}: score={attempt.score}, total_questions={attempt.total_questions}, correct_answers={attempt.correct_answers}")
                if len(mock_test_attempts) > 0:
                    for attempt in mock_test_attempts:
                        print(f"      📊 Mock attempt {attempt.attempt_id}: score={attempt.score}, total_questions={attempt.total_questions}, correct_answers={attempt.correct_answers}")
                
                # Calculate quiz score: (total_correct_answers / total_questions_answered) * 100
                # Handle both new attempts (with total_questions/correct_answers) and old attempts (with only score)
                total_quiz_questions_answered = 0
                total_quiz_correct_answers = 0
                quiz_scores_from_field = []
                
                for attempt in quiz_attempts:
                    # New format: has total_questions and correct_answers
                    if attempt.total_questions and attempt.total_questions > 0:
                        total_quiz_questions_answered += attempt.total_questions
                        if attempt.correct_answers is not None:
                            total_quiz_correct_answers += attempt.correct_answers
                        print(f"      ✅ Using new format: total_q={attempt.total_questions}, correct={attempt.correct_answers}")
                    # Old format: only has score, assume 10 questions per quiz (standard quiz size)
                    elif attempt.score is not None and attempt.score >= 0:
                        # For old attempts, score is typically the number of correct answers out of 10
                        quiz_scores_from_field.append(attempt.score)
                        # Assume 10 questions if not specified
                        total_quiz_questions_answered += 10
                        total_quiz_correct_answers += attempt.score
                        print(f"      ✅ Using old format: score={attempt.score}, assuming 10 questions")
                    else:
                        print(f"      ⚠️ Skipping attempt {attempt.attempt_id}: no usable data")
                
                quiz_score = None
                if total_quiz_questions_answered > 0:
                    quiz_percentage = (total_quiz_correct_answers / total_quiz_questions_answered) * 100
                    quiz_score = round(quiz_percentage, 1)
                    print(f"      📈 Calculated quiz_score: ({total_quiz_correct_answers}/{total_quiz_questions_answered}) * 100 = {quiz_score}%")
                elif quiz_scores_from_field:
                    # Fallback: if we only have scores, calculate percentage assuming 10 questions per quiz
                    avg_score = sum(quiz_scores_from_field) / len(quiz_scores_from_field)
                    quiz_score = round((avg_score / 10) * 100, 1)
                    print(f"      📈 Calculated quiz_score from avg: ({avg_score}/10) * 100 = {quiz_score}%")
                else:
                    print(f"      ⚠️ No quiz score calculated: total_q={total_quiz_questions_answered}, scores={quiz_scores_from_field}")
                
                # Calculate mock test score: (mock_test_correct_answers / mock_test_questions_answered) * 100
                # Handle both new attempts (with total_questions/correct_answers) and old attempts (with only score)
                total_mock_test_questions_answered = 0
                total_mock_test_correct_answers = 0
                mock_scores_from_field = []
                
                for attempt in mock_test_attempts:
                    # New format: has total_questions and correct_answers
                    if attempt.total_questions and attempt.total_questions > 0:
                        total_mock_test_questions_answered += attempt.total_questions
                        if attempt.correct_answers is not None:
                            total_mock_test_correct_answers += attempt.correct_answers
                    # Old format: only has score, assume 50 questions per mock test (standard mock test size)
                    elif attempt.score is not None and attempt.score >= 0:
                        # For old attempts, score is typically the number of correct answers out of 50
                        mock_scores_from_field.append(attempt.score)
                        # Assume 50 questions if not specified
                        total_mock_test_questions_answered += 50
                        total_mock_test_correct_answers += attempt.score
                
                mock_score = None
                if total_mock_test_questions_answered > 0:
                    mock_percentage = (total_mock_test_correct_answers / total_mock_test_questions_answered) * 100
                    mock_score = round(mock_percentage, 1)
                elif mock_scores_from_field:
                    # Fallback: if we only have scores, calculate percentage assuming 50 questions per mock test
                    avg_score = sum(mock_scores_from_field) / len(mock_scores_from_field)
                    mock_score = round((avg_score / 50) * 100, 1)
                
                # Calculate average score: (quiz_score + mock_score) / 2
                average_score = None
                valid_scores = []
                if quiz_score is not None:
                    valid_scores.append(quiz_score)
                if mock_score is not None:
                    valid_scores.append(mock_score)
                
                if valid_scores:
                    average_score = round(sum(valid_scores) / len(valid_scores), 1)
                
                print(f"   ✅ Student {student.student_username} scores: quiz={quiz_score}, mock={mock_score}, avg={average_score}")
                
                # Get completion dates (latest attempt dates)
                quiz_completion_date = None
                if quiz_attempts.exists():
                    latest_quiz = quiz_attempts.order_by('-attempted_at').first()
                    if latest_quiz and latest_quiz.attempted_at:
                        quiz_completion_date = latest_quiz.attempted_at.strftime('%Y-%m-%d')
                
                mock_completion_date = None
                if mock_test_attempts.exists():
                    latest_mock = mock_test_attempts.order_by('-attempted_at').first()
                    if latest_mock and latest_mock.attempted_at:
                        mock_completion_date = latest_mock.attempted_at.strftime('%Y-%m-%d')
                
                # Calculate real time spent (from time_taken_seconds)
                total_quiz_time_seconds = sum(a.time_taken_seconds or 0 for a in quiz_attempts)
                total_mock_time_seconds = sum(a.time_taken_seconds or 0 for a in mock_test_attempts)
                total_quiz_time_minutes = int(total_quiz_time_seconds / 60)
                total_mock_time_minutes = int(total_mock_time_seconds / 60)
                
                # Calculate subject-wise performance - ALWAYS include all 5 subjects
                subject_performance = {}
                subject_mapping = {
                    'mathematics': ['mathematics', 'math', 'maths', 'Mathematics', 'Math', 'MATHS'],
                    'english': ['english', 'English', 'ENGLISH'],
                    'science': ['science', 'Science', 'SCIENCE'],
                    'social': ['social', 'social studies', 'Social', 'Social Studies', 'SOCIAL'],
                    'computer': ['computer', 'computers', 'Computer', 'Computers', 'COMPUTER', 'COMPUTERS']
                }
                
                # Always process all 5 subjects
                for subject_key, subject_variants in subject_mapping.items():
                    # Get quiz attempts for this subject (case-insensitive matching)
                    subject_quiz_attempts = []
                    for attempt in quiz_attempts:
                        if attempt.subject:
                            attempt_subject_lower = attempt.subject.strip().lower()
                            if any(variant.lower() == attempt_subject_lower for variant in subject_variants):
                                subject_quiz_attempts.append(attempt)
                    
                    # Get mock test attempts for this subject (case-insensitive matching)
                    subject_mock_attempts = []
                    for attempt in mock_test_attempts:
                        if attempt.subject:
                            attempt_subject_lower = attempt.subject.strip().lower()
                            if any(variant.lower() == attempt_subject_lower for variant in subject_variants):
                                subject_mock_attempts.append(attempt)
                    
                    # Calculate subject quiz score
                    subject_quiz_total_q = sum(a.total_questions or 0 for a in subject_quiz_attempts)
                    subject_quiz_total_correct = sum(a.correct_answers or 0 for a in subject_quiz_attempts)
                    subject_quiz_score = None
                    if subject_quiz_total_q > 0:
                        subject_quiz_score = round((subject_quiz_total_correct / subject_quiz_total_q) * 100, 1)
                    
                    # Calculate subject mock score
                    subject_mock_total_q = sum(a.total_questions or 0 for a in subject_mock_attempts)
                    subject_mock_total_correct = sum(a.correct_answers or 0 for a in subject_mock_attempts)
                    subject_mock_score = None
                    if subject_mock_total_q > 0:
                        subject_mock_score = round((subject_mock_total_correct / subject_mock_total_q) * 100, 1)
                    
                    # Calculate real time spent from attempts
                    subject_quiz_time = sum(a.time_taken_seconds or 0 for a in subject_quiz_attempts)
                    subject_mock_time = sum(a.time_taken_seconds or 0 for a in subject_mock_attempts)
                    total_time_minutes = int((subject_quiz_time + subject_mock_time) / 60)
                    
                    # Calculate overall subject score (average of quiz and mock if both exist)
                    subject_average = None
                    if subject_quiz_score is not None and subject_mock_score is not None:
                        subject_average = round((subject_quiz_score + subject_mock_score) / 2, 1)
                    elif subject_quiz_score is not None:
                        subject_average = subject_quiz_score
                    elif subject_mock_score is not None:
                        subject_average = subject_mock_score
                    
                    # ALWAYS include the subject, even if no data (for UI consistency)
                    subject_performance[subject_key] = {
                        'score': subject_average,
                        'quiz_score': subject_quiz_score,
                        'mock_score': subject_mock_score,
                        'time_minutes': total_time_minutes,
                        'status': 'Complete' if subject_average is not None else 'Pending',
                        'quiz_attempts': len(subject_quiz_attempts),
                        'mock_attempts': len(subject_mock_attempts)
                    }
                
                student_data = {
                    'student_id': student.student_id,
                    'student_username': student.student_username,
                    'first_name': student.first_name,
                    'last_name': student.last_name,
                    'student_email': student.student_email,
                    'user_info': user_info,
                    'quiz_score': quiz_score,
                    'mock_score': mock_score,
                    'average_score': average_score,
                    'quiz_attempts_count': len(quiz_attempts),
                    'mock_attempts_count': len(mock_test_attempts),
                    'quiz_completion_date': quiz_completion_date,
                    'mock_completion_date': mock_completion_date,
                    'quiz_time_minutes': total_quiz_time_minutes,
                    'mock_time_minutes': total_mock_time_minutes,
                    'subject_performance': subject_performance
                }
                
                students_data.append(student_data)
                
            except Exception as e:
                print(f"❌ Error processing student {student.student_id}: {str(e)}")
                import traceback
                traceback.print_exc()
                # Continue with other students even if one fails
                continue
        
        print(f"✅ Returning {len(students_data)} students with scores")
        
        # Debug: Print summary of scores being returned
        for student_data in students_data:
            print(f"   📤 Returning student {student_data['student_id']}: quiz_score={student_data.get('quiz_score')}, mock_score={student_data.get('mock_score')}, avg_score={student_data.get('average_score')}")
        
        return Response({
            'students': students_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in get_teacher_students: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Failed to fetch teacher students: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
