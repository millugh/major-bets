export type OddsEvent = {
  sport: string;
  matchup: string;
  startTime: string;
  spread?: string;
  moneyline?: string;
  total?: string;
};

export const fallbackOdds: OddsEvent[] = [
  {
    sport: 'NBA',
    matchup: 'Lakers @ Warriors',
    startTime: '10:00 PM ET',
    spread: 'GSW -4.5 (-110)',
    total: 'O/U 229.5 (-108)',
  },
  {
    sport: 'NFL',
    matchup: 'Bills @ Chiefs',
    startTime: '8:20 PM ET',
    spread: 'KC -3.0 (-115)',
    total: 'O/U 48.5 (-110)',
  },
  {
    sport: 'MLB',
    matchup: 'Yankees @ Astros',
    startTime: '7:10 PM ET',
    moneyline: 'NYY -118',
    total: 'O/U 8.5 (-102)',
  },
];
