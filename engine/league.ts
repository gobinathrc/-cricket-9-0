import { DraftedSquad, MatchResult } from "../types/cricket";
import { simulateFixture, OpponentTeamProfile } from "./simulator";
import { logInfo } from "../utils/logger";

/**
 * Tactical profile of a club/franchise competing in the 8-team League Season.
 */
export interface LeagueTeam {
  id: string;
  name: string;
  shortName: string;
  countryCode: string;
  battingOvr: number;
  bowlingOvr: number;
  starPlayer: string;
  isUserTeam?: boolean;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Single fixture between two league teams on a specific matchday.
 */
export interface LeagueFixture {
  id: string;
  matchdayNumber: number;
  homeTeamId: string;
  awayTeamId: string;
}

/**
 * A matchday containing 4 concurrent fixtures across the 8 league teams.
 */
export interface LeagueMatchday {
  matchdayNumber: number;
  fixtures: LeagueFixture[];
}

/**
 * Cumulative record of a team in the League Table (Points Table).
 */
export interface TeamStanding {
  teamId: string;
  teamName: string;
  countryCode: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  runsFor: number;
  oversFor: number;
  runsAgainst: number;
  oversAgainst: number;
  nrr: number;
  rank: number;
  form?: ("W" | "L")[];
}

/**
 * Result of an individual league match.
 */
export interface LeagueMatchScore {
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  winnerId: string;
  homeScore: { runs: number; wickets: number; overs: number };
  awayScore: { runs: number; wickets: number; overs: number };
  marginDescription: string;
  topPerformer: string;
}

/**
 * Complete outcome of simulating an entire matchday (4 matches + updated table).
 */
export interface MatchdayResult {
  matchdayNumber: number;
  fixtureResults: LeagueMatchScore[];
  updatedStandings: TeamStanding[];
  userMatchResult: MatchResult;
}

/**
 * The 8 international league teams competing in the 14-matchday double round-robin season.
 */
export const LEAGUE_TEAMS: LeagueTeam[] = [
  {
    id: "ind",
    name: "India T20",
    shortName: "IND",
    countryCode: "IND",
    battingOvr: 86,
    bowlingOvr: 86,
    starPlayer: "Jasprit Bumrah",
    isUserTeam: true,
    primaryColor: "#0284c7",
    secondaryColor: "#f59e0b",
  },
  {
    id: "aus",
    name: "Australia T20",
    shortName: "AUS",
    countryCode: "AUS",
    battingOvr: 85,
    bowlingOvr: 85,
    starPlayer: "Travis Head",
    primaryColor: "#eab308",
    secondaryColor: "#15803d",
  },
  {
    id: "eng",
    name: "England T20",
    shortName: "ENG",
    countryCode: "ENG",
    battingOvr: 85,
    bowlingOvr: 83,
    starPlayer: "Jos Buttler",
    primaryColor: "#dc2626",
    secondaryColor: "#1d4ed8",
  },
  {
    id: "sa",
    name: "South Africa T20",
    shortName: "SA",
    countryCode: "SA",
    battingOvr: 86,
    bowlingOvr: 85,
    starPlayer: "Heinrich Klaasen",
    primaryColor: "#16a34a",
    secondaryColor: "#eab308",
  },
  {
    id: "pak",
    name: "Pakistan T20",
    shortName: "PAK",
    countryCode: "PAK",
    battingOvr: 81,
    bowlingOvr: 84,
    starPlayer: "Shaheen Afridi",
    primaryColor: "#059669",
    secondaryColor: "#d97706",
  },
  {
    id: "wi",
    name: "West Indies T20",
    shortName: "WI",
    countryCode: "WI",
    battingOvr: 84,
    bowlingOvr: 80,
    starPlayer: "Nicholas Pooran",
    primaryColor: "#991b1b",
    secondaryColor: "#ca8a04",
  },
  {
    id: "nz",
    name: "New Zealand T20",
    shortName: "NZ",
    countryCode: "NZ",
    battingOvr: 82,
    bowlingOvr: 83,
    starPlayer: "Trent Boult",
    primaryColor: "#0f172a",
    secondaryColor: "#38bdf8",
  },
  {
    id: "afg",
    name: "Afghanistan T20",
    shortName: "AFG",
    countryCode: "AFG",
    battingOvr: 78,
    bowlingOvr: 85,
    starPlayer: "Rashid Khan",
    primaryColor: "#2563eb",
    secondaryColor: "#dc2626",
  },
];

/**
 * Generates an authentic double round-robin 14-matchday schedule for 8 teams.
 * Implements the standard circle polygon algorithm to guarantee every team plays
 * all other 7 teams exactly once at home and once away.
 *
 * @param teams - Array of 8 participating teams.
 * @returns 14 matchdays with 4 fixtures each.
 */
export function generateLeagueSchedule(teams: LeagueTeam[]): LeagueMatchday[] {
  const n = teams.length;
  if (n % 2 !== 0) {
    throw new Error("League schedule generation requires an even number of teams");
  }

  const teamIds = teams.map((t) => t.id);
  const totalRounds = (n - 1) * 2; // 7 * 2 = 14
  const halfRounds = n - 1; // 7

  const matchdays: LeagueMatchday[] = [];
  const rotatingTeams = teamIds.slice(1); // 7 teams rotate around index 0

  for (let round = 0; round < halfRounds; round++) {
    const fixtures: LeagueFixture[] = [];

    // Match 1: Fixed team 0 against the rotating team at the current round head
    const team0 = teamIds[0];
    const opponentOf0 = rotatingTeams[round % rotatingTeams.length];
    const isHome0 = round % 2 === 0;

    fixtures.push({
      id: `md_${round + 1}_f1`,
      matchdayNumber: round + 1,
      homeTeamId: isHome0 ? team0 : opponentOf0,
      awayTeamId: isHome0 ? opponentOf0 : team0,
    });

    // Pair remaining 6 rotating teams: 1 with 6, 2 with 5, 3 with 4 (relative to round)
    const count = rotatingTeams.length; // 7
    for (let i = 1; i < (count + 1) / 2; i++) {
      const idxA = (round + i) % count;
      const idxB = (round + count - i) % count;
      const teamA = rotatingTeams[idxA];
      const teamB = rotatingTeams[idxB];
      const homeFlag = (round + i) % 2 === 0;

      fixtures.push({
        id: `md_${round + 1}_f${i + 1}`,
        matchdayNumber: round + 1,
        homeTeamId: homeFlag ? teamA : teamB,
        awayTeamId: homeFlag ? teamB : teamA,
      });
    }

    matchdays.push({
      matchdayNumber: round + 1,
      fixtures,
    });
  }

  // Second half (Rounds 8-14): Mirror matches with inverted home/away advantage
  for (let round = 0; round < halfRounds; round++) {
    const firstLeg = matchdays[round];
    const secondLegFixtures: LeagueFixture[] = firstLeg.fixtures.map((f, fIdx) => ({
      id: `md_${round + 1 + halfRounds}_f${fIdx + 1}`,
      matchdayNumber: round + 1 + halfRounds,
      homeTeamId: f.awayTeamId, // swap home & away
      awayTeamId: f.homeTeamId,
    }));

    matchdays.push({
      matchdayNumber: round + 1 + halfRounds,
      fixtures: secondLegFixtures,
    });
  }

  return matchdays;
}

/**
 * Initializes clean 0-played standings for all league teams.
 *
 * @param teams - Participating teams.
 * @returns Initial standings table.
 */
export function createInitialStandings(teams: LeagueTeam[]): TeamStanding[] {
  return teams.map((t, idx) => ({
    teamId: t.id,
    teamName: t.name,
    countryCode: t.countryCode,
    played: 0,
    won: 0,
    lost: 0,
    points: 0,
    runsFor: 0,
    oversFor: 0,
    runsAgainst: 0,
    oversAgainst: 0,
    nrr: 0.0,
    rank: idx + 1,
    form: [],
  }));
}

/**
 * Calculates Net Run Rate (NRR) according to official ICC and T20 regulations:
 * NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled).
 * Standardizes bowled-out teams to full 20.0 overs to prevent perverse incentives.
 *
 * @param runsFor - Cumulative runs scored by the team.
 * @param oversFor - Cumulative overs faced by the team.
 * @param runsAgainst - Cumulative runs conceded by the team.
 * @param oversAgainst - Cumulative overs bowled by the team.
 * @returns NRR float rounded to 3 decimal places.
 */
export function calculateNRR(
  runsFor: number,
  oversFor: number,
  runsAgainst: number,
  oversAgainst: number
): number {
  if (oversFor <= 0 || oversAgainst <= 0) return 0.0;
  const runRateFor = runsFor / oversFor;
  const runRateAgainst = runsAgainst / oversAgainst;
  return Math.round((runRateFor - runRateAgainst) * 1000) / 1000;
}

/**
 * Sorts league standings strictly by Points (DESC), then NRR (DESC), then Wins (DESC).
 * Assigns sequential ranks 1 to 8.
 *
 * @param standings - Current standings table.
 * @returns Re-ranked standings table.
 */
export function sortStandings(standings: TeamStanding[]): TeamStanding[] {
  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    return b.won - a.won;
  });

  return sorted.map((row, idx) => ({
    ...row,
    rank: idx + 1,
  }));
}

