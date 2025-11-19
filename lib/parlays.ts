import { prisma } from './prisma';
import type { Parlay, ParlayLeg } from '@prisma/client';

const todayRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const serializeParlay = (parlay: Parlay & { legs: ParlayLeg[] }) => ({
  id: parlay.id,
  title: parlay.title,
  description: parlay.description,
  dateFor: parlay.dateFor.toISOString(),
  createdAt: parlay.createdAt.toISOString(),
  updatedAt: parlay.updatedAt.toISOString(),
  risk: parlay.risk.toNumber(),
  toWin: parlay.toWin.toNumber(),
  odds: parlay.odds,
  confidence: parlay.confidence,
  status: parlay.status,
  isSpotlight: parlay.isSpotlight,
  imageUrl: parlay.imageUrl,
  notes: parlay.notes,
  legs: parlay.legs
    .sort((a, b) => a.order - b.order)
    .map((leg) => ({
      id: leg.id,
      order: leg.order,
      league: leg.league,
      eventName: leg.eventName,
      playerName: leg.playerName,
      market: leg.market,
      line: leg.line,
      legOdds: leg.legOdds,
      note: leg.note,
      result: leg.result,
    })),
});

export const getSpotlightParlay = async () => {
  const { start, end } = todayRange();
  const record = await prisma.parlay.findFirst({
    where: { isSpotlight: true, dateFor: { gte: start, lt: end } },
    include: { legs: true },
    orderBy: { updatedAt: 'desc' },
  });
  return record ? serializeParlay(record) : null;
};

export const getDailyParlays = async () => {
  const { start, end } = todayRange();
  const records = await prisma.parlay.findMany({
    where: { dateFor: { gte: start, lt: end } },
    include: { legs: true },
    orderBy: [
      { isSpotlight: 'desc' },
      { createdAt: 'desc' },
    ],
  });
  return records.map(serializeParlay);
};

export const getRecentHistory = async (limit = 10) => {
  const records = await prisma.parlay.findMany({
    include: { legs: true },
    orderBy: { dateFor: 'desc' },
    take: limit,
  });
  return records.map(serializeParlay);
};

export const getPerformanceSummary = async () => {
  const past30 = new Date();
  past30.setDate(past30.getDate() - 30);

  const aggregates = await prisma.parlay.groupBy({
    by: ['status'],
    _count: { _all: true },
    where: { dateFor: { gte: past30 } },
  });

  const total = aggregates.reduce((sum, entry) => sum + entry._count._all, 0);
  const wins = aggregates.find((a) => a.status === 'WON')?._count._all || 0;
  const losses = aggregates.find((a) => a.status === 'LOST')?._count._all || 0;
  const pushes = aggregates.find((a) => a.status === 'PUSH')?._count._all || 0;

  return {
    total30: total,
    wins,
    losses,
    pushes,
    winRate: total ? Math.round((wins / total) * 100) : 0,
  };
};
