import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { generateCallBrief, AiProviderError } from '@/lib/ai/provider';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Call AI to generate a call prep brief
    const prepBrief = await generateCallBrief(lead.analysis);

    return NextResponse.json(prepBrief, { status: 200 });
  } catch (error: unknown) {
    console.error('Error generating prep brief:', error);
    if (error instanceof AiProviderError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Prep brief generation failed' }, { status: 500 });
  }
}
