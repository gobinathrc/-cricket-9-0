import { DraftedSquad, MatchResult, PlayerEditionRecord } from "../types/cricket";
import { logInfo, logWarn } from "../utils/logger";

/**
 * Tactical metrics and ratings representing an opponent in the 72-match gauntlet.
 */
export interface OpponentTeamProfile {
  id: string;
  name: string;
  countryCode: string;
  difficultyTier: "NORMAL" | "HIGH" | "ELITE" | "CHAMPION";
  battingOvr: number;
  bowlingOvr: number;
  starPlayer: string;
}

/**
 * Standard roster of 72 fixtures simulating a full international circuit.
 */
export const GAUNTLET_SCHEDULE: OpponentTeamProfile[] = [
  // Stage 1: Group Fixtures (Matches 1-12)
  { id: "opp_1", name: "Netherlands T20", countryCode: "NED", difficultyTier: "NORMAL", battingOvr: 76, bowlingOvr: 75, starPlayer: "B. de Leede" },
  { id: "opp_2", name: "Ireland T20", countryCode: "IRE", difficultyTier: "NORMAL", battingOvr: 78, bowlingOvr: 77, starPlayer: "P. Stirling" },
  { id: "opp_3", name: "Zimbabwe T20", countryCode: "ZIM", difficultyTier: "NORMAL", battingOvr: 77, bowlingOvr: 78, starPlayer: "S. Raza" },
  { id: "opp_4", name: "USA T20", countryCode: "USA", difficultyTier: "NORMAL", battingOvr: 76, bowlingOvr: 76, starPlayer: "A. Jones" },
  { id: "opp_5", name: "Bangladesh T20", countryCode: "BAN", difficultyTier: "NORMAL", battingOvr: 80, bowlingOvr: 81, starPlayer: "Shakib Al Hasan" },
  { id: "opp_6", name: "Sri Lanka T20", countryCode: "SL", difficultyTier: "HIGH", battingOvr: 82, bowlingOvr: 83, starPlayer: "W. Hasaranga" },
  { id: "opp_7", name: "Afghanistan T20", countryCode: "AFG", difficultyTier: "HIGH", battingOvr: 81, bowlingOvr: 86, starPlayer: "Rashid Khan" },
  { id: "opp_8", name: "West Indies T20", countryCode: "WI", difficultyTier: "HIGH", battingOvr: 85, bowlingOvr: 82, starPlayer: "N. Pooran" },
  { id: "opp_9", name: "New Zealand T20", countryCode: "NZ", difficultyTier: "HIGH", battingOvr: 84, bowlingOvr: 85, starPlayer: "T. Boult" },
  { id: "opp_10", name: "Pakistan T20", countryCode: "PAK", difficultyTier: "HIGH", battingOvr: 83, bowlingOvr: 87, starPlayer: "Shaheen Afridi" },
  { id: "opp_11", name: "South Africa T20", countryCode: "SA", difficultyTier: "HIGH", battingOvr: 86, bowlingOvr: 86, starPlayer: "H. Klaasen" },
  { id: "opp_12", name: "England T20", countryCode: "ENG", difficultyTier: "ELITE", battingOvr: 88, bowlingOvr: 86, starPlayer: "J. Buttler" },

  // Stage 2: Super 8 & Mid-Gauntlet (Matches 13-36)
  { id: "opp_13", name: "Australia T20", countryCode: "AUS", difficultyTier: "ELITE", battingOvr: 88, bowlingOvr: 88, starPlayer: "M. Starc" },
  { id: "opp_14", name: "India T20", countryCode: "IND", difficultyTier: "ELITE", battingOvr: 90, bowlingOvr: 90, starPlayer: "J. Bumrah" },
  { id: "opp_15", name: "Pakistan 2009 Era", countryCode: "PAK", difficultyTier: "HIGH", battingOvr: 84, bowlingOvr: 88, starPlayer: "Umar Gul" },
  { id: "opp_16", name: "Sri Lanka 2014 Era", countryCode: "SL", difficultyTier: "HIGH", battingOvr: 85, bowlingOvr: 89, starPlayer: "L. Malinga" },
  { id: "opp_17", name: "West Indies 2012 Era", countryCode: "WI", difficultyTier: "ELITE", battingOvr: 89, bowlingOvr: 85, starPlayer: "C. Gayle" },
  { id: "opp_18", name: "England 2010 Era", countryCode: "ENG", difficultyTier: "HIGH", battingOvr: 85, bowlingOvr: 85, starPlayer: "K. Pietersen" },
  { id: "opp_19", name: "Australia 2021 Era", countryCode: "AUS", difficultyTier: "ELITE", battingOvr: 88, bowlingOvr: 88, starPlayer: "D. Warner" },
  { id: "opp_20", name: "India 2007 Era", countryCode: "IND", difficultyTier: "ELITE", battingOvr: 88, bowlingOvr: 86, starPlayer: "Yuvraj Singh" },
  { id: "opp_21", name: "South Africa 2024 Era", countryCode: "SA", difficultyTier: "ELITE", battingOvr: 87, bowlingOvr: 88, starPlayer: "A. Nortje" },
  { id: "opp_22", name: "New Zealand 2021 Era", countryCode: "NZ", difficultyTier: "HIGH", battingOvr: 85, bowlingOvr: 86, starPlayer: "K. Williamson" },
  { id: "opp_23", name: "West Indies 2016 Era", countryCode: "WI", difficultyTier: "ELITE", battingOvr: 90, bowlingOvr: 84, starPlayer: "A. Russell" },
  { id: "opp_24", name: "England 2022 Era", countryCode: "ENG", difficultyTier: "ELITE", battingOvr: 89, bowlingOvr: 88, starPlayer: "S. Curran" },

  // Stage 3: High Difficulty Circuit (Matches 25-48)
  ...Array.from({ length: 24 }).map((_, i) => {
    const pool = ["AUS", "IND", "ENG", "SA", "PAK", "WI"];
    const country = pool[i % pool.length];
    return {
      id: `opp_${25 + i}`,
      name: `${country} Tour XI #${(i % 4) + 1}`,
      countryCode: country,
      difficultyTier: "ELITE" as const,
      battingOvr: 87 + (i % 3),
      bowlingOvr: 87 + ((i + 1) % 3),
      starPlayer: "International Star",
    };
  }),

  // Stage 4: Championship Gauntlet (Matches 49-71)
  ...Array.from({ length: 23 }).map((_, i) => {
    const pool = ["Australia Masters", "India Legends", "England Invincibles", "West Indies Powerhouse", "Pakistan Strike"];
    const name = pool[i % pool.length];
    return {
      id: `opp_${49 + i}`,
      name: `${name} (Match ${49 + i})`,
      countryCode: "ICC",
      difficultyTier: "CHAMPION" as const,
      battingOvr: 90 + Math.floor(i / 8),
      bowlingOvr: 90 + Math.floor(i / 8),
      starPlayer: "Tournament MVP",
    };
  }),

  // Match 72: The Ultimate Boss Fixture
  {
    id: "opp_72",
    name: "All-Time T20 World XI (The 72-0 Boss)",
    countryCode: "ALL",
    difficultyTier: "CHAMPION",
    battingOvr: 95,
    bowlingOvr: 95,
    starPlayer: "All-Time Legends",
  },
];

