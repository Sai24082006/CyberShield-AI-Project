from pymongo import MongoClient

uri = "mongodb+srv://baraskarsai34_db_user:Sai12345@cluster0.yfpfs8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(uri)
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print("❌ Connection Failed")
    print(e)