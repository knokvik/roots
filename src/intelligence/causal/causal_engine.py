"""
Layer 04b: Causal Knowledge Graph Engine
India Innovates 2026

Identifies root infrastructure failure from a complaint cluster.
"""
from typing import List, Dict, Any, Tuple
from ..clustering.st_dbscan import Cluster

FAILURE_SIGNATURES = {
    "subsurface_drainage_failure": {
        "name": "Subsurface Drainage Failure",
        "required_complaint_types": ["waterlogging", "pothole", "damp_wall"],
        "description": "Underground pipe rupture causing surface flooding, road base erosion, and adjacent property seepage.",
        "recommended_repair": "Excavate and replace underground drainage segment. Reinforce road base.",
        "estimated_repair_cost_inr": 150000
    },
    "surface_drainage_blockage": {
        "name": "Surface Drainage Blockage",
        "required_complaint_types": ["waterlogging", "garbage"],
        "description": "Solid waste blocking storm water drains leading to localized street flooding.",
        "recommended_repair": "Deploy hydro-jetting to clear storm drains. Clear adjacent solid waste.",
        "estimated_repair_cost_inr": 25000
    },
    "road_base_erosion": {
        "name": "Road Base Erosion",
        "required_complaint_types": ["pothole", "road_damage", "waterlogging"],
        "description": "Water stagnation weakening road sub-grade leading to massive surface failures.",
        "recommended_repair": "Mill existing surface, restore sub-grade profile, relay asphalt.",
        "estimated_repair_cost_inr": 350000
    },
    "solid_waste_overflow": {
        "name": "Solid Waste Overflow",
        "required_complaint_types": ["garbage", "mosquito", "air_quality"],
        "description": "Uncollected organic waste breeding vectors and producing noxious odors.",
        "recommended_repair": "Emergency waste clearing, fumigation, and re-routing of collection trucks.",
        "estimated_repair_cost_inr": 15000
    },
    "sewer_line_failure": {
        "name": "Sewer Line Failure",
        "required_complaint_types": ["waterlogging", "damp_wall"],
        "description": "Sewer line blockage or collapse causing backflow into properties and streets.",
        "recommended_repair": "CCTV inspection of sewer line and targeted pipe replacement.",
        "estimated_repair_cost_inr": 120000
    },
    "green_space_neglect": {
        "name": "Green Space Neglect",
        "required_complaint_types": ["mosquito", "garbage", "waterlogging"],
        "description": "Unmaintained parks turning into dumping grounds with stagnant water.",
        "recommended_repair": "Clear vegetation, level ground for drainage, remove solid waste.",
        "estimated_repair_cost_inr": 45000
    },
    "electrical_infrastructure": {
        "name": "Electrical Infrastructure Damage",
        "required_complaint_types": ["road_damage", "pothole"],
        "description": "Underground cable fault or repair leaving un-restored road cuts.",
        "recommended_repair": "Coordinate with DISCOM to restore trench and relay road surface.",
        "estimated_repair_cost_inr": 80000
    },
    "building_structural": {
        "name": "Building Structural Threat",
        "required_complaint_types": ["damp_wall", "road_damage"],
        "description": "Foundation settling due to adjacent public infrastructure failure.",
        "recommended_repair": "Structural audit followed by localized public works reinforcement.",
        "estimated_repair_cost_inr": 200000
    }
}

class CausalEngine:
    """
    Engine to diagnose root cause of complaint clusters by matching complaint types
    against known failure signatures.
    """
    def __init__(self, confidence_threshold: float = 0.84):
        """
        Initialize the engine.

        Args:
            confidence_threshold (float): Minimum confidence to classify a root cause.
        """
        self.confidence_threshold = confidence_threshold

    def diagnose(self, cluster: Cluster) -> Dict[str, Any]:
        """
        Diagnose the root cause for a given cluster.

        Args:
            cluster (Cluster): The spatiotemporal cluster of complaints.

        Returns:
            Dictionary containing diagnosis results.
        """
        cluster_types = set(cluster.complaint_types)
        best_signature_key = None
        best_score = 0.0
        all_scores = {}

        for key, signature in FAILURE_SIGNATURES.items():
            req_types = set(signature["required_complaint_types"])

            # Count matches
            matches = len(req_types.intersection(cluster_types))

            # Base score calculation
            base_score = matches / len(req_types) if req_types else 0.0

            # Only apply logic if base score is positive
            if base_score > 0:
                # If ALL required types are present, base score is 1.0
                # Extra types boost score by 0.05
                extra_types_count = len(cluster_types - req_types)
                score = base_score + (extra_types_count * 0.05)
            else:
                score = 0.0

            all_scores[key] = score

            if score > best_score:
                best_score = score
                best_signature_key = key

        if best_signature_key and best_score > self.confidence_threshold:
            sig = FAILURE_SIGNATURES[best_signature_key]
            return {
                "root_cause": sig["name"],
                "confidence": min(1.0, best_score), # Cap at 1.0
                "description": sig["description"],
                "recommended_repair": sig["recommended_repair"],
                "estimated_repair_cost_inr": sig["estimated_repair_cost_inr"],
                "all_scores": all_scores
            }
        else:
            return {
                "root_cause": "unclassified",
                "confidence": best_score,
                "description": "Cluster pattern does not strongly match known infrastructure failure signatures.",
                "recommended_repair": "Requires manual inspection by field officer.",
                "estimated_repair_cost_inr": 50000, # Default inspection/minor repair cost
                "all_scores": all_scores
            }
