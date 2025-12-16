"""
Test script to verify student registration is working
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from authentication.models import StudentRegistration
from authentication.serializers import StudentRegistrationCreateSerializer

# Test data
test_data = {
    'first_name': 'Test',
    'last_name': 'Student',
    'student_username': 'testuser123',
    'student_email': 'test@test.com',
    'phone_number': '1234567890',
    'grade': '5',
    'school': 'Test School',
    'password': 'testpass123',
    'confirm_password': 'testpass123'
}

print("=" * 60)
print("Testing Student Registration")
print("=" * 60)

serializer = StudentRegistrationCreateSerializer(data=test_data)
print(f"\n📋 Test data: {test_data}")
print(f"\n✅ Is valid: {serializer.is_valid()}")

if not serializer.is_valid():
    print(f"❌ Validation errors: {serializer.errors}")
else:
    print("✅ Validation passed!")
    try:
        student = serializer.save()
        print(f"✅ Student created successfully!")
        print(f"   Student ID: {student.student_id}")
        print(f"   Username: {student.student_username}")
        print(f"   Status: {student.status}")
        
        # Verify it's in the database
        db_student = StudentRegistration.objects.get(student_id=student.student_id)
        print(f"✅ Verified in database: {db_student.student_username}")
        
        # Clean up test data
        db_student.delete()
        print(f"✅ Test data cleaned up")
        
    except Exception as e:
        print(f"❌ Error creating student: {e}")
        import traceback
        traceback.print_exc()

print("\n" + "=" * 60)

