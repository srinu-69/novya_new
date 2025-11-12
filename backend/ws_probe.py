import asyncio
from pathlib import Path
from urllib.parse import quote

import websockets

TOKEN_PATH = Path("token.txt")
TOKEN = TOKEN_PATH.read_text().strip() if TOKEN_PATH.exists() else ""
FRIEND_ID = 3
URI = f"ws://127.0.0.1:8001/ws/{FRIEND_ID}?token={quote(TOKEN)}"


MESSAGE = "Hello from probe"


async def main():
    try:
        async with websockets.connect(URI, origin="http://localhost:3000") as ws:
            print("connected")
            await ws.send(MESSAGE)
            try:
                reply = await asyncio.wait_for(ws.recv(), timeout=2)
                print("received", reply)
            except asyncio.TimeoutError:
                print("no reply within timeout")
            await ws.close()
    except Exception as exc:
        print("error", type(exc).__name__, exc)


if __name__ == "__main__":
    asyncio.run(main())
