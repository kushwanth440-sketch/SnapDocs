from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import subprocess
import tempfile
import os
from pdf2docx import Converter
import io
import base64

router = APIRouter()

@router.get("/")
async def document_root():
    return {"module": "Document Tools", "status": "ready"}

@router.post("/docx-to-pdf")
async def docx_to_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are supported")

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = os.path.join(tmpdir, file.filename)
            with open(input_path, "wb") as f:
                f.write(await file.read())

            import sys
            if sys.platform == "win32":
                soffice = r"C:\Program Files\LibreOffice\program\soffice.exe"
            else:
                soffice = "libreoffice"
            subprocess.run([
                soffice, "--headless", "--convert-to", "pdf",
                "--outdir", tmpdir, input_path
            ], check=True, timeout=60)

            pdf_filename = os.path.splitext(file.filename)[0] + ".pdf"
            pdf_path = os.path.join(tmpdir, pdf_filename)

            if not os.path.exists(pdf_path):
                raise HTTPException(status_code=500, detail="Conversion failed")

            # Read and return bytes before tmpdir is deleted
            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()

        from fastapi.responses import Response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={pdf_filename}"}
        )

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Conversion timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf-to-docx")
async def pdf_to_docx(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files are supported")

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = os.path.join(tmpdir, file.filename)
            with open(input_path, "wb") as f:
                f.write(await file.read())

            docx_filename = os.path.splitext(file.filename)[0] + ".docx"
            docx_path = os.path.join(tmpdir, docx_filename)

            cv = Converter(input_path)
            cv.convert(docx_path, start=0, end=None)
            cv.close()

            with open(docx_path, "rb") as f:
                docx_bytes = f.read()

        from fastapi.responses import Response
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={docx_filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/txt-to-pdf")
async def txt_to_pdf(file: UploadFile = File(...)):
    try:
        import fitz

        contents = await file.read()
        text = contents.decode("utf-8", errors="replace")

        doc = fitz.open()
        page = doc.new_page(width=595, height=842)  # A4

        # margins
        x, y = 50, 50
        max_width = 495
        font_size = 11
        line_height = font_size * 1.5

        lines = text.splitlines()

        for line in lines:
            # Word-wrap long lines
            words = line.split(" ")
            current_line = ""
            for word in words:
                test_line = (current_line + " " + word).strip()
                text_width = fitz.get_text_length(test_line, fontname="helv", fontsize=font_size)
                if text_width <= max_width:
                    current_line = test_line
                else:
                    if current_line:
                        if y + line_height > 800:
                            page = doc.new_page(width=595, height=842)
                            y = 50
                        page.insert_text((x, y), current_line, fontname="helv", fontsize=font_size, color=(0, 0, 0))
                        y += line_height
                    current_line = word

            # Write remaining
            if y + line_height > 800:
                page = doc.new_page(width=595, height=842)
                y = 50
            page.insert_text((x, y), current_line, fontname="helv", fontsize=font_size, color=(0, 0, 0))
            y += line_height

        output = io.BytesIO()
        doc.save(output)
        doc.close()

        encoded = base64.b64encode(output.getvalue()).decode("utf-8")
        return {"file": encoded, "filename": file.filename.replace(".txt", ".pdf")}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))