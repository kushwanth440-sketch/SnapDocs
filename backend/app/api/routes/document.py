from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def document_root():
    return {"module": "Document Tools", "status": "ready"}
