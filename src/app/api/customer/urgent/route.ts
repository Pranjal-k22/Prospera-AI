import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['customer', 'admin']);
    if (auth.response) return auth.response;
    const user = auth.user;

    await connectMongo();
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Object-level check: customer can only escalate their own lead
    if (user.role !== 'admin' && lead.name !== user.name) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Increase priority to HOT 99
    lead.priority = {
      score: 99,
      tier: 'hot',
      reasons: ['Customer requested URGENT attention from their dashboard.']
    };

    // Update next action
    lead.analysis.next_action = 'URGENT: Customer requested immediate attention. Call immediately.';
    
    // Add debrief note
    if (!lead.debriefHistory) lead.debriefHistory = [];
    lead.debriefHistory.push({
      timestamp: new Date(),
      notes: 'Customer clicked "Request Urgent Attention" from their portal.',
      what_changed: ['Priority updated to HOT 99', 'Next action updated']
    });

    lead.markModified('priority');
    lead.markModified('analysis');
    lead.markModified('debriefHistory');

    await lead.save();

    return NextResponse.json({ success: true, lead });
  } catch (error: unknown) {
    console.error('Error handling urgent request:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
