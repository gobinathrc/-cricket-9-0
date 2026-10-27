import { describe, expect, it } from "vitest";
import {
  isRoleGateClosed,
  getRoleGateQuota,
  STANDARD_ROLE_QUOTAS,
  reorderBattingLineup,
  autoOptimizeBattingLineup,
} from "../engine/lineup";
import { PlayerEditionRecord } from "../types/cricket";

describe("Role Gating & Batting Lineup Position Management", () => {
  const dummy = (
    id: string,
    role: "BAT" | "BOWL" | "AR" | "WK",
    battingOvr: number = 80
  ): PlayerEditionRecord => ({
    id,
    athleteId: `ath_${id}`,
    name: `Player ${id}`,
    countryCode: "IND",
    editionYear: 2024,
    role,
    battingStyle: "RHB",
    bowlingType: role === "BOWL" || role === "AR" ? "FAST" : "NONE",
    ovr: 85,
    subRatings: { batting: battingOvr, bowling: 75, paceOrTurn: 75, clutch: 80 },
    tournamentStats: { runs: 100, ballsFaced: 80, strikeRate: 125, average: 25, wickets: 5, oversBowled: 15, economy: 7.5 },
  });

  describe("Role Gating System", () => {
    it("gates All-Rounders once 2 ARs have been drafted", () => {
      const drafted = [dummy("ar1", "AR"), dummy("ar2", "AR")];

      expect(isRoleGateClosed("AR", drafted)).toBe(true);
      expect(isRoleGateClosed("WK", drafted)).toBe(false);
      expect(isRoleGateClosed("BAT", drafted)).toBe(false);
      expect(isRoleGateClosed("BOWL", drafted)).toBe(false);
    });

    it("gates Wicketkeepers once 1 WK has been drafted", () => {
      const drafted = [dummy("wk1", "WK")];

      expect(isRoleGateClosed("WK", drafted)).toBe(true);
      expect(isRoleGateClosed("BAT", drafted)).toBe(false);
    });

    it("gates Batsmen once 4 BATs have been drafted", () => {
      const drafted = [
        dummy("b1", "BAT"),
        dummy("b2", "BAT"),
        dummy("b3", "BAT"),
        dummy("b4", "BAT"),
      ];

      expect(isRoleGateClosed("BAT", drafted)).toBe(true);
      expect(isRoleGateClosed("BOWL", drafted)).toBe(false);
    });

    it("gates Bowlers once 4 BOWLs have been drafted", () => {
      const drafted = [
        dummy("bw1", "BOWL"),
        dummy("bw2", "BOWL"),
        dummy("bw3", "BOWL"),
        dummy("bw4", "BOWL"),
      ];

      expect(isRoleGateClosed("BOWL", drafted)).toBe(true);
      expect(isRoleGateClosed("AR", drafted)).toBe(false);
    });

    it("returns correct role quota status", () => {
      const drafted = [dummy("ar1", "AR"), dummy("b1", "BAT")];

      const arQuota = getRoleGateQuota("AR", drafted);
      expect(arQuota.current).toBe(1);
      expect(arQuota.max).toBe(2);
      expect(arQuota.isFull).toBe(false);

      const batQuota = getRoleGateQuota("BAT", drafted);
      expect(batQuota.current).toBe(1);
      expect(batQuota.max).toBe(4);
      expect(batQuota.isFull).toBe(false);
    });
  });

  describe("Batting Position Reordering", () => {
    it("moves a player up or down in the batting order", () => {
      const lineup = [
        dummy("p1", "BAT"),
        dummy("p2", "WK"),
        dummy("p3", "BOWL"),
      ];

      // Move player at index 2 (p3) up to index 1
      const reordered = reorderBattingLineup(lineup, 2, 1);
      expect(reordered[0].id).toBe("p1");
      expect(reordered[1].id).toBe("p3");
      expect(reordered[2].id).toBe("p2");
    });

    it("handles boundary conditions gracefully when reordering", () => {
      const lineup = [dummy("p1", "BAT"), dummy("p2", "WK")];

      // Moving index 0 up should be a no-op
      const unchangedTop = reorderBattingLineup(lineup, 0, -1);
      expect(unchangedTop[0].id).toBe("p1");

      // Moving index 1 down should be a no-op
      const unchangedBottom = reorderBattingLineup(lineup, 1, 2);
      expect(unchangedBottom[1].id).toBe("p2");
    });

    it("automatically optimizes batting lineup by role and batting sub-ratings", () => {
      const disordered = [
        dummy("bowl1", "BOWL", 40),
        dummy("wk1", "WK", 88),
        dummy("bat1", "BAT", 95),
        dummy("ar1", "AR", 85),
        dummy("bat2", "BAT", 92),
        dummy("bowl2", "BOWL", 35),
      ];

      const optimized = autoOptimizeBattingLineup(disordered);

      // Top order should be specialist batsmen
      expect(optimized[0].role).toBe("BAT");
      expect(optimized[0].subRatings.batting).toBe(95);
      expect(optimized[1].role).toBe("BAT");
      expect(optimized[1].subRatings.batting).toBe(92);

      // Middle order should be WK / AR
      expect(optimized[2].role).toBe("WK");
      expect(optimized[3].role).toBe("AR");

      // Tail should be Bowlers
      expect(optimized[4].role).toBe("BOWL");
      expect(optimized[5].role).toBe("BOWL");
    });
  });
});
