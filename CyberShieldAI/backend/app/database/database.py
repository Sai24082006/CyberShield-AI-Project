from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not set")

if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is not set")

client = AsyncIOMotorClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000
)

db = client[DATABASE_NAME]