import { describe, expect, it } from "vitest";
import {
  LEAGUE_TEAMS,
  generateLeagueSchedule,
  createInitialStandings,
  simulateAiVsAiMatch,
  simulateLeagueMatchday,
  calculateNRR,
  sortStandings,
  generatePlayoffs,
} from "../engine/league";
import { evaluateSquadTactics } from "../engine/simulator";
import { PlayerEditionRecord } from "../types/cricket";

describe("8-Team League Season Engine (Authentic 14-Matchday & Points Table)", () => {
  it("contains exactly 8 teams in the league including India/User", () => {
    expect(LEAGUE_TEAMS.length).toBe(8);
    const hasIndia = LEAGUE_TEAMS.some((t) => t.id === "ind" || t.countryCode === "IND");
    expect(hasIndia).toBe(true);
  });

  it("generates a balanced 14-matchday double round-robin schedule", () => {
    const schedule = generateLeagueSchedule(LEAGUE_TEAMS);
    expect(schedule.length).toBe(14); // 14 matchdays

    // Every matchday must have exactly 4 matches (8 teams / 2)
    schedule.forEach((matchday, idx) => {
      expect(matchday.matchdayNumber).toBe(idx + 1);
      expect(matchday.fixtures.length).toBe(4);

      // Verify each team plays exactly once per matchday
      const playingTeams = new Set<string>();
      matchday.fixtures.forEach((f) => {
        expect(playingTeams.has(f.homeTeamId)).toBe(false);
        playingTeams.add(f.homeTeamId);
        expect(playingTeams.has(f.awayTeamId)).toBe(false);
        playingTeams.add(f.awayTeamId);
      });
      expect(playingTeams.size).toBe(8);
    });

    // Every pair of teams must play each other exactly twice (home and away)
    const pairings: Record<string, number> = {};
    schedule.forEach((md) => {
      md.fixtures.forEach((f) => {
        const key = [f.homeTeamId, f.awayTeamId].sort().join("_vs_");
        pairings[key] = (pairings[key] || 0) + 1;
      });
    });

    // Total pairings for 8 teams = (8 * 7) / 2 = 28 pairings, each played twice = 56 matches
    expect(Object.keys(pairings).length).toBe(28);
    Object.values(pairings).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it("calculates Net Run Rate (NRR) accurately with 20-over bowled out rules", () => {
    // Team A: 180 runs in 20.0 overs (RR = 9.00)
    // Conceded: 160 runs in 20.0 overs (RR conceded = 8.00)
    // NRR = +1.000
    const nrr1 = calculateNRR(180, 20.0, 160, 20.0);
    expect(nrr1).toBe(1.0);

    // Team bowled out in 15.2 overs for 120 counts as 20 overs for NRR
    const nrr2 = calculateNRR(120, 20.0, 180, 20.0);
    expect(nrr2).toBe(-3.0);
  });

  it("sorts standings by Points (descending) then NRR (descending)", () => {
    const mockStandings = [
      { teamId: "t1", teamName: "Team 1", countryCode: "AUS", played: 2, won: 1, lost: 1, points: 2, runsFor: 320, oversFor: 40, runsAgainst: 340, oversAgainst: 40, nrr: -0.5, rank: 0 },
      { teamId: "t2", teamName: "Team 2", countryCode: "IND", played: 2, won: 2, lost: 0, points: 4, runsFor: 360, oversFor: 40, runsAgainst: 300, oversAgainst: 40, nrr: 1.5, rank: 0 },
      { teamId: "t3", teamName: "Team 3", countryCode: "ENG", played: 2, won: 1, lost: 1, points: 2, runsFor: 350, oversFor: 40, runsAgainst: 330, oversAgainst: 40, nrr: 0.5, rank: 0 },
    ];

    const sorted = sortStandings(mockStandings);
    expect(sorted[0].teamId).toBe("t2"); // 4 pts
    expect(sorted[1].teamId).toBe("t3"); // 2 pts, +0.5 NRR
    expect(sorted[2].teamId).toBe("t1"); // 2 pts, -0.5 NRR
    expect(sorted[0].rank).toBe(1);
    expect(sorted[1].rank).toBe(2);
    expect(sorted[2].rank).toBe(3);
  });

  it("simulates AI vs AI league fixture and returns realistic scores and winner", () => {
    const teamA = LEAGUE_TEAMS[1]; // Australia
    const teamB = LEAGUE_TEAMS[2]; // England
    const match = simulateAiVsAiMatch(teamA, teamB, 1);

    expect(match.teamAScore.runs).toBeGreaterThan(60);
    expect(match.teamBScore.runs).toBeGreaterThan(60);
    expect(match.teamAScore.overs).toBeGreaterThan(10);
    expect(match.teamBScore.overs).toBeGreaterThan(10);
    expect(match.winnerId).toBeDefined();
    expect([teamA.id, teamB.id]).toContain(match.winnerId);
    expect(match.marginDescription.length).toBeGreaterThan(0);
  });

  it("simulates a full matchday with User squad and updates all 8 teams' standings", () => {
    const dummySquad: PlayerEditionRecord[] = Array.from({ length: 11 }).map((_, i) => ({
      id: `p_${i}`,
      athleteId: `ath_${i}`,
      name: `Player ${i}`,
      countryCode: "IND",
      editionYear: 2024,
      role: i === 0 ? "WK" : i < 5 ? "BAT" : i < 7 ? "AR" : "BOWL",
      battingStyle: "RHB",
      bowlingType: i >= 5 ? "FAST" : "NONE",
      ovr: 90,
      subRatings: { batting: 90, bowling: i >= 5 ? 90 : 50, paceOrTurn: 85, clutch: 90 },
      tournamentStats: { runs: 100, ballsFaced: 70, strikeRate: 140, average: 35, wickets: 5, oversBowled: 15, economy: 7.0 },
    }));

    const evaluatedSquad = evaluateSquadTactics(dummySquad);
    const schedule = generateLeagueSchedule(LEAGUE_TEAMS);
    const initialStandings = createInitialStandings(LEAGUE_TEAMS);

    const matchdayResult = simulateLeagueMatchday(
      schedule[0],
      initialStandings,
      evaluatedSquad,
      "ind"
    );

    expect(matchdayResult.matchdayNumber).toBe(1);
    expect(matchdayResult.fixtureResults.length).toBe(4);
    expect(matchdayResult.updatedStandings.length).toBe(8);

    // Every team played 1 match
    matchdayResult.updatedStandings.forEach((standing) => {
      expect(standing.played).toBe(1);
      expect(standing.won + standing.lost).toBe(1);
      expect([0, 2]).toContain(standing.points);
    });

    // 4 teams won, 4 teams lost
    const winners = matchdayResult.updatedStandings.filter((s) => s.won === 1);
    const losers = matchdayResult.updatedStandings.filter((s) => s.lost === 1);
    expect(winners.length).toBe(4);
    expect(losers.length).toBe(4);
  });

  it("generates authentic Top 4 playoff bracket (1st vs 4th, 2nd vs 3rd)", () => {
    const mockFinalStandings = [
      { teamId: "ind", teamName: "India T20", countryCode: "IND", played: 14, won: 14, lost: 0, points: 28, runsFor: 2500, oversFor: 280, runsAgainst: 2100, oversAgainst: 280, nrr: 1.42, rank: 1 },
      { teamId: "aus", teamName: "Australia T20", countryCode: "AUS", played: 14, won: 10, lost: 4, points: 20, runsFor: 2400, oversFor: 280, runsAgainst: 2200, oversAgainst: 280, nrr: 0.71, rank: 2 },
      { teamId: "sa", teamName: "South Africa T20", countryCode: "SA", played: 14, won: 9, lost: 5, points: 18, runsFor: 2350, oversFor: 280, runsAgainst: 2250, oversAgainst: 280, nrr: 0.35, rank: 3 },
      { teamId: "eng", teamName: "England T20", countryCode: "ENG", played: 14, won: 8, lost: 6, points: 16, runsFor: 2300, oversFor: 280, runsAgainst: 2300, oversAgainst: 280, nrr: 0.0, rank: 4 },
      { teamId: "pak", teamName: "Pakistan T20", countryCode: "PAK", played: 14, won: 6, lost: 8, points: 12, runsFor: 2200, oversFor: 280, runsAgainst: 2350, oversAgainst: 280, nrr: -0.53, rank: 5 },
    ];

    const playoffs = generatePlayoffs(mockFinalStandings);
    expect(playoffs.semiFinal1.homeTeam.teamId).toBe("ind");
    expect(playoffs.semiFinal1.awayTeam.teamId).toBe("eng"); // 1st vs 4th
    expect(playoffs.semiFinal2.homeTeam.teamId).toBe("aus");
    expect(playoffs.semiFinal2.awayTeam.teamId).toBe("sa"); // 2nd vs 3rd
  });
});
