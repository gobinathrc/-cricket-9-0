"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Wand2,
  GripVertical,
  Move,
  Flame,
  Shield,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { evaluateSquadTactics } from "../engine/simulator";
import { DEFAULT_FORMATION } from "../data/formations";
import {
  reorderBattingLineup,
  autoOptimizeBattingLineup,
  getBattingPositionLabel,
  getPlayerPositionMismatch,
} from "../engine/lineup";
import { PlayerEditionRecord, TacticalFormation, PlayerRole } from "../types/cricket";

interface SquadXIViewProps {
  draftedPlayers: PlayerEditionRecord[];
  formation?: TacticalFormation;
  onReorderLineup?: (updatedPlayers: PlayerEditionRecord[]) => void;
}

/**
 * Tactical Starting XI dashboard inspired by the 38-0: Football Draft aesthetic.
 * Features oversized trading cards, bold OVR ratings, role color-coded glows,
 * real-time HTML5 drag-and-drop reordering with Framer Motion layout animations,
 * and contextual batting position designations (#1 Opener to #11 Tailender).
 *
 * @param props - SquadXIViewProps
 */
export const SquadXIView: React.FC<SquadXIViewProps> = ({
  draftedPlayers,
  formation = DEFAULT_FORMATION,
  onReorderLineup,
}) => {
  const squad = evaluateSquadTactics(draftedPlayers, formation);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (
      draggedIndex === null ||
      draggedIndex === targetIndex ||
      !onReorderLineup ||
      targetIndex < 0 ||
      targetIndex >= draftedPlayers.length
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = reorderBattingLineup(draftedPlayers, draggedIndex, targetIndex);
    onReorderLineup(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
   * Returns role-specific accent colors and gradients matching the 38-0 card look.
   */
  const getRoleCardStyles = (role: PlayerRole) => {
    switch (role) {
      case "BAT":
        return {
          border: "border-blue-500/40 hover:border-blue-400",
          glow: "from-blue-950/40 via-slate-900/90 to-slate-950/90",
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          tagText: "text-blue-400",
        };
      case "WK":
        return {
          border: "border-purple-500/40 hover:border-purple-400",
          glow: "from-purple-950/40 via-slate-900/90 to-slate-950/90",
          badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          tagText: "text-purple-400",
        };
      case "AR":
        return {
          border: "border-amber-500/40 hover:border-amber-400",
          glow: "from-amber-950/40 via-slate-900/90 to-slate-950/90",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          tagText: "text-amber-400",
        };
      case "BOWL":
        return {
          border: "border-emerald-500/40 hover:border-emerald-400",
          glow: "from-emerald-950/40 via-slate-900/90 to-slate-950/90",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          tagText: "text-emerald-400",
        };
      default:
        return {
          border: "border-white/15 hover:border-white/30",
          glow: "from-slate-900/90 to-slate-950/90",
          badge: "bg-white/10 text-slate-300 border-white/20",
          tagText: "text-slate-400",
        };
    }
  };

  /**
   * Derives contextual slot descriptions matching the chosen formation layout.
   */
  const getSlotRoleLabel = (index: number): string => {
    let offset = 0;
    if (index < offset + squad.formation.wk) return "Wicketkeeper Slot";
    offset += squad.formation.wk;
    if (index < offset + squad.formation.bat) return "Specialist Batsman";
    offset += squad.formation.bat;
    if (index < offset + squad.formation.ar) return "All-Rounder Depth";
    offset += squad.formation.ar;
    if (index < offset + squad.formation.bowl) return "Strike Bowler";
    return "Flex Slot";
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tactical Squad Header & Rating Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Batting Index
          </span>
          <span className="text-3xl font-black font-mono text-amber-400 mt-1">
            {squad.teamBattingOvr || "--"}
          </span>
          {squad.lineupSynergy !== undefined && squad.lineupSynergy < 100 && draftedPlayers.length >= 8 && (
            <span className="text-[10px] font-mono font-bold text-red-400 mt-1">
              ⚠ Inverted Order ({squad.lineupSynergy}% Synergy)
            </span>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Bowling Index
          </span>
          <span className="text-3xl font-black font-mono text-emerald-400 mt-1">
            {squad.teamBowlingOvr || "--"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Squad Average OVR
          </span>
          <span className="text-3xl font-black font-mono text-white mt-1">
            {squad.averageOvr || "--"}
          </span>
        </div>
      </div>

      {/* Mandatory Role Quotas Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/15 backdrop-blur-md flex flex-col gap-3 shadow-md">
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
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between ${
              squad.wkCount >= squad.formation.wk
                ? "bg-purple-500/10 border-purple-500/30 text-purple-200"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            <span>WK (Min {squad.formation.wk}):</span>
            <span className="font-bold text-sm">
              {squad.wkCount}/{squad.formation.wk}
            </span>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between ${
              squad.batCount >= squad.formation.bat
                ? "bg-blue-500/10 border-blue-500/30 text-blue-200"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            <span>BAT (Min {squad.formation.bat}):</span>
            <span className="font-bold text-sm">
              {squad.batCount}/{squad.formation.bat}
            </span>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between ${
              squad.arCount >= squad.formation.ar
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            <span>AR (Min {squad.formation.ar}):</span>
            <span className="font-bold text-sm">
              {squad.arCount}/{squad.formation.ar}
            </span>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between ${
              squad.bowlCount >= squad.formation.bowl
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            <span>BOWL (Min {squad.formation.bowl}):</span>
            <span className="font-bold text-sm">
              {squad.bowlCount}/{squad.formation.bowl}
            </span>
          </div>
        </div>

        {squad.missingRoleDescriptions.length > 0 && draftedPlayers.length >= 8 && (
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono text-amber-300">
            ⚠ Still needed for {squad.formation.shortCode}: {squad.missingRoleDescriptions.join(" · ")}
          </div>
        )}
      </div>

      {/* Tactical Lineup Imbalance Warning Banner */}
      {squad.lineupWarnings && squad.lineupWarnings.length > 0 && draftedPlayers.length >= 8 && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col gap-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              TACTICAL LINEUP IMBALANCE ({squad.lineupWarnings.length} ISSUES)
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-200 border border-red-500/30">
              Synergy: {squad.lineupSynergy}%
            </span>
          </div>
          <p className="text-[11px] font-mono text-red-200/80 leading-relaxed">
            Tailenders in the top order trigger early Powerplay collapses, and star batters down at #10/#11 face almost no deliveries.
            Drag players into proper positions or click <strong>Auto-Order Lineup</strong>.
          </p>
        </div>
      )}

      {/* Starting XI Batting Order & Lineup Positions */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold uppercase tracking-wider font-mono text-white">
                Starting XI Lineup ({draftedPlayers.length}/11)
              </h4>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                <Move className="w-3 h-3" /> DRAG TO REORDER
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Drag cards to position players in batting order (#1 Opener to #11 Tailender)
            </p>
          </div>

          {draftedPlayers.length >= 2 && onReorderLineup && (
            <button
              onClick={handleAutoOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition shadow-sm"
              title="Automatically arrange batting order: Openers -> Middle Order -> Keepers -> All-Rounders -> Bowlers"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Order Lineup</span>
            </button>
          )}
        </div>

        {/* 38-0 Style Starting XI Grid: Bigger, Card-Styled, Draggable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Array.from({ length: 11 }).map((_, index) => {
            const player = draftedPlayers[index];
            const positionInfo = getBattingPositionLabel(index);
            const isBeingDragged = draggedIndex === index;
            const isHoveredTarget = dragOverIndex === index && draggedIndex !== index;

            if (player) {
              const styles = getRoleCardStyles(player.role);
              const mismatch = getPlayerPositionMismatch(player, index);

              return (
                <motion.div
                  key={player.id}
                  layout
                  layoutId={player.id}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  draggable={Boolean(onReorderLineup && draftedPlayers.length > 1)}
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, index)}
                  onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>, index)}
                  onDragLeave={() => handleDragLeave(index)}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(index);
                  }}
                  onDragEnd={handleDragEnd}
                  className={`relative p-4 rounded-2xl bg-gradient-to-br ${styles.glow} border ${
                    isHoveredTarget
                      ? "ring-2 ring-amber-400 border-amber-400 bg-amber-400/20 scale-[1.02] shadow-xl shadow-amber-400/30 z-20"
                      : isBeingDragged
                      ? "opacity-35 scale-95 border-amber-400/60"
                      : mismatch.isMismatch
                      ? "border-red-500/50 shadow-red-500/10 shadow-lg"
                      : `${styles.border} shadow-lg`
                  } backdrop-blur-xl flex flex-col justify-between gap-3 group transition-all duration-150 cursor-grab active:cursor-grabbing select-none`}
                >
                  {/* Card Header: Position Badge, Drag Grip, and Large 38-0 OVR */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="text-slate-400 group-hover:text-amber-400 transition cursor-grab active:cursor-grabbing"
                        title="Drag to swap or move batting position"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-amber-400">
                          #{index + 1}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${styles.tagText}`}>
                          {positionInfo.title}
                        </span>
                      </div>
                    </div>

                    {/* Big Bold 38-0 Style OVR */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${styles.badge}`}>
                        {player.role}
                      </span>
                      <span className="text-2xl font-black font-mono tracking-tight text-white drop-shadow-md">
                        {player.ovr}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Large Player Name & Tournament Origins */}
                  <div className="flex flex-col gap-1 my-0.5">
                    <h5 className="text-base font-extrabold text-white tracking-wide truncate drop-shadow">
                      {player.name}
                    </h5>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <span className="font-semibold text-slate-200">
                        {player.countryCode} ({player.editionYear})
                      </span>
                      <span>·</span>
                      <span className="text-slate-400 text-[11px]">
                        {player.battingStyle} · {player.bowlingType !== "NONE" ? player.bowlingType : "BAT"}
                      </span>
                    </div>

                    {/* Out of position tactical mismatch warning */}
                    {mismatch.isMismatch && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-red-500/20 border border-red-500/40 text-[10px] font-mono font-bold text-red-300 mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <span className="truncate">{mismatch.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Sub-Rating Chips & Steppers */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                    {/* Mini Sub-Rating Stats (38-0 Style) */}
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        <span className="text-slate-400">BAT:</span>
                        <span className="font-bold text-amber-300">
                          {player.subRatings?.batting || player.ovr}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        <span className="text-slate-400">BOWL:</span>
                        <span className="font-bold text-emerald-300">
                          {player.subRatings?.bowling || 40}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        <span className="text-slate-400">CLUTCH:</span>
                        <span className="font-bold text-purple-300">
                          {player.subRatings?.clutch || 85}
                        </span>
                      </div>
                    </div>

                    {/* Step Up / Down Buttons for Click Reordering */}
                    {onReorderLineup && draftedPlayers.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(index);
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 disabled:opacity-20 border border-white/10 transition"
                          title="Move up in batting lineup"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === draftedPlayers.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(index);
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 disabled:opacity-20 border border-white/10 transition"
                          title="Move down in batting lineup"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }

            {/* Empty Slot Card matching 38-0 layout */}
            return (
              <div
                key={`empty_${index}`}
                className="p-4 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-between gap-3 min-h-[140px] text-slate-500 shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {positionInfo.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    UNFILLED
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <span className="text-xs font-mono text-slate-300 font-medium">
                    {getSlotRoleLabel(index)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Spun from tournament wheel
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-slate-600">
                  <span>Slot #{index + 1}</span>
                  <span className="text-slate-600 font-bold">-- OVR</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
