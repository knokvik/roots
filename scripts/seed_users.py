"""
Supabase User Seeding Script for ROOTS
India Innovates 2026

How to run:
  export SUPABASE_URL=your_url
  export SUPABASE_KEY=your_service_role_key
  python scripts/seed_users.py
"""
import os
import sys

# Ensure parent is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.db_service import db_service

def main():
    if not db_service.client:
        print("ERROR: Supabase client not initialized. Ensure SUPABASE_URL and SUPABASE_KEY (service_role) are set.")
        return

    print("=" * 60)
    print("SEEDING SUPABASE DEMO USERS (WARD 78)")
    print("=" * 60)

    demo_users = [
        {
            "email": "citizen@roots.demo",
            "password": "Roots@2026",
            "role": "citizen",
            "full_name": "Ravi Kumar (Citizen)",
            "phone": "+919876543210"
        },
        {
            "email": "officer@roots.demo",
            "password": "Roots@2026",
            "role": "ward_officer",
            "full_name": "Priya Sharma (Officer)",
            "phone": "+919876543211"
        },
        {
            "email": "admin@roots.demo",
            "password": "Roots@2026",
            "role": "mcd_admin",
            "full_name": "Vikram Singh (Admin)",
            "phone": "+919876543212"
        },
        {
            "email": "researcher@roots.demo",
            "password": "Roots@2026",
            "role": "researcher",
            "full_name": "Dr. Anita Desai (Research)",
            "phone": "+919876543213"
        }
    ]

    for user_data in demo_users:
        email = user_data["email"]
        try:
            # Note: We don't have a direct "get user by email" in the simple python client without admin API,
            # so we'll try to create it, and catch the exception if it already exists.
            res = db_service.client.auth.admin.create_user({
                "email": email,
                "password": user_data["password"],
                "email_confirm": True
            })

            user_id = res.user.id
            print(f"Created Auth User: {email} (ID: {user_id})")

            # Create profile
            profile = {
                "id": user_id,
                "full_name": user_data["full_name"],
                "phone": user_data["phone"],
                "role": user_data["role"],
                "ward_id": "ward78",
                "ward_name": "Sadar Bazaar"
            }

            db_service.client.table("user_profiles").upsert(profile).execute()
            print(f"Created Profile for {email}")

        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                print(f"User {email} already exists. Skipping.")
            else:
                print(f"Error creating {email}: {e}")

    print("\nUser seeding process finished.")

if __name__ == "__main__":
    main()
