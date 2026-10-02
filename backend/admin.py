import os
from dotenv import load_dotenv

from auth import hash_password


load_dotenv()


ADMIN_USERNAME = "admin"

ADMIN_PASSWORD = os.getenv(
    "ADMIN_PASSWORD",
    "ChangeThisPassword123!"
)

ADMIN_PASSWORD_HASH = hash_password(
    ADMIN_PASSWORD
)