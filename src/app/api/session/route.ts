// app/api/session/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/data';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
