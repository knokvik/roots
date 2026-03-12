"""
Layer 04c: Environmental Decay Cost Model
India Innovates 2026

Calculates exponential growth of environmental and financial liability over time.
"""
from typing import Dict, Any, List
import math

class DecayCostModel:
    """
    Environmental Decay Cost Model using exponential growth formula.
    C_total(t) = [C_repair * e^(lambda*t)] + sum(alpha_i * H_i(t) * P_density)
    """

    # Constants for the model
    LAMBDAS = {
        "waterlogging": 0.08,
        "pothole": 0.05,
        "garbage": 0.06,
        "default": 0.04
    }

    ALPHAS = {
        "waterlogging": 1.4,
        "garbage": 1.2,
        "default": 1.0
    }

    SEVERITY_MULTIPLIERS = {
        "waterlogging": 1.5,
        "garbage": 1.2,
        "default": 1.0
    }

    P_DENSITY_MULTIPLIERS = {
        1: 0.6,
        2: 0.8,
        3: 1.0,
        4: 1.3,
        5: 1.6
    }

    def _get_dengue_risk(self, complaint_types: List[str], days_elapsed: int) -> tuple[str, str]:
        """Calculate dengue risk level based on waterlogging duration."""
        if "waterlogging" not in complaint_types:
            return "low", "No significant waterlogging detected."

        if days_elapsed <= 6:
            return "low", "Waterlogging present, monitor for clearing."
        elif days_elapsed <= 9:
            return "medium", "Water stagnation approaching mosquito breeding cycle."
        elif days_elapsed <= 13:
            return "high", "Active mosquito breeding likely. Immediate vector control needed."
        else:
            return "critical", "Severe public health risk. Outbreak probability high."

    def calculate(self, cluster_complaint_types: List[str], days_elapsed: int,
                  baseline_repair_cost: float, population_density_class: int,
                  ward_name: str = "Ward 78") -> Dict[str, Any]:
        """
        Calculate the total cost and environmental harm.

        Args:
            cluster_complaint_types: List of complaint types in the cluster.
            days_elapsed: Days since the earliest complaint.
            baseline_repair_cost: Initial estimated repair cost.
            population_density_class: 1 to 5.
            ward_name: Name of the ward.

        Returns:
            Dictionary with calculation results.
        """
        # We need to compute C_total(t) = [C_repair * e^(lambda*t)] + sum(alpha_i * H_i(t) * P_density)
        # We use the max lambda across the complaint types to govern the exponential repair cost growth.
        max_lambda = self.LAMBDAS["default"]
        for ctype in cluster_complaint_types:
            if ctype in self.LAMBDAS and self.LAMBDAS[ctype] > max_lambda:
                max_lambda = self.LAMBDAS[ctype]

        p_density = self.P_DENSITY_MULTIPLIERS.get(population_density_class, 1.0)

        # Exponential repair cost: C_repair * e^(lambda * t)
        exp_repair_cost = baseline_repair_cost * math.exp(max_lambda * days_elapsed)
        next_exp_cost = baseline_repair_cost * math.exp(max_lambda * (days_elapsed + 1))

        # Environmental harm term sum: sum(alpha_i * H_i(t) * P_density)
        env_harm_score = 0.0
        next_env_score = 0.0

        for ctype in cluster_complaint_types:
            alpha = self.ALPHAS.get(ctype, self.ALPHAS["default"])
            sev = self.SEVERITY_MULTIPLIERS.get(ctype, self.SEVERITY_MULTIPLIERS["default"])

            # H_i(t) = days_elapsed * severity_multiplier
            h_t = days_elapsed * sev
            env_harm_score += alpha * h_t * p_density

            next_h_t = (days_elapsed + 1) * sev
            next_env_score += alpha * next_h_t * p_density

        # Total Cost combines repair and environmental impact score (score is mapped to INR)
        total_cost = exp_repair_cost + env_harm_score
        next_total = next_exp_cost + next_env_score

        daily_increase = next_total - total_cost

        dengue_risk, dengue_note = self._get_dengue_risk(cluster_complaint_types, days_elapsed)

        return {
            "days_elapsed": days_elapsed,
            "baseline_repair_cost": baseline_repair_cost,
            "current_estimated_cost": total_cost,
            "daily_cost_increase": daily_increase,
            "dengue_risk_level": dengue_risk,
            "dengue_risk_note": dengue_note,
            "env_harm_score": env_harm_score,
            "recommended_action": f"Immediate repair required in {ward_name}. Delaying 1 day costs an additional ₹{daily_increase:,.2f}."
        }
