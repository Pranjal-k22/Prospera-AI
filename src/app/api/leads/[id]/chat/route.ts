import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { chatWithLead, AiProviderError } from '@/lib/ai/provider';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Prepare lead context for the AI
    const leadContext = {
      lead_record: {
        name: lead.name,
        location: lead.location,
        requirement: lead.requirement,
        budget: lead.budget,
        timeline: lead.timeline
      },
      customer_message: lead.message,
      ai_analysis: lead.analysis,
      priority: lead.priority,
      debrief_history: lead.debriefHistory
    };

    const history = lead.chatHistory || [];
    
    // Call AI
    const responseStream = await chatWithLead(leadContext, question, history);
    
    let fullResponse = '';
    for await (const chunk of responseStream.stream) {
        fullResponse += chunk.text();
    }

    // Append to history
    lead.chatHistory.push({ role: 'user', content: question });
    lead.chatHistory.push({ role: 'assistant', content: fullResponse });
    
    await lead.save();

    return NextResponse.json({ response: fullResponse }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in chat:', error);
    if (error instanceof AiProviderError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Chat failed' }, { status: 500 });
  }
}
