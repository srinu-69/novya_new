#!/usr/bin/env python3
"""
Real-time monitoring script - Run this while testing the frontend
It will show you new data as it gets saved to the database
"""

import sys
import os
import time
from datetime import datetime

# Add Django project path
sys.path.append('backend')

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from ai_assistant.models import AIStudyPlan, AIGeneratedNote, ManualNote, AIChatHistory

def watch_data():
    """Watch for new AI assistant data in real-time"""
    print("👀 Watching for new AI Assistant data...")
    print("   (Press Ctrl+C to stop)")
    print("=" * 60)
    
    # Track counts
    last_counts = {
        'study_plans': AIStudyPlan.objects.count(),
        'ai_notes': AIGeneratedNote.objects.count(),
        'manual_notes': ManualNote.objects.count(),
        'chat_history': AIChatHistory.objects.count(),
    }
    
    print(f"\n📊 Initial Counts:")
    print(f"   Study Plans: {last_counts['study_plans']}")
    print(f"   AI Notes: {last_counts['ai_notes']}")
    print(f"   Manual Notes: {last_counts['manual_notes']}")
    print(f"   Chat History: {last_counts['chat_history']}")
    print(f"\n⏰ Monitoring started at {datetime.now().strftime('%H:%M:%S')}")
    print("-" * 60)
    
    try:
        while True:
            time.sleep(2)  # Check every 2 seconds
            
            # Get current counts
            current_counts = {
                'study_plans': AIStudyPlan.objects.count(),
                'ai_notes': AIGeneratedNote.objects.count(),
                'manual_notes': ManualNote.objects.count(),
                'chat_history': AIChatHistory.objects.count(),
            }
            
            # Check for changes
            for key, current_count in current_counts.items():
                if current_count > last_counts[key]:
                    diff = current_count - last_counts[key]
                    timestamp = datetime.now().strftime('%H:%M:%S')
                    
                    print(f"\n🆕 [{timestamp}] New {key.replace('_', ' ').title()}: +{diff}")
                    
                    # Show details of new items
                    if key == 'study_plans':
                        latest = AIStudyPlan.objects.order_by('-created_at').first()
                        print(f"   📚 {latest.plan_title}")
                        print(f"      Class: {latest.class_name}, Subject: {latest.subject}, Chapter: {latest.chapter}")
                        print(f"      User: {latest.student_id.username}")
                    
                    elif key == 'ai_notes':
                        latest = AIGeneratedNote.objects.order_by('-created_at').first()
                        print(f"   📝 {latest.note_title}")
                        print(f"      Class: {latest.class_name}, Subject: {latest.subject}, Chapter: {latest.chapter}")
                        print(f"      User: {latest.student_id.username}")
                    
                    elif key == 'manual_notes':
                        latest = ManualNote.objects.order_by('-created_at').first()
                        print(f"   ✏️  {latest.note_title or 'Untitled Note'}")
                        print(f"      Class: {latest.class_name}, Subject: {latest.subject}")
                        print(f"      User: {latest.student_id.username}")
                        print(f"      Content: {latest.note_content[:60]}...")
                    
                    elif key == 'chat_history':
                        latest = AIChatHistory.objects.order_by('-message_timestamp').first()
                        print(f"   💬 Chat Message")
                        print(f"      User: {latest.student_id.username}")
                        print(f"      Question: {latest.user_message[:50]}...")
                        print(f"      Response: {latest.ai_response[:50]}...")
                    
                    print("-" * 60)
                    last_counts[key] = current_count
    
    except KeyboardInterrupt:
        print(f"\n\n⏹️  Monitoring stopped at {datetime.now().strftime('%H:%M:%S')}")
        print(f"\n📊 Final Counts:")
        print(f"   Study Plans: {current_counts['study_plans']}")
        print(f"   AI Notes: {current_counts['ai_notes']}")
        print(f"   Manual Notes: {current_counts['manual_notes']}")
        print(f"   Chat History: {current_counts['chat_history']}")
        print("=" * 60)

if __name__ == "__main__":
    watch_data()

