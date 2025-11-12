#!/usr/bin/env python3
"""
Quick verification script to check if AI assistant data is being saved
Run this after testing the frontend to verify end-to-end functionality
"""

import sys
import os

# Add Django project path
sys.path.append('backend')

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from ai_assistant.models import AIStudyPlan, AIGeneratedNote, ManualNote, AIChatHistory

User = get_user_model()

def verify_e2e():
    """Verify end-to-end functionality"""
    print("🔍 Verifying AI Assistant End-to-End Functionality")
    print("=" * 60)
    
    # Get all users with AI assistant data
    users_with_data = User.objects.filter(
        ai_study_plans__isnull=False
    ).distinct() | User.objects.filter(
        ai_generated_notes__isnull=False
    ).distinct() | User.objects.filter(
        manual_notes__isnull=False
    ).distinct() | User.objects.filter(
        ai_chat_history__isnull=False
    ).distinct()
    
    if not users_with_data.exists():
        print("⚠️  No AI assistant data found yet.")
        print("   Please test the frontend first by:")
        print("   1. Login as a student")
        print("   2. Go to Classroom > Select Class > Subject > Lesson")
        print("   3. Use the AI Assistant to ask questions")
        print("   4. Create manual notes")
        return
    
    print(f"👥 Found {users_with_data.count()} user(s) with AI assistant data\n")
    
    for user in users_with_data:
        study_plans = AIStudyPlan.objects.filter(student_id=user.userid).count()
        ai_notes = AIGeneratedNote.objects.filter(student_id=user.userid).count()
        manual_notes = ManualNote.objects.filter(student_id=user.userid).count()
        chat_history = AIChatHistory.objects.filter(student_id=user.userid).count()
        
        print(f"👤 User: {user.username} ({user.firstname} {user.lastname})")
        print(f"   📚 Study Plans: {study_plans}")
        print(f"   📝 AI Notes: {ai_notes}")
        print(f"   ✏️  Manual Notes: {manual_notes}")
        print(f"   💬 Chat History: {chat_history}")
        
        # Show most recent items
        if study_plans > 0:
            latest_plan = AIStudyPlan.objects.filter(student_id=user.userid).order_by('-created_at').first()
            print(f"   Latest Study Plan: {latest_plan.plan_title}")
            print(f"     - Class: {latest_plan.class_name}, Subject: {latest_plan.subject}")
            print(f"     - Created: {latest_plan.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        if ai_notes > 0:
            latest_note = AIGeneratedNote.objects.filter(student_id=user.userid).order_by('-created_at').first()
            print(f"   Latest AI Note: {latest_note.note_title}")
            print(f"     - Class: {latest_note.class_name}, Subject: {latest_note.subject}")
            print(f"     - Created: {latest_note.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        if manual_notes > 0:
            latest_manual = ManualNote.objects.filter(student_id=user.userid).order_by('-created_at').first()
            print(f"   Latest Manual Note: {latest_manual.note_title or 'Untitled'}")
            print(f"     - Class: {latest_manual.class_name}, Subject: {latest_manual.subject}")
            print(f"     - Created: {latest_manual.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        if chat_history > 0:
            latest_chat = AIChatHistory.objects.filter(student_id=user.userid).order_by('-message_timestamp').first()
            print(f"   Latest Chat:")
            print(f"     User: {latest_chat.user_message[:60]}...")
            print(f"     AI: {latest_chat.ai_response[:60]}...")
            print(f"     - Created: {latest_chat.message_timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
        
        print("-" * 60)
    
    # Overall statistics
    print(f"\n📊 Overall Statistics:")
    print(f"   Total Study Plans: {AIStudyPlan.objects.count()}")
    print(f"   Total AI Notes: {AIGeneratedNote.objects.count()}")
    print(f"   Total Manual Notes: {ManualNote.objects.count()}")
    print(f"   Total Chat Messages: {AIChatHistory.objects.count()}")
    
    print("\n✅ End-to-end verification complete!")
    print("=" * 60)

if __name__ == "__main__":
    verify_e2e()

