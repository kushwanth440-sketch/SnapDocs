from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import pdf, document, image, audio
import os
from app.api.routes import pdf, document, image, audio, qr
app = FastAPI(
    title="SnapDocs API",
    description="Privacy-first file processing API",
    version="1.0.0"
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://snap-docs-orrvv59zy-kushwanth-juturu-s-projects.vercel.app/",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(document.router, prefix="/api/document", tags=["Document"])
app.include_router(image.router, prefix="/api/image", tags=["Image"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])
app.include_router(qr.router, prefix="/api/qr", tags=["QR"])

@app.get("/")
async def root():
    return {"message": "SnapDocs API is running", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "ok"}
