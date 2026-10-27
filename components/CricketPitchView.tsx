"use client";

import React from "react";
import { Shield, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { DEFAULT_FORMATION } from "../data/formations";
import { getPlayerPositionMismatch } from "../engine/lineup";
import { PlayerEditionRecord, TacticalFormation, PlayerRole } from "../types/cricket";

interface CricketPitchViewProps {
  draftedPlayers: PlayerEditionRecord[];
  formation?: TacticalFormation;
}

/**
 * Authentic 2D top-down Cricket Ground & Pitch Tactical Visualizer.
 * Situates the 11-player squad across authentic field zones:
 * - Top: Wicketkeeper positioned directly behind the stumps.
 * - Upper-Middle: Top-order batsmen stationed at and before the batting popping crease.
 * - Center: All-rounders positioned in the heart of the 30-yard inner circle.
 * - Bottom: Bowlers positioned at the bowler's end run-up and outfield below.
 *
 * @param props - CricketPitchViewProps
 */
export const CricketPitchView: React.FC<CricketPitchViewProps> = ({
  draftedPlayers,
  formation = DEFAULT_FORMATION,
}) => {
  // Partition drafted players by role
  const keepers = draftedPlayers.filter((p) => p.role === "WK");
  const batters = draftedPlayers.filter((p) => p.role === "BAT");
  const allRounders = draftedPlayers.filter((p) => p.role === "AR");
  const bowlers = draftedPlayers.filter((p) => p.role === "BOWL");

  // Empty slot calculations based on formation quotas
  const emptyKeepersCount = Math.max(0, formation.wk - keepers.length);
  const emptyBattersCount = Math.max(0, formation.bat - batters.length);
  const emptyArCount = Math.max(0, formation.ar - allRounders.length);
  const emptyBowlersCount = Math.max(0, formation.bowl - bowlers.length);

  /**
   * Returns role-specific accent styling.
   */
  const getRoleBadgeStyle = (role: PlayerRole) => {
    switch (role) {
      case "WK":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "BAT":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "AR":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "BOWL":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      default:
        return "bg-white/10 text-slate-300 border-white/20";
    }
  };

  /**
   * Mini pitch player card rendering.
   */
  const renderFieldCard = (player: PlayerEditionRecord) => {
    const lineupIndex = draftedPlayers.findIndex((p) => p.id === player.id);
    const mismatch = getPlayerPositionMismatch(player, lineupIndex);

    return (
      <motion.div
        key={player.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative p-2 sm:p-3 rounded-xl bg-slate-950/85 border ${
          mismatch.isMismatch
            ? "border-red-500/60 shadow-red-500/20 shadow-md"
            : "border-white/20 hover:border-white/40 shadow-lg"
        } backdrop-blur-md flex flex-col gap-1 w-full min-w-[110px] max-w-[175px] transition group select-none`}
      >
        {/* Top Header: Batting Order # and OVR Badge */}
        <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-1.5">
          <span className="text-[11px] font-mono font-black text-amber-400">
            #{lineupIndex + 1}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(
                player.role
              )}`}
            >
              {player.role}
            </span>
            <span className="text-sm font-black font-mono text-white">
              {player.ovr}
            </span>
          </div>
        </div>

        {/* Player Name & Nationality */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">
            {player.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400 truncate">
            {player.countryCode} ({player.editionYear}) · {player.battingStyle}
          </span>
        </div>

        {/* Mismatch Alert Tag */}
        {mismatch.isMismatch && (
          <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-red-300 bg-red-500/20 px-1 py-0.5 rounded border border-red-500/30">
            <AlertTriangle className="w-2.5 h-2.5 text-red-400 flex-shrink-0" />
            <span className="truncate">{mismatch.message}</span>
          </div>
        )}
      </motion.div>
    );
  };

  /**
   * Empty stadium slot placeholder.
   */
  const renderEmptySlot = (label: string, roleBadge: string, key: string) => (
    <div
      key={key}
      className="p-2 sm:p-2.5 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.03] backdrop-blur-sm flex flex-col items-center justify-center gap-1 w-full min-w-[105px] max-w-[160px] text-center"
    >
      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-400">
        {roleBadge}
      </span>
      <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-medium truncate max-w-full px-1">{label}</span>
      <span className="text-[9px] font-mono text-slate-600">-- OVR</span>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Stadium Field View Container */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0b3319] via-[#072412] to-[#04140a] border-2 border-emerald-500/30 p-4 sm:p-6 overflow-hidden shadow-2xl">
        {/* Subtle Outfield Grass Striping Effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(16,185,129,0.04)_0px,rgba(16,185,129,0.04)_35px,rgba(5,150,105,0.02)_35px,rgba(5,150,105,0.02)_70px)] pointer-events-none" />

        {/* 30-Yard Fielding Circle Marking */}
        <div className="absolute inset-x-8 inset-y-12 sm:inset-x-12 sm:inset-y-16 rounded-[48px] border-2 border-dashed border-emerald-400/15 pointer-events-none" />

        {/* Center 22-Yard Pitch Strip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-28 sm:w-36 rounded-2xl bg-gradient-to-b from-[#4a3520]/50 via-[#3a2818]/45 to-[#4a3520]/50 border border-amber-600/30 shadow-inner pointer-events-none flex flex-col justify-between py-6 items-center">
          {/* Batting End Stumps & Crease */}
          <div className="w-full flex flex-col items-center gap-1">
            <div className="w-20 sm:w-24 h-0.5 bg-white/40" />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm shadow-sm" />
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm shadow-sm" />
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm shadow-sm" />
            </div>
            <span className="text-[8px] font-mono tracking-widest text-amber-300/60 uppercase">
              Batting Stumps
            </span>
          </div>

          {/* 22-Yard Pitch Pitch Center Label */}
          <div className="text-[9px] font-mono font-bold tracking-widest text-amber-400/40 uppercase rotate-90">
            22-YARD PITCH
          </div>

          {/* Bowler End Stumps & Crease */}
          <div className="w-full flex flex-col items-center gap-1">
            <span className="text-[8px] font-mono tracking-widest text-amber-300/60 uppercase">
              Bowling Crease
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm shadow-sm" />
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm shadow-sm" />
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm shadow-sm" />
            </div>
            <div className="w-20 sm:w-24 h-0.5 bg-white/40" />
          </div>
        </div>

        {/* Content Layer: Tactical Field Zones */}
        <div className="relative z-10 flex flex-col gap-6 w-full items-center">
          {/* ZONE 1 (TOP): WICKETKEEPER BEHIND STUMPS */}
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold tracking-wider uppercase">
              🧤 Behind the Stumps · Wicketkeeper
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {keepers.map((p) => renderFieldCard(p))}
              {Array.from({ length: emptyKeepersCount }).map((_, i) =>
                renderEmptySlot("Keeper Behind Stumps", "WK", `empty_wk_${i}`)
              )}
            </div>
          </div>

          {/* ZONE 2 (UPPER MIDDLE): BATSMEN AT & BEFORE CREASE */}
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold tracking-wider uppercase">
              🏏 Batting Crease · Top Order Batsmen
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 justify-items-center">
              {batters.map((p) => renderFieldCard(p))}
              {Array.from({ length: emptyBattersCount }).map((_, i) =>
                renderEmptySlot(`Batter #${i + 1}`, "BAT", `empty_bat_${i}`)
              )}
            </div>
          </div>

          {/* ZONE 3 (CENTER): ALL-ROUNDERS IN MID-FIELD */}
          <div className="flex flex-col items-center gap-2 w-full my-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase">
              ⚡ Mid-Field Pivot · All-Rounders
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {allRounders.map((p) => renderFieldCard(p))}
              {Array.from({ length: emptyArCount }).map((_, i) =>
                renderEmptySlot("All-Rounder", "AR", `empty_ar_${i}`)
              )}
            </div>
          </div>

          {/* ZONE 4 (BOTTOM): BOWLERS AT BOWLER'S END & RUN-UP */}
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase">
              🎯 Bowler&apos;s Run-Up End · Bowling Attack Below
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 justify-items-center">
              {bowlers.map((p) => renderFieldCard(p))}
              {Array.from({ length: emptyBowlersCount }).map((_, i) =>
                renderEmptySlot(`Bowler #${i + 1}`, "BOWL", `empty_bowl_${i}`)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
