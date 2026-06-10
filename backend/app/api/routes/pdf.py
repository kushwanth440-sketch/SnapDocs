from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def pdf_root():
    return {"module": "PDF Tools", "status": "ready"}
