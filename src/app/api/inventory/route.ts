import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Property from '@/models/Property';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const properties = await Property.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ properties });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    const body = await req.json();
    const property = await Property.create(body);
    return NextResponse.json({ property }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