/**
 * Inspects a drafted 11-player squad to evaluate tactical viability and composition balance.
 *
 * @param players - Array of 11 drafted player records.
 * @returns Evaluated DraftedSquad entity.
 */
export function evaluateSquadTactics(players: PlayerEditionRecord[]): DraftedSquad {
  const hasWicketKeeper = players.some((p) => p.role === "WK");

  const eligibleBowlers = players.filter((p) => p.role === "BOWL" || p.role === "AR");
  const bowlerCount = eligibleBowlers.length;

  const spinnerCount = eligibleBowlers.filter(
    (p) => p.bowlingType === "SPIN_OFF" || p.bowlingType === "SPIN_LEG"
  ).length;

  const pacerCount = eligibleBowlers.filter(
    (p) => p.bowlingType === "FAST" || p.bowlingType === "MEDIUM"
  ).length;

  // Balanced attack handles all match scenarios
  const isBalancedAttack = spinnerCount >= 1 && pacerCount >= 2;

  // Top 7 batting aggregate
  const topBatters = [...players].sort((a, b) => b.subRatings.batting - a.subRatings.batting).slice(0, 7);
  const teamBattingOvr = Math.round(
    topBatters.reduce((acc, curr) => acc + curr.subRatings.batting, 0) / Math.max(1, topBatters.length)
  );

  // Top 5 bowling aggregate
  const topBowlers = [...players].sort((a, b) => b.subRatings.bowling - a.subRatings.bowling).slice(0, 5);
  const teamBowlingOvr = Math.round(
    topBowlers.reduce((acc, curr) => acc + curr.subRatings.bowling, 0) / Math.max(1, topBowlers.length)
  );

  const averageOvr = Math.round(
    players.reduce((acc, curr) => acc + curr.ovr, 0) / Math.max(1, players.length)
  );

  return {
    players,
    hasWicketKeeper,
    bowlerCount,
    spinnerCount,
    pacerCount,
    isBalancedAttack,
    teamBattingOvr,
    teamBowlingOvr,
    averageOvr,
  };
}

