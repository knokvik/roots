"""
ROOTS Core Application
India Innovates 2026

FastAPI application entry point.
"""
import logging

from fastapi import FastAPI, Query, HTTPException, Body
from typing import Optional, List, Dict, Any
from src.db_service import db_service
import traceback

from fastapi.middleware.cors import CORSMiddleware
from src.intake.whatsapp_webhook import router as whatsapp_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="ROOTS Urban OS",
    description="Responsive Optimization of Urban Infrastructure Through AI",
    version="3.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(whatsapp_router, prefix="/api/v1/intake", tags=["WhatsApp"])

@app.on_event("startup")
async def startup_event():
    """Execute startup actions."""
    print("=" * 60)
    print("ROOTS v3.0 running — Ward 78 Sadar Bazaar")
    print("=" * 60)

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "system": "ROOTS Urban OS",
        "version": "3.0",
        "ward": "Ward 78 Sadar Bazaar",
        "status": "operational"
    }


@app.get("/api/complaints")
async def get_complaints(ward_id: Optional[str] = Query(None)):
    try:
        if not db_service.client:
            raise HTTPException(status_code=503, detail="Supabase not configured")
        return db_service.get_complaints(ward_id=ward_id)
    except Exception as e:
        print(f"Error fetching complaints: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complaints")
async def create_complaint(complaint: Dict[str, Any] = Body(...)):
    try:
        if not db_service.client:
            raise HTTPException(status_code=503, detail="Supabase not configured")
        # In a real scenario we'd run NLP/Vision here. For now, just insert.
        import uuid
        from datetime import datetime, timezone
        if "complaint_id" not in complaint:
            complaint["complaint_id"] = f"C-WEB-{str(uuid.uuid4())[:8]}"
        if "timestamp" not in complaint:
            complaint["timestamp"] = datetime.now(timezone.utc).isoformat()
        if "ward_id" not in complaint:
            complaint["ward_id"] = "ward78"
            complaint["ward_name"] = "Sadar Bazaar"
        if "status" not in complaint:
            complaint["status"] = "open"

        return db_service.create_complaint(complaint)
    except Exception as e:
        print(f"Error creating complaint: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/clusters")
async def get_clusters(ward_id: Optional[str] = Query(None)):
    try:
        if not db_service.client:
            raise HTTPException(status_code=503, detail="Supabase not configured")
        return db_service.get_clusters(ward_id=ward_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/repair-tasks")
async def get_repair_tasks(ward_id: Optional[str] = Query(None)):
    try:
        if not db_service.client:
            raise HTTPException(status_code=503, detail="Supabase not configured")
        return db_service.get_repair_tasks(ward_id=ward_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ward-health")
async def get_ward_health(ward_id: str = Query(..., description="The ward ID")):
    try:
        if not db_service.client:
            raise HTTPException(status_code=503, detail="Supabase not configured")
        return db_service.get_ward_health(ward_id=ward_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def get_status():
    if db_service.client:
        return {"status": "live"}
    return {"status": "demo"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
