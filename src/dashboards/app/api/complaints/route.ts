import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const FASTAPI_URL = 'http://localhost:8000/api/complaints';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wardId = searchParams.get('ward_id');
  const url = wardId ? `${FASTAPI_URL}?ward_id=${wardId}` : FASTAPI_URL;

  try {
    const response = await axios.get(url, { timeout: 2000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('FastAPI server unreachable. Returning mock data.');
    const mockComplaints = [
      { complaint_id: "C001", ward_id: "ward78", latitude: 28.656200, longitude: 77.214000, complaint_type: "waterlogging", severity: 0.8, timestamp: "2024-03-01T10:00:00Z", status: "open" },
      { complaint_id: "C002", ward_id: "ward78", latitude: 28.657500, longitude: 77.212050, complaint_type: "pothole", severity: 0.7, timestamp: "2024-03-01T14:30:00Z", status: "open" },
      { complaint_id: "C004", ward_id: "ward78", latitude: 28.658000, longitude: 77.216000, complaint_type: "garbage", severity: 0.9, timestamp: "2024-03-02T11:00:00Z", status: "clustered" },
      { complaint_id: "C005", ward_id: "ward78", latitude: 28.655300, longitude: 77.214100, complaint_type: "waterlogging", severity: 0.5, timestamp: "2024-03-02T16:45:00Z", status: "open" },
      { complaint_id: "C007", ward_id: "ward78", latitude: 28.656100, longitude: 77.213900, complaint_type: "pothole", severity: 0.6, timestamp: "2024-03-03T10:30:00Z", status: "resolved" }
    ];
    return NextResponse.json(mockComplaints);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(FASTAPI_URL, body, { timeout: 2000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('FastAPI server unreachable for POST. Returning success mock.');
    const body = await request.json();
    return NextResponse.json({
        ...body,
        complaint_id: `MOCK-${Math.floor(Math.random() * 1000)}`,
        status: "open",
        timestamp: new Date().toISOString()
    });
  }
}
