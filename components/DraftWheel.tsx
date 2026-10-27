"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Disc, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { DraftSessionState } from "../engine/draft";
import { PlayerEditionRecord } from "../types/cricket";
import { PlayerPickCard } from "./PlayerPickCard";

interface DraftWheelProps {
  session: DraftSessionState;
  onSpin: () => Promise<void> | void;
  onSelectPick: (player: PlayerEditionRecord) => Promise<void> | void;
  isLoading?: boolean;
}

/**
 * Interactive drafting wheel and player selector for the 11-round session.
 * Connected to server API endpoints with optimistic loading states.
 *
 * @param props - DraftWheelProps
 */
export const DraftWheel: React.FC<DraftWheelProps> = ({
  session,
  onSpin,
  onSelectPick,
  isLoading = false,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerEditionRecord | null>(null);

  const handleSpinClick = async () => {
    if (isLoading || session.activeSquad) return;
    setSelectedPlayer(null);
    await onSpin();
  };

  const handleConfirmPick = async () => {
    if (!selectedPlayer || isLoading) return;
    await onSelectPick(selectedPlayer);
    setSelectedPlayer(null);
  };

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

          <button
            onClick={handleSpinClick}
            disabled={isLoading}
            className="px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? "Spinning Server Reel..." : "SPIN FOR SQUAD"}
          </button>
        </motion.div>
      ) : (
        /* Active Squad Drawn - Pick Selection */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-5 p-6 bg-slate-900/80 border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl"
        >
          {/* Squad Header Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400 font-semibold">
                Drawn Tournament Squad (Server Verified)
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

            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 text-slate-300 border border-white/10">
              {session.activeSquad.editionYear}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Select 1 player from this roster to add to your starting XI:
          </p>

          {/* Roster Pick Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {session.activeSquad.roster.map((player) => (
              <PlayerPickCard
                key={player.id}
                player={player}
                isSelected={selectedPlayer?.id === player.id}
                onSelect={(p) => setSelectedPlayer(p)}
              />
            ))}
          </div>

          {/* Confirm Pick Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {selectedPlayer
                ? `Selected: ${selectedPlayer.name} (${selectedPlayer.ovr} OVR)`
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
