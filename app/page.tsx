"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { DraftWheel } from "../components/DraftWheel";
import { SquadXIView } from "../components/SquadXIView";
import { GauntletRunner } from "../components/GauntletRunner";
import { ALL_TOURNAMENT_SQUADS } from "../data/squads";
import { createDraftSession, selectDraftPick, spinDraftWheel, DraftSessionState } from "../engine/draft";
import { PlayerEditionRecord } from "../types/cricket";
import { Swords, Users } from "lucide-react";

/**
 * Main application page driving the draft session and 72-match simulation cycle.
 */
export default function HomePage() {
  const [session, setSession] = useState<DraftSessionState>(() =>
    createDraftSession(ALL_TOURNAMENT_SQUADS)
  );

  const [activeTab, setActiveTab] = useState<"DRAFT" | "SQUAD">("DRAFT");

  const handleSpin = () => {
    setSession((prev) => spinDraftWheel(prev));
  };

  const handleSelectPick = (player: PlayerEditionRecord) => {
    setSession((prev) => selectDraftPick(prev, player));
  };

  const handleResetDraft = () => {
    setSession(createDraftSession(ALL_TOURNAMENT_SQUADS));
    setActiveTab("DRAFT");
  };

  return (
    <main className="flex-1 flex flex-col items-center max-w-5xl w-full mx-auto px-4 pb-16">
      <Header />

      {/* Main Mode Switcher: Drafting vs 72-0 Simulation Gauntlet */}
      {!session.isComplete ? (
        <div className="w-full flex flex-col items-center gap-6 mt-4">
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
              />
            </div>

            {/* Right 5 Cols: Live XI Formation & Tactics */}
            <div className={`lg:col-span-5 flex flex-col ${activeTab === "SQUAD" ? "block" : "hidden sm:block"}`}>
              <SquadXIView draftedPlayers={session.draftedPlayers} />
            </div>
          </div>
        </div>
      ) : (
        /* Draft Complete -> The 72-0 Gauntlet Runner */
        <div className="w-full flex flex-col items-center gap-8 mt-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider">
            <Swords className="w-4 h-4" />
            STARTING XI LOCKED · ENTERING THE 72-0 GAUNTLET
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <GauntletRunner
                draftedPlayers={session.draftedPlayers}
                onResetDraft={handleResetDraft}
              />
            </div>

            <div className="lg:col-span-4">
              <SquadXIView draftedPlayers={session.draftedPlayers} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
