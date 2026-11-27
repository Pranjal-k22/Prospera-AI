import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req, ['customer', 'admin']);
    if (auth.response) return auth.response;
    const user = auth.user;

    await connectToDatabase();
    
    // Customer can only view their own leads; admin can view all
    const query = user.role === 'admin' ? {} : { name: user.name };
    const leads = await Lead.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
