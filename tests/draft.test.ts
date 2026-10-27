import { describe, expect, it } from "vitest";
import { ALL_TOURNAMENT_SQUADS } from "../data/squads";
import { createDraftSession, selectDraftPick, spinDraftWheel } from "../engine/draft";

describe("11-Round Drafting Engine", () => {
  it("initializes a clean 11-round session", () => {
    const session = createDraftSession(ALL_TOURNAMENT_SQUADS);
    expect(session.currentRound).toBe(1);
    expect(session.maxRounds).toBe(11);
    expect(session.draftedPlayers.length).toBe(0);
    expect(session.isComplete).toBe(false);
  });

  it("spins the wheel and populates activeSquad with available picks", () => {
    let session = createDraftSession(ALL_TOURNAMENT_SQUADS);
    session = spinDraftWheel(session);

    expect(session.activeSquad).not.toBeNull();
    expect(session.activeSquad!.roster.length).toBeGreaterThan(0);
  });

  it("locks in pick, advances round, and prevents duplicate athletes across different editions", () => {
    let session = createDraftSession(ALL_TOURNAMENT_SQUADS);
    session = spinDraftWheel(session);

    const pickedPlayer = session.activeSquad!.roster[0];
    session = selectDraftPick(session, pickedPlayer);

    expect(session.currentRound).toBe(2);
    expect(session.draftedPlayers.length).toBe(1);
    expect(session.draftedAthleteIds).toContain(pickedPlayer.athleteId);
    expect(session.activeSquad).toBeNull(); // Cleared until next spin

    // Now verify that if another squad containing this same athlete is spun, the athlete is filtered out
    session = spinDraftWheel(session);
    if (session.activeSquad) {
      const duplicateFound = session.activeSquad.roster.some(
        (p) => p.athleteId === pickedPlayer.athleteId
      );
      expect(duplicateFound).toBe(false);
    }
  });

  it("marks session complete upon reaching 11 picks", () => {
    let session = createDraftSession(ALL_TOURNAMENT_SQUADS);

    // Pick 11 players sequentially
    for (let i = 0; i < 11; i++) {
      session = spinDraftWheel(session);
      const eligible = session.activeSquad!.roster[0];
      session = selectDraftPick(session, eligible);
    }

    expect(session.isComplete).toBe(true);
    expect(session.draftedPlayers.length).toBe(11);
  });

  it("includes diverse tournament squads beyond champions and runners-up", () => {
    // Verifies the database includes semi-finalists and breakout squads
    const squadNames = ALL_TOURNAMENT_SQUADS.map((s) => s.teamName);
    const hasSemiFinalists = squadNames.some((name) =>
      name.toLowerCase().includes("semi-finalist")
    );
    const hasGiantslayersOrBreakout = squadNames.some(
      (name) =>
        name.toLowerCase().includes("giantslayer") ||
        name.toLowerCase().includes("breakout")
    );

    expect(hasSemiFinalists).toBe(true);
    expect(hasGiantslayersOrBreakout).toBe(true);
    expect(ALL_TOURNAMENT_SQUADS.length).toBeGreaterThanOrEqual(14);
  });
});