/**
 * Converts a decimal overs representation (e.g. 18.2 overs) to total balls or NRR overs.
 * Note: 18.2 overs means 18 full overs + 2 balls = 18 + 2/6 = 18.333 overs.
 *
 * @param overs - Formatted cricket overs (e.g. 18.4).
 * @param wasBowledOut - If true, official rules count as full 20.0 overs.
 * @returns True mathematical overs for run rate division.
 */
export function normalizeOversForNRR(overs: number, wasBowledOut: boolean): number {
  if (wasBowledOut) return 20.0;
  const completedOvers = Math.floor(overs);
  const balls = Math.round((overs - completedOvers) * 10);
  return completedOvers + balls / 6.0;
}

/**
 * Simulates a realistic T20 match between two computer-controlled AI teams.
 *
 * @param teamA - Home AI team.
 * @param teamB - Away AI team.
 * @param matchdayNumber - Current matchday.
 * @returns Match result with scores, wickets, overs, winner, and margin.
 */
export function simulateAiVsAiMatch(
  teamA: LeagueTeam,
  teamB: LeagueTeam,
  matchdayNumber: number
): {
  teamAScore: { runs: number; wickets: number; overs: number };
  teamBScore: { runs: number; wickets: number; overs: number };
  winnerId: string;
  marginDescription: string;
  topPerformer: string;
} {
  // Coin Toss: 50% Team A bats first
  const teamABatsFirst = Math.random() >= 0.5;

  let teamARuns: number;
  let teamAWickets: number;
  let teamAOvers: number;

  let teamBRuns: number;
  let teamBWickets: number;
  let teamBOvers: number;

  let winnerId: string;
  let margin: string;

  if (teamABatsFirst) {
    // Team A sets target
    const batDelta = teamA.battingOvr - teamB.bowlingOvr;
    const baseRuns = 164 + batDelta * 1.6 + (Math.random() - 0.5) * 26;
    teamARuns = Math.round(Math.max(105, Math.min(235, baseRuns)));
    teamAWickets = Math.round(Math.max(2, Math.min(10, 5.0 - batDelta * 0.1 + (Math.random() - 0.5) * 4)));
    teamAOvers = teamAWickets === 10 ? Math.round((15 + Math.random() * 4) * 10) / 10 : 20.0;

    const target = teamARuns + 1;

    // Team B chases target
    const chaseDelta = teamB.battingOvr - teamA.bowlingOvr;
    const chasePower = chaseDelta * 1.5 - (teamARuns - 160) * 0.4 + (Math.random() - 0.5) * 22;

    if (chasePower > 0) {
      // Team B wins chase
      winnerId = teamB.id;
      teamBWickets = Math.round(Math.max(2, Math.min(9, 4.5 - chaseDelta * 0.1 + (Math.random() - 0.5) * 3)));
      teamBRuns = target + Math.floor(Math.random() * 4);
      const ballsLeft = Math.round(Math.max(1, Math.min(20, chasePower * 0.5 + Math.random() * 6)));
      teamBOvers = Math.round(((120 - ballsLeft) / 6) * 10) / 10;
      margin = `${teamB.shortName} won by ${10 - teamBWickets} wickets`;
    } else {
      // Team A defends target
      winnerId = teamA.id;
      const deficit = Math.round(Math.max(2, Math.min(60, -chasePower + Math.random() * 8)));
      teamBRuns = Math.max(90, teamARuns - deficit);
      teamBWickets = Math.random() > 0.4 ? 10 : Math.round(Math.max(5, Math.min(9, 7.0 - chaseDelta * 0.1)));
      teamBOvers = teamBWickets === 10 ? Math.round((16 + Math.random() * 3.5) * 10) / 10 : 20.0;
      margin = `${teamA.shortName} won by ${teamARuns - teamBRuns} runs`;
    }
  } else {
    // Team B sets target
    const batDelta = teamB.battingOvr - teamA.bowlingOvr;
    const baseRuns = 164 + batDelta * 1.6 + (Math.random() - 0.5) * 26;
    teamBRuns = Math.round(Math.max(105, Math.min(235, baseRuns)));
    teamBWickets = Math.round(Math.max(2, Math.min(10, 5.0 - batDelta * 0.1 + (Math.random() - 0.5) * 4)));
    teamBOvers = teamBWickets === 10 ? Math.round((15 + Math.random() * 4) * 10) / 10 : 20.0;

    const target = teamBRuns + 1;

    // Team A chases target
    const chaseDelta = teamA.battingOvr - teamB.bowlingOvr;
    const chasePower = chaseDelta * 1.5 - (teamBRuns - 160) * 0.4 + (Math.random() - 0.5) * 22;

    if (chasePower > 0) {
      // Team A wins chase
      winnerId = teamA.id;
      teamAWickets = Math.round(Math.max(2, Math.min(9, 4.5 - chaseDelta * 0.1 + (Math.random() - 0.5) * 3)));
      teamARuns = target + Math.floor(Math.random() * 4);
      const ballsLeft = Math.round(Math.max(1, Math.min(20, chasePower * 0.5 + Math.random() * 6)));
      teamAOvers = Math.round(((120 - ballsLeft) / 6) * 10) / 10;
      margin = `${teamA.shortName} won by ${10 - teamAWickets} wickets`;
    } else {
      // Team B defends target
      winnerId = teamB.id;
      const deficit = Math.round(Math.max(2, Math.min(60, -chasePower + Math.random() * 8)));
      teamARuns = Math.max(90, teamBRuns - deficit);
      teamAWickets = Math.random() > 0.4 ? 10 : Math.round(Math.max(5, Math.min(9, 7.0 - chaseDelta * 0.1)));
      teamAOvers = teamAWickets === 10 ? Math.round((16 + Math.random() * 3.5) * 10) / 10 : 20.0;
      margin = `${teamB.shortName} won by ${teamBRuns - teamARuns} runs`;
    }
  }

  // Handle tie via Super Over
  if (teamARuns === teamBRuns) {
    winnerId = Math.random() >= 0.5 ? teamA.id : teamB.id;
    margin = `${winnerId === teamA.id ? teamA.shortName : teamB.shortName} won via Super Over`;
  }

  const topPerformer = winnerId === teamA.id ? teamA.starPlayer : teamB.starPlayer;

  return {
    teamAScore: { runs: teamARuns, wickets: teamAWickets, overs: teamAOvers },
    teamBScore: { runs: teamBRuns, wickets: teamBWickets, overs: teamBOvers },
    winnerId,
    marginDescription: margin,
    topPerformer,
  };
}

