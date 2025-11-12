from pathlib import Path

import requests


def main() -> None:
    token_path = Path("token.txt")
    if not token_path.exists():
        raise SystemExit("token.txt not found")

    token = token_path.read_text().strip()
    if not token:
        raise SystemExit("token.txt is empty")

    url = "http://127.0.0.1:8001/friends/2"
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    print(f"status={resp.status_code}")
    print(resp.text)


if __name__ == "__main__":
    main()

