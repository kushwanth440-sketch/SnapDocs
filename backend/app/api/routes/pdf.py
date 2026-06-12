from fastapi import APIRouter, UploadFile, File, HTTPException,Form
from fastapi.responses import StreamingResponse
from typing import List
import pypdf
import io
import fitz
import base64

router = APIRouter()

@router.get("/")
async def pdf_root():
    return {"module": "PDF Tools", "status": "ready"}

@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 PDF files are required"
        )

    try:
        merger = pypdf.PdfWriter()

        for file in files:
            contents = await file.read()
            pdf_reader = pypdf.PdfReader(io.BytesIO(contents))
            for page in pdf_reader.pages:
                merger.add_page(page)

        output = io.BytesIO()
        merger.write(output)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=merged.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
import base64

@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    mode: str = Form("all"),
    ranges: str = Form(None),
    every_n: int = Form(1),
):
    contents = await file.read()
    reader = pypdf.PdfReader(io.BytesIO(contents))
    total_pages = len(reader.pages)

    # Build list of page groups
    groups: list[list[int]] = []

    if mode == "all":
        # Each page becomes its own PDF
        groups = [[i] for i in range(total_pages)]

    elif mode == "every":
        # Chunk into groups of every_n pages
        for start in range(0, total_pages, every_n):
            groups.append(list(range(start, min(start + every_n, total_pages))))

    elif mode == "range":
        if not ranges:
            raise HTTPException(status_code=400, detail="No ranges provided")
        for part in ranges.split(","):
            part = part.strip()
            page_indices = []
            for segment in part.split("+"):
                segment = segment.strip()
                if "-" in segment:
                    a, b = segment.split("-", 1)
                    start, end = int(a.strip()) - 1, int(b.strip()) - 1
                    if start < 0 or end >= total_pages or start > end:
                        raise HTTPException(status_code=400, detail=f"Invalid range: {segment}")
                    page_indices.extend(range(start, end + 1))
                else:
                    p = int(segment) - 1
                    if p < 0 or p >= total_pages:
                        raise HTTPException(status_code=400, detail=f"Invalid page: {segment}")
                    page_indices.append(p)
        groups.append(page_indices)
    else:
        raise HTTPException(status_code=400, detail="Invalid mode")

    # Build output PDFs
    output_files = []
    for idx, page_indices in enumerate(groups):
        writer = pypdf.PdfWriter()
        for pi in page_indices:
            writer.add_page(reader.pages[pi])
        buf = io.BytesIO()
        writer.write(buf)
        buf.seek(0)
        encoded = base64.b64encode(buf.read()).decode("utf-8")

        if mode == "all":
            name = f"page_{page_indices[0] + 1}.pdf"
        elif mode == "every":
            name = f"part_{idx + 1}_pages_{page_indices[0]+1}-{page_indices[-1]+1}.pdf"
        else:
            name = f"range_{idx + 1}_pages_{page_indices[0]+1}-{page_indices[-1]+1}.pdf"

        output_files.append({"name": name, "data": encoded})

    return {"files": output_files, "total_pages": total_pages}

@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("medium"),
):
    contents = await file.read()
    original_size = len(contents)

    try:
        import fitz  # pymupdf

        # Garbage collection and deflate settings per level
        settings = {
            "low":    {"garbage": 1, "deflate": True, "clean": False},
            "medium": {"garbage": 3, "deflate": True, "clean": True},
            "high":   {"garbage": 4, "deflate": True, "clean": True, "deflate_images": True, "deflate_fonts": True},
        }.get(level, {"garbage": 3, "deflate": True, "clean": True})

        doc = fitz.open(stream=contents, filetype="pdf")

        # For high compression, also downsample images
        if level in ("medium", "high"):
            zoom = 1.0 if level == "medium" else 0.75
            for page in doc:
                for img in page.get_images(full=True):
                    xref = img[0]
                    try:
                        pix = fitz.Pixmap(doc, xref)
                        if pix.n > 4:
                            pix = fitz.Pixmap(fitz.csRGB, pix)
                        new_w = max(1, int(pix.width * zoom))
                        new_h = max(1, int(pix.height * zoom))
                        pix = pix.scale(new_w, new_h)
                        quality = 85 if level == "medium" else 40
                        img_bytes = pix.tobytes("jpeg", jpg_quality=quality)
                        doc.update_stream(xref, img_bytes)
                    except Exception:
                        continue

        output = io.BytesIO()
        doc.save(output, **settings)
        doc.close()

        compressed_bytes = output.getvalue()
        compressed_size = len(compressed_bytes)

        import base64
        encoded = base64.b64encode(compressed_bytes).decode("utf-8")

        return {
            "file": encoded,
            "original_size": original_size,
            "compressed_size": compressed_size,
            "filename": file.filename,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/pdf-to-image")
async def pdf_to_image(
    file: UploadFile = File(...),
    format: str = Form("png"),
):
    contents = await file.read()

    try:
        import fitz
        import base64

        doc = fitz.open(stream=contents, filetype="pdf")
        images = []

        for i, page in enumerate(doc):
            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom = ~150 DPI
            pix = page.get_pixmap(matrix=mat)

            if format == "jpg":
                img_bytes = pix.tobytes("jpeg", jpg_quality=90)
                mime = "image/jpeg"
                ext = "jpg"
            else:
                img_bytes = pix.tobytes("png")
                mime = "image/png"
                ext = "png"

            encoded = base64.b64encode(img_bytes).decode("utf-8")
            images.append({
                "name": f"page_{i + 1}.{ext}",
                "data": encoded,
                "mime": mime,
            })

        doc.close()
        return {"images": images, "total_pages": len(images)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image-to-pdf")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    try:
        import fitz
        import base64
        from PIL import Image as PILImage

        doc = fitz.open()

        for file in files:
            contents = await file.read()
            img = PILImage.open(io.BytesIO(contents))

            # Convert to RGB if needed (e.g. PNG with transparency)
            if img.mode in ("RGBA", "P", "LA"):
                background = PILImage.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")

            img_bytes = io.BytesIO()
            img.save(img_bytes, format="JPEG", quality=90)
            img_bytes.seek(0)

            # Create a PDF page the same size as the image
            img_w, img_h = img.size
            # Convert pixels to points (72 DPI)
            pt_w = img_w * 72 / 96
            pt_h = img_h * 72 / 96

            page = doc.new_page(width=pt_w, height=pt_h)
            rect = fitz.Rect(0, 0, pt_w, pt_h)
            page.insert_image(rect, stream=img_bytes.read())

        output = io.BytesIO()
        doc.save(output)
        doc.close()

        encoded = base64.b64encode(output.getvalue()).decode("utf-8")
        return {"file": encoded, "filename": "images.pdf"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