/**
 * Appends a match result ("W" or "L") to recent form and retains the last 5 results.
 */
function updateForm(form: ("W" | "L")[] = [], result: "W" | "L"): ("W" | "L")[] {
  const next: ("W" | "L")[] = [...form, result];
  return next.slice(-5);
}

/**
 * Simulates an entire matchday (all 4 matches) simultaneously.
 * The user's fixture is resolved with full player ratings & batting order penalties,
 * while the 3 AI fixtures are resolved in parallel to update all 8 teams' standings.
 *
 * @param matchday - The matchday schedule containing 4 fixtures.
 * @param currentStandings - Current league standings before this matchday.
 * @param userSquad - Evaluated tactical squad for the human user.
 * @param userTeamId - Identifier for user team (default "ind").
 * @returns Complete matchday result with fixture scores and re-ranked table.
 */
export function simulateLeagueMatchday(
  matchday: LeagueMatchday,
  currentStandings: TeamStanding[],
  userSquad: DraftedSquad,
  userTeamId: string = "ind"
): MatchdayResult {
  const standingsMap = new Map<string, TeamStanding>(
    currentStandings.map((s) => [s.teamId, { ...s, form: [...(s.form || [])] }])
  );

  const teamProfilesMap = new Map<string, LeagueTeam>(
    LEAGUE_TEAMS.map((t) => [t.id, t])
  );

  const fixtureResults: LeagueMatchScore[] = [];
  let userMatchResult: MatchResult | null = null;

  for (const fixture of matchday.fixtures) {
    const isUserFixture = fixture.homeTeamId === userTeamId || fixture.awayTeamId === userTeamId;

    if (isUserFixture) {
      const isUserHome = fixture.homeTeamId === userTeamId;
      const opponentId = isUserHome ? fixture.awayTeamId : fixture.homeTeamId;
      const opponentTeam = teamProfilesMap.get(opponentId)!;

      // Adapt to OpponentTeamProfile for simulateFixture
      const oppProfile: OpponentTeamProfile = {
        id: opponentTeam.id,
        stageName: "GROUP STAGE",
        matchNumber: matchday.matchdayNumber,
        name: opponentTeam.name,
        countryCode: opponentTeam.countryCode,
        difficultyTier: opponentTeam.battingOvr >= 93 ? "CHAMPION" : opponentTeam.battingOvr >= 91 ? "ELITE" : "HIGH",
        battingOvr: opponentTeam.battingOvr,
        bowlingOvr: opponentTeam.bowlingOvr,
        starPlayer: opponentTeam.starPlayer,
      };

      const result = simulateFixture(userSquad, oppProfile, matchday.matchdayNumber);
      userMatchResult = result;

      const userWinner = result.userWon ? userTeamId : opponentId;
      const homeScore = isUserHome ? result.userScore : result.opponentScore;
      const awayScore = isUserHome ? result.opponentScore : result.userScore;

      fixtureResults.push({
        fixtureId: fixture.id,
        homeTeamId: fixture.homeTeamId,
        awayTeamId: fixture.awayTeamId,
        winnerId: userWinner,
        homeScore,
        awayScore,
        marginDescription: result.marginDescription,
        topPerformer: result.topPerformer,
      });

      // Update User Standings
      const userStanding = standingsMap.get(userTeamId)!;
      userStanding.played += 1;
      if (result.userWon) {
        userStanding.won += 1;
        userStanding.points += 2;
        userStanding.form = updateForm(userStanding.form, "W");
      } else {
        userStanding.lost += 1;
        userStanding.form = updateForm(userStanding.form, "L");
      }
      userStanding.runsFor += result.userScore.runs;
      userStanding.oversFor += normalizeOversForNRR(result.userScore.overs, result.userScore.wickets === 10);
      userStanding.runsAgainst += result.opponentScore.runs;
      userStanding.oversAgainst += normalizeOversForNRR(result.opponentScore.overs, result.opponentScore.wickets === 10);
      userStanding.nrr = calculateNRR(
        userStanding.runsFor,
        userStanding.oversFor,
        userStanding.runsAgainst,
        userStanding.oversAgainst
      );

      // Update Opponent Standings
      const oppStanding = standingsMap.get(opponentId)!;
      oppStanding.played += 1;
      if (!result.userWon) {
        oppStanding.won += 1;
        oppStanding.points += 2;
        oppStanding.form = updateForm(oppStanding.form, "W");
      } else {
        oppStanding.lost += 1;
        oppStanding.form = updateForm(oppStanding.form, "L");
      }
      oppStanding.runsFor += result.opponentScore.runs;
      oppStanding.oversFor += normalizeOversForNRR(result.opponentScore.overs, result.opponentScore.wickets === 10);
      oppStanding.runsAgainst += result.userScore.runs;
      oppStanding.oversAgainst += normalizeOversForNRR(result.userScore.overs, result.userScore.wickets === 10);
      oppStanding.nrr = calculateNRR(
        oppStanding.runsFor,
        oppStanding.oversFor,
        oppStanding.runsAgainst,
        oppStanding.oversAgainst
      );
    } else {
      // Simulate computer AI fixture
      const homeTeam = teamProfilesMap.get(fixture.homeTeamId)!;
      const awayTeam = teamProfilesMap.get(fixture.awayTeamId)!;
      const aiSim = simulateAiVsAiMatch(homeTeam, awayTeam, matchday.matchdayNumber);

      fixtureResults.push({
        fixtureId: fixture.id,
        homeTeamId: fixture.homeTeamId,
        awayTeamId: fixture.awayTeamId,
        winnerId: aiSim.winnerId,
        homeScore: aiSim.teamAScore,
        awayScore: aiSim.teamBScore,
        marginDescription: aiSim.marginDescription,
        topPerformer: aiSim.topPerformer,
      });

      // Update Home Standing
      const homeStanding = standingsMap.get(fixture.homeTeamId)!;
      homeStanding.played += 1;
      if (aiSim.winnerId === fixture.homeTeamId) {
        homeStanding.won += 1;
        homeStanding.points += 2;
        homeStanding.form = updateForm(homeStanding.form, "W");
      } else {
        homeStanding.lost += 1;
        homeStanding.form = updateForm(homeStanding.form, "L");
      }
      homeStanding.runsFor += aiSim.teamAScore.runs;
      homeStanding.oversFor += normalizeOversForNRR(aiSim.teamAScore.overs, aiSim.teamAScore.wickets === 10);
      homeStanding.runsAgainst += aiSim.teamBScore.runs;
      homeStanding.oversAgainst += normalizeOversForNRR(aiSim.teamBScore.overs, aiSim.teamBScore.wickets === 10);
      homeStanding.nrr = calculateNRR(
        homeStanding.runsFor,
        homeStanding.oversFor,
        homeStanding.runsAgainst,
        homeStanding.oversAgainst
      );

      // Update Away Standing
      const awayStanding = standingsMap.get(fixture.awayTeamId)!;
      awayStanding.played += 1;
      if (aiSim.winnerId === fixture.awayTeamId) {
        awayStanding.won += 1;
        awayStanding.points += 2;
        awayStanding.form = updateForm(awayStanding.form, "W");
      } else {
        awayStanding.lost += 1;
        awayStanding.form = updateForm(awayStanding.form, "L");
      }
      awayStanding.runsFor += aiSim.teamBScore.runs;
      awayStanding.oversFor += normalizeOversForNRR(aiSim.teamBScore.overs, aiSim.teamBScore.wickets === 10);
      awayStanding.runsAgainst += aiSim.teamAScore.runs;
      awayStanding.oversAgainst += normalizeOversForNRR(aiSim.teamAScore.overs, aiSim.teamAScore.wickets === 10);
      awayStanding.nrr = calculateNRR(
        awayStanding.runsFor,
        awayStanding.oversFor,
        awayStanding.runsAgainst,
        awayStanding.oversAgainst
      );
    }
  }

  const updatedList = Array.from(standingsMap.values());
  const sortedStandings = sortStandings(updatedList);

  logInfo("Simulated full league matchday", {
    matchday: matchday.matchdayNumber,
    userWon: userMatchResult?.userWon,
    userRank: sortedStandings.find((s) => s.teamId === userTeamId)?.rank,
  });

  return {
    matchdayNumber: matchday.matchdayNumber,
    fixtureResults,
    updatedStandings: sortedStandings,
    userMatchResult: userMatchResult!,
  };
}

/**
 * Playoff bracket structure for the top 4 teams of the regular season.
 */
export interface PlayoffBracket {
  semiFinal1: { homeTeam: TeamStanding; awayTeam: TeamStanding };
  semiFinal2: { homeTeam: TeamStanding; awayTeam: TeamStanding };
}

/**
 * Generates the playoff fixtures from the final sorted regular season standings.
 * Rank 1 plays Rank 4 in Semi-Final 1; Rank 2 plays Rank 3 in Semi-Final 2.
 *
 * @param sortedStandings - Final regular season standings.
 * @returns Playoff bracket with Semi-Final 1 and Semi-Final 2.
 */
export function generatePlayoffs(sortedStandings: TeamStanding[]): PlayoffBracket {
  if (sortedStandings.length < 4) {
    throw new Error("Playoffs require at least 4 ranked teams");
  }

  return {
    semiFinal1: { homeTeam: sortedStandings[0], awayTeam: sortedStandings[3] },
    semiFinal2: { homeTeam: sortedStandings[1], awayTeam: sortedStandings[2] },
  };
}

