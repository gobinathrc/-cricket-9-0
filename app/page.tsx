"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { DraftWheel } from "../components/DraftWheel";
import { SquadXIView } from "../components/SquadXIView";
import { GauntletRunner } from "../components/GauntletRunner";
import { LeaderboardModal } from "../components/LeaderboardModal";
import { FormationSelector } from "../components/FormationSelector";
import { ALL_TOURNAMENT_SQUADS } from "../data/squads";
import { createDraftSession, DraftSessionState } from "../engine/draft";
import { PlayerEditionRecord, TacticalFormation } from "../types/cricket";
import { Swords, Trophy } from "lucide-react";
import { logError } from "../utils/logger";

/**
 * Main application page driving the draft session and 9-match simulation cycle.
 * Integrated with Next.js backend API routes (/api/draft/*, /api/simulate, /api/leaderboard).
 */
export default function HomePage() {
  const [session, setSession] = useState<DraftSessionState>(() =>
    createDraftSession(ALL_TOURNAMENT_SQUADS)
  );

  const [activeTab, setActiveTab] = useState<"DRAFT" | "SQUAD">("DRAFT");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Server-side spin
  const handleSpin = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/draft/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRound: session.currentRound,
          draftedAthleteIds: session.draftedAthleteIds,
          draftedPlayers: session.draftedPlayers,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to spin draft wheel on server");
      }

      setSession((prev) => ({
        ...prev,
        activeSquad: json.data.activeSquad,
        currentRound: json.data.currentRound,
      }));
    } catch (err) {
      logError("Frontend spin error", { err });
      setApiError(err instanceof Error ? err.message : "Error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  // Server-side pick confirmation
  const handleSelectPick = async (player: PlayerEditionRecord) => {
    if (!session.activeSquad) return;
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/draft/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeSquadId: session.activeSquad.id,
          playerId: player.id,
          currentRound: session.currentRound,
          draftedPlayers: session.draftedPlayers,
          draftedAthleteIds: session.draftedAthleteIds,
          formation: session.formation,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Pick rejected by server");
      }

      setSession((prev) => ({
        ...prev,
        draftedPlayers: json.data.draftedPlayers,
        draftedAthleteIds: json.data.draftedAthleteIds,
        currentRound: json.data.currentRound,
        activeSquad: null,
        isComplete: json.data.isComplete,
      }));
    } catch (err) {
      logError("Frontend pick error", { err });
      setApiError(err instanceof Error ? err.message : "Failed to record pick");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFormation = (formation: TacticalFormation) => {
    setSession((prev) => ({
      ...prev,
      formation,
    }));
  };

  const handleResetDraft = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/draft/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formation: session.formation }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSession(json.data);
      } else {
        setSession(createDraftSession(ALL_TOURNAMENT_SQUADS, session.formation));
      }
    } catch {
      setSession(createDraftSession(ALL_TOURNAMENT_SQUADS, session.formation));
    } finally {
      setIsLoading(false);
      setActiveTab("DRAFT");
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center max-w-5xl w-full mx-auto px-4 pb-16">
      <Header />

      {/* Leaderboard Trigger Button */}
      <div className="w-full flex justify-end mb-2">
        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 transition"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          HALL OF FAME
        </button>
      </div>

      {apiError && (
        <div className="w-full max-w-xl mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-xs font-mono text-red-300 text-center">
          {apiError}
        </div>
      )}

      {/* Main Mode Switcher: Drafting vs 9-0 Simulation Gauntlet */}
      {!session.isComplete ? (
        <div className="w-full flex flex-col items-center gap-6 mt-2">
          {/* Tactical Formation Selector Banner */}
          <FormationSelector
            currentFormation={session.formation}
            onSelectFormation={handleSelectFormation}
            draftedCount={session.draftedPlayers.length}
          />

          {/* Mobile Tab Toggle */}
          <div className="flex sm:hidden p-1 bg-slate-900/60 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab("DRAFT")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === "DRAFT" ? "bg-amber-400 text-slate-950" : "text-slate-400"
              }`}
            >
              Draft Wheel
            </button>
            <button
              onClick={() => setActiveTab("SQUAD")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === "SQUAD" ? "bg-amber-400 text-slate-950" : "text-slate-400"
              }`}
            >
              My XI ({session.draftedPlayers.length}/11)
            </button>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Draft Wheel & Pick Selector */}
            <div className={`lg:col-span-7 flex flex-col ${activeTab === "DRAFT" ? "block" : "hidden sm:block"}`}>
              <DraftWheel
                session={session}
                onSpin={handleSpin}
                onSelectPick={handleSelectPick}
                isLoading={isLoading}
              />
            </div>

            {/* Right 5 Cols: Live XI Formation & Tactics */}
            <div className={`lg:col-span-5 flex flex-col ${activeTab === "SQUAD" ? "block" : "hidden sm:block"}`}>
              <SquadXIView
                draftedPlayers={session.draftedPlayers}
                formation={session.formation}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Draft Complete -> The 9-0 Championship Gauntlet */
        <div className="w-full flex flex-col items-center gap-8 mt-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider">
            <Swords className="w-4 h-4" />
            STARTING XI LOCKED ({session.formation.shortCode}) · ENTERING THE 9-0 WORLD CUP GAUNTLET
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <GauntletRunner
                draftedPlayers={session.draftedPlayers}
                formation={session.formation}
                onResetDraft={handleResetDraft}
              />
            </div>

            <div className="lg:col-span-4">
              <SquadXIView
                draftedPlayers={session.draftedPlayers}
                formation={session.formation}
              />
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </main>
  );
}
