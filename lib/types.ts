import type { LegResult, ParlayStatus } from '@prisma/client';

export type ParlayLegDTO = {
  id: string;
  order: number;
  league: string;
  eventName: string;
  playerName: string | null;
  market: string;
  line: string;
  legOdds: string;
  note: string | null;
  result: LegResult;
};

export type ParlayDTO = {
  id: string;
  title: string;
  description: string | null;
  dateFor: string;
  createdAt: string;
  updatedAt: string;
  risk: number;
  toWin: number;
  odds: string;
  confidence: number;
  status: ParlayStatus;
  isSpotlight: boolean;
  imageUrl: string | null;
  notes: string | null;
  legs: ParlayLegDTO[];
};

export type PerformanceSummary = {
  total30: number;
  wins: number;
  losses: number;
  pushes: number;
  winRate: number;
};
