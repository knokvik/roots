"""
Layer 04: Intelligence Core Pipeline
India Innovates 2026

Master orchestration connecting ST-DBSCAN, CausalEngine, DecayCostModel, and ROIOptimizer.
"""
from typing import List, Dict, Any
from datetime import datetime, timezone

from .clustering.st_dbscan import STDBSCANClusterer
from .causal.causal_engine import CausalEngine
from .decay.decay_model import DecayCostModel
from .optimizer.roi_optimizer import ROIOptimizer, RepairTask

def run_roots_pipeline(complaints: List[Dict[str, Any]], budget_inr: float,
                       ward_density_class: int = 3) -> Dict[str, Any]:
    """
    Run the full ROOTS intelligence pipeline.

    Args:
        complaints: List of complaint dictionaries.
        budget_inr: Available budget in INR.
        ward_density_class: Population density class (1-5).

    Returns:
        Dictionary with full pipeline results.
    """
    # 1. Run clustering
    clusterer = STDBSCANClusterer(ward_density_class=ward_density_class)
    clusters = clusterer.fit(complaints)

    causal_engine = CausalEngine()
    decay_model = DecayCostModel()
    optimizer = ROIOptimizer()

    repair_tasks = []
    root_causes_identified = []
    total_env_cost = 0.0
    total_daily_increase = 0.0
    dengue_warnings = []

    now = datetime.now(timezone.utc)

    # 2 & 3. Process each cluster
    for cluster in clusters:
        # Diagnosis
        diagnosis = causal_engine.diagnose(cluster)
        root_causes_identified.append(diagnosis["root_cause"])

        # Time elapsed
        if cluster.formed_at.tzinfo is None:
            formed_at = cluster.formed_at.replace(tzinfo=timezone.utc)
        else:
            formed_at = cluster.formed_at

        days_unresolved = max(0, (now - formed_at).days)

        # Decay calculation
        decay_res = decay_model.calculate(
            cluster.complaint_types,
            days_unresolved,
            diagnosis["estimated_repair_cost_inr"],
            ward_density_class
        )

        total_env_cost += decay_res["current_estimated_cost"]
        total_daily_increase += decay_res["daily_cost_increase"]

        if decay_res["dengue_risk_level"] in ["high", "critical"]:
            dengue_warnings.append({
                "cluster_id": cluster.cluster_id,
                "risk_level": decay_res["dengue_risk_level"],
                "note": decay_res["dengue_risk_note"]
            })

        # 4. Compile task
        # Approximate affected population
        affected_pop = cluster.complaint_count * 50 * ward_density_class

        task = RepairTask(
            task_id=f"TASK-{cluster.cluster_id}",
            root_cause=diagnosis["root_cause"],
            repair_description=diagnosis["recommended_repair"],
            estimated_cost_inr=diagnosis["estimated_repair_cost_inr"],
            env_harm_prevented_score=decay_res["env_harm_score"],
            days_unresolved=days_unresolved,
            affected_population=affected_pop
        )
        repair_tasks.append(task)

    # 5. Optimize
    opt_result = optimizer.optimize(budget_inr, repair_tasks)

    # Generate summary
    summary = (
        f"Analyzed {len(complaints)} complaints, finding {len(clusters)} core infrastructure issues. "
        f"Without intervention, total cost liability is ₹{total_env_cost:,.2f}. "
        f"Optimized budget of ₹{budget_inr:,.2f} covers {len(opt_result['tasks_selected'])} repairs, "
        f"preventing significant environmental harm."
    )

    # 6. Return comprehensive report
    return {
        "clusters_found": len(clusters),
        "root_causes_identified": root_causes_identified,
        "total_env_cost_if_unresolved": total_env_cost,
        "total_daily_increase": total_daily_increase,
        "recommended_repairs": opt_result["tasks_selected"],
        "deferred_repairs": opt_result["tasks_deferred"],
        "dengue_risk_warnings": dengue_warnings,
        "summary": summary
    }
