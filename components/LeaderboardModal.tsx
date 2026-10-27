"use client";

import React, { useEffect, useState } from "react";
import { Trophy, X, Shield, Medal } from "lucide-react";
import { LeaderboardEntry } from "../services/leaderboard";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal displaying the global Hall of Fame leaderboard retrieved from the backend API.
 *
 * @param props - LeaderboardModalProps
 */
export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch("/api/leaderboard")
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setEntries(json.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">9-0 Hall of Fame</h3>
              <p className="text-xs text-slate-400">Top tournament streaks & World Cup champions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400 animate-pulse">
              Loading verified records from backend...
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No runs recorded yet. Be the first to conquer 9-0!
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black font-mono bg-white/10 text-slate-300">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{entry.userName}</span>
                      {entry.isChampion && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          WORLD CHAMPION
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {entry.finalStage} · Squad OVR: {entry.teamAverageOvr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono font-bold text-sm">
                  <Medal className="w-4 h-4" />
                  {entry.streak} - 0
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
