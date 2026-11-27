import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Property from '@/models/Property';
import { inventory } from '@/lib/inventory';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ['admin', 'broker']);
    if (auth.response) return auth.response;

    await connectToDatabase();
    
    // Clear existing
    await Property.deleteMany({});
    
    // Insert all
    for (const prop of inventory) {
      await Property.create({
        name: prop.name,
        location: prop.location,
        bhk: prop.bhk,
        price: prop.price,
        description: prop.description,
        images: prop.images,
        features: prop.features
      });
    }
    
    return NextResponse.json({ success: true, seededCount: inventory.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
