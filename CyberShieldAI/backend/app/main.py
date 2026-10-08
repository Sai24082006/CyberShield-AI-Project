from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import db

from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.scan import router as scan_router
from app.api.history import router as history_router
from app.api.dashboard import router as dashboard_router
from app.api.qr import router as qr_router
from app.api.email import router as email_router

import sys
import ssl
import pymongo
import certifi


app = FastAPI(
    title="CyberShield AI",
    description="AI-Powered Phishing Detection System",
    version="1.0.0"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(scan_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(qr_router)
app.include_router(email_router)


# Root Endpoint
@app.get("/")
async def home():
    return {
        "status": "success",
        "message": "Welcome to CyberShield AI",
        "version": "1.0.0"
    }


# Database Health Check
@app.get("/db-check")
async def db_check():
    try:
        await db.command("ping")

        return {
            "status": "success",
            "message": "MongoDB Connected Successfully"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# Temporary Render Environment Check
@app.get("/env-check")
async def env_check():
    return {
        "python": sys.version,
        "openssl": ssl.OPENSSL_VERSION,
        "pymongo": pymongo.version,
        "certifi": certifi.where()
    }
