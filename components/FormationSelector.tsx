"use client";

import React, { useState } from "react";
import { ALL_PRESET_FORMATIONS, DEFAULT_FORMATION, isValidTacticalFormation } from "../data/formations";
import { TacticalFormation } from "../types/cricket";
import { Shield, Sparkles, Sliders, ChevronDown, ChevronUp, Check, Info } from "lucide-react";

interface FormationSelectorProps {
  currentFormation: TacticalFormation;
  onSelectFormation: (formation: TacticalFormation) => void;
  draftedCount: number;
}

/**
 * Tactical Formation Selector:
 * Enables players to select between preset cricket formations (e.g. Standard 1-4-2-4,
 * All-Rounder Fortress 1-1-4-5, Strike Force 1-3-2-5) or dial in a custom configuration.
 *
 * @param props - FormationSelectorProps
 */
export const FormationSelector: React.FC<FormationSelectorProps> = ({
  currentFormation,
  onSelectFormation,
  draftedCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showCombinatoricsInfo, setShowCombinatoricsInfo] = useState(false);

  // Custom configuration state
  const [customWk, setCustomWk] = useState(currentFormation.wk);
  const [customBat, setCustomBat] = useState(currentFormation.bat);
  const [customAr, setCustomAr] = useState(currentFormation.ar);
  const [customBowl, setCustomBowl] = useState(currentFormation.bowl);

  const customTotal = customWk + customBat + customAr + customBowl;
  const isCustomValid = isValidTacticalFormation({
    wk: customWk,
    bat: customBat,
    ar: customAr,
    bowl: customBowl,
  });

  const handleApplyCustom = () => {
    if (!isCustomValid) return;
    const customFormation: TacticalFormation = {
      id: `custom_${customWk}_${customBat}_${customAr}_${customBowl}`,
      name: `Custom (${customWk}-${customBat}-${customAr}-${customBowl})`,
      shortCode: `${customWk}-${customBat}-${customAr}-${customBowl}`,
      tagline: "Custom User Strategy",
      description: `${customWk} WK, ${customBat} BAT, ${customAr} AR, ${customBowl} BOWL.`,
      wk: customWk,
      bat: customBat,
      ar: customAr,
      bowl: customBowl,
    };
    onSelectFormation(customFormation);
    setShowCustomModal(false);
  };

  return (
    <div className="w-full bg-slate-900/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col gap-3 shadow-lg">
      {/* Top Banner: Active Formation & Trigger Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                Tactical Formation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-white/10 text-white border border-white/10">
                {currentFormation.shortCode}
              </span>
            </div>
            <span className="text-sm font-semibold text-white">
              {currentFormation.name} · <span className="text-xs text-slate-400 font-normal">{currentFormation.tagline}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowCombinatoricsInfo(!showCombinatoricsInfo)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition"
            title="Combinatorics breakdown"
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Combinations (165)</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 transition"
          >
            <span>{isOpen ? "Close Formations" : "Change Formation"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Combinatorics Deep-Dive Banner */}
      {showCombinatoricsInfo && (
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs font-mono text-sky-200 flex flex-col gap-2">
          <div className="font-bold flex items-center gap-1.5 text-sky-300">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Mathematical Combinations for 11 Players (Min 1 WK, 1 BAT, 1 BOWL):
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            <li>
              <strong className="text-white">165 Total Combinations:</strong> Every possible integer partition of 11 players across $(WK \ge 1, BAT \ge 1, AR \ge 0, BOWL \ge 1)$ calculated via Stars-and-Bars $\binom{11}{3}$.
            </li>
            <li>
              <strong className="text-white">95 T20 Cricket Match Combinations:</strong> Formations with at least 5 bowling options $(AR + BOWL \ge 5)$ to complete the required 20 overs.
            </li>
            <li>
              <strong className="text-white">61 Classic Match Setups:</strong> Real-world tournament teams with 1 or 2 wicketkeepers and 5+ bowling options.
            </li>
          </ul>
        </div>
      )}

      {/* Preset Formation Pills Tray */}
      {isOpen && (
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Select a Preset Formation {draftedCount > 0 && `(Draft in progress: ${draftedCount}/11)`}:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ALL_PRESET_FORMATIONS.map((preset) => {
              const isSelected = currentFormation.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectFormation(preset);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? "bg-amber-400/20 border-amber-400/50 shadow-md shadow-amber-500/10"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      {preset.name}
                      {preset.shortCode === "1-1-4-5" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          USER CHOICE
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-xs font-black text-amber-300">
                      {preset.shortCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {preset.tagline}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 pt-1 border-t border-white/5">
                    <span>WK: {preset.wk}</span>
                    <span>·</span>
                    <span>BAT: {preset.bat}</span>
                    <span>·</span>
                    <span>AR: {preset.ar}</span>
                    <span>·</span>
                    <span>BOWL: {preset.bowl}</span>
                  </div>
                </button>
              );
            })}

            {/* Custom Formation Card */}
            <button
              onClick={() => {
                setShowCustomModal(true);
                setIsOpen(false);
              }}
              className="p-3 rounded-xl border border-dashed border-sky-400/40 bg-sky-500/5 hover:bg-sky-500/10 text-left transition flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-sky-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Custom Combination
                </span>
                <span className="font-mono text-xs font-bold text-sky-400">165 options</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Dial in any custom combination of WK, BAT, AR, and BOWL summing to 11.
              </p>
              <div className="text-[10px] font-mono text-sky-400 pt-1 border-t border-white/5">
                Build your own strategy →
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Custom Formation Modal / Drawer */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  Custom Formation Builder
                </h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select slot quotas for your 11-player Starting XI. Must have at least 1 WK, 1 BAT, and 1 BOWL.
            </p>

            {/* Role Steppers */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              {/* WK Stepper */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-purple-300 font-bold">Wicketkeeper (WK):</span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={customWk <= 1}
                    onClick={() => setCustomWk((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{customWk}</span>
                  <button
                    disabled={customTotal >= 11 && customWk >= 2}
                    onClick={() => setCustomWk((p) => Math.min(3, p + 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BAT Stepper */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-blue-300 font-bold">Batsmen (BAT):</span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={customBat <= 1}
                    onClick={() => setCustomBat((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{customBat}</span>
                  <button
                    disabled={customTotal >= 11}
                    onClick={() => setCustomBat((p) => Math.min(7, p + 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* AR Stepper */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-amber-300 font-bold">All-Rounders (AR):</span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={customAr <= 0}
                    onClick={() => setCustomAr((p) => Math.max(0, p - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{customAr}</span>
                  <button
                    disabled={customTotal >= 11}
                    onClick={() => setCustomAr((p) => Math.min(6, p + 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BOWL Stepper */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-emerald-300 font-bold">Bowlers (BOWL):</span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={customBowl <= 1}
                    onClick={() => setCustomBowl((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{customBowl}</span>
                  <button
                    disabled={customTotal >= 11}
                    onClick={() => setCustomBowl((p) => Math.min(7, p + 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Indicator & Validation Warning */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
              customTotal === 11
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}>
              <span>Total Selected Players:</span>
              <span className="font-bold text-sm">{customTotal}/11</span>
            </div>

            {customTotal !== 11 && (
              <p className="text-[11px] text-red-400 font-mono text-center">
                Squad must total exactly 11 players ({customTotal > 11 ? `Remove ${customTotal - 11}` : `Add ${11 - customTotal}`}).
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                disabled={!isCustomValid}
                onClick={handleApplyCustom}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-slate-950 transition"
              >
                <Check className="w-4 h-4" /> Apply Formation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
