"""
Layer 04a: Spatiotemporal Clustering
India Innovates 2026

Implementation of ST-DBSCAN (Birant and Kut, 2007) for spatiotemporal
clustering of urban complaints.
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
import numpy as np
from sklearn.cluster import DBSCAN
from math import radians, sin, cos, sqrt, atan2

class Cluster:
    """Represents a spatiotemporal cluster of complaints."""
    def __init__(self, cluster_id: str, complaint_ids: List[str],
                 centroid_lat: float, centroid_lon: float,
                 complaint_types: List[str], formed_at: datetime,
                 complaint_count: int):
        self.cluster_id = cluster_id
        self.complaint_ids = complaint_ids
        self.centroid_lat = centroid_lat
        self.centroid_lon = centroid_lon
        self.complaint_types = complaint_types
        self.formed_at = formed_at
        self.complaint_count = complaint_count

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "cluster_id": self.cluster_id,
            "complaint_ids": self.complaint_ids,
            "centroid_lat": self.centroid_lat,
            "centroid_lon": self.centroid_lon,
            "complaint_types": self.complaint_types,
            "formed_at": self.formed_at.isoformat() if isinstance(self.formed_at, datetime) else self.formed_at,
            "complaint_count": self.complaint_count
        }

class STDBSCANClusterer:
    """
    ST-DBSCAN Clusterer for grouping complaints based on spatial and temporal proximity.
    Features dynamic epsilon based on ward density class.
    """
    def __init__(self, ward_density_class: int = 3, time_window_hours: float = 72.0, min_pts: int = 3):
        """
        Initialize the clusterer.

        Args:
            ward_density_class (int): Density class from 1 to 5.
            time_window_hours (float): Maximum time difference for clustering.
            min_pts (int): Minimum points to form a cluster.
        """
        self.time_window_hours = time_window_hours
        self.min_pts = min_pts
        self.eps_meters = self._get_epsilon_by_density(ward_density_class)

    def _get_epsilon_by_density(self, density_class: int) -> float:
        """Get the spatial epsilon (in meters) based on density class."""
        mapping = {1: 800, 2: 600, 3: 400, 4: 300, 5: 200}
        return mapping.get(density_class, 400)

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate the great circle distance between two points on the earth in meters."""
        R = 6371000  # radius of Earth in meters
        phi1 = radians(lat1)
        phi2 = radians(lat2)
        delta_phi = radians(lat2 - lat1)
        delta_lambda = radians(lon2 - lon1)

        a = sin(delta_phi / 2.0) ** 2 + cos(phi1) * cos(phi2) * sin(delta_lambda / 2.0) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return R * c

    def fit(self, complaints: List[Dict[str, Any]]) -> List[Cluster]:
        """
        Cluster the given complaints.

        Args:
            complaints: List of complaint dictionaries.

        Returns:
            List of Cluster objects.
        """
        if not complaints:
            return []

        # Parse timestamps and convert to standard datetime
        for c in complaints:
            if isinstance(c['timestamp'], str):
                # Handle ISO format strings
                ts_str = c['timestamp'].replace('Z', '+00:00')
                c['_dt'] = datetime.fromisoformat(ts_str)
            else:
                c['_dt'] = c['timestamp']

        n_samples = len(complaints)
        distance_matrix = np.zeros((n_samples, n_samples))

        # Calculate custom distance matrix
        for i in range(n_samples):
            for j in range(i, n_samples):
                if i == j:
                    distance_matrix[i, j] = 0
                else:
                    c1 = complaints[i]
                    c2 = complaints[j]

                    # Temporal distance
                    time_diff_hours = abs((c1['_dt'] - c2['_dt']).total_seconds()) / 3600.0

                    if time_diff_hours > self.time_window_hours:
                        # If time diff exceeds window, set distance to infinity to prevent clustering
                        dist = 1e9  # Use a large finite number instead of inf
                    else:
                        # Spatial distance using Haversine
                        dist = self.haversine_distance(
                            c1['latitude'], c1['longitude'],
                            c2['latitude'], c2['longitude']
                        )

                    distance_matrix[i, j] = dist
                    distance_matrix[j, i] = dist

        # Apply DBSCAN with precomputed metric
        # eps is in meters since our distance matrix is in meters
        dbscan = DBSCAN(eps=self.eps_meters, min_samples=self.min_pts, metric='precomputed')
        labels = dbscan.fit_predict(distance_matrix)

        clusters = []
        unique_labels = set(labels)

        for label in unique_labels:
            if label == -1:
                # Noise points
                continue

            cluster_complaints = [complaints[i] for i in range(n_samples) if labels[i] == label]

            cluster_id = f"CL-{label}-{int(datetime.now().timestamp())}"
            complaint_ids = [c['complaint_id'] for c in cluster_complaints]
            centroid_lat = sum(c['latitude'] for c in cluster_complaints) / len(cluster_complaints)
            centroid_lon = sum(c['longitude'] for c in cluster_complaints) / len(cluster_complaints)
            complaint_types = list(set(c['complaint_type'] for c in cluster_complaints))
            formed_at = min(c['_dt'] for c in cluster_complaints)

            cluster = Cluster(
                cluster_id=cluster_id,
                complaint_ids=complaint_ids,
                centroid_lat=centroid_lat,
                centroid_lon=centroid_lon,
                complaint_types=complaint_types,
                formed_at=formed_at,
                complaint_count=len(cluster_complaints)
            )
            clusters.append(cluster)

        return clusters
