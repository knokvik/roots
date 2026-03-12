"""
Supabase Seeder Script for ROOTS
India Innovates 2026
"""
import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Add parent directory to path to import db_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.db_service import db_service

def generate_random_coords(base_lat=28.6562, base_lon=77.2140, radius_deg=0.003):
    """Generate random coordinates within approx 400m radius of base."""
    lat = base_lat + random.uniform(-radius_deg, radius_deg)
    lon = base_lon + random.uniform(-radius_deg, radius_deg)
    return lat, lon

def generate_timestamp(base_time, max_offset_hours=72):
    """Generate random timestamp within offset."""
    offset = random.uniform(0, max_offset_hours)
    dt = base_time - timedelta(hours=offset)
    return dt.isoformat()

def main():
    if not db_service.client:
        print("ERROR: Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_KEY in environment.")
        return

    print("=" * 60)
    print("SEEDING SUPABASE FOR ROOTS V3.0 DEMO (WARD 78)")
    print("=" * 60)

    # Try to delete existing data to start fresh (cascade/foreign keys might complicate this,
    # but for simple seeding we'll try to just insert or let it fail if keys exist)
    print("Note: Ensure tables are created in Supabase before running this script.")

    base_time = datetime.now(timezone.utc)
    channels = ["WhatsApp", "Web", "USSD"]

    # --- 1. Generate 20 Complaints ---
    print("\nGenerating 20 complaints...")
    complaints = []

    # 8 waterlogging
    for i in range(8):
        lat, lon = generate_random_coords()
        complaints.append({
            "complaint_id": f"SEED-W-{i}",
            "ward_id": "ward78",
            "ward_name": "Sadar Bazaar",
            "latitude": lat,
            "longitude": lon,
            "complaint_type": "waterlogging",
            "severity": round(random.uniform(0.6, 0.95), 2),
            "description": f"Heavy waterlogging in Sadar Bazaar area {i}",
            "timestamp": generate_timestamp(base_time),
            "source_channel": random.choice(channels),
            "is_verified": True,
            "status": "open"
        })

    # 5 pothole
    for i in range(5):
        lat, lon = generate_random_coords()
        complaints.append({
            "complaint_id": f"SEED-P-{i}",
            "ward_id": "ward78",
            "ward_name": "Sadar Bazaar",
            "latitude": lat,
            "longitude": lon,
            "complaint_type": "pothole",
            "severity": round(random.uniform(0.6, 0.95), 2),
            "description": f"Dangerous pothole near market {i}",
            "timestamp": generate_timestamp(base_time),
            "source_channel": random.choice(channels),
            "is_verified": True,
            "status": "open"
        })

    # 4 damp_wall
    for i in range(4):
        lat, lon = generate_random_coords()
        complaints.append({
            "complaint_id": f"SEED-D-{i}",
            "ward_id": "ward78",
            "ward_name": "Sadar Bazaar",
            "latitude": lat,
            "longitude": lon,
            "complaint_type": "damp_wall",
            "severity": round(random.uniform(0.6, 0.95), 2),
            "description": f"Water seeping into building foundations {i}",
            "timestamp": generate_timestamp(base_time),
            "source_channel": random.choice(channels),
            "is_verified": True,
            "status": "open"
        })

    # 3 garbage
    for i in range(3):
        lat, lon = generate_random_coords()
        complaints.append({
            "complaint_id": f"SEED-G-{i}",
            "ward_id": "ward78",
            "ward_name": "Sadar Bazaar",
            "latitude": lat,
            "longitude": lon,
            "complaint_type": "garbage",
            "severity": round(random.uniform(0.6, 0.95), 2),
            "description": f"Garbage dump overflowing into street {i}",
            "timestamp": generate_timestamp(base_time),
            "source_channel": random.choice(channels),
            "is_verified": True,
            "status": "open"
        })

    try:
        db_service.insert_complaints(complaints)
        print(f"Successfully inserted 20 complaints.")
    except Exception as e:
        print(f"Failed to insert complaints: {e}")

    # --- 2. Generate 3 Clusters ---
    print("\nGenerating 3 clusters...")
    clusters = [
        {
            "cluster_id": "cluster_1",
            "ward_id": "ward78", # Added for easier fetching
            "root_cause": "Subsurface Drainage Failure",
            "confidence": 0.91,
            "complaint_types": ["waterlogging", "pothole", "damp_wall"],
            "formed_at": generate_timestamp(base_time, max_offset_hours=120)
        },
        {
            "cluster_id": "cluster_2",
            "ward_id": "ward78",
            "root_cause": "Solid Waste Overflow",
            "confidence": 0.87,
            "complaint_types": ["garbage", "mosquito"],
            "formed_at": generate_timestamp(base_time, max_offset_hours=72)
        },
        {
            "cluster_id": "cluster_3",
            "ward_id": "ward78",
            "root_cause": "Surface Drainage Blockage",
            "confidence": 0.85,
            "complaint_types": ["waterlogging", "garbage"],
            "formed_at": generate_timestamp(base_time, max_offset_hours=336) # Older to trigger critical dengue
        }
    ]

    try:
        db_service.insert_clusters(clusters)
        print("Successfully inserted 3 clusters.")
    except Exception as e:
        print(f"Failed to insert clusters: {e}")

    # --- 3. Generate 3 Repair Tasks ---
    print("\nGenerating 3 repair tasks...")
    repair_tasks = [
        {
            "task_id": "task_1",
            "ward_id": "ward78",
            "cluster_id": "cluster_1",
            "root_cause": "Subsurface Drainage Failure",
            "repair_description": "Excavate and replace underground drainage segment. Reinforce road base.",
            "estimated_cost_inr": 150000,
            "env_harm_prevented_score": 8200,
            "days_unresolved": 5,
            "complaint_type": "waterlogging",
            "dengue_risk_level": "high",
            "affected_population": 3000
        },
        {
            "task_id": "task_2",
            "ward_id": "ward78",
            "cluster_id": "cluster_3",
            "root_cause": "Surface Drainage Blockage",
            "repair_description": "Deploy hydro-jetting to clear storm drains. Clear adjacent solid waste.",
            "estimated_cost_inr": 25000,
            "env_harm_prevented_score": 4839,
            "days_unresolved": 14,
            "complaint_type": "waterlogging",
            "dengue_risk_level": "critical",
            "affected_population": 1500
        },
        {
            "task_id": "task_3",
            "ward_id": "ward78",
            "cluster_id": "cluster_2",
            "root_cause": "Solid Waste Overflow",
            "repair_description": "Emergency waste clearing, fumigation, and re-routing of collection trucks.",
            "estimated_cost_inr": 15000,
            "env_harm_prevented_score": 1200,
            "days_unresolved": 3,
            "complaint_type": "garbage",
            "dengue_risk_level": "low",
            "affected_population": 800
        }
    ]

    try:
        db_service.insert_repair_tasks(repair_tasks)
        print("Successfully inserted 3 repair tasks.")
    except Exception as e:
        print(f"Failed to insert repair tasks: {e}")

    # --- 4. Generate Ward Health ---
    print("\nGenerating ward health record...")
    ward_health = {
        "ward_id": "ward78",
        "ward_name": "Sadar Bazaar",
        "health_score": 0.43,
        "active_clusters": 3,
        "total_env_cost_inr": 124000,
        "dengue_risk_level": "high",
        "updated_at": base_time.isoformat()
    }

    try:
        db_service.insert_ward_health(ward_health)
        print("Successfully inserted ward health record.")
    except Exception as e:
        print(f"Failed to insert ward health: {e}")

    print("\n" + "=" * 60)
    print("SEEDING COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    main()
