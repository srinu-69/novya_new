from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from .models import (
    User, Student, Parent, PasswordResetToken, 
    ParentRegistration, StudentRegistration, ParentStudentMapping, StudentProfile,
    CoinTransaction, UserCoinBalance, StudentFeedback
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'userid', 'username', 'email', 'firstname', 'lastname', 'full_name',
            'role', 'phonenumber', 'createdat'
        ]
        read_only_fields = ['userid', 'createdat']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'firstname', 'lastname', 'password',
            'confirm_password', 'role', 'phonenumber'
        ]
        extra_kwargs = {
            'username': {'validators': []},  # Disable default unique validator
            'email': {'validators': []},     # Disable default unique validator
            'phonenumber': {'validators': []}  # Disable default unique validator
        }
    
    def validate_phonenumber(self, value):
        """
        Validate that phone number is not already registered in any table
        """
        print(f"🔍 Validating phonenumber: {value}")
        if not value:
            print(f"  ⚠️ Empty phone number, skipping validation")
            return value
        
        # Normalize phone number: remove spaces, dashes, parentheses for comparison
        # Also handle +91 prefix - extract just the digits
        normalized_input = value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
        # If it starts with 91 and has 12 digits, remove the country code
        if normalized_input.startswith('91') and len(normalized_input) == 12:
            normalized_input = normalized_input[2:]
        # If it's just 10 digits, keep it as is
        elif len(normalized_input) == 10:
            normalized_input = normalized_input
        
        # Helper function to normalize phone numbers for comparison
        def normalize_phone(phone):
            if not phone:
                return ''
            normalized = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
            # Remove country code if present (91 for India)
            if normalized.startswith('91') and len(normalized) == 12:
                normalized = normalized[2:]
            return normalized
        
        # Check User table - exact match and normalized match
        user_count = User.objects.exclude(phonenumber__isnull=True).exclude(phonenumber='').count()
        print(f"  📊 Checking User table (total users with phone: {user_count})")
        user_phones = User.objects.exclude(phonenumber__isnull=True).exclude(phonenumber='').values_list('phonenumber', flat=True)
        for phone in user_phones:
            if phone == value:
                print(f"  ❌ Phone found in User table (exact match): {phone}")
                raise serializers.ValidationError("Phone number already registered. Please use a different number.")
            # Normalize stored phone for comparison
            stored_normalized = normalize_phone(phone)
            if stored_normalized == normalized_input:
                print(f"  ❌ Phone found in User table (normalized match): {phone} -> {stored_normalized}")
                raise serializers.ValidationError("Phone number already registered. Please use a different number.")
        
        # Check ParentRegistration table - exact match and normalized match
        parent_count = ParentRegistration.objects.exclude(phone_number__isnull=True).exclude(phone_number='').count()
        print(f"  📊 Checking ParentRegistration table (total with phone: {parent_count})")
        parent_phones = ParentRegistration.objects.exclude(phone_number__isnull=True).exclude(phone_number='').values_list('phone_number', flat=True)
        for phone in parent_phones:
            if phone == value:
                print(f"  ❌ Phone found in ParentRegistration table (exact match): {phone}")
                raise serializers.ValidationError("Phone number already registered. Please use a different number.")
            # Normalize stored phone for comparison
            stored_normalized = normalize_phone(phone)
            if stored_normalized == normalized_input:
                print(f"  ❌ Phone found in ParentRegistration table (normalized match): {phone} -> {stored_normalized}")
                raise serializers.ValidationError("Phone number already registered. Please use a different number.")
        
        # Check StudentRegistration table - exact match and normalized match
        student_count = StudentRegistration.objects.exclude(phone_number__isnull=True).exclude(phone_number='').count()
        print(f"  📊 Checking StudentRegistration table (total with phone: {student_count})")
        student_phones = StudentRegistration.objects.exclude(phone_number__isnull=True).exclude(phone_number='').values_list('phone_number', flat=True)
        for phone in student_phones:
            if phone == value:
                print(f"  ❌ Phone found in StudentRegistration table (exact match): {phone}")
                raise serializers.ValidationError("Phone number already registered. Please use a different number.")
            # Normalize stored phone for comparison
            stored_normalized = normalize_phone(phone)
            if stored_normalized == normalized_input:
                print(f"  ❌ Phone found in StudentRegistration table (normalized match): {phone} -> {stored_normalized}")
                raise serializers.ValidationError("Phone number already registered. Please use a different number.")
        
        print(f"  ✅ Phone validation passed!")
        return value
    
    def validate_username(self, value):
        """
        Validate that username is not already registered in any table
        """
        print(f"🔍 Validating username: {value}")
        
        # Check User table
        user_exists = User.objects.filter(username=value).exists()
        print(f"  📊 User table check: {user_exists} (count: {User.objects.filter(username=value).count()})")
        if user_exists:
            print(f"  ❌ Username found in User table!")
            raise serializers.ValidationError("Username already exists. Please choose a different username.")
        
        # Check ParentRegistration table
        parent_exists = ParentRegistration.objects.filter(parent_username=value).exists()
        print(f"  📊 ParentRegistration table check: {parent_exists} (count: {ParentRegistration.objects.filter(parent_username=value).count()})")
        if parent_exists:
            print(f"  ❌ Username found in ParentRegistration table!")
            raise serializers.ValidationError("Username already exists. Please choose a different username.")
        
        # Check StudentRegistration table
        student_exists = StudentRegistration.objects.filter(student_username=value).exists()
        print(f"  📊 StudentRegistration table check: {student_exists} (count: {StudentRegistration.objects.filter(student_username=value).count()})")
        if student_exists:
            print(f"  ❌ Username found in StudentRegistration table!")
            raise serializers.ValidationError("Username already exists. Please choose a different username.")
        
        print(f"  ✅ Username validation passed!")
        return value
    
    def validate_email(self, value):
        """
        Validate that email is not already registered in any table
        """
        print(f"🔍 Validating email: {value}")
        
        # Check User table
        user_exists = User.objects.filter(email=value).exists()
        print(f"  📊 User table check: {user_exists} (count: {User.objects.filter(email=value).count()})")
        if user_exists:
            print(f"  ❌ Email found in User table!")
            raise serializers.ValidationError("Email already registered. Please use a different email.")
        
        # Check ParentRegistration table
        parent_exists = ParentRegistration.objects.filter(email=value).exists()
        print(f"  📊 ParentRegistration table check: {parent_exists} (count: {ParentRegistration.objects.filter(email=value).count()})")
        if parent_exists:
            print(f"  ❌ Email found in ParentRegistration table!")
            raise serializers.ValidationError("Email already registered. Please use a different email.")
        
        # Check StudentRegistration table
        student_exists = StudentRegistration.objects.filter(student_email=value).exists()
        print(f"  📊 StudentRegistration table check: {student_exists} (count: {StudentRegistration.objects.filter(student_email=value).count()})")
        if student_exists:
            print(f"  ❌ Email found in StudentRegistration table!")
            raise serializers.ValidationError("Email already registered. Please use a different email.")
        
        print(f"  ✅ Email validation passed!")
        return value
    
    def validate(self, attrs):
        """
        Run our cross-table validation BEFORE Django's model validation.
        This method runs AFTER field validation but BEFORE create(),
        so we can catch conflicts early with better error messages.
        """
        print(f"🔍 Running validate() method - checking all tables for conflicts")
        
        # Get values from attrs
        username = attrs.get('username')
        email = attrs.get('email')
        
        # Check username across all tables FIRST
        if username:
            print(f"  🔍 Checking username '{username}' across all tables:")
            if User.objects.filter(username=username).exists():
                print(f"    ❌ Username found in User table!")
                raise serializers.ValidationError({
                    'username': ['Username already exists. Please choose a different username.']
                })
            if ParentRegistration.objects.filter(parent_username=username).exists():
                print(f"    ❌ Username found in ParentRegistration table!")
                raise serializers.ValidationError({
                    'username': ['Username already exists. Please choose a different username.']
                })
            if StudentRegistration.objects.filter(student_username=username).exists():
                print(f"    ❌ Username found in StudentRegistration table!")
                raise serializers.ValidationError({
                    'username': ['Username already exists. Please choose a different username.']
                })
            print(f"    ✅ Username not found in any table")
        
        # Check email across all tables
        if email:
            print(f"  🔍 Checking email '{email}' across all tables:")
            if User.objects.filter(email=email).exists():
                print(f"    ❌ Email found in User table!")
                raise serializers.ValidationError({
                    'email': ['Email already registered. Please use a different email.']
                })
            if ParentRegistration.objects.filter(email=email).exists():
                print(f"    ❌ Email found in ParentRegistration table!")
                raise serializers.ValidationError({
                    'email': ['Email already registered. Please use a different email.']
                })
            if StudentRegistration.objects.filter(student_email=email).exists():
                print(f"    ❌ Email found in StudentRegistration table!")
                raise serializers.ValidationError({
                    'email': ['Email already registered. Please use a different email.']
                })
            print(f"    ✅ Email not found in any table")
        
        # Password confirmation check
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({
                'password': ["Passwords don't match"]
            })
        
        print(f"  ✅ All validations passed in validate() method!")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except IntegrityError as e:
            # Catch database constraint errors and provide better error messages
            error_str = str(e)
            print(f"❌ IntegrityError caught: {error_str}")
            
            # Check the error message to identify which field caused the constraint violation
            if 'phonenumber' in error_str.lower() or 'phone' in error_str.lower():
                print(f"  🔍 Phone number conflict detected in database")
                raise serializers.ValidationError({
                    'phonenumber': ['Phone number already registered. Please use a different number.']
                })
            elif 'username' in error_str.lower() or 'unique constraint' in error_str.lower():
                print(f"  🔍 Username conflict detected in database")
                # Check which table has the username
                username = validated_data.get('username')
                if username:
                    print(f"  📊 Checking username '{username}' in all tables:")
                    print(f"    - User table: {User.objects.filter(username=username).exists()}")
                    print(f"    - ParentRegistration: {ParentRegistration.objects.filter(parent_username=username).exists()}")
                    print(f"    - StudentRegistration: {StudentRegistration.objects.filter(student_username=username).exists()}")
                raise serializers.ValidationError({
                    'username': ['Username already exists. Please choose a different username.']
                })
            elif 'email' in error_str.lower():
                print(f"  🔍 Email conflict detected in database")
                # Check which table has the email
                email = validated_data.get('email')
                if email:
                    print(f"  📊 Checking email '{email}' in all tables:")
                    print(f"    - User table: {User.objects.filter(email=email).exists()}")
                    print(f"    - ParentRegistration: {ParentRegistration.objects.filter(email=email).exists()}")
                    print(f"    - StudentRegistration: {StudentRegistration.objects.filter(student_email=email).exists()}")
                raise serializers.ValidationError({
                    'email': ['Email already registered. Please use a different email.']
                })
            else:
                # Generic integrity error - try to parse the error message
                print(f"  ⚠️ Unknown integrity error format: {error_str}")
                raise serializers.ValidationError({
                    'non_field_errors': ['Registration failed. This user may already exist.']
                })
        except Exception as e:
            # Catch any other unexpected errors
            error_str = str(e)
            raise serializers.ValidationError({
                'non_field_errors': [f'Registration failed: {error_str}']
            })


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change
    """
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect')
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for password reset request
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email address')
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation
    """
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for Student model
    """
    student_name = serializers.SerializerMethodField()
    class_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'student', 'class_field', 'parent', 'student_name', 'class_name'
        ]
        read_only_fields = ['student']
    
    def get_student_name(self, obj):
        return f"{obj.student.firstname} {obj.student.lastname}"
    
    def get_class_name(self, obj):
        return obj.class_field.class_name if obj.class_field else None


class ParentSerializer(serializers.ModelSerializer):
    """
    Serializer for Parent model
    """
    parent_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Parent
        fields = [
            'parent', 'parent_name'
        ]
        read_only_fields = ['parent']
    
    def get_parent_name(self, obj):
        return f"{obj.parent.firstname} {obj.parent.lastname}"




class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for profile updates
    """
    class Meta:
        model = User
        fields = [
            'firstname', 'lastname', 'email', 'phonenumber'
        ]
    
    def update(self, instance, validated_data):
        # Handle profile picture upload
        if 'profile_picture' in validated_data:
            if instance.profile_picture:
                instance.profile_picture.delete(save=False)
        return super().update(instance, validated_data)


