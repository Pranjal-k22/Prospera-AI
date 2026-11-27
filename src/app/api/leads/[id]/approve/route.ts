import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectMongo();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Lead ID' }, { status: 400 });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    lead.status = 'approved';

    // Add debrief note
    if (!lead.debriefHistory) lead.debriefHistory = [];
    lead.debriefHistory.push({
      timestamp: new Date(),
      notes: `Lead approved by admin. Deal won!`,
      what_changed: ['Status updated to approved']
    });

    lead.markModified('debriefHistory');
    await lead.save();

    return NextResponse.json({ success: true, lead });
  } catch (error: unknown) {
    console.error('Error approving lead:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
