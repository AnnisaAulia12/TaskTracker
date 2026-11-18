#membaca konfigurasi db nya .env , dan membuat koneksi ke PostrageSQL
# membuat session untuk oprasi db
#SQLAlchemy library pyhton yang digunakan untuk komunikasi dnegan db dengan pendekatan OMR 
# dan ini berfungsi penguhubung antara code pyhton dengan db nya

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

#load enviroment variable 
#ini membaca file envnya 
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR/".env")

DB_HOST = os.getenv("DB_HOST") #lokasi server db aku
DB_PORT = os.getenv("DB_PORT") #port nya
DB_NAME = os.getenv("DB_NAME") #ambil nama db nya
DB_USER = os.getenv("DB_USER") #username postrage sql nya
DB_PASSWORD = os.getenv("DB_PASSWORD") #pw db aku


#memvalidasi konfigurasi db  , untuk mengetahui konfigurasi mana yang blm di isi
required_variables = {
    "DB_HOST": DB_HOST,
    "DB_PORT": DB_PORT,
    "DB_NAME": DB_NAME,
    "DB_USER": DB_USER,
    "DB_PASSWORD": DB_PASSWORD,
}

missing_variables = [
    key for key, value in required_variables.items()
    if not value
]

if missing_variables:
    raise RuntimeError(
        f"Missing environment variables: {', '.join(missing_variables)}"
    )

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME,
)

#membuat engine yng ngelola koneksi nya 
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

#membuat session yang menjalankan oprasi db nya 
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
