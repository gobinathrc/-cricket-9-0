import { DraftedSquad, MatchResult, PlayerEditionRecord, TacticalFormation } from "../types/cricket";
import { DEFAULT_FORMATION } from "../data/formations";
import { logInfo, logWarn } from "../utils/logger";

/**
 * Tactical metrics and ratings representing an opponent in the 9-match World Cup campaign.
 */
export interface OpponentTeamProfile {
  id: string;
  stageName: "GROUP STAGE" | "SUPER 8" | "SEMI-FINAL" | "THE FINAL";
  matchNumber: number;
  name: string;
  countryCode: string;
  difficultyTier: "NORMAL" | "HIGH" | "ELITE" | "CHAMPION";
  battingOvr: number;
  bowlingOvr: number;
  starPlayer: string;
}

/**
 * Authentic 9-match tournament schedule mirroring the T20 World Cup championship path.
 */
export const WORLD_CUP_SCHEDULE: OpponentTeamProfile[] = [
  // Stage 1: Group Stage (Matches 1-4)
  {
    id: "match_1",
    stageName: "GROUP STAGE",
    matchNumber: 1,
    name: "Ireland T20",
    countryCode: "IRE",
    difficultyTier: "NORMAL",
    battingOvr: 78,
    bowlingOvr: 77,
    starPlayer: "P. Stirling",
  },
  {
    id: "match_2",
    stageName: "GROUP STAGE",
    matchNumber: 2,
    name: "USA T20",
    countryCode: "USA",
    difficultyTier: "NORMAL",
    battingOvr: 77,
    bowlingOvr: 76,
    starPlayer: "A. Jones",
  },
  {
    id: "match_3",
    stageName: "GROUP STAGE",
    matchNumber: 3,
    name: "Pakistan T20",
    countryCode: "PAK",
    difficultyTier: "HIGH",
    battingOvr: 84,
    bowlingOvr: 88,
    starPlayer: "Shaheen Afridi",
  },
  {
    id: "match_4",
    stageName: "GROUP STAGE",
    matchNumber: 4,
    name: "Bangladesh T20",
    countryCode: "BAN",
    difficultyTier: "NORMAL",
    battingOvr: 80,
    bowlingOvr: 81,
    starPlayer: "Shakib Al Hasan",
  },

  // Stage 2: Super 8 Stage (Matches 5-7)
  {
    id: "match_5",
    stageName: "SUPER 8",
    matchNumber: 5,
    name: "Afghanistan T20",
    countryCode: "AFG",
    difficultyTier: "HIGH",
    battingOvr: 82,
    bowlingOvr: 89,
    starPlayer: "Rashid Khan",
  },
  {
    id: "match_6",
    stageName: "SUPER 8",
    matchNumber: 6,
    name: "West Indies T20",
    countryCode: "WI",
    difficultyTier: "ELITE",
    battingOvr: 89,
    bowlingOvr: 84,
    starPlayer: "N. Pooran",
  },
  {
    id: "match_7",
    stageName: "SUPER 8",
    matchNumber: 7,
    name: "Australia T20",
    countryCode: "AUS",
    difficultyTier: "ELITE",
    battingOvr: 89,
    bowlingOvr: 89,
    starPlayer: "T. Head",
  },

  // Stage 3: The Knockout Semi-Final (Match 8)
  {
    id: "match_8",
    stageName: "SEMI-FINAL",
    matchNumber: 8,
    name: "England T20",
    countryCode: "ENG",
    difficultyTier: "ELITE",
    battingOvr: 90,
    bowlingOvr: 88,
    starPlayer: "J. Buttler",
  },

  // Stage 4: The T20 World Cup Final (Match 9)
  {
    id: "match_9",
    stageName: "THE FINAL",
    matchNumber: 9,
    name: "South Africa T20",
    countryCode: "SA",
    difficultyTier: "CHAMPION",
    battingOvr: 91,
    bowlingOvr: 91,
    starPlayer: "H. Klaasen",
  },
];

/**
 * Inspects a drafted 11-player squad to evaluate tactical viability and composition balance
 * against a chosen TacticalFormation preset (defaulting to Standard Balanced 1-4-2-4).
 *
 * @param players - Array of 11 drafted player records.
 * @param formation - Target tactical formation specifying role quotas (WK, BAT, AR, BOWL).
 * @returns Evaluated DraftedSquad entity.
 */