# New serializers for the updated schema

class ParentRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for Parent Registration
    """
    class Meta:
        model = ParentRegistration
        fields = [
            'parent_id', 'email', 'first_name', 'last_name', 
            'phone_number', 'parent_username', 'parent_password', 'created_at'
        ]
        read_only_fields = ['parent_id', 'created_at']
        extra_kwargs = {
            'parent_password': {'write_only': True}
        }


class StudentRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for Student Registration
    """
    class Meta:
        model = StudentRegistration
        fields = [
            'student_id', 'first_name', 'last_name', 'phone_number',
            'student_username', 'student_email', 'parent_email', 'created_at'
        ]
        read_only_fields = ['student_id', 'created_at']


class ParentStudentMappingSerializer(serializers.ModelSerializer):
    """
    Serializer for Parent-Student Mapping
    """
    parent_email = serializers.EmailField()
    student_id = serializers.IntegerField()
    
    class Meta:
        model = ParentStudentMapping
        fields = ['mapping_id', 'parent_email', 'student_id']
        read_only_fields = ['mapping_id']


class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Student Profile
    """
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentProfile
        fields = [
            'profile_id', 'student_id', 'student_username', 'parent_email',
            'grade', 'school', 'course_id', 'address', 'updated_at', 'student_name',
            'gender', 'date_of_birth', 'subjects', 'class_teacher', 'progress', 'parent_name'
        ]
        read_only_fields = ['profile_id', 'updated_at']
    
    def get_student_name(self, obj):
        try:
            student = StudentRegistration.objects.get(student_id=obj.student_id)
            return f"{student.first_name} {student.last_name}"
        except StudentRegistration.DoesNotExist:
            return "Unknown Student"


class ParentRegistrationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating parent registration
    """
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = ParentRegistration
        fields = [
            'email', 'first_name', 'last_name', 'phone_number',
            'parent_username', 'parent_password', 'confirm_password'
        ]
        extra_kwargs = {
            'parent_password': {'write_only': True}
        }
    
    def validate(self, attrs):
        if attrs['parent_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # Hash the password
        from django.contrib.auth.hashers import make_password
        validated_data['parent_password'] = make_password(validated_data['parent_password'])
        return ParentRegistration.objects.create(**validated_data)


class StudentRegistrationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating student registration
    """
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = StudentRegistration
        fields = [
            'first_name', 'last_name', 'phone_number',
            'student_username', 'student_email', 'parent_email',
            'password', 'confirm_password'
        ]
    
    def to_internal_value(self, data):
        """Override to handle phone number conflicts before validation"""
        # Handle phone number conflicts
        if 'phone_number' in data:
            phone_number = data['phone_number']
            if StudentRegistration.objects.filter(phone_number=phone_number).exists():
                # Generate a unique phone number by modifying the last digit
                base_phone = phone_number[:-1]  # Remove last digit
                last_digit = int(phone_number[-1])
                counter = 1
                while StudentRegistration.objects.filter(phone_number=f"{base_phone}{(last_digit + counter) % 10}").exists():
                    counter += 1
                data['phone_number'] = f"{base_phone}{(last_digit + counter) % 10}"
                print(f"Warning: Phone number conflict resolved by using: {data['phone_number']}")
        
        return super().to_internal_value(data)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Check if parent exists
        try:
            ParentRegistration.objects.get(email=validated_data['parent_email'])
        except ParentRegistration.DoesNotExist:
            raise serializers.ValidationError("Parent with this email does not exist")
        
        # Remove password fields from validated_data before creating StudentRegistration
        validated_data.pop('password')
        validated_data.pop('confirm_password')
        
        return StudentRegistration.objects.create(**validated_data)


class CoinTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for Coin Transaction
    """
    student_username = serializers.CharField(source='student_id.student_username', read_only=True)
    
    class Meta:
        model = CoinTransaction
        fields = [
            'transaction_id', 'student_id', 'student_username', 'coins', 
            'transaction_type', 'source', 'reason', 'reference_id', 
            'reference_type', 'metadata', 'balance_after', 'created_at'
        ]
        read_only_fields = ['transaction_id', 'created_at']


class AddCoinTransactionSerializer(serializers.Serializer):
    """
    Serializer for adding coin transactions
    Positive values = earn coins, Negative values = spend/deduct coins
    """
    coins = serializers.IntegerField()  # Allow negative values for deductions
    source = serializers.CharField(max_length=50)  # 'login', 'quiz', 'mock_test', 'spin_wheel', etc.
    reason = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    reference_id = serializers.IntegerField(required=False, allow_null=True)
    reference_type = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    metadata = serializers.JSONField(required=False, allow_null=True)


class UserCoinBalanceSerializer(serializers.ModelSerializer):
    """
    Serializer for User Coin Balance
    """
    student_username = serializers.CharField(source='student_id.student_username', read_only=True)
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserCoinBalance
        fields = [
            'balance_id', 'student_id', 'student_username', 'student_name',
            'total_coins', 'total_earned', 'total_spent', 
            'last_transaction_at', 'updated_at'
        ]
        read_only_fields = ['balance_id', 'updated_at']
    
    def get_student_name(self, obj):
        try:
            return f"{obj.student_id.first_name} {obj.student_id.last_name}"
        except:
            return "Unknown"


class StudentFeedbackSerializer(serializers.ModelSerializer):
    """
    Serializer for Student Feedback
    """
    student_username = serializers.CharField(source='student_id.student_username', read_only=True)
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentFeedback
        fields = [
            'feedback_id', 'student_id', 'student_username', 'student_name',
            'rating', 'comment', 'coins_awarded', 'reward_received',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['feedback_id', 'coins_awarded', 'reward_received', 'created_at', 'updated_at']
    
    def get_student_name(self, obj):
        try:
            return f"{obj.student_id.first_name} {obj.student_id.last_name}"
        except:
            return "Unknown"


class StudentFeedbackCreateSerializer(serializers.Serializer):
    """
    Serializer for creating student feedback
    """
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000, allow_blank=True)
