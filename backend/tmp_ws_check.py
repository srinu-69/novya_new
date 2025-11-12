import asyncio

import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNzc5MTg0LCJpYXQiOjE3NjI3NzU1ODQsImp0aSI6Ijg1YmI0YTQ5MjBmNzQzNzJiZWI4ZTUwMDhjM2YwN2Y0IiwidXNlcl9pZCI6Mn0.JLzPzIm9YyuF45ivc3kazXeI1N0MqTYDX7npT6Yb-XA"


async def main():
  uri = f"ws://localhost:8001/ws/3?token={TOKEN}"
  try:
    async with websockets.connect(uri) as websocket:
      print("connected")
      await asyncio.sleep(1)
  except Exception as exc:
    print("error", type(exc).__name__, exc)


if __name__ == "__main__":
  asyncio.run(main())

