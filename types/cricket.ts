/**
 * Domain definitions and contracts for the Cricket 72-0 T20 Draft & Simulation Engine.
 */

export type PlayerRole = "BAT" | "BOWL" | "AR" | "WK";

export type BowlingType = "FAST" | "MEDIUM" | "SPIN_OFF" | "SPIN_LEG" | "NONE";

/**
 * Granular statistical summary from a specific tournament edition.
 * Retained in the data tier for formulaic calculations and deterministic simulation.
 */
export interface PlayerStatsSummary {
  runs: number;
  ballsFaced: number;
  strikeRate: number;
  average: number;
  wickets: number;
  oversBowled: number;
  economy: number;
}

/**
 * Complete player card record tied to a specific tournament year edition.
 */
export interface PlayerEditionRecord {
  id: string; // Composite unique key: e.g. "ind_2007_yuvraj_singh"
  athleteId: string; // Global athlete identifier (e.g. "yuvraj_singh") to prevent multi-edition drafting collisions
  name: string; // "Yuvraj Singh"
  countryCode: string; // "IND"
  editionYear: number; // 2007
  role: PlayerRole;
  battingStyle: "LHB" | "RHB";
  bowlingType: BowlingType;
  ovr: number; // Bounded gaming rating between 60 and 99
  subRatings: {
    batting: number;
    bowling: number;
    paceOrTurn: number;
    clutch: number;
  };
  tournamentStats: PlayerStatsSummary;
}

/**
 * Minimalist arcade presentation model for the UI card.
 */
export interface PlayerCardView {
  id: string;
  athleteId: string;
  name: string;
  ovr: number;
  countryCode: string;
  editionYear: number;
  role: PlayerRole;
  bowlingType: BowlingType;
}

/**
 * A historical squad for an edition available on the draft wheel.
 */
export interface TournamentSquad {
  id: string;
  editionYear: number;
  teamName: string;
  countryCode: string;
  isChampion: boolean;
  themeColor: string; // Tailwind-friendly accent color
  roster: PlayerEditionRecord[];
}

/**
 * Tactical user squad configuration (11 drafted players).
 */
export interface DraftedSquad {
  players: PlayerEditionRecord[];
  wkCount: number;
  batCount: number;
  arCount: number;
  bowlCount: number;
  hasWicketKeeper: boolean;
  bowlerCount: number;
  hasRequiredRoles: boolean; // Enforces: WK >= 1, BAT >= 4, AR >= 2, BOWL >= 3
  missingRoleDescriptions: string[];
  isBalancedAttack: boolean; // At least 1 spinner and at least 2 pacers
  teamBattingOvr: number;
  teamBowlingOvr: number;
  averageOvr: number;
}

/**
 * Result of a single simulated fixture in the 72-match gauntlet.
 */
export interface MatchResult {
  matchNumber: number;
  userWon: boolean;
  userScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  opponentScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  opponentName: string;
  topPerformer: string;
  marginDescription: string;
}

/**
 * Overall run state for the active 72-0 session.
 */
export interface GauntletRunState {
  currentStreak: number;
  maxStreak: number;
  targetStreak: number; // 9
  status: "DRAFTING" | "READY_TO_SIMULATE" | "SIMULATING" | "FAILED" | "COMPLETED";
  completedMatches: MatchResult[];
  lastMatch?: MatchResult;
}
