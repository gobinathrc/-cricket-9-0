import { TacticalFormation } from "../types/cricket";

/**
 * Standard Balanced Formation (1-4-2-4):
 * Mirrors the canonical modern T20 championship side: 1 Wicketkeeper, 4 Pure Batsmen,
 * 2 All-Rounders, and 4 Specialist Bowlers.
 */
export const DEFAULT_FORMATION: TacticalFormation = {
  id: "formation_standard_1_4_2_4",
  name: "Standard Balanced",
  shortCode: "1-4-2-4",
  tagline: "Classic T20 World Cup Champion XI",
  description: "1 Wicketkeeper, 4 Batsmen, 2 All-Rounders, and 4 Frontline Bowlers. Provides optimal top-order firepower and five distinct bowling options.",
  wk: 1,
  bat: 4,
  ar: 2,
  bowl: 4,
  isStandard: true,
};

/**
 * All-Rounder Fortress (1-1-4-5):
 * Requested configuration prioritizing maximum bowling depth and lower-order boundary hitters.
 * Gives 9 bowling options and depth down to number 11.
 */
export const ALL_ROUNDER_HEAVY_FORMATION: TacticalFormation = {
  id: "formation_ar_heavy_1_1_4_5",
  name: "All-Rounder Fortress",
  shortCode: "1-1-4-5",
  tagline: "Extreme Bowling Depth & Lower-Order Power",
  description: "1 Wicketkeeper, 1 Anchor Batsman, 4 Elite All-Rounders, and 5 Frontline Bowlers. Unlocks 9 bowling options and eliminates tailender vulnerabilities.",
  wk: 1,
  bat: 1,
  ar: 4,
  bowl: 5,
};

/**
 * Batting Depth Formation (1-5-2-3):
 * Tailored for high-scoring tournament chases with 6 specialist batsmen including the keeper.
 */
export const BATTING_DEPTH_FORMATION: TacticalFormation = {
  id: "formation_batting_depth_1_5_2_3",
  name: "Batting Depth",
  shortCode: "1-5-2-3",
  tagline: "Deep Top-Order Run Chasers",
  description: "1 Wicketkeeper, 5 Specialist Batsmen, 2 All-Rounders, and 3 Frontline Bowlers. High run expectancy with reliable 5 bowling options.",
  wk: 1,
  bat: 5,
  ar: 2,
  bowl: 3,
};

/**
 * Pace & Spin Strike Battery (1-3-2-5):
 * Defensive powerhouse configuration with 5 dedicated wicket-taking bowlers and 2 all-rounders.
 */
export const BOWLING_BATTERY_FORMATION: TacticalFormation = {
  id: "formation_bowling_battery_1_3_2_5",
  name: "Strike Force Battery",
  shortCode: "1-3-2-5",
  tagline: "Aggressive Wicket-Taking Specialist Attack",
  description: "1 Wicketkeeper, 3 Specialist Batsmen, 2 All-Rounders, and 5 Frontline Bowlers. Designed to restrict opponents to sub-130 totals.",
  wk: 1,
  bat: 3,
  ar: 2,
  bowl: 5,
};

/**
 * Total Cricket Dynamic XI (1-2-4-4):
 * Modern franchise-inspired lineup with 4 explosive all-rounders and 4 frontline bowlers.
 */
export const TOTAL_CRICKET_FORMATION: TacticalFormation = {
  id: "formation_total_cricket_1_2_4_4",
  name: "Total Cricket",
  shortCode: "1-2-4-4",
  tagline: "Modern Dynamic T20 Power XI",
  description: "1 Wicketkeeper, 2 Batsmen, 4 All-Rounders, and 4 Bowlers. Extreme tactical agility with 8 bowling options and boundary hitters at every position.",
  wk: 1,
  bat: 2,
  ar: 4,
  bowl: 4,
};

/**
 * Batting Powerhouse (1-5-1-4):
 * Top-heavy batting order designed to dominate the powerplay and set massive first-innings targets.
 */
