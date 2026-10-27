import { describe, expect, it } from "vitest";
import { POST as handleSessionPost } from "../app/api/draft/session/route";
import { POST as handleSpinPost } from "../app/api/draft/spin/route";
import { POST as handlePickPost } from "../app/api/draft/pick/route";
import { POST as handleSimulatePost } from "../app/api/simulate/route";
import { GET as handleLeaderboardGet, POST as handleLeaderboardPost } from "../app/api/leaderboard/route";
import { NextRequest } from "next/server";
import { ALL_TOURNAMENT_SQUADS } from "../data/squads";

function createMockNextRequest(url: string, body?: unknown, method: string = "POST"): NextRequest {
  const reqInit: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    reqInit.body = JSON.stringify(body);
  }
  return new NextRequest(new URL(url, "http://localhost:3000"), reqInit);
}

describe("Next.js Backend API Route Handlers", () => {
  it("POST /api/draft/session initializes clean draft session", async () => {
    const req = createMockNextRequest("http://localhost:3000/api/draft/session", {});
    const res = await handleSessionPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.currentRound).toBe(1);
    expect(json.data.maxRounds).toBe(11);
    expect(json.data.availableSquadOptions.length).toBeGreaterThan(0);
  });

  it("POST /api/draft/spin returns server-sanitized activeSquad", async () => {
    const req = createMockNextRequest("http://localhost:3000/api/draft/spin", {
      currentRound: 1,
      draftedAthleteIds: ["virat_kohli"],
    });

    const res = await handleSpinPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.activeSquad).toBeDefined();
    // Verify that virat_kohli is filtered out
    const containsKohli = json.data.activeSquad.roster.some(
      (p: any) => p.athleteId === "virat_kohli"
    );
    expect(containsKohli).toBe(false);
  });

  it("POST /api/draft/pick rejects duplicate athlete with 400", async () => {
    const targetSquad = ALL_TOURNAMENT_SQUADS[0];
    const firstPlayer = targetSquad.roster[0];

    const req = createMockNextRequest("http://localhost:3000/api/draft/pick", {
      activeSquadId: targetSquad.id,
      playerId: firstPlayer.id,
      currentRound: 2,
      draftedPlayers: [firstPlayer],
      draftedAthleteIds: [firstPlayer.athleteId], // already drafted
    });

    const res = await handlePickPost(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("already been drafted");
  });

  it("POST /api/draft/pick accepts valid pick and advances round", async () => {
    const targetSquad = ALL_TOURNAMENT_SQUADS[0];
    const firstPlayer = targetSquad.roster[0];

    const req = createMockNextRequest("http://localhost:3000/api/draft/pick", {
      activeSquadId: targetSquad.id,
      playerId: firstPlayer.id,
      currentRound: 1,
      draftedPlayers: [],
      draftedAthleteIds: [],
    });

    const res = await handlePickPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.currentRound).toBe(2);
    expect(json.data.draftedAthleteIds).toContain(firstPlayer.athleteId);
    expect(json.data.draftedPlayers.length).toBe(1);
  });

  it("POST /api/simulate rejects incomplete squad with 422", async () => {
    const req = createMockNextRequest("http://localhost:3000/api/simulate", {
      draftedPlayers: [], // Incomplete squad
      matchIndex: 0,
    });

    const res = await handleSimulatePost(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.success).toBe(false);
    expect(json.error).toContain("exactly 11 players");
  });

  it("POST /api/simulate executes match on server and returns match result", async () => {
    // 11 dummy players meeting strict composition: 1 WK, 4 BAT, 2 AR, 4 BOWL
    const players = Array.from({ length: 11 }).map((_, i) => ({
      id: `p_${i}`,
      athleteId: `ath_${i}`,
      name: `Player ${i}`,
      countryCode: "IND",
      editionYear: 2024,
      role: i === 0 ? "WK" : i < 5 ? "BAT" : i < 7 ? "AR" : "BOWL",
      battingStyle: "RHB",
      bowlingType: i >= 5 ? "FAST" : "NONE",
      ovr: 88,
      subRatings: { batting: 88, bowling: i >= 5 ? 88 : 50, paceOrTurn: 85, clutch: 88 },
      tournamentStats: { runs: 100, ballsFaced: 70, strikeRate: 140, average: 30, wickets: 5, oversBowled: 15, economy: 7.0 },
    }));

    const req = createMockNextRequest("http://localhost:3000/api/simulate", {
      draftedPlayers: players,
      matchIndex: 0, // Match 1 vs Ireland
    });

    const res = await handleSimulatePost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.result.matchNumber).toBe(1);
    expect(typeof json.data.result.userWon).toBe("boolean");
    expect(json.data.stageName).toBe("GROUP STAGE");
  });

  it("POST /api/simulate validates squad against custom 1-1-4-5 formation", async () => {
    // 1 WK, 1 BAT, 4 AR, 5 BOWL
    const squad1145 = Array.from({ length: 11 }).map((_, i) => ({
      id: `p_${i}`,
      athleteId: `ath_${i}`,
      name: `Player ${i}`,
      countryCode: "IND",
      editionYear: 2024,
      role: i === 0 ? "WK" : i === 1 ? "BAT" : i < 6 ? "AR" : "BOWL",
      battingStyle: "RHB",
      bowlingType: i >= 2 ? "FAST" : "NONE",
      ovr: 88,
      subRatings: { batting: 88, bowling: i >= 2 ? 88 : 50, paceOrTurn: 85, clutch: 88 },
      tournamentStats: { runs: 100, ballsFaced: 70, strikeRate: 140, average: 30, wickets: 5, oversBowled: 15, economy: 7.0 },
    }));

    const req = createMockNextRequest("http://localhost:3000/api/simulate", {
      draftedPlayers: squad1145,
      matchIndex: 0,
      formation: {
        id: "custom_1145",
        name: "All-Rounder Fortress",
        shortCode: "1-1-4-5",
        tagline: "Test formation",
        description: "Test",
        wk: 1,
        bat: 1,
        ar: 4,
        bowl: 5,
      },
    });

    const res = await handleSimulatePost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.result.userWon !== undefined).toBe(true);
  });

  it("GET /api/leaderboard returns hall of fame records", async () => {
    const res = await handleLeaderboardGet();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("POST /api/leaderboard records completed run", async () => {
    const req = createMockNextRequest("http://localhost:3000/api/leaderboard", {
      userName: "InvincibleSkipper",
      streak: 9,
      isChampion: true,
      teamAverageOvr: 94,
      finalStage: "THE FINAL",
      summary: "Undefeated champion run",
    });

    const res = await handleLeaderboardPost(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.userName).toBe("InvincibleSkipper");
    expect(json.data.streak).toBe(9);
  });
});
