"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { evaluateSquadTactics } from "../engine/simulator";
import { PlayerEditionRecord } from "../types/cricket";

interface SquadXIViewProps {
  draftedPlayers: PlayerEditionRecord[];
}

/**
 * Tactical Starting XI dashboard displaying player cards, roles, and strict composition checklist.
 * Enforces the minimum quota: at least 1 WK, 4 BAT, 2 AR, and 3 BOWL.
 *
 * @param props - SquadXIViewProps
 */
export const SquadXIView: React.FC<SquadXIViewProps> = ({ draftedPlayers }) => {
  const squad = evaluateSquadTactics(draftedPlayers);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tactical Squad Header & Rating Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Batting Index
          </span>
          <span className="text-3xl font-black font-mono text-amber-400 mt-1">
            {squad.teamBattingOvr || "--"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Bowling Index
          </span>
          <span className="text-3xl font-black font-mono text-emerald-400 mt-1">
            {squad.teamBowlingOvr || "--"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Squad Average OVR
          </span>
          <span className="text-3xl font-black font-mono text-white mt-1">
            {squad.averageOvr || "--"}
          </span>
        </div>
      </div>

      {/* Mandatory Role Quotas Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/15 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Mandatory Role Quotas ({draftedPlayers.length}/11)
          </span>
          {squad.hasRequiredRoles ? (
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> QUOTAS MET
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" /> INCOMPLETE
            </span>
          )}
        </div>

        {/* Role Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.wkCount >= 1 ? "bg-purple-500/10 border-purple-500/30 text-purple-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>WK (Min 1):</span>
            <span className="font-bold text-sm">{squad.wkCount}/1</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.batCount >= 4 ? "bg-blue-500/10 border-blue-500/30 text-blue-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>BAT (Min 4):</span>
            <span className="font-bold text-sm">{squad.batCount}/4</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.arCount >= 2 ? "bg-amber-500/10 border-amber-500/30 text-amber-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>AR (Min 2):</span>
            <span className="font-bold text-sm">{squad.arCount}/2</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.bowlCount >= 3 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>BOWL (Min 3):</span>
            <span className="font-bold text-sm">{squad.bowlCount}/3</span>
          </div>
        </div>

        {squad.missingRoleDescriptions.length > 0 && draftedPlayers.length >= 8 && (
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono text-amber-300">
            ⚠ Still needed before simulation: {squad.missingRoleDescriptions.join(" · ")}
          </div>
        )}
      </div>

      {/* Starting XI Roster Slots */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-400 px-1">
          Starting XI Roster ({draftedPlayers.length}/11)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Array.from({ length: 11 }).map((_, index) => {
            const player = draftedPlayers[index];

            if (player) {
              return (
                <div
                  key={player.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between backdrop-blur-md shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-4">
                      #{index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {player.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {player.countryCode} · {player.role} ({player.editionYear})
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-sm font-black font-mono bg-white/10 text-amber-300 border border-white/10">
                    {player.ovr}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={`empty_${index}`}
                className="p-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-between text-slate-600"
              >
                <span className="text-xs font-mono font-bold w-4">#{index + 1}</span>
                <span className="text-xs font-mono">
                  {index === 0 ? "WK Slot" : index < 5 ? "Batter Slot" : index < 7 ? "All-Rounder Slot" : index < 10 ? "Bowler Slot" : "Flex Slot"}
                </span>
                <span className="text-xs font-mono">--</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
