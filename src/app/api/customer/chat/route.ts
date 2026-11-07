import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GROQ_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey || 'dummy_api_key_for_build');
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

export async function POST(req: Request) {
  try {
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

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
    });

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContent({ contents });
    const reply = result.response.text() || "I am currently unavailable.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error('Error in customer chat:', error);
    return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 });
  }
}
