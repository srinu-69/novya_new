"""
ASGI config for LMS_BACK project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

try:
    from channels.security.websocket import AllowedHostsOriginValidator
except ImportError:
    AllowedHostsOriginValidator = None
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()

try:
    from studyroom.routing import websocket_urlpatterns
except Exception:
    websocket_urlpatterns = []

websocket_application = URLRouter(websocket_urlpatterns)
if AllowedHostsOriginValidator is not None:
    websocket_application = AllowedHostsOriginValidator(websocket_application)

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(websocket_application),
    }
)
