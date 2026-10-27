"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Disc, Sparkles, Trophy, ArrowRight, Filter, Shuffle } from "lucide-react";
import { DraftSessionState } from "../engine/draft";
import { isRoleGateClosed, getRoleGateQuota } from "../engine/lineup";
import { PlayerEditionRecord, PlayerRole } from "../types/cricket";
import { PlayerPickCard } from "./PlayerPickCard";

interface DraftWheelProps {
  session: DraftSessionState;
  onSpin: () => Promise<void> | void;
  onSelectPick: (player: PlayerEditionRecord) => Promise<void> | void;
  onAutoDraft?: () => Promise<void> | void;
  isLoading?: boolean;
}

/**
 * Interactive drafting wheel and player selector for the 11-round session.
 * Features strict role gating (disabling roles once quota is reached) and full 15-player squad browsing.
 *
 * @param props - DraftWheelProps
 */
export const DraftWheel: React.FC<DraftWheelProps> = ({
  session,
  onSpin,
  onSelectPick,
  onAutoDraft,
  isLoading = false,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerEditionRecord | null>(null);
  const [roleFilter, setRoleFilter] = useState<"ALL" | PlayerRole>("ALL");

  const handleSpinClick = async () => {
    if (isLoading || session.activeSquad) return;
    setSelectedPlayer(null);
    setRoleFilter("ALL");
    await onSpin();
  };

  const handleConfirmPick = async () => {
    if (!selectedPlayer || isLoading) return;
    await onSelectPick(selectedPlayer);
    setSelectedPlayer(null);
    setRoleFilter("ALL");
  };

  const handleRandomSquadPick = () => {
    if (!session.activeSquad) return;
    const eligible = session.activeSquad.roster.filter(
      (p) => !isRoleGateClosed(p.role, session.draftedPlayers)
    );
    if (eligible.length > 0) {
      const random = eligible[Math.floor(Math.random() * eligible.length)];
      setSelectedPlayer(random);
    }
  };

  const filteredRoster = session.activeSquad
    ? session.activeSquad.roster.filter((p) => roleFilter === "ALL" || p.role === roleFilter)
    : [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Round & Progress Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold">
            Draft Phase
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-sm font-medium text-slate-300">
            Round {session.currentRound} of {session.maxRounds}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {session.draftedPlayers.length}/11 Picked
        </span>
      </div>

      <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden border border-white/5">
        <motion.div
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(session.draftedPlayers.length / 11) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Spin Wheel Header & Trigger */}
      {!session.activeSquad ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 bg-slate-900/60 border border-white/10 rounded-3xl backdrop-blur-2xl text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <motion.div
            animate={{ rotate: isLoading ? 720 : 0 }}
            transition={{ duration: 0.9, repeat: isLoading ? Infinity : 0, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 shadow-inner"
          >
            <Disc className="w-10 h-10 animate-pulse" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Round {session.currentRound} Spin
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Spin the tournament wheel to unlock a random World Cup squad and draft 1 player into your XI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSpinClick}
              disabled={isLoading}
              className="px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5" />
              {isLoading ? "Spinning Reel..." : "SPIN FOR SQUAD"}
            </button>

            {onAutoDraft && session.draftedPlayers.length === 0 && (
              <button
                onClick={onAutoDraft}
                disabled={isLoading}
                className="px-5 py-4 rounded-xl font-bold text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-amber-400/40 transition-all flex items-center gap-2"
                title="Automatically draft a randomized 11-player squad across historical editions"
              >
                <Shuffle className="w-4 h-4 text-amber-400" />
                RANDOM TEAM
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Active Squad Drawn - Pick Selection */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-4 p-6 bg-slate-900/80 border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl"
        >
          {/* Squad Header Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400 font-semibold">
                Drawn World Cup Squad ({session.activeSquad.roster.length} Players Available)
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h4 className="text-xl font-bold text-white">
                  {session.activeSquad.teamName}
                </h4>
                {session.activeSquad.isChampion && (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Trophy className="w-3.5 h-3.5" /> WINNER
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomSquadPick}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition"
                title="Pick random available player"
              >
                <Shuffle className="w-3 h-3" />
                <span className="hidden sm:inline">Random Pick</span>
              </button>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 text-slate-300 border border-white/10">
                {session.activeSquad.editionYear}
              </span>
            </div>
          </div>

          {/* Quick Role Filter Tabs */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {(["ALL", "BAT", "WK", "AR", "BOWL"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    roleFilter === role
                      ? "bg-amber-400 text-slate-950 font-bold shadow"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Showing {filteredRoster.length} players
            </span>
          </div>

          {/* Full Squad Roster Grid (Including Starters and Bench) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredRoster.map((player) => {
              const isGated = isRoleGateClosed(player.role, session.draftedPlayers);
              const quota = getRoleGateQuota(player.role, session.draftedPlayers);

              return (
                <PlayerPickCard
                  key={player.id}
                  player={player}
                  isSelected={selectedPlayer?.id === player.id}
                  isDisabled={isGated}
                  disabledReason={`Quota Met (${quota.max}/${quota.max})`}
                  onSelect={(p) => {
                    if (!isGated) setSelectedPlayer(p);
                  }}
                />
              );
            })}
          </div>

          {/* Confirm Pick Button */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {selectedPlayer
                ? `Selected: ${selectedPlayer.name} (${selectedPlayer.ovr} OVR · ${selectedPlayer.role})`
                : "Choose a player above to proceed"}
            </span>

            <button
              onClick={handleConfirmPick}
              disabled={!selectedPlayer || isLoading}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                selectedPlayer && !isLoading
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/30 hover:scale-105"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
              }`}
            >
              {isLoading ? "Validating Pick..." : "CONFIRM PICK"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
