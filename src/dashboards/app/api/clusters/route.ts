import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';
const FASTAPI_URL = 'http://localhost:8000/api/clusters';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wardId = searchParams.get('ward_id');
  const url = wardId ? `${FASTAPI_URL}?ward_id=${wardId}` : FASTAPI_URL;

  try {
    const response = await axios.get(url, { timeout: 2000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('FastAPI server unreachable. Returning mock data.');
    const mockClusters = [
      { cluster_id: "cluster_1", root_cause: "Subsurface Drainage Failure", confidence: 0.91, formed_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString() },
      { cluster_id: "cluster_2", root_cause: "Solid Waste Overflow", confidence: 0.87, formed_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString() },
      { cluster_id: "cluster_3", root_cause: "Surface Drainage Blockage", confidence: 0.85, formed_at: new Date(Date.now() - 336 * 3600 * 1000).toISOString() }
    ];
    return NextResponse.json(mockClusters);
  }
}
