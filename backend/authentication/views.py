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
from datetime import datetime, timedelta
import uuid

from .models import (
    User, Student, Parent, PasswordResetToken,
    ParentRegistration, StudentRegistration, ParentStudentMapping, StudentProfile,
    CoinTransaction, UserCoinBalance, StudentFeedback
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    PasswordChangeSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, StudentSerializer, ParentSerializer,
    ProfileUpdateSerializer, ParentRegistrationSerializer, StudentRegistrationSerializer,
    ParentStudentMappingSerializer, StudentProfileSerializer,
    ParentRegistrationCreateSerializer, StudentRegistrationCreateSerializer,
    CoinTransactionSerializer, AddCoinTransactionSerializer, UserCoinBalanceSerializer,
    StudentFeedbackSerializer, StudentFeedbackCreateSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view that includes user data in response
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Get user data
            username = request.data.get('username')
            user = User.objects.get(username=username)
            user_data = UserSerializer(user).data
            
            # Add user data to response
            response.data['user'] = user_data
            
            # Add role-specific data (optional - don't fail if profile doesn't exist)
            try:
                if user.role == 'Student' and hasattr(user, 'student'):
                    response.data['student_profile'] = StudentSerializer(user.student).data
                elif user.role == 'Parent' and hasattr(user, 'parent'):
                    response.data['parent_profile'] = ParentSerializer(user.parent).data
            except Exception as e:
                # Profile doesn't exist yet - that's okay for now
                pass
        
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
@permission_classes([permissions.AllowAny])  # Changed to AllowAny for testing
def get_students(request):
    """
    Get all students
    """
    students = StudentRegistration.objects.all()
    serializer = StudentRegistrationSerializer(students, many=True)
    return Response(serializer.data)


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
        
        # Get student profile data
        try:
            student_profile = StudentProfile.objects.get(student_id=student_registration.student_id)
            profile_data = {
                'student_username': student_profile.student_username,
                'parent_email': student_profile.parent_email,
                'grade': student_profile.grade,
                'school': student_profile.school,
                'address': student_profile.address
            }
        except StudentProfile.DoesNotExist:
            profile_data = {
                'student_username': '',
                'parent_email': '',
                'grade': '',
                'school': '',
                'address': ''
            }
        
        # Get parent details automatically if parent_email exists
        parent_details = {}
        if student_registration.parent_email and student_registration.parent_email != 'no-parent@example.com':
            try:
                parent_registration = ParentRegistration.objects.get(email=student_registration.parent_email)
                parent_details = {
                    'parent_name': f"{parent_registration.first_name} {parent_registration.last_name}",
                    'parent_email': parent_registration.email,
                    'parent_phone': parent_registration.phone_number
                }
            except ParentRegistration.DoesNotExist:
                parent_details = {
                    'parent_name': 'Not provided',
                    'parent_email': 'Not provided',
                    'parent_phone': 'Not provided'
                }
        else:
            parent_details = {
                'parent_name': 'Not provided',
                'parent_email': 'Not provided',
                'parent_phone': 'Not provided'
            }
        
        # Prepare user data
        if user.is_authenticated:
            user_data = {
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.email,
                'phonenumber': user.phonenumber,
                'username': user.username
            }
        else:
            # Use student registration data for unauthenticated requests
            user_data = {
                'firstname': student_registration.first_name,
                'lastname': student_registration.last_name,
                'email': student_registration.student_email,
                'phonenumber': student_registration.phone_number,
                'username': student_registration.student_username
            }
        
        return Response({
            'user': user_data,
            'student_registration': {
                'first_name': student_registration.first_name,
                'last_name': student_registration.last_name,
                'phone_number': student_registration.phone_number,
                'student_email': student_registration.student_email,
                'student_username': student_registration.student_username,
                'parent_email': student_registration.parent_email
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
