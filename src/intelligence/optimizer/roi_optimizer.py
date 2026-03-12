"""
Layer 04d: Environmental ROI Budget Optimizer
India Innovates 2026

Ranks repair tasks by environmental return per rupee.
"""
from typing import List, Dict, Any
from dataclasses import dataclass

@dataclass
class RepairTask:
    """Dataclass representing a repair task derived from a complaint cluster."""
    task_id: str
    root_cause: str
    repair_description: str
    estimated_cost_inr: float
    env_harm_prevented_score: float
    days_unresolved: int
    affected_population: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "task_id": self.task_id,
            "root_cause": self.root_cause,
            "repair_description": self.repair_description,
            "estimated_cost_inr": self.estimated_cost_inr,
            "env_harm_prevented_score": self.env_harm_prevented_score,
            "days_unresolved": self.days_unresolved,
            "affected_population": self.affected_population
        }


class ROIOptimizer:
    """
    ROI Budget Optimizer using greedy 0/1 knapsack approximation.
    """

    def optimize(self, budget_inr: float, repair_tasks: List[RepairTask]) -> Dict[str, Any]:
        """
        Select the optimal subset of tasks that maximizes environmental ROI within the budget.

        Args:
            budget_inr: The available budget in INR.
            repair_tasks: List of RepairTask objects to consider.

        Returns:
            Dictionary with optimization results.
        """
        # Calculate ROI ratio for each task
        task_ratios = []
        for task in repair_tasks:
            # ROI = env harm prevented per unit cost
            roi_ratio = task.env_harm_prevented_score / max(1.0, task.estimated_cost_inr)
            task_ratios.append((roi_ratio, task))

        # Sort descending by ROI
        task_ratios.sort(key=lambda x: x[0], reverse=True)

        selected_tasks = []
        deferred_tasks = []
        current_cost = 0.0
        total_env_prevented = 0.0

        for ratio, task in task_ratios:
            if current_cost + task.estimated_cost_inr <= budget_inr:
                selected_tasks.append(task)
                current_cost += task.estimated_cost_inr
                total_env_prevented += task.env_harm_prevented_score
            else:
                deferred_tasks.append(task)

        utilization_pct = (current_cost / budget_inr * 100) if budget_inr > 0 else 0
        top_priority = selected_tasks[0] if selected_tasks else None

        return {
            "budget_inr": budget_inr,
            "tasks_selected": [t.to_dict() for t in selected_tasks],
            "tasks_deferred": [t.to_dict() for t in deferred_tasks],
            "total_cost_selected": current_cost,
            "total_env_harm_prevented": total_env_prevented,
            "budget_utilization_pct": utilization_pct,
            "top_priority_task": top_priority.to_dict() if top_priority else None
        }
