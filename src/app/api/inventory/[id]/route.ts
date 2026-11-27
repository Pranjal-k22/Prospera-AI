import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Property from '@/models/Property';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    const resolvedParams = await params;
    const body = await req.json();
    const property = await Property.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ property });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    const resolvedParams = await params;
    const property = await Property.findByIdAndDelete(resolvedParams.id);
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
