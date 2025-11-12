from __future__ import annotations

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

  dependencies = [
    ("studyroom", "0001_initial"),
  ]

  operations = [
    migrations.AlterField(
      model_name="directmessage",
      name="delivered_at",
      field=models.DateTimeField(blank=True, null=True),
    ),
    migrations.CreateModel(
      name="GroupUnreadCount",
      fields=[
        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
        ("user_id", models.IntegerField()),
        ("count", models.PositiveIntegerField(default=0)),
        ("updated_at", models.DateTimeField(auto_now=True)),
        ("group", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="unread_counters", to="studyroom.studygroup")),
      ],
      options={
        "db_table": "studyroom_group_unread_count",
        "unique_together": {("user_id", "group")},
      },
    ),
    migrations.CreateModel(
      name="UnreadCount",
      fields=[
        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
        ("user_id", models.IntegerField()),
        ("friend_id", models.IntegerField()),
        ("count", models.PositiveIntegerField(default=0)),
        ("updated_at", models.DateTimeField(auto_now=True)),
      ],
      options={
        "db_table": "studyroom_unread_count",
        "unique_together": {("user_id", "friend_id")},
      },
    ),
    migrations.AddIndex(
      model_name="groupunreadcount",
      index=models.Index(fields=["user_id", "group"], name="studyroom_group_unread_user_group_idx"),
    ),
    migrations.AddIndex(
      model_name="unreadcount",
      index=models.Index(fields=["user_id", "friend_id"], name="studyroom_unread_user_friend_idx"),
    ),
  ]