export function evaluateSquadTactics(
  players: PlayerEditionRecord[],
  formation: TacticalFormation = DEFAULT_FORMATION
): DraftedSquad {
  const wkCount = players.filter((p) => p.role === "WK").length;
  const batCount = players.filter((p) => p.role === "BAT").length;
  const arCount = players.filter((p) => p.role === "AR").length;
  const bowlCount = players.filter((p) => p.role === "BOWL").length;

  const targetWk = formation.wk;
  const targetBat = formation.bat;
  const targetAr = formation.ar;
  const targetBowl = formation.bowl;

  const missingRoleDescriptions: string[] = [];
  if (wkCount < targetWk) {
    missingRoleDescriptions.push(`Need at least ${targetWk} Wicketkeeper${targetWk > 1 ? "s" : ""} (WK)`);
  }
  if (batCount < targetBat) {
    missingRoleDescriptions.push(`Need at least ${targetBat} Batsmen (Current: ${batCount}/${targetBat})`);
  }
  if (arCount < targetAr) {
    missingRoleDescriptions.push(`Need at least ${targetAr} All-Rounders (Current: ${arCount}/${targetAr})`);
  }
  if (bowlCount < targetBowl) {
    missingRoleDescriptions.push(`Need at least ${targetBowl} Bowlers (Current: ${bowlCount}/${targetBowl})`);
  }

  const hasRequiredRoles =
    wkCount >= targetWk &&
    batCount >= targetBat &&
    arCount >= targetAr &&
    bowlCount >= targetBowl;

  const eligibleBowlers = players.filter((p) => p.role === "BOWL" || p.role === "AR");
  const spinnerCount = eligibleBowlers.filter(
    (p) => p.bowlingType === "SPIN_OFF" || p.bowlingType === "SPIN_LEG"
  ).length;

  const pacerCount = eligibleBowlers.filter(
    (p) => p.bowlingType === "FAST" || p.bowlingType === "MEDIUM"
  ).length;

  const isBalancedAttack = spinnerCount >= 1 && pacerCount >= 2;

  const topBatters = [...players].sort((a, b) => b.subRatings.batting - a.subRatings.batting).slice(0, 7);
  const teamBattingOvr = Math.round(
    topBatters.reduce((acc, curr) => acc + curr.subRatings.batting, 0) / Math.max(1, topBatters.length)
  );

  const topBowlers = [...players].sort((a, b) => b.subRatings.bowling - a.subRatings.bowling).slice(0, 5);
  const teamBowlingOvr = Math.round(
    topBowlers.reduce((acc, curr) => acc + curr.subRatings.bowling, 0) / Math.max(1, topBowlers.length)
  );

  const averageOvr = Math.round(
    players.reduce((acc, curr) => acc + curr.ovr, 0) / Math.max(1, players.length)
  );

  return {
    players,
    formation,
    wkCount,
    batCount,
    arCount,
    bowlCount,
    hasWicketKeeper: wkCount >= 1,
    bowlerCount: bowlCount,
    hasRequiredRoles,
    missingRoleDescriptions,
    isBalancedAttack,
    teamBattingOvr,
    teamBowlingOvr,
    averageOvr,
  };
}

/**
 * Simulates a single fixture in the 9-match World Cup tournament.
 * Models authentic T20 match dynamics including toss, 1st innings target setting,
 * and 2nd innings target chasing with realistic wickets, overs, and margins.
 *
 * @param squad - User's tactical squad.
 * @param opponent - Opponent team profile.
 * @param matchNumber - 1-indexed fixture counter.
 * @returns MatchResult detailing scores, wickets, overs, and victory state.
 */
