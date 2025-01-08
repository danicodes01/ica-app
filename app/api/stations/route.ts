import { NextResponse } from 'next/server';

export async function GET() {
  // Basic implementation for now since we're not using it yet
  return NextResponse.json({ message: "Stations endpoint" });
}

export async function POST() {
  return NextResponse.json({ message: "POST not implemented" }, { status: 501 });
}