import { BowlingType, PlayerRole } from "../types/cricket";
import { logInfo, logWarn } from "../utils/logger";

/**
 * Statistical input capturing a player's performance in a specific T20 World Cup edition.
 */
export interface TournamentRawStats {
  ballsFaced: number;
  runsScored: number;
  dismissals: number;
  oversBowled: number;
  runsConceded: number;
  wicketsTaken: number;
  baselineBattingSr: number; // 24-month prior international baseline
  baselineBowlingEcon: number; // 24-month prior international baseline
}

/**
 * Normalization baseline for a specific tournament edition.
 * Ensures an average 130 SR in 2007 is scored proportionally to a 145 SR in 2024.
 */
export interface TournamentEditionBaseline {
  editionYear: number;
  meanStrikeRate: number;
  stdStrikeRate: number;
  meanAverage: number;
  stdAverage: number;
  meanEconomy: number;
  stdEconomy: number;
}

/**
 * Default tournament baselines across historical T20 World Cups.
 */
export const EDITION_BASELINES: Record<number, TournamentEditionBaseline> = {
  2007: { editionYear: 2007, meanStrikeRate: 124.0, stdStrikeRate: 18.0, meanAverage: 22.0, stdAverage: 8.5, meanEconomy: 7.4, stdEconomy: 1.1 },
  2009: { editionYear: 2009, meanStrikeRate: 121.5, stdStrikeRate: 17.5, meanAverage: 21.5, stdAverage: 8.0, meanEconomy: 7.2, stdEconomy: 1.05 },
  2010: { editionYear: 2010, meanStrikeRate: 125.0, stdStrikeRate: 19.0, meanAverage: 22.5, stdAverage: 8.5, meanEconomy: 7.5, stdEconomy: 1.1 },
  2012: { editionYear: 2012, meanStrikeRate: 123.0, stdStrikeRate: 18.0, meanAverage: 22.0, stdAverage: 8.2, meanEconomy: 7.3, stdEconomy: 1.1 },
  2014: { editionYear: 2014, meanStrikeRate: 126.0, stdStrikeRate: 19.5, meanAverage: 23.0, stdAverage: 8.5, meanEconomy: 7.45, stdEconomy: 1.15 },
  2016: { editionYear: 2016, meanStrikeRate: 129.0, stdStrikeRate: 20.0, meanAverage: 24.0, stdAverage: 9.0, meanEconomy: 7.7, stdEconomy: 1.2 },
  2021: { editionYear: 2021, meanStrikeRate: 127.0, stdStrikeRate: 19.0, meanAverage: 23.5, stdAverage: 8.8, meanEconomy: 7.55, stdEconomy: 1.15 },
  2022: { editionYear: 2022, meanStrikeRate: 130.0, stdStrikeRate: 21.0, meanAverage: 24.5, stdAverage: 9.2, meanEconomy: 7.8, stdEconomy: 1.25 },
  2024: { editionYear: 2024, meanStrikeRate: 133.0, stdStrikeRate: 22.5, meanAverage: 25.0, stdAverage: 9.5, meanEconomy: 7.95, stdEconomy: 1.3 },
  2026: { editionYear: 2026, meanStrikeRate: 136.0, stdStrikeRate: 23.0, meanAverage: 25.5, stdAverage: 9.8, meanEconomy: 8.1, stdEconomy: 1.35 },
};

/**
 * Calculates a bounded gaming rating (60-99 OVR) for a player edition card.
 * Uses Bayesian prior shrinkage to prevent small-sample anomalies from inflating or destroying cards.
 *
 * @param stats - Raw tournament statistics.
 * @param baseline - Normalization parameters for the target edition.
 * @param role - Primary tactical position.
 * @returns Bounded integer OVR rating between 60 and 99.
 */
export function calculatePlayerOVR(
  stats: TournamentRawStats,
  baseline: TournamentEditionBaseline,
  role: PlayerRole
): number {
  const minBallsThreshold = 60;
  const actualAvg = stats.dismissals > 0 ? stats.runsScored / stats.dismissals : stats.runsScored;
  const rawSr = stats.ballsFaced > 0 ? (stats.runsScored / stats.ballsFaced) * 100 : baseline.meanStrikeRate;

  // Shrinking sample sizes towards 24-month prior baseline preserves game balance
  const batShrinkWeight = Math.min(1.0, stats.ballsFaced / minBallsThreshold);
  const adjustedSr = batShrinkWeight * rawSr + (1 - batShrinkWeight) * stats.baselineBattingSr;

  const zBatSr = (adjustedSr - baseline.meanStrikeRate) / baseline.stdStrikeRate;
  const zBatAvg = (actualAvg - baseline.meanAverage) / baseline.stdAverage;
  const batScore = 0.65 * zBatSr + 0.35 * zBatAvg;

  const minOversThreshold = 10;
  const rawEcon = stats.oversBowled > 0 ? stats.runsConceded / stats.oversBowled : baseline.meanEconomy;
  const wicketsPerOver = stats.oversBowled > 0 ? stats.wicketsTaken / stats.oversBowled : 0;

  const bowlShrinkWeight = Math.min(1.0, stats.oversBowled / minOversThreshold);
  const adjustedEcon = bowlShrinkWeight * rawEcon + (1 - bowlShrinkWeight) * stats.baselineBowlingEcon;

  const zBowlEcon = (baseline.meanEconomy - adjustedEcon) / baseline.stdEconomy;
  const zBowlWpo = (wicketsPerOver - 0.25) / 0.15;
  const bowlScore = 0.55 * zBowlEcon + 0.45 * zBowlWpo;

  let compositeZ: number;
  switch (role) {
    case "BAT":
    case "WK":
      compositeZ = batScore;
      break;
    case "BOWL":
      compositeZ = bowlScore;
      break;
    case "AR":
      compositeZ = Math.max(batScore, bowlScore) * 0.65 + Math.min(batScore, bowlScore) * 0.35;
      break;
  }

  // Sigmoidal compression ensures bounded output within [60, 99]
  const k = 0.72;
  const scaled = 60 + 39 / (1 + Math.exp(-k * compositeZ));

  const finalOvr = Math.min(99, Math.max(60, Math.round(scaled)));
  return finalOvr;
}

/**
 * Computes sub-ratings (Batting, Bowling, Pace/Turn, Clutch) to drive tactical match simulation.
 *
 * @param ovr - Primary calculated OVR.
 * @param role - Tactical role.
 * @param bowlingType - Bowling style category.
 * @param isKnockoutHero - Indicator if player won Player of Match in semi-final or final.
 */
export function computeSubRatings(
  ovr: number,
  role: PlayerRole,
  bowlingType: BowlingType,
  isKnockoutHero: boolean = false
): { batting: number; bowling: number; paceOrTurn: number; clutch: number } {
  let batting = 60;
  let bowling = 60;

  switch (role) {
    case "BAT":
      batting = ovr;
      bowling = 55;
      break;
    case "WK":
      batting = ovr;
      bowling = 45;
      break;
    case "BOWL":
      batting = 50 + Math.round((ovr - 60) * 0.25);
      bowling = ovr;
      break;
    case "AR":
      batting = Math.max(65, ovr - 3);
      bowling = Math.max(65, ovr - 3);
      break;
  }

  const paceOrTurn = bowlingType === "NONE" ? 50 : Math.max(60, bowling);
  const clutch = isKnockoutHero ? Math.min(99, ovr + 4) : ovr;

  return { batting, bowling, paceOrTurn, clutch };
}
