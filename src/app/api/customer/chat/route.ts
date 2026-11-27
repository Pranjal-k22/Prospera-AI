import { NextResponse } from 'next/server';
import { getGenerativeModel, AiProviderError } from '@/lib/ai/provider';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ['customer', 'admin']);
    if (auth.response) return auth.response;

    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const systemPrompt = `You are Prospera Assistant, an intelligent luxury real estate AI advisor for Prospera AI. 
You are chatting directly with a prospective buyer/customer on their portal.
Your goal is to be immensely persuasive, enthusiastic, and helpful. 
Respond in short, punchy paragraphs. Use formatting to make it readable.
If they ask about properties, ask them about their preferred location, configuration, and budget.
Remind them they can use the AI Matchmaker form on this page to instantly generate global luxury property recommendations!`;

    const model = getGenerativeModel({
      systemInstruction: systemPrompt,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
    });

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContent({ contents });
    const reply = result.response.text() || "I am currently unavailable.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in customer chat:', error);
    if (error instanceof AiProviderError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Chat failed' }, { status: 500 });
  }
}
