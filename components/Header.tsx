"use client";

import React from "react";
import { ShieldAlert, Flame } from "lucide-react";

/**
 * Top brand navigation bar and operational header for the Cricket 72-0 game.
 */
export const Header: React.FC = () => {
  return (
    <header className="w-full flex flex-col items-center justify-center pt-8 pb-4 px-4 text-center select-none">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold tracking-wide mb-3">
        <Flame className="w-3.5 h-3.5" />
        THE UNBEATEN T20 DRAFT CHALLENGE
      </div>

      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
        CRICKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">72 - 0</span>
      </h1>

      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg">
        Draft an all-time Starting XI from 10 T20 World Cup editions (2007–2026). Can you survive 72 consecutive matches without a single defeat?
      </p>
    </header>
  );
};
