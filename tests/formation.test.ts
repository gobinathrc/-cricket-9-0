import { describe, expect, it } from "vitest";
import {
  ALL_PRESET_FORMATIONS,
  DEFAULT_FORMATION,
  calculateAllTacticalCombinations,
  isValidTacticalFormation,
} from "../data/formations";
import { evaluateSquadTactics } from "../engine/simulator";
import { PlayerEditionRecord } from "../types/cricket";

describe("Tactical Formation Combinatorics & Multi-Preset System", () => {
  const dummy = (
    id: string,
    role: "BAT" | "BOWL" | "AR" | "WK",
    bowlingType: "FAST" | "MEDIUM" | "SPIN_OFF" | "SPIN_LEG" | "NONE" = "NONE"
  ): PlayerEditionRecord => ({
    id,
    athleteId: `ath_${id}`,
    name: `Player ${id}`,
    countryCode: "IND",
    editionYear: 2024,
    role,
    battingStyle: "RHB",
    bowlingType,
    ovr: 85,
    subRatings: { batting: 85, bowling: 85, paceOrTurn: 80, clutch: 85 },
    tournamentStats: { runs: 100, ballsFaced: 80, strikeRate: 125, average: 25, wickets: 5, oversBowled: 15, economy: 7.5 },
  });

  it("calculates exact mathematical combinations for 11 players under minimum constraints (min 1 WK, min 1 BAT, min 1 BOWL)", () => {
    const allCombos = calculateAllTacticalCombinations({ minWk: 1, minBat: 1, minBowl: 1, minAr: 0 });
    // Stars and bars: C(11 - 3 + 4 - 1, 4 - 1) = C(11, 3) = 165
    expect(allCombos.length).toBe(165);

    // Each combination must sum to exactly 11 players
    for (const combo of allCombos) {
      expect(combo.wk + combo.bat + combo.ar + combo.bowl).toBe(11);
      expect(combo.wk).toBeGreaterThanOrEqual(1);
      expect(combo.bat).toBeGreaterThanOrEqual(1);
      expect(combo.bowl).toBeGreaterThanOrEqual(1);
      expect(combo.ar).toBeGreaterThanOrEqual(0);
    }
  });

  it("calculates combinations adhering to realistic 20-over T20 cricket rules (AR + BOWL >= 5)", () => {
    const t20Combos = calculateAllTacticalCombinations({
      minWk: 1,
      minBat: 1,
      minBowl: 1,
      minAr: 0,
      minBowlingOptions: 5,
    });
    // With AR + BOWL >= 5, WK + BAT <= 6, sum = 95
    expect(t20Combos.length).toBe(95);
  });

  it("calculates combinations for standard 1 or 2 wicketkeepers with 5 bowling options", () => {
    const realisticCombos = calculateAllTacticalCombinations({
      minWk: 1,
      maxWk: 2,
      minBat: 1,
      minBowl: 1,
      minAr: 0,
      minBowlingOptions: 5,
    });
    // WK=1 (35) + WK=2 (26) = 61 combinations
    expect(realisticCombos.length).toBe(61);
  });

  it("evaluates a squad configured under the user-requested 1-1-4-5 formation (1 WK, 1 BAT, 4 AR, 5 BOWL)", () => {
    const formation1145 = ALL_PRESET_FORMATIONS.find((f) => f.shortCode === "1-1-4-5");
    expect(formation1145).toBeDefined();

    // 1 WK, 1 BAT, 4 AR, 5 BOWL
    const squad1145: PlayerEditionRecord[] = [
      dummy("wk1", "WK"),
      dummy("bat1", "BAT"),
      dummy("ar1", "AR", "FAST"),
      dummy("ar2", "AR", "SPIN_OFF"),
      dummy("ar3", "AR", "MEDIUM"),
      dummy("ar4", "AR", "SPIN_LEG"),
      dummy("bowl1", "BOWL", "FAST"),
      dummy("bowl2", "BOWL", "FAST"),
      dummy("bowl3", "BOWL", "FAST"),
      dummy("bowl4", "BOWL", "SPIN_OFF"),
      dummy("bowl5", "BOWL", "SPIN_LEG"),
    ];

    const evaluation = evaluateSquadTactics(squad1145, formation1145);
    expect(evaluation.wkCount).toBe(1);
    expect(evaluation.batCount).toBe(1);
    expect(evaluation.arCount).toBe(4);
    expect(evaluation.bowlCount).toBe(5);
    expect(evaluation.hasRequiredRoles).toBe(true);
    expect(evaluation.missingRoleDescriptions.length).toBe(0);
  });

  it("flags incomplete quotas when a squad drafted for 1-1-4-5 has too few all-rounders or bowlers", () => {
    const formation1145 = ALL_PRESET_FORMATIONS.find((f) => f.shortCode === "1-1-4-5")!;

    // 1 WK, 4 BAT, 2 AR, 4 BOWL (Valid for standard 1-4-2-4, but invalid for 1-1-4-5)
    const standardSquad: PlayerEditionRecord[] = [
      dummy("wk1", "WK"),
      dummy("bat1", "BAT"),
      dummy("bat2", "BAT"),
      dummy("bat3", "BAT"),
      dummy("bat4", "BAT"),
      dummy("ar1", "AR", "FAST"),
      dummy("ar2", "AR", "SPIN_OFF"),
      dummy("bowl1", "BOWL", "FAST"),
      dummy("bowl2", "BOWL", "FAST"),
      dummy("bowl3", "BOWL", "FAST"),
      dummy("bowl4", "BOWL", "SPIN_LEG"),
    ];

    const evaluation = evaluateSquadTactics(standardSquad, formation1145);
    expect(evaluation.hasRequiredRoles).toBe(false);
    expect(evaluation.missingRoleDescriptions.some((m) => m.includes("All-Rounders"))).toBe(true);
    expect(evaluation.missingRoleDescriptions.some((m) => m.includes("Bowlers"))).toBe(true);
  });

  it("validates formation integrity using isValidTacticalFormation", () => {
    expect(isValidTacticalFormation({ wk: 1, bat: 4, ar: 2, bowl: 4 })).toBe(true);
    expect(isValidTacticalFormation({ wk: 1, bat: 1, ar: 4, bowl: 5 })).toBe(true);
    expect(isValidTacticalFormation({ wk: 0, bat: 5, ar: 2, bowl: 4 })).toBe(false); // No keeper
    expect(isValidTacticalFormation({ wk: 1, bat: 4, ar: 2, bowl: 3 })).toBe(false); // Sum = 10, not 11
    expect(isValidTacticalFormation({ wk: 1, bat: 0, ar: 5, bowl: 5 })).toBe(false); // No batter
    expect(isValidTacticalFormation({ wk: 1, bat: 5, ar: 5, bowl: 0 })).toBe(false); // No bowler
  });
});
