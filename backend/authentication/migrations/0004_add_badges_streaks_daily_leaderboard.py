# Generated manually for Badges, Streaks, Daily Summary, and Leaderboard

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', 'fix_coin_transaction_constraint'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserBadge',
            fields=[
                ('badge_id', models.AutoField(primary_key=True, serialize=False)),
                ('badge_type', models.CharField(choices=[('quick_master', 'Quick Master'), ('mock_master', 'Mock Master'), ('streak_7', 'Steady Learner'), ('streak_15', 'Focused Mind'), ('streak_30', 'Learning Legend')], max_length=50)),
                ('badge_title', models.CharField(max_length=100)),
                ('badge_description', models.TextField(blank=True, null=True)),
                ('earned_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('student_id', models.ForeignKey(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.studentregistration')),
            ],
            options={
                'db_table': 'user_badge',
                'verbose_name': 'User Badge',
                'verbose_name_plural': 'User Badges',
                'ordering': ['-earned_at'],
            },
        ),
        migrations.CreateModel(
            name='UserStreak',
            fields=[
                ('streak_id', models.AutoField(primary_key=True, serialize=False)),
                ('current_streak', models.IntegerField(default=0)),
                ('longest_streak', models.IntegerField(default=0)),
                ('last_activity_date', models.DateField(blank=True, null=True)),
                ('total_days_active', models.IntegerField(default=0)),
                ('streak_started_at', models.DateField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('student_id', models.OneToOneField(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.studentregistration')),
            ],
            options={
                'db_table': 'user_streak',
                'verbose_name': 'User Streak',
                'verbose_name_plural': 'User Streaks',
            },
        ),
        migrations.CreateModel(
            name='DailyActivity',
            fields=[
                ('activity_id', models.AutoField(primary_key=True, serialize=False)),
                ('activity_date', models.DateField()),
                ('quizzes_completed', models.IntegerField(default=0)),
                ('mock_tests_completed', models.IntegerField(default=0)),
                ('quick_practices_completed', models.IntegerField(default=0)),
                ('classroom_activities', models.IntegerField(default=0)),
                ('total_study_time_minutes', models.IntegerField(default=0)),
                ('average_quiz_score', models.FloatField(default=0.0)),
                ('average_mock_test_score', models.FloatField(default=0.0)),
                ('coins_earned', models.IntegerField(default=0)),
                ('activity_summary', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('student_id', models.ForeignKey(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.studentregistration')),
            ],
            options={
                'db_table': 'daily_activity',
                'verbose_name': 'Daily Activity',
                'verbose_name_plural': 'Daily Activities',
                'ordering': ['-activity_date'],
            },
        ),
        migrations.CreateModel(
            name='LeaderboardEntry',
            fields=[
                ('entry_id', models.AutoField(primary_key=True, serialize=False)),
                ('ranking_type', models.CharField(choices=[('overall', 'Overall'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('subject', 'Subject'), ('class', 'Class')], max_length=50)),
                ('rank', models.IntegerField()),
                ('score', models.FloatField(default=0.0)),
                ('period_start', models.DateField(blank=True, null=True)),
                ('period_end', models.DateField(blank=True, null=True)),
                ('subject', models.CharField(blank=True, max_length=100, null=True)),
                ('class_name', models.CharField(blank=True, max_length=50, null=True)),
                ('total_quizzes', models.IntegerField(default=0)),
                ('total_mock_tests', models.IntegerField(default=0)),
                ('average_score', models.FloatField(default=0.0)),
                ('total_coins', models.IntegerField(default=0)),
                ('current_streak', models.IntegerField(default=0)),
                ('calculated_at', models.DateTimeField(auto_now=True)),
                ('student_id', models.ForeignKey(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.studentregistration')),
            ],
            options={
                'db_table': 'leaderboard_entry',
                'verbose_name': 'Leaderboard Entry',
                'verbose_name_plural': 'Leaderboard Entries',
                'ordering': ['ranking_type', 'rank'],
            },
        ),
        migrations.AddIndex(
            model_name='userbadge',
            index=models.Index(fields=['student_id', 'badge_type'], name='user_badge_student_badge_idx'),
        ),
        migrations.AddIndex(
            model_name='userbadge',
            index=models.Index(fields=['student_id', 'earned_at'], name='user_badge_student_earned_idx'),
        ),
        migrations.AddIndex(
            model_name='dailyactivity',
            index=models.Index(fields=['student_id', 'activity_date'], name='daily_activity_student_date_idx'),
        ),
        migrations.AddIndex(
            model_name='dailyactivity',
            index=models.Index(fields=['activity_date'], name='daily_activity_date_idx'),
        ),
        migrations.AddIndex(
            model_name='leaderboardentry',
            index=models.Index(fields=['ranking_type', 'rank'], name='leaderboard_entry_type_rank_idx'),
        ),
        migrations.AddIndex(
            model_name='leaderboardentry',
            index=models.Index(fields=['student_id', 'ranking_type'], name='leaderboard_entry_student_type_idx'),
        ),
        migrations.AddIndex(
            model_name='leaderboardentry',
            index=models.Index(fields=['period_start', 'period_end'], name='leaderboard_entry_period_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='userbadge',
            unique_together={('student_id', 'badge_type')},
        ),
        migrations.AlterUniqueTogether(
            name='dailyactivity',
            unique_together={('student_id', 'activity_date')},
        ),
        migrations.AlterUniqueTogether(
            name='leaderboardentry',
            unique_together={('student_id', 'ranking_type', 'period_start', 'period_end', 'subject', 'class_name')},
        ),
    ]

