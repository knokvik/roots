"""
Demo Script for ROOTS Pipeline
India Innovates 2026
"""
import json
import os
import sys

# Ensure src is in Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.intelligence.pipeline import run_roots_pipeline

def main():
    print("=" * 60)
    print("ROOTS v3.0 INTELLIGENCE PIPELINE DEMO")
    print("=" * 60)
    print("\nLoading data/ward78/sample_complaints.json...")

    with open('data/ward78/sample_complaints.json', 'r') as f:
        complaints = json.load(f)

    print(f"Loaded {len(complaints)} individual complaints.")

    budget_inr = 500000.0
    print(f"Processing through ST-DBSCAN -> Causal Engine -> Decay Model -> ROI Optimizer")
    print(f"Available Budget: ₹{budget_inr:,.2f}")

    # Run the pipeline
    results = run_roots_pipeline(complaints, budget_inr=budget_inr, ward_density_class=3)

    print("\n" + "=" * 60)
    print("DEMO RESULTS REPORT")
    print("=" * 60)

    print(f"\n[ CLUSTERING ]")
    print(f"Clusters Found: {results['clusters_found']}")

    print(f"\n[ ROOT CAUSES DIAGNOSED ]")
    for cause in results['root_causes_identified']:
        print(f" - {cause}")

    print(f"\n[ ENVIRONMENTAL COST MODEL ]")
    print(f"Total Environmental Cost Liability: ₹{results['total_env_cost_if_unresolved']:,.2f}")
    if len(results['recommended_repairs']) > 0:
        first_repair_cost = results['recommended_repairs'][0]['estimated_cost_inr']
        first_env_cost = results['recommended_repairs'][0]['env_harm_prevented_score']
        print(f"Daily Compounding Cost Increase: ₹{results['total_daily_increase']:,.2f}")

    print(f"\n[ PUBLIC HEALTH / DENGUE WARNINGS ]")
    if not results['dengue_risk_warnings']:
        print(" - None")
    for warning in results['dengue_risk_warnings']:
        print(f" - WARNING: {warning['risk_level'].upper()} risk for Cluster {warning['cluster_id']}: {warning['note']}")

    print(f"\n[ TOP 3 REPAIRS RANKED BY ROI (Budget: ₹{budget_inr:,.2f}) ]")
    selected = results['recommended_repairs']
    for i, repair in enumerate(selected[:3]):
        print(f" {i+1}. {repair['root_cause']}")
        print(f"    Desc: {repair['repair_description']}")
        print(f"    Cost: ₹{repair['estimated_cost_inr']:,.2f} | Env. Score: {repair['env_harm_prevented_score']:,.2f}")

    total_cost = sum(r['estimated_cost_inr'] for r in selected)
    remaining = budget_inr - total_cost
    print(f"\nRemaining Budget: ₹{remaining:,.2f}")
    print("\n" + "=" * 60)
    print(results['summary'])
    print("=" * 60)

if __name__ == "__main__":
    main()
