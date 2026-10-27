import { describe, expect, it } from "vitest";
import { evaluateSquadTactics, WORLD_CUP_SCHEDULE, simulateFixture } from "../engine/simulator";
import { PlayerEditionRecord } from "../types/cricket";

describe("T20 Match Simulator Engine (9-0 Championship Path & Strict Quotas)", () => {
  const dummyPlayer = (
    id: string,
    athleteId: string,
    role: "BAT" | "BOWL" | "AR" | "WK",
    bowlingType: "FAST" | "MEDIUM" | "SPIN_OFF" | "SPIN_LEG" | "NONE",
    ovr: number
  ): PlayerEditionRecord => ({
    id,
    athleteId,
    name: `Player ${id}`,
    countryCode: "IND",
    editionYear: 2024,
    role,
    battingStyle: "RHB",
    bowlingType,
    ovr,
    subRatings: {
      batting: role === "BAT" || role === "WK" ? ovr : 55,
      bowling: role === "BOWL" || role === "AR" ? ovr : 50,
      paceOrTurn: bowlingType !== "NONE" ? ovr : 50,
      clutch: ovr,
    },
    tournamentStats: { runs: 100, ballsFaced: 80, strikeRate: 125, average: 25, wickets: 5, oversBowled: 15, economy: 7.5 },
  });

  // Valid 11-player squad meeting the minimum quotas: 1 WK, 4 BAT, 2 AR, 3 BOWL, + 1 FLEX (extra bowler)
  const validTacticalSquad: PlayerEditionRecord[] = [
    dummyPlayer("p1", "ath1", "WK", "NONE", 90),     // 1 WK
    dummyPlayer("p2", "ath2", "BAT", "NONE", 92),    // 1 BAT
    dummyPlayer("p3", "ath3", "BAT", "NONE", 88),    // 2 BAT
    dummyPlayer("p4", "ath4", "BAT", "NONE", 86),    // 3 BAT
    dummyPlayer("p5", "ath5", "BAT", "NONE", 84),    // 4 BAT (Meets 4 BAT minimum)
    dummyPlayer("p6", "ath6", "AR", "FAST", 92),     // 1 AR
    dummyPlayer("p7", "ath7", "AR", "SPIN_OFF", 89), // 2 AR (Meets 2 AR minimum)
    dummyPlayer("p8", "ath8", "BOWL", "FAST", 94),   // 1 BOWL
    dummyPlayer("p9", "ath9", "BOWL", "FAST", 91),   // 2 BOWL
    dummyPlayer("p10", "ath10", "BOWL", "SPIN_LEG", 93), // 3 BOWL (Meets 3 BOWL minimum)
    dummyPlayer("p11", "ath11", "BOWL", "FAST", 89), // 4 BOWL (Flex slot)
  ];

  it("evaluates a properly balanced squad with strict role quotas", () => {
    const evaluation = evaluateSquadTactics(validTacticalSquad);
    expect(evaluation.wkCount).toBe(1);
    expect(evaluation.batCount).toBe(4);
    expect(evaluation.arCount).toBe(2);
    expect(evaluation.bowlCount).toBe(4);
    expect(evaluation.hasRequiredRoles).toBe(true);
    expect(evaluation.missingRoleDescriptions.length).toBe(0);
    expect(evaluation.isBalancedAttack).toBe(true);
  });

  it("identifies missing role quotas when composition fails the minimum constraints", () => {
    // 11 pure batters: missing WK, AR, and BOWL
    const allBatters = Array.from({ length: 11 }).map((_, i) =>
      dummyPlayer(`bat_${i}`, `ath_bat_${i}`, "BAT", "NONE", 85)
    );

    const evaluation = evaluateSquadTactics(allBatters);
    expect(evaluation.wkCount).toBe(0);
    expect(evaluation.batCount).toBe(11);
    expect(evaluation.arCount).toBe(0);
    expect(evaluation.bowlCount).toBe(0);
    expect(evaluation.hasRequiredRoles).toBe(false);
    expect(evaluation.missingRoleDescriptions).toContain("Need at least 1 Wicketkeeper (WK)");
    expect(evaluation.missingRoleDescriptions).toContain("Need at least 2 All-Rounders (Current: 0/2)");
    expect(evaluation.missingRoleDescriptions).toContain("Need at least 3 Bowlers (Current: 0/3)");
  });

  it("simulates a fixture and produces realistic scores and valid win/loss state", () => {
    const squad = evaluateSquadTactics(validTacticalSquad);
    const opponent = WORLD_CUP_SCHEDULE[0]; // Ireland

    const result = simulateFixture(squad, opponent, 1);
    expect(result.matchNumber).toBe(1);
    expect(result.userScore.runs).toBeGreaterThanOrEqual(100);
    expect(result.userScore.runs).toBeLessThanOrEqual(250);
    expect(result.opponentScore.runs).toBeGreaterThanOrEqual(95);
    expect(result.opponentScore.runs).toBeLessThanOrEqual(250);
    expect(typeof result.userWon).toBe("boolean");
    expect(result.marginDescription.length).toBeGreaterThan(0);
  });

  it("contains exactly 9 fixtures structured through Group, Super 8, Semi-Final, and The Final", () => {
    expect(WORLD_CUP_SCHEDULE.length).toBe(9);
    expect(WORLD_CUP_SCHEDULE[0].stageName).toBe("GROUP STAGE");
    expect(WORLD_CUP_SCHEDULE[3].stageName).toBe("GROUP STAGE");
    expect(WORLD_CUP_SCHEDULE[4].stageName).toBe("SUPER 8");
    expect(WORLD_CUP_SCHEDULE[6].stageName).toBe("SUPER 8");
    expect(WORLD_CUP_SCHEDULE[7].stageName).toBe("SEMI-FINAL");
    expect(WORLD_CUP_SCHEDULE[8].stageName).toBe("THE FINAL");
    expect(WORLD_CUP_SCHEDULE[8].difficultyTier).toBe("CHAMPION");
  });
});
