import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';
const FASTAPI_URL = 'http://localhost:8000/api/repair-tasks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wardId = searchParams.get('ward_id');
  const url = wardId ? `${FASTAPI_URL}?ward_id=${wardId}` : FASTAPI_URL;

  try {
    const response = await axios.get(url, { timeout: 2000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('FastAPI server unreachable. Returning mock data.');
    const dummyTasks = [
      { task_id: "T-001", root_cause: "Surface Drainage Blockage", repair_description: "Deploy hydro-jetting to clear storm drains.", estimated_cost_inr: 25000, env_harm_prevented_score: 4839, days_unresolved: 14, affected_population: 1500, complaint_type: "waterlogging", dengue_risk_level: "critical" },
      { task_id: "T-002", root_cause: "Subsurface Drainage Failure", repair_description: "Excavate and replace underground drainage segment.", estimated_cost_inr: 150000, env_harm_prevented_score: 8200, days_unresolved: 5, affected_population: 3000, complaint_type: "waterlogging", dengue_risk_level: "high" },
      { task_id: "T-003", root_cause: "Solid Waste Overflow", repair_description: "Emergency waste clearing, fumigation.", estimated_cost_inr: 15000, env_harm_prevented_score: 1200, days_unresolved: 3, affected_population: 800, complaint_type: "garbage", dengue_risk_level: "low" }
    ];
    return NextResponse.json(dummyTasks);
  }
}
