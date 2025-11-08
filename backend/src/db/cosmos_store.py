from azure.cosmos import CosmosClient
from datetime import datetime
import os, uuid

# ✅ Environment variables (you’ll set these in .env or Vercel later)
COSMOS_URL = os.getenv("COSMOS_URL")
COSMOS_KEY = os.getenv("COSMOS_KEY")
DATABASE_ID = "CortexDB"

client = CosmosClient(COSMOS_URL, credential=COSMOS_KEY)
db = client.get_database_client(DATABASE_ID)

users = db.get_container_client("users")
docs = db.get_container_client("docs")
chats = db.get_container_client("chats")

# --- Helper Functions ---
def save_doc(user_id: str, filename: str, text: str):
    item = {
        "id": f"doc_{uuid.uuid4()}",
        "userId": user_id,
        "filename": filename,
        "text": text,
        "uploadedAt": datetime.utcnow().isoformat()
    }
    docs.create_item(item)
    return item

def list_docs(user_id: str):
    query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
    return list(docs.query_items(query=query, enable_cross_partition_query=True))