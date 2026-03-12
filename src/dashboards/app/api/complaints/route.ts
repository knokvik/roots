import { NextResponse } from 'next/server';
import axios from 'axios';

// Force dynamic so it doesn't prerender at build time
export const dynamic = 'force-dynamic';

const FASTAPI_URL = 'http://localhost:8000/api/complaints';

export async function GET() {
  try {
    const response = await axios.get(FASTAPI_URL, { timeout: 2000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('FastAPI server unreachable. Returning mock data.');

    // Fallback Mock Data
    const mockComplaints = [
      {
        complaint_id: "C001",
        ward_id: "W78",
        ward_name: "Sadar Bazaar",
        latitude: 28.656200,
        longitude: 77.214000,
        complaint_type: "waterlogging",
        severity: 0.8,
        description: "Heavy waterlogging on Main Road",
        timestamp: "2024-03-01T10:00:00Z",
        source_channel: "WhatsApp",
        is_verified: true,
        status: "open"
      },
      {
        complaint_id: "C002",
        ward_id: "W78",
        ward_name: "Sadar Bazaar",
        latitude: 28.657500,
        longitude: 77.212050,
        complaint_type: "pothole",
        severity: 0.7,
        description: "Large pothole emerged after rain",
        timestamp: "2024-03-01T14:30:00Z",
        source_channel: "Web",
        is_verified: true,
        status: "open"
      },
      {
        complaint_id: "C004",
        ward_id: "W78",
        ward_name: "Sadar Bazaar",
        latitude: 28.658000,
        longitude: 77.216000,
        complaint_type: "garbage",
        severity: 0.9,
        description: "Garbage dump overflowing",
        timestamp: "2024-03-02T11:00:00Z",
        source_channel: "IVR",
        is_verified: true,
        status: "open"
      },
      {
        complaint_id: "C005",
        ward_id: "W78",
        ward_name: "Sadar Bazaar",
        latitude: 28.655300,
        longitude: 77.214100,
        complaint_type: "waterlogging",
        severity: 0.5,
        description: "Minor water pooling near shop",
        timestamp: "2024-03-02T16:45:00Z",
        source_channel: "WhatsApp",
        is_verified: true,
        status: "open"
      },
      {
        complaint_id: "C007",
        ward_id: "W78",
        ward_name: "Sadar Bazaar",
        latitude: 28.656100,
        longitude: 77.213900,
        complaint_type: "pothole",
        severity: 0.6,
        description: "Another pothole nearby",
        timestamp: "2024-03-03T10:30:00Z",
        source_channel: "Web",
        is_verified: true,
        status: "open"
      }
    ];

    return NextResponse.json(mockComplaints);
  }
}
