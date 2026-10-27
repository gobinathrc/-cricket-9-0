"use client";

import React from "react";
import { PlayerEditionRecord } from "../types/cricket";
import { Lock } from "lucide-react";

interface PlayerPickCardProps {
  player: PlayerEditionRecord;
  isSelected?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  onSelect?: (player: PlayerEditionRecord) => void;
}

/**
 * Minimalist arcade player card component.
 * Displays Name, OVR rating, and tactical badges.
 * Supports role gating to grey out and lock players when position quotas are met.
 *
 * @param props - PlayerPickCardProps
 */
export const PlayerPickCard: React.FC<PlayerPickCardProps> = ({
  player,
  isSelected = false,
  isDisabled = false,
  disabledReason,
  onSelect,
}) => {
  const getRatingBadgeStyle = (ovr: number): string => {
    if (isDisabled) return "bg-slate-700 text-slate-400";
    if (ovr >= 95) return "bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 shadow-amber-400/40";
    if (ovr >= 90) return "bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-emerald-400/30";
    if (ovr >= 82) return "bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 shadow-sky-400/30";
    return "bg-slate-300 text-slate-900";
  };

  const getRoleBadgeStyle = (role: string): string => {
    if (isDisabled) return "bg-slate-800 text-slate-500 border-white/5";
    switch (role) {
      case "WK": return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "BAT": return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "AR": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "BOWL": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    onSelect?.(player);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 select-none ${
        isDisabled
          ? "opacity-45 grayscale bg-slate-950/60 border-white/5 cursor-not-allowed pointer-events-none"
          : isSelected
          ? "border-amber-400 bg-amber-400/15 shadow-xl shadow-amber-500/20 scale-[1.02] cursor-pointer"
          : "border-white/10 bg-slate-900/60 hover:border-white/25 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-black/40 cursor-pointer"
      }`}
    >
      {/* Player Meta Details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`text-base font-semibold tracking-tight transition-colors ${
            isDisabled ? "text-slate-500 line-through" : "text-white group-hover:text-amber-300"
          }`}>
            {player.name}
          </span>
          {isDisabled && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-red-400/80 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              <Lock className="w-3 h-3" /> {disabledReason || "Gated"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-white/5 border border-white/10 text-slate-300">
            {player.countryCode} · {player.editionYear}
          </span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${getRoleBadgeStyle(player.role)}`}>
            {player.role}
          </span>
          {player.bowlingType !== "NONE" && (
            <span className="text-[11px] font-mono text-slate-400">
              {player.bowlingType.replace("SPIN_", "")}
            </span>
          )}
        </div>
      </div>

      {/* OVR Rating Pill */}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl font-black text-xl shadow-lg font-mono tracking-tighter ${getRatingBadgeStyle(
          player.ovr
        )}`}
      >
        {player.ovr}
      </div>
    </div>
  );
};
