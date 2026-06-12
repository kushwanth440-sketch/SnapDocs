from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from PIL import Image
import io
import base64
import numpy as np
# import easyocr
import io
# import numpy as np
from PIL import Image
router = APIRouter()
# reader = easyocr.Reader(['en'], gpu=False)  # loads once on startup


@router.get("/")
async def image_root():
    return {"module": "Image Tools", "status": "ready"}

@router.post("/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(80),
):
    contents = await file.read()
    original_size = len(contents)

    try:
        img = Image.open(io.BytesIO(contents))
        fmt = img.format or "JPEG"
        original_format = fmt.upper()

        output = io.BytesIO()

        if original_format == "PNG":
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            img.save(output, format="PNG", optimize=True, compress_level=9)
        elif original_format == "WEBP":
            img.save(output, format="WEBP", quality=quality, method=6)
        else:
            if img.mode != "RGB":
                img = img.convert("RGB")
            img.save(output, format="JPEG", quality=quality, optimize=True)

        compressed_bytes = output.getvalue()
        compressed_size = len(compressed_bytes)
        encoded = base64.b64encode(compressed_bytes).decode("utf-8")

        ext_map = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}
        ext = ext_map.get(original_format, "jpg")
        mime_map = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}
        mime = mime_map.get(original_format, "image/jpeg")

        return {
            "file": encoded,
            "mime": mime,
            "ext": ext,
            "original_size": original_size,
            "compressed_size": compressed_size,
            "filename": file.filename,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/resize-image")
async def resize_image(
    file: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(...),
    maintain_aspect: bool = Form(True)
):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        original_format = img.format or "PNG"

        if maintain_aspect:
            img.thumbnail((width, height), Image.LANCZOS)
        else:
            img = img.resize((width, height), Image.LANCZOS)

        output = io.BytesIO()
        img.save(output, format=original_format)
        output.seek(0)

        encoded = base64.b64encode(output.getvalue()).decode("utf-8")
        ext = original_format.lower()
        return {
            "file": encoded,
            "filename": f"resized_{file.filename}",
            "width": img.width,
            "height": img.height,
            "media_type": f"image/{ext}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/convert-image")
async def convert_image(
    file: UploadFile = File(...),
    output_format: str = Form(...)
):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        fmt = output_format.upper()

        if fmt == "JPEG":
            if img.mode in ("RGBA", "P", "LA"):
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")

        output = io.BytesIO()
        img.save(output, format=fmt)
        output.seek(0)

        ext = "jpg" if fmt == "JPEG" else fmt.lower()
        original_name = file.filename.rsplit(".", 1)[0]
        encoded = base64.b64encode(output.getvalue()).decode("utf-8")

        return {
            "file": encoded,
            "filename": f"{original_name}.{ext}",
            "media_type": f"image/{fmt.lower()}",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ocr_reader = easyocr.Reader(['en'], gpu=False)

@router.post("/ocr")
async def ocr_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img_np = np.array(img)

        results = reader.readtext(img_np)

        if not results:
            return {"text": "", "blocks": [], "message": "No text found"}

        full_text = "\n".join([r[1] for r in results])
        blocks = [
            {
                "text": r[1],
                "confidence": round(r[2] * 100, 1),
                "bbox": r[0]
            }
            for r in results
        ]

        return {"text": full_text, "blocks": blocks, "message": "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
