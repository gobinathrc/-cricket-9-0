"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ArrowUp, ArrowDown, Wand2, Shield } from "lucide-react";
import { evaluateSquadTactics } from "../engine/simulator";
import { DEFAULT_FORMATION } from "../data/formations";
import {
  reorderBattingLineup,
  autoOptimizeBattingLineup,
  getBattingPositionLabel,
} from "../engine/lineup";
import { PlayerEditionRecord, TacticalFormation } from "../types/cricket";

interface SquadXIViewProps {
  draftedPlayers: PlayerEditionRecord[];
  formation?: TacticalFormation;
  onReorderLineup?: (updatedPlayers: PlayerEditionRecord[]) => void;
}

/**
 * Tactical Starting XI dashboard displaying player cards, roles, and strict composition checklist.
 * Enables live moving/reordering of batting positions (#1 to #11) and smart auto-ordering.
 *
 * @param props - SquadXIViewProps
 */
export const SquadXIView: React.FC<SquadXIViewProps> = ({
  draftedPlayers,
  formation = DEFAULT_FORMATION,
  onReorderLineup,
}) => {
  const squad = evaluateSquadTactics(draftedPlayers, formation);

  const handleMoveUp = (index: number) => {
    if (index <= 0 || !onReorderLineup) return;
    const reordered = reorderBattingLineup(draftedPlayers, index, index - 1);
    onReorderLineup(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index >= draftedPlayers.length - 1 || !onReorderLineup) return;
    const reordered = reorderBattingLineup(draftedPlayers, index, index + 1);
    onReorderLineup(reordered);
  };

  const handleAutoOrder = () => {
    if (!onReorderLineup || draftedPlayers.length === 0) return;
    const optimized = autoOptimizeBattingLineup(draftedPlayers);
    onReorderLineup(optimized);
  };

  /**
   * Derives contextual slot descriptions matching the chosen formation layout.
   */
  const getSlotRoleLabel = (index: number): string => {
    let offset = 0;
    if (index < offset + squad.formation.wk) return "Wicketkeeper Slot";
    offset += squad.formation.wk;
    if (index < offset + squad.formation.bat) return "Batsman Slot";
    offset += squad.formation.bat;
    if (index < offset + squad.formation.ar) return "All-Rounder Slot";
    offset += squad.formation.ar;
    if (index < offset + squad.formation.bowl) return "Bowler Slot";
    return "Flex Slot";
  };

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
            squad.wkCount >= squad.formation.wk ? "bg-purple-500/10 border-purple-500/30 text-purple-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>WK (Min {squad.formation.wk}):</span>
            <span className="font-bold text-sm">{squad.wkCount}/{squad.formation.wk}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.batCount >= squad.formation.bat ? "bg-blue-500/10 border-blue-500/30 text-blue-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>BAT (Min {squad.formation.bat}):</span>
            <span className="font-bold text-sm">{squad.batCount}/{squad.formation.bat}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.arCount >= squad.formation.ar ? "bg-amber-500/10 border-amber-500/30 text-amber-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>AR (Min {squad.formation.ar}):</span>
            <span className="font-bold text-sm">{squad.arCount}/{squad.formation.ar}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            squad.bowlCount >= squad.formation.bowl ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "bg-white/5 border-white/10 text-slate-400"
          }`}>
            <span>BOWL (Min {squad.formation.bowl}):</span>
            <span className="font-bold text-sm">{squad.bowlCount}/{squad.formation.bowl}</span>
          </div>
        </div>

        {squad.missingRoleDescriptions.length > 0 && draftedPlayers.length >= 8 && (
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono text-amber-300">
            ⚠ Still needed for {squad.formation.shortCode}: {squad.missingRoleDescriptions.join(" · ")}
          </div>
        )}
      </div>

      {/* Starting XI Batting Order & Lineup Positions */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-300">
            Batting Order ({draftedPlayers.length}/11)
          </h4>

          {draftedPlayers.length >= 2 && onReorderLineup && (
            <button
              onClick={handleAutoOrder}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition shadow-sm"
              title="Automatically arrange batting order: Openers -> Middle Order -> Wicketkeeper -> All-Rounders -> Bowlers"
            >
              <Wand2 className="w-3 h-3 text-amber-400" />
              <span>Auto-Order Lineup</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Array.from({ length: 11 }).map((_, index) => {
            const player = draftedPlayers[index];
            const positionInfo = getBattingPositionLabel(index);

            if (player) {
              return (
                <div
                  key={player.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between backdrop-blur-md shadow group hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Batting Position Number & Up/Down Stepper */}
                    <div className="flex flex-col items-center justify-center">
                      {onReorderLineup && draftedPlayers.length > 1 && (
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveUp(index)}
                          className="text-slate-500 hover:text-amber-400 disabled:opacity-20 transition leading-none p-0.5"
                          title="Move Up in Batting Order"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      <span className="text-xs font-mono font-black text-amber-400 leading-none">
                        #{index + 1}
                      </span>
                      {onReorderLineup && draftedPlayers.length > 1 && (
                        <button
                          disabled={index === draftedPlayers.length - 1}
                          onClick={() => handleMoveDown(index)}
                          className="text-slate-500 hover:text-amber-400 disabled:opacity-20 transition leading-none p-0.5"
                          title="Move Down in Batting Order"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white truncate">
                          {player.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-white/10 text-slate-300">
                          {player.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <span className="text-amber-400/90 font-medium">
                          {positionInfo.title}
                        </span>
                        <span>·</span>
                        <span>{player.countryCode} ({player.editionYear})</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-lg text-sm font-black font-mono bg-white/10 text-amber-300 border border-white/10 flex-shrink-0">
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold w-4">#{index + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-slate-400">
                      {positionInfo.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      {getSlotRoleLabel(index)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-700">--</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
