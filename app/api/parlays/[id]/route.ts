import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parlayInputSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth';

const getDayBounds = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
  const { id } = params;

  if (data.isSpotlight) {
    const { start, end } = getDayBounds(data.dateFor);
    await prisma.parlay.updateMany({
      where: { dateFor: { gte: start, lt: end }, id: { not: id } },
      data: { isSpotlight: false },
    });
  }

  const updated = await prisma.parlay.update({
    where: { id },
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
      createdById: admin.id,
      legs: {
        deleteMany: {},
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

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await prisma.parlay.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
