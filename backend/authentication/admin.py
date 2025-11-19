from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Student, Parent, Teacher, PasswordResetToken,
    UserBadge, UserStreak, DailyActivity, LeaderboardEntry
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin configuration for custom User model
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address', 'profile_picture')}),
        ('Role & Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """
    Admin configuration for Student model
    """
    list_display = ('user', 'grade', 'roll_number', 'parent', 'admission_date')
    list_filter = ('grade', 'admission_date')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'roll_number')
    raw_id_fields = ('user', 'parent')


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    """
    Admin configuration for Parent model
    """
    list_display = ('user', 'occupation', 'workplace', 'relationship_with_student')
    list_filter = ('occupation', 'relationship_with_student')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    raw_id_fields = ('user',)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    """
    Admin configuration for Teacher model
    """
    list_display = ('user', 'employee_id', 'department', 'experience_years')
    list_filter = ('department', 'experience_years')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'employee_id')
    raw_id_fields = ('user',)
    filter_horizontal = ('subjects',)


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """
    Admin configuration for PasswordResetToken model
    """
    list_display = ('user', 'token', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__username', 'user__email', 'token')
    readonly_fields = ('token', 'created_at')


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    """
    Admin configuration for UserBadge model
    """
    list_display = ('student_id', 'badge_type', 'badge_title', 'earned_at', 'is_active')
    list_filter = ('badge_type', 'is_active', 'earned_at')
    search_fields = ('student_id__student_username', 'badge_title', 'badge_type')
    readonly_fields = ('earned_at',)


@admin.register(UserStreak)
class UserStreakAdmin(admin.ModelAdmin):
    """
    Admin configuration for UserStreak model
    """
    list_display = ('student_id', 'current_streak', 'longest_streak', 'last_activity_date', 'total_days_active')
    list_filter = ('last_activity_date',)
    search_fields = ('student_id__student_username',)
    readonly_fields = ('updated_at',)


@admin.register(DailyActivity)
class DailyActivityAdmin(admin.ModelAdmin):
    """
    Admin configuration for DailyActivity model
    """
    list_display = ('student_id', 'activity_date', 'quizzes_completed', 'mock_tests_completed', 'coins_earned')
    list_filter = ('activity_date',)
    search_fields = ('student_id__student_username',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    """
    Admin configuration for LeaderboardEntry model
    """
    list_display = ('student_id', 'ranking_type', 'rank', 'score', 'calculated_at')
    list_filter = ('ranking_type', 'calculated_at')
    search_fields = ('student_id__student_username', 'ranking_type')
    readonly_fields = ('calculated_at',)
