"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, FastForward, RotateCcw, Trophy, Skull, Swords, Award } from "lucide-react";
import {
  LEAGUE_TEAMS,
  generateLeagueSchedule,
  createInitialStandings,
  TeamStanding,
  LeagueMatchday,
  LeagueMatchScore,
  PlayoffBracket,
} from "../engine/league";
import { LeagueTable } from "./LeagueTable";
import { MatchResult, PlayerEditionRecord, TacticalFormation } from "../types/cricket";
import { logInfo, logError } from "../utils/logger";

interface GauntletRunnerProps {
  draftedPlayers: PlayerEditionRecord[];
  formation?: TacticalFormation;
  onResetDraft: () => void;
}

/**
 * Interactive 8-Team League Season & Playoff Runner.
 * Simulates concurrent matchdays side-by-side with a live updating points table,
 * Net Run Rate calculations, around-the-league scoreboards, and top-4 playoff gauntlet.
 *
 * @param props - GauntletRunnerProps
 */
export const GauntletRunner: React.FC<GauntletRunnerProps> = ({
  draftedPlayers,
  formation,
  onResetDraft,
}) => {
  const [schedule] = useState<LeagueMatchday[]>(() => generateLeagueSchedule(LEAGUE_TEAMS));
  const [standings, setStandings] = useState<TeamStanding[]>(() => createInitialStandings(LEAGUE_TEAMS));
  const [currentMatchdayIndex, setCurrentMatchdayIndex] = useState(0); // 0 to 13
  const [activeResult, setActiveResult] = useState<MatchResult | null>(null);
  const [lastMatchdayScores, setLastMatchdayScores] = useState<LeagueMatchScore[] | null>(null);

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isSimulatingCurrent, setIsSimulatingCurrent] = useState(false);
  const [isRegularSeasonDone, setIsRegularSeasonDone] = useState(false);
  const [userQualifiedForPlayoffs, setUserQualifiedForPlayoffs] = useState(false);
  const [playoffBracket, setPlayoffBracket] = useState<PlayoffBracket | null>(null);
  const [playoffStage, setPlayoffStage] = useState<"NONE" | "SEMI_FINAL" | "FINAL" | "FINISHED">("NONE");

  const [isChampion, setIsChampion] = useState(false);
  const [seasonEliminated, setSeasonEliminated] = useState(false);
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

  const userStanding = standings.find((s) => s.teamId === "ind") || standings[0];
  const userWins = userStanding.won;
  const userLosses = userStanding.lost;

  // Identify current opponent in this matchday
  const currentMatchday = schedule[currentMatchdayIndex] || schedule[0];
  const userFixture = currentMatchday.fixtures.find(
    (f) => f.homeTeamId === "ind" || f.awayTeamId === "ind"
  ) || currentMatchday.fixtures[0];
  const currentOpponentId = userFixture.homeTeamId === "ind" ? userFixture.awayTeamId : userFixture.homeTeamId;
  const currentOpponent = LEAGUE_TEAMS.find((t) => t.id === currentOpponentId) || LEAGUE_TEAMS[1];

  /**
   * Simulates the current matchday across all 8 teams via the backend API.
   */
  const runSingleMatchday = async () => {
    if (isRegularSeasonDone || isSimulatingCurrent) return;

    setIsSimulatingCurrent(true);
    setServerError(null);

    try {
      const res = await fetch("/api/league", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftedPlayers,
          matchdayIndex: currentMatchdayIndex,
          currentStandings: standings,
          formation,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Server matchday simulation failed");
      }

      const matchdayResult = json.data.matchdayResult;
      setActiveResult(matchdayResult.userMatchResult);
      setLastMatchdayScores(matchdayResult.fixtureResults);
      setStandings(matchdayResult.updatedStandings);
      setIsSimulatingCurrent(false);

      if (json.data.isRegularSeasonFinished) {
        setIsAutoPlaying(false);
        setIsRegularSeasonDone(true);
        setUserQualifiedForPlayoffs(json.data.userQualifiedForPlayoffs);
        setPlayoffBracket(json.data.playoffBracket);

        if (json.data.userQualifiedForPlayoffs) {
          setPlayoffStage("SEMI_FINAL");
        } else {
          setSeasonEliminated(true);
          // Post league exit to leaderboard
          fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: "Challenger",
              streak: userWins + (matchdayResult.userMatchResult.userWon ? 1 : 0),
              isChampion: false,
              teamAverageOvr: Math.round((teamBattingOvr + teamBowlingOvr) / 2),
              finalStage: `Finished #${userStanding.rank} in League`,
              summary: `Completed 14-match regular season with ${userWins} wins. Missed playoffs.`,
            }),
          }).catch((err) => logError("Failed to record league run", { err }));
        }
      } else {
        setCurrentMatchdayIndex((prev) => prev + 1);
      }
    } catch (err) {
      setIsSimulatingCurrent(false);
      setIsAutoPlaying(false);
      setServerError(err instanceof Error ? err.message : "Network error during simulation");
    }
  };

  /**
   * Simulates a playoff match (Semi-Final or Final).
   */
  const runPlayoffMatch = async () => {
    if (isSimulatingCurrent || (playoffStage !== "SEMI_FINAL" && playoffStage !== "FINAL")) return;

    setIsSimulatingCurrent(true);
    setServerError(null);

    // Identify playoff opponent
    let opponentId = "aus";
    if (playoffStage === "SEMI_FINAL" && playoffBracket) {
      const isSF1 = playoffBracket.semiFinal1.homeTeam.teamId === "ind" || playoffBracket.semiFinal1.awayTeam.teamId === "ind";
      const sf = isSF1 ? playoffBracket.semiFinal1 : playoffBracket.semiFinal2;
      opponentId = sf.homeTeam.teamId === "ind" ? sf.awayTeam.teamId : sf.homeTeam.teamId;
    } else if (playoffStage === "FINAL") {
      opponentId = "sa"; // Final challenger
    }

    try {
      const res = await fetch("/api/league", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftedPlayers,
          formation,
          isPlayoff: true,
          playoffStage,
          playoffOpponentId: opponentId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Playoff simulation failed");
      }

      const result: MatchResult = json.data.playoffResult;
      setActiveResult(result);
      setIsSimulatingCurrent(false);

      if (!result.userWon) {
        setSeasonEliminated(true);
        setPlayoffStage("FINISHED");
        fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: "PlayoffContender",
            streak: userWins,
            isChampion: false,
            teamAverageOvr: Math.round((teamBattingOvr + teamBowlingOvr) / 2),
            finalStage: playoffStage === "SEMI_FINAL" ? "SEMI-FINAL" : "THE FINAL",
            summary: `Defeated in ${playoffStage === "SEMI_FINAL" ? "Semi-Final" : "Final"} by ${result.opponentName}`,
          }),
        }).catch((err) => logError("Failed to record playoff loss", { err }));
      } else {
        if (playoffStage === "SEMI_FINAL") {
          setPlayoffStage("FINAL");
        } else if (playoffStage === "FINAL") {
          setIsChampion(true);
          setPlayoffStage("FINISHED");
          try {
            if (typeof window !== "undefined") {
              confetti({ particleCount: 250, spread: 100, origin: { y: 0.55 } });
            }
          } catch {
            // Suppress non-critical visual error
          }

          fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: "ChampionSkipper",
              streak: userWins + 2,
              isChampion: true,
              teamAverageOvr: Math.round((teamBattingOvr + teamBowlingOvr) / 2),
              finalStage: "LEAGUE CHAMPIONS (16-0 Path)",
              summary: `Grand Champions: Finished ${userWins}-0 in Regular Season + Playoff Sweep!`,
            }),
          }).catch((err) => logError("Failed to record championship run", { err }));
        }
      }
    } catch (err) {
      setIsSimulatingCurrent(false);
      setServerError(err instanceof Error ? err.message : "Playoff simulation error");
    }
  };

  // Auto-simulate timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && !isRegularSeasonDone && currentMatchdayIndex < 14) {
      timer = setTimeout(() => {
        runSingleMatchday();
      }, 900);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentMatchdayIndex, isRegularSeasonDone]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Top Banner: League Season Navigation & Streak */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900/80 border border-white/15 rounded-3xl backdrop-blur-2xl shadow-2xl gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            8-Team Premier Season • 14 Matchdays
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              {userWins}W - {userLosses}L
            </span>
            <span className="text-sm font-mono text-slate-400">
              Rank #{userStanding.rank} • {userStanding.points} PTS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isRegularSeasonDone && (
            <>
              <button
                onClick={runSingleMatchday}
                disabled={isSimulatingCurrent || isAutoPlaying}
                className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                <FastForward className="w-4 h-4 text-amber-400" />
                {isSimulatingCurrent ? "SIMULATING..." : "SIM 1 MATCHDAY"}
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
                {isAutoPlaying ? "PAUSE SEASON" : "AUTO-SIM SEASON"}
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

      {/* Progress Bar towards 14 Matchdays */}
      <div className="w-full bg-slate-800/60 rounded-full h-2.5 overflow-hidden border border-white/5">
        <motion.div
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full"
          animate={{ width: `${(currentMatchdayIndex / 14) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 14 Matchdays Stepper Indicator */}
      <div
        className="gap-1 px-1 w-full"
        style={{ display: "grid", gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 14 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-colors ${
              idx < currentMatchdayIndex
                ? "bg-emerald-400"
                : idx === currentMatchdayIndex && !isRegularSeasonDone
                ? "bg-amber-400 animate-pulse"
                : "bg-slate-800"
            }`}
            title={`Matchday ${idx + 1}`}
          />
        ))}
      </div>

      {/* Main Side-by-Side Grid: Simulation Arena (Left) vs Live Standings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Matchday Arena & Scoreboards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Active Regular Season Fixture Card */}
          {!isRegularSeasonDone && (
            <div className="p-6 bg-slate-900/60 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col gap-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-white/10 text-amber-300 border border-white/10">
                    MATCHDAY {currentMatchdayIndex + 1} OF 14
                  </span>
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                    Round-Robin
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  HOME & AWAY LEAGUE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* User Squad Box */}
                <div className="flex flex-col p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">YOUR STARTING XI (YOU)</span>
                  <span className="text-lg font-black text-white mt-1">India T20 (Challengers)</span>
                  <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                    <span>BAT: {teamBattingOvr}</span>
                    <span>•</span>
                    <span>BOWL: {teamBowlingOvr}</span>
                  </div>
                </div>

                {/* Opponent Squad Box */}
                <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">OPPONENT FRANCHISE</span>
                  <span className="text-lg font-black text-amber-300 mt-1">{currentOpponent.name}</span>
                  <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                    <span>BAT: {currentOpponent.battingOvr}</span>
                    <span>•</span>
                    <span>BOWL: {currentOpponent.bowlingOvr}</span>
                    <span>•</span>
                    <span>{currentOpponent.starPlayer}</span>
                  </div>
                </div>
              </div>

              {/* Realtime User Matchday Scorecard */}
              {activeResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                >
                  <div>
                    <span className="text-xs font-mono text-emerald-300 font-semibold uppercase">
                      Matchday #{activeResult.matchNumber} Result (Server Verified)
                    </span>
                    <div className="text-base font-bold text-white mt-0.5">
                      You {activeResult.userScore.runs}/{activeResult.userScore.wickets} vs {activeResult.opponentName} {activeResult.opponentScore.runs}/{activeResult.opponentScore.wickets}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-500 text-slate-950">
                    {activeResult.marginDescription}
                  </span>
                </motion.div>
              )}
            </div>
          )}

          {/* Around the League: Other 3 concurrent match results in this matchday */}
          {lastMatchdayScores && lastMatchdayScores.length > 0 && (
            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                Around The League • Concurrent Matchday Results
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lastMatchdayScores.map((score, sIdx) => {
                  const teamA = LEAGUE_TEAMS.find((t) => t.id === score.homeTeamId);
                  const teamB = LEAGUE_TEAMS.find((t) => t.id === score.awayTeamId);
                  const isUserMatch = score.homeTeamId === "ind" || score.awayTeamId === "ind";

                  return (
                    <div
                      key={sIdx}
                      className={`p-3 rounded-xl border text-xs font-mono flex flex-col justify-between gap-1.5 ${
                        isUserMatch
                          ? "bg-amber-500/10 border-amber-500/30 text-white"
                          : "bg-white/5 border-white/5 text-slate-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{teamA?.shortName}: {score.homeScore.runs}/{score.homeScore.wickets} ({score.homeScore.overs} ov)</span>
                        <span>{teamB?.shortName}: {score.awayScore.runs}/{score.awayScore.wickets} ({score.awayScore.overs} ov)</span>
                      </div>
                      <span className="text-[11px] text-amber-400/90 font-medium">{score.marginDescription}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Post-Season Playoff Arena Card */}
          {isRegularSeasonDone && !seasonEliminated && !isChampion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-amber-500/10 border border-amber-400/40 rounded-3xl backdrop-blur-2xl flex flex-col gap-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md text-xs font-black font-mono bg-amber-400 text-slate-950 uppercase">
                    {playoffStage === "SEMI_FINAL" ? "🏆 SEMI-FINAL QUALIFIER" : "👑 THE CHAMPIONSHIP FINAL"}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Knockout Match #{playoffStage === "SEMI_FINAL" ? 15 : 16}
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">TOP 4 PLAYOFFS</span>
              </div>

              <p className="text-sm text-slate-200">
                You finished in the Top 4! Win this knockout match to advance towards the Unbeaten Championship!
              </p>

              <button
                onClick={runPlayoffMatch}
                disabled={isSimulatingCurrent}
                className="w-full py-4 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition"
              >
                {isSimulatingCurrent
                  ? "SIMULATING KNOCKOUT..."
                  : playoffStage === "SEMI_FINAL"
                  ? "SIMULATE SEMI-FINAL"
                  : "SIMULATE THE FINAL"}
              </button>
            </motion.div>
          )}

          {/* Season Eliminated / Game Over Card */}
          <AnimatePresence>
            {seasonEliminated && activeResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-red-950/40 border border-red-500/40 rounded-3xl backdrop-blur-2xl text-center shadow-2xl flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg">
                  <Skull className="w-8 h-8" />
                </div>

                <h3 className="text-3xl font-black text-white">SEASON CONCLUDED</h3>
                <p className="text-sm text-slate-300 max-w-md">
                  {userQualifiedForPlayoffs
                    ? `Knocked out in ${playoffStage === "SEMI_FINAL" ? "Semi-Final" : "Final"} by ${activeResult.opponentName}.`
                    : `Finished #${userStanding.rank} in the League with a ${userWins}W - ${userLosses}L record. Missed Top-4 playoff cut.`}
                </p>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 w-full max-w-md text-left font-mono text-xs flex flex-col gap-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Final Result:</span>
                    <span className="text-red-400 font-bold">{activeResult.marginDescription}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Your Squad:</span>
                    <span>{activeResult.userScore.runs}/{activeResult.userScore.wickets} ({activeResult.userScore.overs} ov)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{activeResult.opponentName}:</span>
                    <span>{activeResult.opponentScore.runs}/{activeResult.opponentScore.wickets} ({activeResult.opponentScore.overs} ov)</span>
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
                  {userWins + 2} - 0 GRAND CHAMPIONS!
                </h3>
                <p className="text-sm text-slate-200 max-w-md">
                  Incredible season! You dominated the 14-matchday double round-robin, conquered the Semi-Final, and lifted the Championship Trophy!
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

        {/* Right Column: Live Standings Table (5 Cols) */}
        <div className="lg:col-span-5">
          <LeagueTable
            standings={standings}
            userTeamId="ind"
            currentMatchday={currentMatchdayIndex + (isRegularSeasonDone ? 0 : 1)}
            totalMatchdays={14}
          />
        </div>
      </div>
    </div>
  );
};
