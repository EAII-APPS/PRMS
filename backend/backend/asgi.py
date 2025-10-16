import os
import django
print("Setting DJANGO_SETTINGS_MODULE")  # Debug print
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
print("Calling django.setup()")  # Debug print
django.setup()  # Ensure Django is set up

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from comApp.routing import websocket_urlpatterns

print("Setting up application")  # Debug print
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
