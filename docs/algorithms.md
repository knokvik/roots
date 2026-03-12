# ROOTS Core Algorithms
*India Innovates 2026*

## Spatiotemporal DBSCAN (ST-DBSCAN)
**Purpose:** Groups related civic complaints that occur near each other in both space (geography) and time.
**Logic:** A modification of traditional DBSCAN. Points are clustered only if their Haversine distance is less than an epsilon `ε` *and* their temporal difference is within a `time_window_hours`. ROOTS uses a dynamic `ε` based on ward population density (dense wards have smaller search radii).
**Reference:** Birant, D., & Kut, A. (2007). *ST-DBSCAN: An algorithm for clustering spatial–temporal data*. Data & Knowledge Engineering, 60(1), 208-221.

## Causal Knowledge Graph Engine
**Purpose:** Identifies the root infrastructure failure causing a cluster of seemingly disparate complaints.
**Logic:** Analyzes the set of `complaint_types` in a formed cluster and matches them against predefined failure signatures. The engine calculates a confidence score based on the ratio of matching types. If the score exceeds 0.84, it classifies the root cause (e.g., "Subsurface Drainage Failure").

## Environmental Decay Cost Model
**Purpose:** Converts unresolved, lingering complaints into real-time compounding financial liability and flags vector-borne disease risks (like Dengue).
**Formula:** `C_total(t) = [C_repair * e^(λt)] + sum(alpha_i * H_i(t) * P_density)`
- `C_repair`: Baseline repair cost
- `λ`: Decay rate constant specific to the issue type
- `t`: Days elapsed
- `alpha_i`: Environmental severity weight
- `H_i(t)`: Harm factor over time
- `P_density`: Population density multiplier

## Environmental ROI Budget Optimizer
**Purpose:** Selects the optimal set of repair tasks to maximize environmental harm prevented, subject to a fixed municipal budget.
**Logic:** Uses a greedy 0/1 knapsack approximation. Tasks are scored by an ROI ratio (`env_harm_prevented_score / estimated_cost_inr`). They are then sorted descending by ROI and selected until the budget is exhausted.

## Equity Auditor (XGBoost + SHAP)
**Purpose:** Analyzes the system for bias in complaint resolution times across different socio-economic wards (Article 14 equity compliance).
**Reference:**
- Chen, T., & Guestrin, C. (2016). *XGBoost: A scalable tree boosting system*.
- Lundberg, S. M., & Lee, S. I. (2017). *A unified approach to interpreting model predictions*.
