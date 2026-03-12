import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await axios.get('http://localhost:8000/api/status', { timeout: 1000 });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ status: "demo" });
  }
}
