import os
import sys

import jwt


def main() -> None:
    args = sys.argv[1:]
    if not args:
        token = sys.stdin.read().strip()
        if not token:
            print("usage: python decode_token.py <token> [secret]")
            sys.exit(1)
        secret = None
    else:
        token = args[0]
        secret = args[1] if len(args) > 1 else None

    if secret is not None:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        print("verified with provided secret")
    else:
        payload = jwt.decode(token, options={"verify_signature": False})
        print("decoded without verifying signature")

    print(payload)
    print(f"exp: {payload.get('exp')}")


if __name__ == "__main__":
    main()

