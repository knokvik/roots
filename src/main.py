"""
ROOTS Core Application
India Innovates 2026

FastAPI application entry point.
"""
import logging
from fastapi import FastAPI
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
