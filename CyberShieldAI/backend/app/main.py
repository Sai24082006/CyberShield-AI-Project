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
import socket
import pymongo
import certifi


app = FastAPI(
    title="CyberShield AI",
    description="AI-Powered Phishing Detection System",
    version="1.0.0"
)


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


app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(scan_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(qr_router)
app.include_router(email_router)


@app.get("/")
async def home():
    return {
        "status": "success",
        "message": "Welcome to CyberShield AI",
        "version": "1.0.0"
    }


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


@app.get("/env-check")
async def env_check():
    return {
        "python": sys.version,
        "openssl": ssl.OPENSSL_VERSION,
        "pymongo": pymongo.version,
        "certifi": certifi.where()
    }


@app.get("/tls-check")
async def tls_check():
    host = "ac-cojybyf-shard-00-00.yfpfs8p.mongodb.net"
    port = 27017

    try:
        context = ssl.create_default_context(
            cafile=certifi.where()
        )

        with socket.create_connection(
            (host, port),
            timeout=10
        ) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=host
            ) as tls_socket:

                return {
                    "status": "success",
                    "message": "TLS connection successful",
                    "tls_version": tls_socket.version(),
                    "cipher": tls_socket.cipher()
                }

    except Exception as e:
        return {
            "status": "error",
            "error_type": type(e).__name__,
            "message": str(e)
        }
