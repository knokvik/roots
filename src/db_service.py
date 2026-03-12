"""
Database Service for Supabase
India Innovates 2026
"""
import os
from typing import List, Dict, Any, Optional
from supabase import create_client, Client

class DBService:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL", "")
        supabase_key = os.getenv("SUPABASE_KEY", "")
        if not supabase_url or not supabase_key:
            # Fallback for dummy initialization if not present in env
            # Allows the app to run (and return errors/mock data) without crashing
            self.client = None
        else:
            self.client: Client = create_client(supabase_url, supabase_key)

    def _check_client(self):
        if not self.client:
            raise Exception("Supabase client not initialized. Check SUPABASE_URL and SUPABASE_KEY.")

    # --- Complaints ---
    def insert_complaints(self, complaints: List[Dict[str, Any]]):
        self._check_client()
        return self.client.table("complaints").insert(complaints).execute()

    def get_complaints(self, ward_id: Optional[str] = None) -> List[Dict[str, Any]]:
        self._check_client()
        query = self.client.table("complaints").select("*")
        if ward_id:
            query = query.eq("ward_id", ward_id)
        # Order by timestamp descending
        result = query.order("timestamp", desc=True).execute()
        return result.data

    def create_complaint(self, complaint: Dict[str, Any]) -> Dict[str, Any]:
        self._check_client()
        result = self.client.table("complaints").insert(complaint).execute()
        return result.data[0] if result.data else {}

    # --- Clusters ---
    def insert_clusters(self, clusters: List[Dict[str, Any]]):
        self._check_client()
        return self.client.table("clusters").insert(clusters).execute()

    def get_clusters(self, ward_id: Optional[str] = None) -> List[Dict[str, Any]]:
        self._check_client()
        query = self.client.table("clusters").select("*")
        if ward_id:
            # Assuming clusters don't have ward_id directly in this schema,
            # we might need to fetch all or add ward_id to clusters.
            # For simplicity, returning all or filtering logic.
            pass
        result = query.execute()
        return result.data

    # --- Repair Tasks ---
    def insert_repair_tasks(self, tasks: List[Dict[str, Any]]):
        self._check_client()
        return self.client.table("repair_tasks").insert(tasks).execute()

    def get_repair_tasks(self, ward_id: Optional[str] = None) -> List[Dict[str, Any]]:
        self._check_client()
        query = self.client.table("repair_tasks").select("*")
        # Order by ROI roughly (highest env score / cost) or just by days unresolved
        result = query.order("days_unresolved", desc=True).execute()
        return result.data

    # --- Ward Health ---
    def insert_ward_health(self, health: Dict[str, Any]):
        self._check_client()
        return self.client.table("ward_health").upsert(health).execute()

    def get_ward_health(self, ward_id: str) -> Dict[str, Any]:
        self._check_client()
        result = self.client.table("ward_health").select("*").eq("ward_id", ward_id).execute()
        return result.data[0] if result.data else {}

db_service = DBService()
