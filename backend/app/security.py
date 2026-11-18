# Security digunakan untuk mengamankan password dan autentikasi user
# Password tidak disimpan dalam bentuk asli, tetapi menggunakan hashing.
# JWT digunakan agar backend dapat mengenali user yang sudah login.

# Import library
import os
from pathlib import Path
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash


# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is missing from .env")


# Create JWT Token
# Membuat JWT Token untuk user yang berhasil login.
# Token digunakan untuk mengakses endpoint yang membutuhkan login.

def create_access_token(
    # Data yang dimasukkan ke JWT, misalnya ID user.
    data: dict,
    expires_delta: timedelta | None = None
) -> str:

    to_encode = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    expire = datetime.now(timezone.utc) + expires_delta

    # Menambahkan informasi waktu kedaluwarsa token.
    to_encode.update({"exp": expire})

    # Membuat dan menandatangani JWT.
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# Decode JWT Token
# Memverifikasi dan membaca token yang dikirim oleh user.

def decode_access_token(token: str) -> dict:

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return payload


# Password Hashing
password_hash = PasswordHash.recommended()


# Mengubah password asli menjadi hash.
def hash_password(password: str) -> str:
    return password_hash.hash(password)


# Memeriksa password dengan hash yang tersimpan di database.
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password
    )