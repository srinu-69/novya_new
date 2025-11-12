import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from rest_framework.test import APIClient

client = APIClient()

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNzc5MTg0LCJpYXQiOjE3NjI3NzU1ODQsImp0aSI6Ijg1YmI0YTQ5MjBmNzQzNzJiZWI4ZTUwMDhjM2YwN2Y0IiwidXNlcl9pZCI6Mn0.JLzPzIm9YyuF45ivc3kazXeI1N0MqTYDX7npT6Yb-XA"
client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

resp = client.get("/messages/3", HTTP_HOST="localhost:8001")
print("status:", resp.status_code)
print("data:", resp.json() if resp.status_code != 204 else None)

