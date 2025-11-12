import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from studyroom.models import Friendship

print("studyroom friendships:", list(Friendship.objects.values_list("user1_id", "user2_id")))

