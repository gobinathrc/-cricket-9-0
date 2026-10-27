"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { evaluateSquadTactics } from "../engine/simulator";
import { PlayerEditionRecord } from "../types/cricket";

interface SquadXIViewProps {
  draftedPlayers: PlayerEditionRecord[];
}

/**
 * Tactical Starting XI dashboard displaying player cards, roles, and composition checklist.
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

      {/* Tactical Balance Checklist */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {squad.hasWicketKeeper ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
          <span className={squad.hasWicketKeeper ? "text-slate-200" : "text-amber-300"}>
            Wicketkeeper ({squad.hasWicketKeeper ? "Active" : "Missing -4 Penalty"})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {squad.bowlerCount >= 5 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
          <span className={squad.bowlerCount >= 5 ? "text-slate-200" : "text-amber-300"}>
            Bowlers: {squad.bowlerCount}/5 Required
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {squad.isBalancedAttack ? (
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          ) : (
            <Zap className="w-4 h-4 text-slate-500" />
          )}
          <span className={squad.isBalancedAttack ? "text-sky-300 font-semibold" : "text-slate-400"}>
            Attack Diversity ({squad.pacerCount} Pace, {squad.spinnerCount} Spin)
          </span>
        </div>
      </div>

      {/* Starting XI Roster Slots */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-400 px-1">
          Starting XI Slots ({draftedPlayers.length}/11)
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
                <span className="text-xs font-mono">Empty Slot</span>
                <span className="text-xs font-mono">--</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
