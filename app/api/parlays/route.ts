import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDailyParlays, getRecentHistory } from '@/lib/parlays';
import { parlayInputSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth';

const getDayBounds = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range');
  if (range === 'history') {
    const history = await getRecentHistory(20);
    return NextResponse.json(history);
  }
  const daily = await getDailyParlays();
  return NextResponse.json(daily);
}

export async function POST(request: Request) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const raw = await request.json();
  const parsed = parlayInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const data = parsed.data;

  if (data.isSpotlight) {
    const { start, end } = getDayBounds(data.dateFor);
    await prisma.parlay.updateMany({
      where: { dateFor: { gte: start, lt: end } },
      data: { isSpotlight: false },
    });
  }

  const parlay = await prisma.parlay.create({
    data: {
      title: data.title,
      description: data.description,
      dateFor: data.dateFor,
      risk: data.risk,
      toWin: data.toWin,
      odds: data.odds,
      confidence: data.confidence,
      status: data.status,
      isSpotlight: data.isSpotlight,
      imageUrl: data.imageUrl,
      notes: data.notes,
      createdBy: { connect: { id: admin.id } },
      legs: {
        create: data.legs.map((leg) => ({
          league: leg.league,
          eventName: leg.eventName,
          playerName: leg.playerName,
          market: leg.market,
          line: leg.line,
          legOdds: leg.legOdds,
          note: leg.note,
          result: leg.result,
          order: leg.order,
        })),
      },
    },
    include: { legs: true },
  });

  return NextResponse.json(parlay);
}
