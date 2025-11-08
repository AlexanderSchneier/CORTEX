import os
import requests

MCP_URL = os.getenv("MCP_URL")
MCP_API_KEY = os.getenv("MCP_API_KEY")

def upload_to_mcp(file_path: str, paper_id: str):
    headers = {"Authorization": f"Bearer {MCP_API_KEY}"}
    files = {"file": open(file_path, "rb")}
    response = requests.post(f"{MCP_URL}/ingest", headers=headers, files=files)
    response.raise_for_status()
    data = response.json()
    # expected to return something like {"mcp_document_id": "..."}
    return data.get("mcp_document_id")
