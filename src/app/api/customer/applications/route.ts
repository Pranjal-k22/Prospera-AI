import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const user = (await verifyAuth(token)) as { name?: string } | null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    const leads = await Lead.find({ name: user.name }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
