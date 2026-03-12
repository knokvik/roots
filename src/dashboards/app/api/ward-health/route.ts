import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';
const FASTAPI_URL = 'http://localhost:8000/api/ward-health';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wardId = searchParams.get('ward_id') || 'ward78';

  try {
    const response = await axios.get(`${FASTAPI_URL}?ward_id=${wardId}`, { timeout: 2000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('FastAPI server unreachable. Returning mock data.');
    const dummyHealth = {
      ward_id: "ward78",
      ward_name: "Sadar Bazaar",
      health_score: 0.43,
      active_clusters: 3,
      total_env_cost_inr: 124000,
      dengue_risk_level: "high"
    };
    return NextResponse.json(dummyHealth);
  }
}
