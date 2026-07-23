from fastapi import Header, HTTPException
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.")

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing. You must be logged in.")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise HTTPException(status_code=401, detail="Invalid Authorization header format. Expected 'Bearer <token>'.")
        
    token = parts[1]
    try:
        # Verify the JWT token by fetching the user from Supabase
        res = supabase.auth.get_user(token)
        if not res.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token.")
            
        # Create a request-scoped client so PostgREST knows who the user is for RLS
        req_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        req_client.postgrest.auth(token)
        
        return {"user": res.user, "client": req_client}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
