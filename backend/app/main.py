
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import Base, engine
from app.routes import auth, tasks


# Membuat tabel saat aplikasi dijalankan
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# Membuat aplikasi FastAPI
app = FastAPI(
    title="Task Tracker API",
    description="API for managing Task Tracker",
    version="1.0.0",
    lifespan=lifespan
)


# Mengaktifkan CORS
# Mengaktifkan CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Web Vite
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Web alternatif
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Web development
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Android Capacitor
        "http://localhost",

        # Frontend Vercel
        "https://task-tracker-qsim.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Menggabungkan router Auth dan Tasks
app.include_router(auth.router)
app.include_router(tasks.router)


# Endpoint utama
@app.get("/")
def home():
    return {
        "message": "API Task Tracker is running"
    }
