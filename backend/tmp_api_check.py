from rest_framework.test import APIClient

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNzc5MTg0LCJpYXQiOjE3NjI3NzU1ODQsImp0aSI6Ijg1YmI0YTQ5MjBmNzQzNzJiZWI4ZTUwMDhjM2YwN2Y0IiwidXNlcl9pZCI6Mn0.JLzPzIm9YyuF45ivc3kazXeI1N0MqTYDX7npT6Yb-XA"
client = APIClient()
client.credentials(HTTP_AUTHORIZATION="Bearer " + token)
resp = client.get("/messages/3", HTTP_HOST="localhost")
print(resp.status_code)
try:
    print(resp.data)
except AttributeError:
    print(resp.content)

