"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, FastForward, RotateCcw, Trophy, Skull } from "lucide-react";
import { WORLD_CUP_SCHEDULE } from "../engine/simulator";
import { MatchResult, PlayerEditionRecord } from "../types/cricket";
import { logInfo, logError } from "../utils/logger";

interface GauntletRunnerProps {
  draftedPlayers: PlayerEditionRecord[];
  onResetDraft: () => void;
}

/**
 * Interactive 9-match World Cup tournament runner connected to the server API backend.
 *
 * @param props - GauntletRunnerProps
 */
export const GauntletRunner: React.FC<GauntletRunnerProps> = ({
  draftedPlayers,
  onResetDraft,
}) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // 0 to 8
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [activeResult, setActiveResult] = useState<MatchResult | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isSimulatingCurrent, setIsSimulatingCurrent] = useState(false);
  const [runFailed, setRunFailed] = useState(false);
  const [isChampion, setIsChampion] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Computes tactical averages
  const teamBattingOvr = Math.round(
    [...draftedPlayers].sort((a, b) => b.subRatings.batting - a.subRatings.batting).slice(0, 7)
      .reduce((acc, curr) => acc + curr.subRatings.batting, 0) / 7
  );
  const teamBowlingOvr = Math.round(
    [...draftedPlayers].sort((a, b) => b.subRatings.bowling - a.subRatings.bowling).slice(0, 5)
      .reduce((acc, curr) => acc + curr.subRatings.bowling, 0) / 5
  );

  const runSingleMatch = async () => {
    if (runFailed || isChampion || currentMatchIndex >= 9 || isSimulatingCurrent) return;

    setIsSimulatingCurrent(true);
    setServerError(null);

    try {
      // Server-authoritative match simulation
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftedPlayers,
          matchIndex: currentMatchIndex,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Simulation error on server");
      }

      const result: MatchResult = json.data.result;
      const isChampionshipDecider: boolean = json.data.isChampion;

      setActiveResult(result);
      setMatchHistory((prev) => [...prev, result]);
      setIsSimulatingCurrent(false);

      if (!result.userWon) {
        setIsAutoPlaying(false);
        setRunFailed(true);
        // Post run to leaderboard asynchronously
        fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: "Challenger",
            streak: currentMatchIndex,
            isChampion: false,
            teamAverageOvr: Math.round((teamBattingOvr + teamBowlingOvr) / 2),
            finalStage: json.data.stageName,
            summary: `Defeated in ${json.data.stageName} by ${result.opponentName}`,
          }),
        }).catch((err) => logError("Failed to record run to leaderboard", { err }));
      } else {
        const nextIndex = currentMatchIndex + 1;
        setCurrentMatchIndex(nextIndex);

        if (isChampionshipDecider || nextIndex === 9) {
          setIsAutoPlaying(false);
          setIsChampion(true);
          try {
            if (typeof window !== "undefined") {
              confetti({ particleCount: 200, spread: 90, origin: { y: 0.55 } });
            }
          } catch {
            // Non-critical visual effect error suppressed
          }

          fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: "ChampionSkipper",
              streak: 9,
              isChampion: true,
              teamAverageOvr: Math.round((teamBattingOvr + teamBowlingOvr) / 2),
              finalStage: "THE FINAL (Champions)",
              summary: "Undefeated 9-0 clean sweep World Champions",
            }),
          }).catch((err) => logError("Failed to record champion run", { err }));
        }
      }
    } catch (err) {
      setIsSimulatingCurrent(false);
      setIsAutoPlaying(false);
      setServerError(err instanceof Error ? err.message : "Network error");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && !runFailed && !isChampion && currentMatchIndex < 9) {
      timer = setTimeout(() => {
        runSingleMatch();
      }, 950);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentMatchIndex, runFailed, isChampion]);

  const streak = currentMatchIndex;
  const currentOpponent = WORLD_CUP_SCHEDULE[currentMatchIndex] || WORLD_CUP_SCHEDULE[8];

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Top Streak Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900/80 border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            The 9 - 0 Championship Path
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              {streak} - 0
            </span>
            <span className="text-sm font-mono text-slate-400">/ 9 WINS</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!runFailed && !isChampion && (
            <>
              <button
                onClick={runSingleMatch}
                disabled={isSimulatingCurrent || isAutoPlaying}
                className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                <FastForward className="w-4 h-4 text-amber-400" />
                {isSimulatingCurrent ? "SIMULATING..." : "SIM 1 MATCH"}
              </button>

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                disabled={isSimulatingCurrent}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition shadow-lg ${
                  isAutoPlaying
                    ? "bg-amber-500 text-slate-950 shadow-amber-500/20"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
                }`}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAutoPlaying ? "PAUSE RUN" : "AUTO-SIMULATE"}
              </button>
            </>
          )}

          <button
            onClick={onResetDraft}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition"
            title="Start Fresh Draft"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {serverError && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-mono text-red-300 text-center">
          {serverError}
        </div>
      )}

      {/* Progress Bar towards 9 */}
      <div className="w-full bg-slate-800/60 rounded-full h-2.5 overflow-hidden border border-white/5">
        <motion.div
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full"
          animate={{ width: `${(streak / 9) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 9 Stages Stepper Indicator */}
      <div className="grid grid-cols-9 gap-1 px-1">
        {WORLD_CUP_SCHEDULE.map((m, idx) => (
          <div
            key={m.id}
            className={`h-1.5 rounded-full transition-colors ${
              idx < streak
                ? "bg-emerald-400"
                : idx === streak
                ? "bg-amber-400 animate-pulse"
                : "bg-slate-800"
            }`}
            title={`Match ${idx + 1}: ${m.stageName} vs ${m.name}`}
          />
        ))}
      </div>

      {/* Active Match Arena Card */}
      {!runFailed && !isChampion && (
        <div className="p-8 bg-slate-900/60 border border-white/10 rounded-3xl backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-white/10 text-amber-300 border border-white/10">
                {currentOpponent.stageName}
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                Match #{currentMatchIndex + 1} of 9
              </span>
            </div>

            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono ${
              currentOpponent.difficultyTier === "CHAMPION"
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : currentOpponent.difficultyTier === "ELITE"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
            }`}>
              {currentOpponent.difficultyTier} OPPONENT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* User Squad Box */}
            <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-mono text-slate-400">YOUR STARTING XI</span>
              <span className="text-lg font-bold text-white mt-1">Invincible Challengers</span>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                <span>BAT: {teamBattingOvr}</span>
                <span>•</span>
                <span>BOWL: {teamBowlingOvr}</span>
              </div>
            </div>

            {/* Opponent Squad Box */}
            <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-mono text-slate-400">OPPONENT SQUAD</span>
              <span className="text-lg font-bold text-amber-300 mt-1">{currentOpponent.name}</span>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                <span>BAT: {currentOpponent.battingOvr}</span>
                <span>•</span>
                <span>BOWL: {currentOpponent.bowlingOvr}</span>
                <span>•</span>
                <span>{currentOpponent.starPlayer}</span>
              </div>
            </div>
          </div>

          {/* Realtime Live Score Display */}
          {activeResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            >
              <div>
                <span className="text-xs font-mono text-emerald-300 font-semibold uppercase">
                  Last Matchday Verdict (Server Verified)
                </span>
                <div className="text-base font-bold text-white mt-0.5">
                  User {activeResult.userScore.runs}/{activeResult.userScore.wickets} vs {activeResult.opponentName} {activeResult.opponentScore.runs}/{activeResult.opponentScore.wickets}
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-500 text-slate-950">
                {activeResult.marginDescription}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Game Over Screen */}
      <AnimatePresence>
        {runFailed && activeResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-red-950/40 border border-red-500/40 rounded-3xl backdrop-blur-2xl text-center shadow-2xl flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg">
              <Skull className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-black text-white">THE 9 - 0 DREAM IS OVER</h3>
            <p className="text-sm text-slate-300 max-w-md">
              Knocked out in <span className="font-bold text-amber-300">{currentOpponent.stageName}</span> (Match #{activeResult.matchNumber}) by <span className="font-bold text-red-400">{activeResult.opponentName}</span>.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 w-full max-w-md text-left font-mono text-xs flex flex-col gap-2">
              <div className="flex justify-between text-slate-300">
                <span>Final Scorecard:</span>
                <span className="text-red-400 font-bold">{activeResult.marginDescription}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Your Squad:</span>
                <span>{activeResult.userScore.runs}/{activeResult.userScore.wickets} (20 ov)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{activeResult.opponentName}:</span>
                <span>{activeResult.opponentScore.runs}/{activeResult.opponentScore.wickets} (20 ov)</span>
              </div>
            </div>

            <button
              onClick={onResetDraft}
              className="mt-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-xl shadow-red-500/30 hover:scale-105 transition"
            >
              START A NEW DRAFT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Champion Victory Screen */}
      <AnimatePresence>
        {isChampion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-amber-500/20 border border-amber-400/50 rounded-3xl backdrop-blur-2xl text-center shadow-2xl flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-amber-400/30 border border-amber-400 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-400/20 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              9 - 0 UNBEATEN WORLD CHAMPIONS
            </h3>
            <p className="text-sm text-slate-200 max-w-md">
              Flawless campaign! You conquered the Group Stage, Super 8s, Semi-Final, and lifted the World Cup trophy with a perfect 9–0 clean sweep!
            </p>

            <button
              onClick={onResetDraft}
              className="mt-4 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/40 hover:scale-105 transition"
            >
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
