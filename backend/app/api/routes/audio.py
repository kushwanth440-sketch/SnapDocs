from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from faster_whisper import WhisperModel
import io
import base64
import tempfile
import os

router = APIRouter()

# Load once at startup
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")

@router.get("/")
async def audio_root():
    return {"module": "Audio Tools", "status": "ready"}


# ─── Audio to Text ────────────────────────────────────────────────────────────

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        segments, info = whisper_model.transcribe(tmp_path, beam_size=5)
        full_text = " ".join([seg.text.strip() for seg in segments])

        os.unlink(tmp_path)

        if not full_text.strip():
            return {"text": "", "language": info.language, "message": "No speech detected"}

        return {
            "text": full_text,
            "language": info.language,
            "message": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── MP4 to MP3 ───────────────────────────────────────────────────────────────

@router.post("/mp4-to-mp3")
async def mp4_to_mp3(file: UploadFile = File(...)):
    try:
        import moviepy as mp

        contents = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_in:
            tmp_in.write(contents)
            tmp_in_path = tmp_in.name

        tmp_out_path = tmp_in_path.replace(".mp4", ".mp3")

        clip = mp.VideoFileClip(tmp_in_path)
        clip.audio.write_audiofile(tmp_out_path, logger=None)
        clip.close()

        with open(tmp_out_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")

        os.unlink(tmp_in_path)
        os.unlink(tmp_out_path)

        return {
            "file": encoded,
            "filename": file.filename.rsplit(".", 1)[0] + ".mp3",
            "mime": "audio/mpeg",
            "message": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Video to Text ────────────────────────────────────────────────────────────

@router.post("/video-to-text")
async def video_to_text(file: UploadFile = File(...)):
    try:
        import moviepy as mp

        contents = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_vid:
            tmp_vid.write(contents)
            tmp_vid_path = tmp_vid.name

        tmp_audio_path = tmp_vid_path.replace(".mp4", ".wav")

        clip = mp.VideoFileClip(tmp_vid_path)
        clip.audio.write_audiofile(tmp_audio_path, logger=None)
        clip.close()

        segments, info = whisper_model.transcribe(tmp_audio_path, beam_size=5)
        full_text = " ".join([seg.text.strip() for seg in segments])

        os.unlink(tmp_vid_path)
        os.unlink(tmp_audio_path)

        if not full_text.strip():
            return {"text": "", "language": info.language, "message": "No speech detected"}

        return {
            "text": full_text,
            "language": info.language,
            "message": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))