from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import pdf, document, image, audio

app = FastAPI(
    title="SnapDocs API",
    description="Privacy-first file processing API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(document.router, prefix="/api/document", tags=["Document"])
app.include_router(image.router, prefix="/api/image", tags=["Image"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])

@app.get("/")
async def root():
    return {"message": "SnapDocs API is running", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "ok"}
