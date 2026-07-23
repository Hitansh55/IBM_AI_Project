from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from enum import Enum
import os
import json
import logging
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import services
from file_service import extract_text_from_pdf, extract_text_from_docx, extract_text_from_image
from ai_service import generate_action_stream
from auth import get_current_user, supabase

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AI Study Buddy API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS — restrict to known origins
RAW_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000").split(",")
ALLOWED_ORIGINS = [o.strip().rstrip("/") for o in RAW_ORIGINS if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Max upload size: 20MB
MAX_FILE_SIZE = 20 * 1024 * 1024

class ActionType(str, Enum):
    summarize = "summarize"
    explain = "explain"
    quiz = "quiz"
    flashcards = "flashcards"
    chat = "chat"

class GenerateRequest(BaseModel):
    text: str = Field(..., max_length=500_000)
    action: ActionType
    query: str = Field(default="", max_length=10_000)
    session_id: str = Field(..., max_length=200)



@app.post("/api/extract")
@limiter.limit("15/minute")
async def extract_file(request: Request, file: UploadFile = File(...), auth_data = Depends(get_current_user)):
    user = auth_data["user"]
    req_client = auth_data["client"]
    
    filename = file.filename.lower()
    allowed_exts = [".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg"]
    
    if not any(filename.endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    try:
        file_bytes = await file.read()
        
        # Enforce file size limit
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 20MB.")
        
        text = ""
        
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_bytes)
        elif filename.endswith((".docx", ".doc")):
            text = extract_text_from_docx(file_bytes)
        elif filename.endswith(".txt"):
            text = file_bytes.decode("utf-8", errors="ignore")
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            text = extract_text_from_image(file_bytes)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any content from the file.")
            
        # Save to Supabase
        try:
            req_client.table("documents").insert({
                "user_id": user.id,
                "filename": filename,
                "content": text
            }).execute()
        except Exception as e:
            logger.error(f"Failed to save document to DB: {e}")
            
        return {"text": text}
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is (they have safe messages)
    except Exception as e:
        logger.exception("Unexpected error in /api/extract")
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again.")

@app.post("/api/generate")
@limiter.limit("20/minute")
async def generate_content(request: Request, req: GenerateRequest, auth_data = Depends(get_current_user)):
    user = auth_data["user"]
    req_client = auth_data["client"]
    
    try:
        user_content = req.query if req.action == "chat" else f"Action: {req.action}"
        
        # Save user message to Supabase
        try:
            req_client.table("messages").insert({
                "user_id": user.id,
                "role": "user",
                "content": user_content,
                "session_id": req.session_id
            }).execute()
        except Exception as e:
            logger.error(f"Failed to save user message: {e}")

        async def stream_wrapper():
            full_ai_response = ""
            async for chunk in generate_action_stream(req.text, req.action, req.query):
                if chunk.startswith("data: "):
                    try:
                        data_str = chunk[6:].strip()
                        data = json.loads(data_str)
                        if "text" in data:
                            full_ai_response += data["text"]
                    except:
                        pass
                yield chunk
            
            if full_ai_response:
                try:
                    req_client.table("messages").insert({
                        "user_id": user.id,
                        "role": "ai",
                        "content": full_ai_response,
                        "session_id": req.session_id
                    }).execute()
                except Exception as e:
                    logger.error(f"Failed to save AI message: {e}")

        return StreamingResponse(
            stream_wrapper(), 
            media_type="text/event-stream"
        )
    except Exception as e:
        logger.exception("Unexpected error in /api/generate")
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again.")

# Serve React Frontend in Production (Must be at the bottom to avoid shadowing API routes)
if os.path.isdir("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="dist")
else:
    @app.get("/")
    def read_root():
        return {"status": "AI Study Buddy Backend is Running"}