/**
 * Simulates a single fixture within the 72-match gauntlet.
 * Uses neutral international pitch conditions with transparent tactical modifiers.
 *
 * @param squad - User's tactical squad.
 * @param opponent - Opponent team profile.
 * @param matchNumber - 1-indexed fixture counter.
 * @returns MatchResult detailing scores, wickets, and victory state.
 */
export function simulateFixture(
  squad: DraftedSquad,
  opponent: OpponentTeamProfile,
  matchNumber: number
): MatchResult {
  // Apply tactical composition adjustments
  let effectiveUserBowling = squad.teamBowlingOvr;

  if (squad.bowlerCount < 5) {
    // Penalty: forced to use non-bowlers for unfilled quota
    const missing = 5 - squad.bowlerCount;
    effectiveUserBowling -= missing * 6;
    logWarn(`Squad lacks 5 bowlers in Match ${matchNumber}; applying penalty`, { missing });
  }

  if (squad.isBalancedAttack) {
    // Synergy: having both spin and pace adds tactical coverage
    effectiveUserBowling += 2;
  }

  if (!squad.hasWicketKeeper) {
    // Penalty: conceded byes and missed chances
    effectiveUserBowling -= 4;
  }

  // 1. User Batting Inning
  const batDelta = squad.teamBattingOvr - opponent.bowlingOvr;
  const userBaseRuns = 165 + batDelta * 1.25;
  const userRandomVariance = (Math.random() - 0.5) * 28; // Standard cricket variance
  const userRuns = Math.round(Math.max(110, Math.min(235, userBaseRuns + userRandomVariance)));

  const userWickets = Math.round(
    Math.max(1, Math.min(10, 5.5 - batDelta * 0.08 + (Math.random() - 0.5) * 3))
  );

  // 2. Opponent Chasing / Batting Inning
  const oppBatDelta = opponent.battingOvr - effectiveUserBowling;
  const oppBaseRuns = 165 + oppBatDelta * 1.25;
  const oppRandomVariance = (Math.random() - 0.5) * 28;
  let oppRuns = Math.round(Math.max(105, Math.min(240, oppBaseRuns + oppRandomVariance)));

  const oppWickets = Math.round(
    Math.max(1, Math.min(10, 5.5 - oppBatDelta * 0.08 + (Math.random() - 0.5) * 3))
  );

  // 3. Resolve Outcome
  let userWon: boolean;
  let margin: string;

  if (userRuns > oppRuns) {
    userWon = true;
    margin = `Won by ${userRuns - oppRuns} runs`;
  } else if (oppRuns > userRuns) {
    userWon = false;
    const wicketsLeft = Math.max(1, 10 - oppWickets);
    margin = `Lost by ${wicketsLeft} wickets`;
  } else {
    // Tie / Super Over Resolution
    const userSuperOverRating = (squad.teamBattingOvr + squad.teamBowlingOvr) / 2 + Math.random() * 8;
    const oppSuperOverRating = (opponent.battingOvr + opponent.bowlingOvr) / 2 + Math.random() * 8;
    userWon = userSuperOverRating >= oppSuperOverRating;
    margin = userWon ? "Won via Super Over" : "Lost via Super Over";
  }

  const topUserPlayer = squad.players[Math.floor(Math.random() * squad.players.length)];
  const topPerformer = userWon ? `${topUserPlayer.name} (${topUserPlayer.ovr} OVR)` : opponent.starPlayer;

  return {
    matchNumber,
    userWon,
    userScore: {
      runs: userRuns,
      wickets: userWickets,
      overs: 20,
    },
    opponentScore: {
      runs: oppRuns,
      wickets: oppWickets,
      overs: 20,
    },
    opponentName: opponent.name,
    topPerformer,
    marginDescription: margin,
  };
}
