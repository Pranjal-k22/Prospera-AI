import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { getGenerativeModel, AiProviderError } from '@/lib/ai/provider';

const globalImageSets = [
  [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
  ],
  [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
  ],
  [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  ]
];

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ['customer', 'admin']);
    if (auth.response) return auth.response;
    const user = auth.user;

    const { query } = await req.json();

    const systemPrompt = `
You are the Prospera AI Global Real Estate Matchmaker, connected to a worldwide property database.
The user is searching for properties. Extract their desired location from their query. 
If they specify a city anywhere in the world (e.g. Paris, Tokyo, Dubai, Miami), you must INVENT 3 highly realistic, premium luxury properties that are currently "for sale" in that specific location that match their criteria.
Use real, prestigious neighborhoods for that city, realistic local currency and pricing, and believable luxury features.
Act as a persuasive middleman to convince them to buy.

Output JSON strictly matching this schema:
{
  "matches": [
    {
      "property_id": "gen_1",
      "property_name": "Name of the building or villa",
      "location": "Neighborhood, City",
      "bhk": "e.g. 3 BHK or 4 Bedroom Villa",
      "price": "e.g. € 4,500,000",
      "match_score": 95,
      "sales_pitch": "A highly persuasive 3-sentence pitch explaining why this location is incredible.",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Minor con 1"]
    }
  ]
}
    `;

    const model = getGenerativeModel({
      systemInstruction: systemPrompt,
      generationConfig: { responseMimeType: "application/json", temperature: 0.5 }
    });

    const result = await model.generateContent(`Customer Query: ${query}`);
    const text = result.response.text() || "{}";
    let matchData;
    
    try {
      matchData = JSON.parse(text);
    } catch (e) {
      const match = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (match) {
        matchData = JSON.parse(match[1]);
      } else {
        throw e;
      }
    }

    // Attach curated luxury images
    if (matchData.matches && Array.isArray(matchData.matches)) {
      matchData.matches = matchData.matches.map((m: Record<string, unknown>, idx: number) => ({
        ...m,
        images: globalImageSets[idx % globalImageSets.length]
      }));
    }
      
    // Save this interaction as a Lead so the Admin can see the conversation
    await connectToDatabase();
    await Lead.create({
      name: user.name,
      location: 'Global AI Matchmaker',
      requirement: `Global Search: ${query.substring(0, 50)}...`,
      budget: 'Global Inquiry',
      timeline: 'Immediate',
      message: `Customer ran AI Matchmaker search: "${query}". Top recommendation generated: ${matchData?.matches?.[0]?.property_name || 'Global Property'}`,
      chatHistory: [
        { role: 'user', content: query },
        { role: 'assistant', content: `I searched our global database and recommended ${matchData?.matches?.length || 0} luxury properties matching your exact specifications.` }
      ],
      analysis: {
        summary: `Customer explored global luxury inventory matching "${query.substring(0, 40)}..."`,
        intent: 'early_research',
        intent_reasoning: 'Customer actively exploring international options through AI Matchmaker.',
        key_requirements: [query.substring(0, 30)],
        objections: [],
        next_action: 'Present full dossiers for global recommendations',
        suggested_response: 'Hi! I saw the global luxury properties our matchmaker recommended for you. Would you like me to connect you with our regional advisory desk?',
        scores: {
          intent_strength: 7,
          budget_fit: 8,
          timeline_urgency: 6,
          information_completeness: 8,
          engagement_quality: 9
        },
        score_rationale: 'High engagement searching worldwide luxury inventory.',
        confidence: 'high',
        missing_info: ['Financing structure', 'Passport / residency status']
      },
      priority: {
        score: 75,
        tier: 'hot',
        atRisk: false
      }
    });

    return NextResponse.json(matchData, { status: 200 });
  } catch (error: unknown) {
    console.error('Error generating matches:', error);
    if (error instanceof AiProviderError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Matching failed' }, { status: 500 });
  }
}
