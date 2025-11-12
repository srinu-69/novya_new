import os
import sys

import django
import jwt


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()

    args = sys.argv[1:]
    if not args:
        token = sys.stdin.read().strip()
        if not token:
            print("usage: python check_token.py <token>")
            sys.exit(1)
    else:
        token = args[0]

    from django.conf import settings  # noqa: WPS433

    try:
        payload = jwt.decode(token, settings.STUDYROOM_JWT_SECRET, algorithms=["HS256"])
        print("decoded with STUDYROOM_JWT_SECRET")
        print(payload)
        return
    except jwt.InvalidTokenError as exc:
        print(f"studyroom secret failed: {exc}")

    from rest_framework_simplejwt.backends import TokenBackend  # noqa: WPS433

    backend = TokenBackend(
        algorithm=settings.SIMPLE_JWT["ALGORITHM"],
        signing_key=settings.SIMPLE_JWT["SIGNING_KEY"],
    )
    try:
        payload = backend.decode(token, verify=True)
        print("decoded with SIMPLE_JWT signing key")
        print(payload)
    except Exception as exc:  # noqa: W0703
        print(f"simplejwt key failed: {exc}")


if __name__ == "__main__":
    main()

