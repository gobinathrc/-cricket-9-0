"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeamStanding } from "../engine/league";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LeagueTableProps {
  standings: TeamStanding[];
  userTeamId?: string;
  currentMatchday?: number;
  totalMatchdays?: number;
}

/**
 * Glassmorphic 8-Team Premier League / IPL Points Table with live animated re-ranking,
 * Top-4 playoff qualification zone cutoff, Net Run Rate (NRR), and recent form chips.
 *
 * @param props - LeagueTableProps
 */
export const LeagueTable: React.FC<LeagueTableProps> = ({
  standings,
  userTeamId = "ind",
  currentMatchday = 0,
  totalMatchdays = 14,
}) => {
  return (
    <div className="flex flex-col w-full bg-slate-900/80 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase font-mono">
              League Standings
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Round-Robin Season • Top 4 Qualify for Playoffs
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE TABLE
        </div>
      </div>

      {/* Standings Grid with Mobile Momentum Touch Scrolling */}
      <div className="overflow-x-auto w-full overscroll-x-contain touch-pan-x scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-black/20">
              <th className="py-2.5 px-3 text-center w-10">Pos</th>
              <th className="py-2.5 px-3">Club / Franchise</th>
              <th className="py-2.5 px-2 text-center w-8">P</th>
              <th className="py-2.5 px-2 text-center w-8">W</th>
              <th className="py-2.5 px-2 text-center w-8">L</th>
              <th className="py-2.5 px-3 text-right">NRR</th>
              <th className="py-2.5 px-3 text-center font-bold text-amber-400 w-12">PTS</th>
              <th className="py-2.5 px-3 text-center hidden sm:table-cell w-24">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            <AnimatePresence>
              {standings.map((team, idx) => {
                const isUser = team.teamId === userTeamId;
                const isPlayoffZone = team.rank <= 4;

                return (
                  <motion.tr
                    key={team.teamId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`transition-colors ${
                      isUser
                        ? "bg-amber-500/15 border-l-4 border-l-amber-400 hover:bg-amber-500/20"
                        : isPlayoffZone
                        ? "border-l-2 border-l-emerald-500/60 hover:bg-white/5"
                        : "hover:bg-white/5 border-l-2 border-l-transparent opacity-80"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-mono ${
                          team.rank === 1
                            ? "bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20"
                            : isPlayoffZone
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "text-slate-400"
                        }`}
                      >
                        {team.rank}
                      </span>
                    </td>

                    {/* Team Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          {team.teamName}
                        </span>
                        {isUser && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Played */}
                    <td className="py-3 px-2 text-center text-slate-300">
                      {team.played}
                    </td>

                    {/* Won */}
                    <td className="py-3 px-2 text-center font-bold text-emerald-400">
                      {team.won}
                    </td>

                    {/* Lost */}
                    <td className="py-3 px-2 text-center text-rose-400">
                      {team.lost}
                    </td>

                    {/* NRR */}
                    <td
                      className={`py-3 px-3 text-right font-medium ${
                        team.nrr > 0
                          ? "text-emerald-400"
                          : team.nrr < 0
                          ? "text-rose-400"
                          : "text-slate-400"
                      }`}
                    >
                      {team.nrr > 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 text-center font-black text-amber-400 text-sm">
                      {team.points}
                    </td>

                    {/* Form */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {team.form && team.form.length > 0 ? (
                          team.form.map((res, fIdx) => (
                            <span
                              key={fIdx}
                              className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                                res === "W"
                                  ? "bg-emerald-500 text-slate-950 font-bold"
                                  : "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                              }`}
                            >
                              {res}
                            </span>
                          ))
                        ) : (
                          <Minus className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Qualification Legend Footer */}
      <div className="p-3 bg-black/40 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 px-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Ranks 1–4: Qualify for Championship Playoffs</span>
        </div>
        <div>
          <span>Matchday {currentMatchday} / {totalMatchdays}</span>
        </div>
      </div>
    </div>
  );
};
