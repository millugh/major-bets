import { NextResponse } from 'next/server';
import { getPerformanceSummary } from '@/lib/parlays';

export async function GET() {
  const summary = await getPerformanceSummary();
  return NextResponse.json(summary);
}
