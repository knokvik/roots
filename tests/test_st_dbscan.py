"""
Layer 04a: ST-DBSCAN Unit Tests
India Innovates 2026

Unit tests for the spatiotemporal clustering algorithm.
"""
import pytest
from datetime import datetime, timedelta, timezone
from src.intelligence.clustering.st_dbscan import STDBSCANClusterer

def create_dummy_complaints(coords_times):
    """Helper to create minimal complaint dicts for testing."""
    complaints = []
    base_time = datetime(2024, 3, 1, 12, 0, 0, tzinfo=timezone.utc)

    for i, (lat, lon, hours_offset) in enumerate(coords_times):
        dt = base_time + timedelta(hours=hours_offset)
        complaints.append({
            "complaint_id": f"C{i}",
            "latitude": lat,
            "longitude": lon,
            "timestamp": dt.isoformat(),
            "complaint_type": "test_type",
            "ward_id": "W01",
            "ward_name": "Test Ward",
            "severity": 0.5,
            "description": "test",
            "source_channel": "Web",
            "is_verified": True,
            "status": "open"
        })
    return complaints

def test_clustering_within_radius_and_time():
    """Test 1: Complaints within radius AND time window are clustered together."""
    # Class 3 -> eps = 400m
    clusterer = STDBSCANClusterer(ward_density_class=3, time_window_hours=72, min_pts=2)

    # Very close spatially (few meters apart) and temporally (1 hour apart)
    coords_times = [
        (28.656200, 77.214000, 0),
        (28.656250, 77.214050, 1),
        (28.656150, 77.213950, 2)
    ]

    complaints = create_dummy_complaints(coords_times)
    clusters = clusterer.fit(complaints)

    assert len(clusters) == 1
    assert clusters[0].complaint_count == 3
    assert set(clusters[0].complaint_ids) == {"C0", "C1", "C2"}

def test_clustering_outside_time_window():
    """Test 2: Complaints outside time window are NOT clustered."""
    clusterer = STDBSCANClusterer(ward_density_class=3, time_window_hours=72, min_pts=2)

    # Close spatially, but C2 is 100 hours later (outside 72h window)
    # C0 and C1 should cluster, C2 should be noise
    coords_times = [
        (28.656200, 77.214000, 0),
        (28.656250, 77.214050, 1),
        (28.656150, 77.213950, 100) # Outside window
    ]

    complaints = create_dummy_complaints(coords_times)
    clusters = clusterer.fit(complaints)

    assert len(clusters) == 1
    assert clusters[0].complaint_count == 2
    assert set(clusters[0].complaint_ids) == {"C0", "C1"}
    assert "C2" not in clusters[0].complaint_ids

def test_dynamic_epsilon_by_density():
    """Test 3: Dynamic epsilon changes correctly with density class."""

    # Two points exactly ~330 meters apart
    # 28.6562, 77.2140 to 28.6592, 77.2140 is ~333 meters
    coords_times = [
        (28.656200, 77.214000, 0),
        (28.659200, 77.214000, 1)
    ]

    complaints = create_dummy_complaints(coords_times)

    # Class 4 -> eps = 300m. The points are ~333m apart, so they should NOT cluster (noise).
    clusterer_dense = STDBSCANClusterer(ward_density_class=4, time_window_hours=72, min_pts=2)
    assert clusterer_dense.eps_meters == 300
    clusters_dense = clusterer_dense.fit(complaints)
    assert len(clusters_dense) == 0 # Both become noise

    # Class 3 -> eps = 400m. The points are ~333m apart, so they SHOULD cluster.
    clusterer_sparse = STDBSCANClusterer(ward_density_class=3, time_window_hours=72, min_pts=2)
    assert clusterer_sparse.eps_meters == 400
    clusters_sparse = clusterer_sparse.fit(complaints)
    assert len(clusters_sparse) == 1
    assert clusters_sparse[0].complaint_count == 2
