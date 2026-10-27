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
    expect(evaluation.missingRoleDescriptions).toContain("Need at least 4 Bowlers (Current: 0/4)");
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

  it("contains an intensified, high-difficulty 9-match World Cup gauntlet", () => {
    expect(WORLD_CUP_SCHEDULE.length).toBe(9);
    // Knockout opponents must test championship mettle
    const finalMatch = WORLD_CUP_SCHEDULE[8]; // The Final
    const semiFinalMatch = WORLD_CUP_SCHEDULE[7]; // Semi-Final
    const super8Matches = WORLD_CUP_SCHEDULE.slice(4, 7);

    expect(finalMatch.battingOvr).toBeGreaterThanOrEqual(93);
    expect(finalMatch.bowlingOvr).toBeGreaterThanOrEqual(93);
    expect(semiFinalMatch.battingOvr).toBeGreaterThanOrEqual(92);
    expect(semiFinalMatch.bowlingOvr).toBeGreaterThanOrEqual(90);

    // Super 8 opponents must all possess high/elite bowling ratings
    super8Matches.forEach((match) => {
      expect(match.bowlingOvr).toBeGreaterThanOrEqual(88);
    });
  });

  it("calculates batting index dynamically based on lineup order and penalizes bowlers opening", () => {
    // Correctly ordered squad: Batters #1-#4, Keepers/AR #5-#7, Bowlers #8-#11
    const optimalLineup = [...validTacticalSquad];
    const optimalEvaluation = evaluateSquadTactics(optimalLineup);

    // Inverted/upside-down squad: Bowlers #1-#4, Batters #8-#11 (matching user bug report)
    const upsideDownLineup = [
      validTacticalSquad[7], // Bowler at #1 (batting 55)
      validTacticalSquad[8], // Bowler at #2 (batting 55)
      validTacticalSquad[9], // Bowler at #3 (batting 55)
      validTacticalSquad[10], // Bowler at #4 (batting 55)
      validTacticalSquad[5], // AR at #5
      validTacticalSquad[6], // AR at #6
      validTacticalSquad[0], // WK at #7
      validTacticalSquad[1], // BAT at #8 (batting 92 stranded)
      validTacticalSquad[2], // BAT at #9 (batting 88 stranded)
      validTacticalSquad[3], // BAT at #10 (batting 86 stranded)
      validTacticalSquad[4], // BAT at #11 (batting 84 stranded)
    ];
    const upsideDownEvaluation = evaluateSquadTactics(upsideDownLineup);

    // The upside-down squad must have a drastically lower teamBattingOvr than optimal
    expect(upsideDownEvaluation.teamBattingOvr).toBeLessThan(optimalEvaluation.teamBattingOvr - 15);

    // Against an elite opponent (e.g. Australia in Match 7), upside-down squad should lose consistently
    const eliteOpponent = WORLD_CUP_SCHEDULE[6]; // Australia (Bat: 89, Bowl: 89)
    let upsideDownLosses = 0;
    for (let sim = 0; sim < 20; sim++) {
      const match = simulateFixture(upsideDownEvaluation, eliteOpponent, 7);
      if (!match.userWon) upsideDownLosses++;
    }

    // Must lose at least 15 out of 20 matches (>= 75% loss rate for upside-down squad)
    expect(upsideDownLosses).toBeGreaterThanOrEqual(15);
  });
});
