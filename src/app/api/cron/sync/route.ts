import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import { getGenerativeModel, AiProviderError } from '@/lib/ai/provider';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const prompt = `
      You are an automated real estate market scraper. Generate exactly 2 highly detailed, realistic luxury properties located in Mumbai, India.
      Return the output ONLY as a valid JSON object with a "properties" key containing an array of objects. Do not include markdown formatting.
      Each object must have exactly these fields:
      - name: string (e.g., "Solaria Altamount 4BHK", "Sea-Facing Penthouse at Worli")
      - location: string (e.g., "Altamount Road", "Worli Sea Face", "Bandra West")
      - price: string (e.g., "₹ 25.5 Cr", "₹ 14.0 Cr")
      - bhk: string (e.g., "4 BHK", "5 BHK Penthouse")
      - description: string (2-3 sentences of luxurious, compelling description)
    `;

    const model = getGenerativeModel({
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
    });

    const completion = await model.generateContent(prompt);
    const responseContent = completion.response.text();

    if (!responseContent) {
      throw new Error("No response from Gemini");
    }

    let parsed;
    try {
      const json = JSON.parse(responseContent);
      parsed = json.properties || json.listings || Object.values(json)[0];
      
      if (!Array.isArray(parsed)) {
        parsed = JSON.parse(responseContent);
      }
    } catch {
      console.error("Failed to parse Gemini response:", responseContent);
      return NextResponse.json({ error: 'Failed to generate valid properties' }, { status: 500 });
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Generated data is not an array' }, { status: 500 });
    }

    const imageUrls = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80"
    ];

    const existingProperties = await Property.find({}, 'images').lean();
    const usedImages = new Set(existingProperties.flatMap((p: { images?: string[] }) => p.images || []));

    let availableImages = imageUrls.filter(url => !usedImages.has(url));
    if (availableImages.length === 0) {
      availableImages = [...imageUrls]; 
    }

    parsed = parsed.map((prop: Record<string, unknown>) => {
      const r = Math.floor(Math.random() * availableImages.length);
      const chosenUrl = availableImages[r];
      availableImages.splice(r, 1);
      
      if (availableImages.length === 0) {
        availableImages = [...imageUrls];
      }
      
      return {
        ...prop,
        images: [chosenUrl],
        features: ["High Floor", "Sea View", "Dedicated Parking", "Smart Home"]
      };
    });

    const saved = await Property.insertMany(parsed);
    return NextResponse.json({ success: true, count: saved.length, properties: saved });
  } catch (error: unknown) {
    console.error('Error syncing MLS data:', error);
    if (error instanceof AiProviderError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Sync failed' }, { status: 500 });
  }
}
