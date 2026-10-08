import hashlib
import hmac
import os


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        310000
    )
    return f"pbkdf2_sha256$310000${salt.hex()}${password_hash.hex()}"


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    try:
        algorithm, iterations, salt_hex, hash_hex = hashed_password.split("$")

        if algorithm != "pbkdf2_sha256":
            return False

        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)

        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt,
            int(iterations)
        )

        return hmac.compare_digest(actual_hash, expected_hash)

    except (ValueError, TypeError):
        return False