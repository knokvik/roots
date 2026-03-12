"""
Layer 01: Citizen Input Channel
India Innovates 2026

FastAPI webhook for WhatsApp Cloud API.
"""
import os
from fastapi import APIRouter, Request, HTTPException, Query
from datetime import datetime
import json

router = APIRouter()

# Verify token from Meta dashboard
VERIFY_TOKEN = os.getenv("WHATSAPP_TOKEN", "roots_secret_verify_token")

@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token")
):
    """
    Meta Webhook Verification.
    """
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        print("Webhook verified successfully!")
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Invalid verification token")

@router.post("/webhook")
async def receive_message(request: Request):
    """
    Receive WhatsApp messages and process them into complaints.
    """
    body = await request.json()

    # Process the message (Stubbed logic for now)
    try:
        # Navigate through the WhatsApp Cloud API payload structure
        if "object" in body and body["object"] == "whatsapp_business_account":
            for entry in body.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    if "messages" in value:
                        for msg in value["messages"]:
                            sender_phone = msg.get("from")
                            msg_type = msg.get("type")

                            print(f"Received {msg_type} message from {sender_phone}")

                            # Extract text
                            text = ""
                            if msg_type == "text":
                                text = msg.get("text", {}).get("body", "")

                            # Extract location
                            lat = None
                            lon = None
                            if msg_type == "location":
                                lat = msg.get("location", {}).get("latitude")
                                lon = msg.get("location", {}).get("longitude")

                            # Extract image URL stub
                            image_id = None
                            if msg_type == "image":
                                image_id = msg.get("image", {}).get("id")

                            # Create a stub complaint object
                            complaint = {
                                "complaint_id": f"WA-{int(datetime.now().timestamp())}",
                                "ward_id": "W78",
                                "ward_name": "Sadar Bazaar",
                                "latitude": lat or 28.6562,
                                "longitude": lon or 77.2140,
                                "complaint_type": "unclassified", # Requires NLP/Vision parsing
                                "severity": 0.5,
                                "description": text,
                                "timestamp": datetime.now().isoformat(),
                                "source_channel": "WhatsApp",
                                "is_verified": True,
                                "status": "open",
                                "sender_phone": sender_phone,
                                "image_id": image_id
                            }

                            # Call process_complaint stub
                            print(f"Processed new complaint: {json.dumps(complaint, indent=2)}")

            return {"status": "success"}
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return {"status": "error"}

    return {"status": "received"}