export const BATTING_POWERHOUSE_FORMATION: TacticalFormation = {
  id: "formation_batting_power_1_5_1_4",
  name: "Batting Powerhouse",
  shortCode: "1-5-1-4",
  tagline: "Top-Order Run Machine",
  description: "1 Wicketkeeper, 5 Batsmen, 1 All-Rounder, and 4 Bowlers. Classical top-heavy team capable of posting massive totals.",
  wk: 1,
  bat: 5,
  ar: 1,
  bowl: 4,
};

/**
 * Twin Keepers Formation (2-4-2-3):
 * Dual wicketkeeper strategy fielding two keeper-batsmen in the top four.
 */
export const DUAL_KEEPER_FORMATION: TacticalFormation = {
  id: "formation_dual_keeper_2_4_2_3",
  name: "Twin Keepers",
  shortCode: "2-4-2-3",
  tagline: "Two Keeper-Batters in Top Order",
  description: "2 Wicketkeepers, 4 Batsmen, 2 All-Rounders, and 3 Bowlers. High strike-rate middle overs.",
  wk: 2,
  bat: 4,
  ar: 2,
  bowl: 3,
};

/**
 * Curated list of prominent tactical presets available to the user before or during drafting.
 */
export const ALL_PRESET_FORMATIONS: TacticalFormation[] = [
  DEFAULT_FORMATION,
  ALL_ROUNDER_HEAVY_FORMATION,
  BATTING_DEPTH_FORMATION,
  BOWLING_BATTERY_FORMATION,
  TOTAL_CRICKET_FORMATION,
  BATTING_POWERHOUSE_FORMATION,
  DUAL_KEEPER_FORMATION,
];

/**
 * Configuration options for generating mathematical combinations.
 */
export interface CombinatoricsConstraints {
  minWk?: number;
  maxWk?: number;
  minBat?: number;
  minAr?: number;
  minBowl?: number;
  minBowlingOptions?: number; // min (AR + BOWL) for authentic 20-over T20 cricket
}

/**
 * Computes all valid integer partitions of 11 players across (WK, BAT, AR, BOWL) satisfying constraints.
 * Implements the stars-and-bars combinatorial search algorithm to prove how many formations are valid.
 *
 * @param constraints - Boundaries for minimum and maximum roles.
 * @returns Array of valid tactical combinations.
 */
export function calculateAllTacticalCombinations(
  constraints: CombinatoricsConstraints = {}
): Array<{ wk: number; bat: number; ar: number; bowl: number }> {
  const minWk = constraints.minWk ?? 1;
  const maxWk = constraints.maxWk ?? 11;
  const minBat = constraints.minBat ?? 1;
  const minAr = constraints.minAr ?? 0;
  const minBowl = constraints.minBowl ?? 1;
  const minBowlingOptions = constraints.minBowlingOptions ?? 0;

  const validCombinations: Array<{ wk: number; bat: number; ar: number; bowl: number }> = [];

  for (let wk = minWk; wk <= Math.min(11, maxWk); wk++) {
    for (let bat = minBat; bat <= 11 - wk; bat++) {
      for (let bowl = minBowl; bowl <= 11 - wk - bat; bowl++) {
        const ar = 11 - wk - bat - bowl;
        if (ar < minAr) continue;
        if (ar + bowl < minBowlingOptions) continue;

        validCombinations.push({ wk, bat, ar, bowl });
      }
    }
  }

  return validCombinations;
}

/**
 * Validates whether a proposed tactical formation satisfies cricket sanity constraints:
 * Must sum to 11 players, contain at least 1 WK, 1 BAT, and 1 BOWL.
 *
 * @param formation - Proposed tactical combination.
 * @returns Boolean flag indicating whether the formation is viable.
 */
export function isValidTacticalFormation(
  formation: { wk: number; bat: number; ar: number; bowl: number }
): boolean {
  if (formation.wk < 1) return false;
  if (formation.bat < 1) return false;
  if (formation.bowl < 1) return false;
  if (formation.ar < 0) return false;
  return formation.wk + formation.bat + formation.ar + formation.bowl === 11;
}
