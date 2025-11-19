import type { Metadata } from 'next';
import { Space_Grotesk, Unbounded } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const unbounded = Unbounded({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-unbounded' });

export const metadata: Metadata = {
  title: "Major's Bets",
  description: "Track Major's parlays, odds, and performance in a neon sportsbook dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${unbounded.variable}`}>
      <body>{children}</body>
    </html>
  );
}
