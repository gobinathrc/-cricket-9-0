import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Cricket 72 - 0 | T20 World Cup Invincible Draft",
  description: "Draft an all-time Starting XI from 10 T20 World Cup editions and simulate 72 consecutive matches undefeated.",
};

/**
 * Root Next.js App Router layout wrapping all routes in global aesthetic and ErrorBoundary.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col justify-between">
        <ErrorBoundary>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </ErrorBoundary>

        {/* Legal Fair Use Disclaimer */}
        <footer className="w-full py-6 px-4 text-center border-t border-white/5 bg-black/40 text-[11px] text-slate-500 font-mono">
          <p className="max-w-xl mx-auto">
            Disclaimer: Unofficial trivia & simulation challenge. Not affiliated with, endorsed by, or sponsored by the ICC, BCCI, or any cricket board, league, or professional player. All statistics and player references are used strictly under factual/nominative fair use.
          </p>
        </footer>
      </body>
    </html>
  );
}
