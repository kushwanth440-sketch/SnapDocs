# SnapDocs
> Convert. Compress. Extract. Instantly.

Privacy-first file toolkit for PDFs, Images, Audio and Documents.
No signup. No storage. Files deleted immediately after processing.

## Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** FastAPI, Python 3.14

## Getting Started

### Backend
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev

## Modules
- PDF Tools (Merge, Split, Compress, Convert)
- Document Tools (DOCX↔PDF, TXT→PDF)
- Image Tools (Compress, Resize, Convert, OCR)
- Audio Tools (Transcribe, MP4→MP3)
