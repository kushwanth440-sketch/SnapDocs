from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def image_root():
    return {"module": "Image Tools", "status": "ready"}
