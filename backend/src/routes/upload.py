import uuid
import logging
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..db import cosmos_store as local_store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["upload"])

# Make sure uploads/ exists
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


@router.post("")
async def upload_papers(
    files: list[UploadFile] = File(...),
    user_id: str = Form("default_user")
):
    """
    Upload multiple PDF documents and group them under a single workspace.
    Returns the workspace_id and metadata for each file uploaded.
    """
    # 1️⃣ Generate a workspace ID for this batch of uploads
    workspace_id = str(uuid.uuid4())
    uploaded_files = []

    for file in files:
        # --- Step 1: Validate file type ---
        if file.content_type not in ("application/pdf", "application/x-pdf"):
            raise HTTPException(status_code=415, detail="Only PDF files are supported.")

        # --- Step 2: Create unique file ID and storage path ---
        paper_id = str(uuid.uuid4())
        stored_filename = f"{paper_id}.pdf"
        stored_path = UPLOADS_DIR / stored_filename

        # --- Step 3: Save file locally ---
        try:
            content = await file.read()
            stored_path.write_bytes(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"File save failed: {e}")

        # --- Step 4: Attempt upload to MCP server (optional) ---
        from ..services.mcp_client import upload_to_mcp
        mcp_id = None
        try:
            mcp_id = upload_to_mcp(str(stored_path), paper_id)
        except Exception as e:
            logger.error(f"MCP upload failed for {file.filename}: {e}")

        # --- Step 5: Save metadata to Cosmos ---
        try:
            local_store.save_doc(
                user_id=user_id,
                filename=file.filename,
                text="",  # placeholder for extracted text or processing
                workspace_id=workspace_id
            )
        except Exception as e:
            logger.error(f"CosmosDB save failed for {file.filename}: {e}")
            raise HTTPException(status_code=500, detail="Database write failed")

        uploaded_files.append({
            "filename": file.filename,
            "paper_id": paper_id,
            "stored_path": str(stored_path),
            "mcp_id": mcp_id
        })

    # --- Step 6: Return confirmation with workspace ID ---
    return {
        "workspace_id": workspace_id,
        "uploaded_files": uploaded_files,
        "count": len(uploaded_files),
        "status": "uploaded"
    }

  