export function simulateFixture(
  squad: DraftedSquad,
  opponent: OpponentTeamProfile,
  matchNumber: number
): MatchResult {
  let effectiveUserBowling = squad.teamBowlingOvr;

  const targetBowl = squad.formation ? squad.formation.bowl : 3;
  if (squad.bowlCount < targetBowl) {
    const missing = targetBowl - squad.bowlCount;
    effectiveUserBowling -= missing * 8;
    logWarn(`Squad lacks frontline bowlers for ${squad.formation?.name || "tactics"} in Match ${matchNumber}; applying penalty`, { missing });
  }

  if (squad.isBalancedAttack) {
    effectiveUserBowling += 2;
  }

  if (squad.wkCount < 1) {
    effectiveUserBowling -= 6;
  }

  // Coin Toss: 50% user bats first, 50% opponent bats first
  const userBatsFirst = Math.random() >= 0.5;

  let userRuns: number;
  let userWickets: number;
  let userOvers: number;

  let oppRuns: number;
  let oppWickets: number;
  let oppOvers: number;

  let userWon: boolean;
  let margin: string;

  if (userBatsFirst) {
    // --- User 1st Innings (Setting Target) ---
    const batDelta = squad.teamBattingOvr - opponent.bowlingOvr;
    const base1stRuns = 162 + batDelta * 1.8;
    const variance1st = (Math.random() - 0.5) * 26;
    userRuns = Math.round(Math.max(115, Math.min(230, base1stRuns + variance1st)));
    userWickets = Math.round(Math.max(2, Math.min(10, 5.2 - batDelta * 0.12 + (Math.random() - 0.5) * 4)));
    userOvers = userWickets === 10 ? Math.round((16 + Math.random() * 3.5) * 10) / 10 : 20;

    const target = userRuns + 1;

    // --- Opponent 2nd Innings (Chasing Target) ---
    const oppChaseDelta = opponent.battingOvr - effectiveUserBowling;
    const chaseStrength = oppChaseDelta * 1.5 - (userRuns - 160) * 0.4 + (Math.random() - 0.5) * 22;

    if (chaseStrength > 0) {
      // Opponent successfully chases target
      userWon = false;
      oppWickets = Math.round(Math.max(2, Math.min(9, 4.5 - oppChaseDelta * 0.1 + (Math.random() - 0.5) * 3)));
      const extra = Math.floor(Math.random() * 4);
      oppRuns = target + extra;
      const ballsLeft = Math.round(Math.max(1, Math.min(18, chaseStrength * 0.6 + Math.random() * 6)));
      const oversBowled = (120 - ballsLeft) / 6;
      oppOvers = Math.round(oversBowled * 10) / 10;
      margin = `Lost by ${10 - oppWickets} wickets (${ballsLeft} balls left)`;
    } else {
      // Opponent fails to chase target
      userWon = true;
      const oppDeficit = Math.round(Math.max(2, Math.min(65, -chaseStrength + Math.random() * 10)));
      oppRuns = Math.max(95, userRuns - oppDeficit);
      oppWickets = Math.random() > 0.4 ? 10 : Math.round(Math.max(5, Math.min(9, 7.0 - oppChaseDelta * 0.1)));
      oppOvers = oppWickets === 10 ? Math.round((16 + Math.random() * 3.5) * 10) / 10 : 20;
      margin = `Won by ${userRuns - oppRuns} runs`;
    }
  } else {
    // --- Opponent 1st Innings (Setting Target) ---
    const oppBatDelta = opponent.battingOvr - effectiveUserBowling;
    const base1stRuns = 162 + oppBatDelta * 1.8;
    const variance1st = (Math.random() - 0.5) * 26;
    oppRuns = Math.round(Math.max(115, Math.min(230, base1stRuns + variance1st)));
    oppWickets = Math.round(Math.max(2, Math.min(10, 5.2 - oppBatDelta * 0.12 + (Math.random() - 0.5) * 4)));
    oppOvers = oppWickets === 10 ? Math.round((16 + Math.random() * 3.5) * 10) / 10 : 20;

    const target = oppRuns + 1;

    // --- User 2nd Innings (Chasing Target) ---
    const userChaseDelta = squad.teamBattingOvr - opponent.bowlingOvr;
    const chaseStrength = userChaseDelta * 1.5 - (oppRuns - 160) * 0.4 + (Math.random() - 0.5) * 22;

    if (chaseStrength > 0) {
      // User successfully chases target
      userWon = true;
      userWickets = Math.round(Math.max(2, Math.min(9, 4.5 - userChaseDelta * 0.1 + (Math.random() - 0.5) * 3)));
      const extra = Math.floor(Math.random() * 4);
      userRuns = target + extra;
      const ballsLeft = Math.round(Math.max(1, Math.min(18, chaseStrength * 0.6 + Math.random() * 6)));
      const oversBowled = (120 - ballsLeft) / 6;
      userOvers = Math.round(oversBowled * 10) / 10;
      margin = `Won by ${10 - userWickets} wickets (${ballsLeft} balls left)`;
    } else {
      // User fails to chase target
      userWon = false;
      const userDeficit = Math.round(Math.max(2, Math.min(65, -chaseStrength + Math.random() * 10)));
      userRuns = Math.max(95, oppRuns - userDeficit);
      userWickets = Math.random() > 0.4 ? 10 : Math.round(Math.max(5, Math.min(9, 7.0 - userChaseDelta * 0.1)));
      userOvers = userWickets === 10 ? Math.round((16 + Math.random() * 3.5) * 10) / 10 : 20;
      margin = `Lost by ${oppRuns - userRuns} runs`;
    }
  }

  // Handle rare dead-tie -> Super Over
  if (userRuns === oppRuns) {
    const userSo = squad.teamBattingOvr + Math.random() * 10;
    const oppSo = opponent.battingOvr + Math.random() * 10;
    userWon = userSo >= oppSo;
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
      overs: userOvers,
    },
    opponentScore: {
      runs: oppRuns,
      wickets: oppWickets,
      overs: oppOvers,
    },
    opponentName: opponent.name,
    topPerformer,
    marginDescription: margin,
  };
}
