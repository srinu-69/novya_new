from django.urls import re_path

from .consumers import DirectChatConsumer, GroupChatConsumer

websocket_urlpatterns = [
    re_path(r'^ws/(?P<friend_id>\d+)$', DirectChatConsumer.as_asgi()),
    re_path(r'^ws/group/(?P<group_id>\d+)$', GroupChatConsumer.as_asgi()),
]
