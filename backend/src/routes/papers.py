from fastapi import APIRouter, Query
from ..db import cosmos_store as local_store

router = APIRouter(prefix="/papers", tags=["papers"])

@router.get("")
async def list_papers(user_id: str = Query("default_user")):
    """
    List all papers for a given user.
    Optionally filter by user_id (default_user for now).
    """
    papers = local_store.list_docs(user_id)
    simplified = [
        {
            "id": p.get("id"),
            "filename": p.get("filename"),
            "uploaded_at": p.get("uploadedAt"),
            "workspace_id": p.get("workspaceId")
        }
        for p in papers
    ]
    return simplified


@router.get("/workspace/{workspace_id}")
async def get_papers_by_workspace(workspace_id: str):
    """
    Retrieve all papers that belong to a specific workspace.
    Useful for showing what was uploaded in a single session.
    """
    papers = local_store.list_docs_by_workspace(workspace_id)
    return {
        "workspace_id": workspace_id,
        "documents": [
            {
                "id": p.get("id"),
                "filename": p.get("filename"),
                "uploaded_at": p.get("uploadedAt")
            }
            for p in papers
        ]
    }
