from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
import qrcode
from qrcode.image.svg import SvgImage
import io
import base64
from PIL import Image
from typing import Optional

router = APIRouter()

class QRRequest(BaseModel):
    text: str
    size: int = 300
    fg_color: str = "#000000"
    bg_color: str = "#ffffff"
    format: str = "png"  # png or svg
    logo_base64: Optional[str] = None

@router.get("/")
async def qr_root():
    return {"module": "QR Generator", "status": "ready"}

@router.post("/generate")
async def generate_qr(req: QRRequest):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(req.text)
        qr.make(fit=True)

        if req.format == "svg":
            img = qr.make_image(image_factory=SvgImage)
            output = io.BytesIO()
            img.save(output)
            encoded = base64.b64encode(output.getvalue()).decode("utf-8")
            return {"file": encoded, "mime": "image/svg+xml", "ext": "svg"}

        # PNG
        img = qr.make_image(fill_color=req.fg_color, back_color=req.bg_color).convert("RGB")
        img = img.resize((req.size, req.size), Image.LANCZOS)

        # Add logo if provided
        if req.logo_base64:
            logo_bytes = base64.b64decode(req.logo_base64)
            logo = Image.open(io.BytesIO(logo_bytes)).convert("RGBA")

            # Resize logo to 25% of QR size
            logo_size = req.size // 4
            logo = logo.resize((logo_size, logo_size), Image.LANCZOS)

            # Paste in center
            pos = ((img.size[0] - logo_size) // 2, (img.size[1] - logo_size) // 2)
            img.paste(logo, pos, mask=logo if logo.mode == "RGBA" else None)

        output = io.BytesIO()
        img.save(output, format="PNG")
        encoded = base64.b64encode(output.getvalue()).decode("utf-8")

        return {"file": encoded, "mime": "image/png", "ext": "png"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))