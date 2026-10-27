import { describe, expect, it } from "vitest";
import { evaluateSquadTactics, WORLD_CUP_SCHEDULE, simulateFixture } from "../engine/simulator";
import { PlayerEditionRecord } from "../types/cricket";

describe("T20 Match Simulator Engine (9-0 Championship Path)", () => {
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

  const balancedSquadPlayers: PlayerEditionRecord[] = [
    dummyPlayer("p1", "ath1", "WK", "NONE", 90),
    dummyPlayer("p2", "ath2", "BAT", "NONE", 92),
    dummyPlayer("p3", "ath3", "BAT", "NONE", 88),
    dummyPlayer("p4", "ath4", "BAT", "NONE", 86),
    dummyPlayer("p5", "ath5", "AR", "FAST", 92),
    dummyPlayer("p6", "ath6", "AR", "SPIN_OFF", 89),
    dummyPlayer("p7", "ath7", "BAT", "NONE", 84),
    dummyPlayer("p8", "ath8", "BOWL", "FAST", 94),
    dummyPlayer("p9", "ath9", "BOWL", "FAST", 91),
    dummyPlayer("p10", "ath10", "BOWL", "SPIN_LEG", 93),
    dummyPlayer("p11", "ath11", "BOWL", "FAST", 89),
  ];

  it("evaluates a properly balanced squad with wicketkeeper and pace/spin variety", () => {
    const evaluation = evaluateSquadTactics(balancedSquadPlayers);
    expect(evaluation.hasWicketKeeper).toBe(true);
    expect(evaluation.bowlerCount).toBeGreaterThanOrEqual(5);
    expect(evaluation.spinnerCount).toBeGreaterThanOrEqual(1);
    expect(evaluation.pacerCount).toBeGreaterThanOrEqual(2);
    expect(evaluation.isBalancedAttack).toBe(true);
  });

  it("identifies missing wicketkeeper and bowler deficit penalties", () => {
    const allBatters = Array.from({ length: 11 }).map((_, i) =>
      dummyPlayer(`bat_${i}`, `ath_bat_${i}`, "BAT", "NONE", 85)
    );

    const evaluation = evaluateSquadTactics(allBatters);
    expect(evaluation.hasWicketKeeper).toBe(false);
    expect(evaluation.bowlerCount).toBe(0);
    expect(evaluation.isBalancedAttack).toBe(false);
  });

  it("simulates a fixture and produces realistic scores and valid win/loss state", () => {
    const squad = evaluateSquadTactics(balancedSquadPlayers);
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
