import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    
    // In Next 15+, `params` is a Promise, so we must await it.
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const lead = await Lead.findById(id).lean();

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch lead' }, { status: 500 });
  }
}
