# ROOTS Developer Guide for AI Coding Agents

## Project Overview
ROOTS (Responsive Optimization of Urban Infrastructure Through AI) is a 7-layer urban intelligence operating system designed for Indian cities. It converts incoming citizen complaints into root-cause infrastructure analysis, calculates the compounding environmental cost of inaction, and optimizes municipal repair budgets using an ROI ratio.

## Architecture Summary
The system operates across 7 distinct layers:
- Layer 01: Intake (WhatsApp, Web, IVR)
- Layer 02: Language & Identity (Bhashini, DigiLocker)
- Layer 03: Vision & Geo-Enrichment (Gemini Vision, PostGIS)
- Layer 04: Intelligence Core (AI Algorithms for root-cause and decay)
- Layer 05: Civic Digital Twin (Real-time mapping)
- Layer 06: CSR & Carbon Credit Bridge (Funding mechanism)
- Layer 07: Dashboards (Next.js frontend)

## Key Files
- `src/intelligence/pipeline.py`: Master orchestration for Layer 04
- `src/intelligence/clustering/st_dbscan.py`: Spatial-temporal clustering algorithm
- `src/intelligence/causal/causal_engine.py`: Matches clusters to failure signatures
- `src/intelligence/decay/decay_model.py`: Calculates exponential environmental cost
- `src/intelligence/optimizer/roi_optimizer.py`: Greedy knapsack budget optimizer
- `src/main.py`: FastAPI application entry point
- `demo/run_demo.py`: Demo script executing the pipeline on sample data

## Core Data Flow
1. **Intake**: Incoming Complaint JSON from Layer 01.
2. **Clustering**: `STDBSCANClusterer` groups related complaints based on time/distance.
3. **Causality**: `CausalEngine` analyzes the cluster's combined tags to find the root cause.
4. **Decay**: `DecayCostModel` evaluates how the problem's cost grows and flags health risks (Dengue).
5. **Optimization**: `ROIOptimizer` ranks repairs within budget constraints to maximize environmental ROI.
6. **Output**: Sent to Dashboards for Officer/Citizen viewing.

## Running the Application
1. Install dependencies: `pip install -r requirements.txt` (or `make install`)
2. Run API server: `uvicorn src.main:app --reload` (or `make run`)
3. Run Demo: `python demo/run_demo.py` (or `make demo`)

## Coding Conventions
- **Typing**: Use comprehensive Python type hints for all functions, methods, and dataclasses.
- **Currency**: All financial variables must be represented in Indian Rupees (INR) as `float` (e.g., `estimated_cost_inr`).
- **Geospatial**: Always represent GPS coordinates as `(latitude, longitude)` float pairs.
- **Docstrings**: Include module-level docstrings mentioning the Layer and "India Innovates 2026". Include docstrings for all classes and public methods.
