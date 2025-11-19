import { z } from 'zod';

export const legInputSchema = z.object({
  id: z.string().uuid().optional(),
  league: z.string().min(2),
  eventName: z.string().min(2),
  playerName: z.string().optional().nullable(),
  market: z.string().min(2),
  line: z.string().min(1),
  legOdds: z.string().min(1),
  note: z.string().optional().nullable(),
  result: z.enum(['PENDING', 'HIT', 'MISSED', 'PUSH']).default('PENDING'),
  order: z.number().int().nonnegative(),
});

export const parlayInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  dateFor: z
    .string()
    .transform((value) => new Date(value))
    .refine((date) => !Number.isNaN(date.getTime()), { message: 'Invalid date' }),
  risk: z.number().nonnegative(),
  toWin: z.number().nonnegative(),
  odds: z.string().min(1),
  confidence: z.number().int().min(1).max(10),
  status: z.enum(['PENDING', 'WON', 'LOST', 'PUSH']).default('PENDING'),
  isSpotlight: z.boolean().default(false),
  imageUrl: z.string().url().optional().nullable(),
  notes: z.string().optional().nullable(),
  legs: z.array(legInputSchema).min(1),
});

export type ParlayInput = z.infer<typeof parlayInputSchema>;
export type LegInput = z.infer<typeof legInputSchema>;
