import { PlayerEditionRecord, PlayerRole } from "../types/cricket";

/**
 * Standard tactical role quotas for an 11-player Starting XI.
 * Enforces: 1 Wicketkeeper, 4 Batsmen, 2 All-Rounders, 4 Bowlers.
 */
export const STANDARD_ROLE_QUOTAS: Record<PlayerRole, number> = {
  WK: 1,
  BAT: 4,
  AR: 2,
  BOWL: 4,
};

/**
 * Tactical role quota status structure.
 */
export interface RoleQuotaStatus {
  role: PlayerRole;
  current: number;
  max: number;
  isFull: boolean;
}

/**
 * Determines whether a role's drafting quota has been filled.
 * Greys out and disables player cards of that role to prevent invalid squad composition.
 *
 * @param role - Target player role (WK, BAT, AR, BOWL).
 * @param drafted - Currently drafted players in session.
 * @param quotas - Role limits (default: 1 WK, 4 BAT, 2 AR, 4 BOWL).
 * @returns Boolean flag indicating if the gate is closed.
 */
export function isRoleGateClosed(
  role: PlayerRole,
  drafted: PlayerEditionRecord[],
  quotas: Record<PlayerRole, number> = STANDARD_ROLE_QUOTAS
): boolean {
  const currentCount = drafted.filter((p) => p.role === role).length;
  const maxQuota = quotas[role] ?? 0;
  return currentCount >= maxQuota;
}

/**
 * Retrieves the current quota progress for a specific tactical position.
 *
 * @param role - Target player role.
 * @param drafted - Currently drafted players.
 * @param quotas - Role limits.
 * @returns RoleQuotaStatus object.
 */
export function getRoleGateQuota(
  role: PlayerRole,
  drafted: PlayerEditionRecord[],
  quotas: Record<PlayerRole, number> = STANDARD_ROLE_QUOTAS
): RoleQuotaStatus {
  const current = drafted.filter((p) => p.role === role).length;
  const max = quotas[role] ?? 0;
  return {
    role,
    current,
    max,
    isFull: current >= max,
  };
}

/**
 * Shifts a player up or down within the 11-slot batting lineup.
 * Allows the user to organize openers, middle order, and tailenders.
 *
 * @param players - Active starting XI roster.
 * @param fromIndex - Origin slot index (0 to 10).
 * @param toIndex - Destination slot index (0 to 10).
 * @returns New array of players with updated batting order.
 */
export function reorderBattingLineup(
  players: PlayerEditionRecord[],
  fromIndex: number,
  toIndex: number
): PlayerEditionRecord[] {
  if (
    fromIndex < 0 ||
    fromIndex >= players.length ||
    toIndex < 0 ||
    toIndex >= players.length ||
    fromIndex === toIndex
  ) {
    return [...players];
  }

  const updated = [...players];
  const [movedPlayer] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, movedPlayer);
  return updated;
}

/**
 * Automatically sorts drafted players into an authentic cricket batting lineup.
 * Ranks Openers & Pure Batters first (#1 to #4) by batting rating,
 * followed by Wicketkeeper & All-Rounders (#5 to #7), and finishes with Bowlers (#8 to #11).
 *
 * @param players - Array of drafted players.
 * @returns Optimized batting order array.
 */
export function autoOptimizeBattingLineup(
  players: PlayerEditionRecord[]
): PlayerEditionRecord[] {
  const batters = players
    .filter((p) => p.role === "BAT")
    .sort((a, b) => b.subRatings.batting - a.subRatings.batting);

  const keepers = players
    .filter((p) => p.role === "WK")
    .sort((a, b) => b.subRatings.batting - a.subRatings.batting);

  const allRounders = players
    .filter((p) => p.role === "AR")
    .sort((a, b) => b.subRatings.batting - a.subRatings.batting);

  const bowlers = players
    .filter((p) => p.role === "BOWL")
    .sort((a, b) => b.subRatings.batting - a.subRatings.batting); // Higher batting bowlers bat earlier in tail

  return [...batters, ...keepers, ...allRounders, ...bowlers];
}

/**
 * Contextual labels for each batting position in the 11-player lineup.
 * Describes the batting position slot rather than hardcoding a player role.
 *
 * @param index - 0-indexed batting order position.
 * @returns Descriptive label and category.
 */
export function getBattingPositionLabel(index: number): { title: string; category: string } {
  switch (index) {
    case 0:
      return { title: "Opener (#1)", category: "Top Order" };
    case 1:
      return { title: "Opener (#2)", category: "Top Order" };
    case 2:
      return { title: "No. 3 Anchor", category: "Top Order" };
    case 3:
      return { title: "Middle Order (#4)", category: "Middle Order" };
    case 4:
      return { title: "Middle Order (#5)", category: "Middle Order" };
    case 5:
      return { title: "Finisher (#6)", category: "Middle Order" };
    case 6:
      return { title: "Lower Order (#7)", category: "Lower Order" };
    case 7:
      return { title: "Lower Order (#8)", category: "Lower Order" };
    case 8:
      return { title: "Tail (#9)", category: "Tail" };
    case 9:
      return { title: "Tail (#10)", category: "Tail" };
    case 10:
      return { title: "Tail (#11)", category: "Tail" };
    default:
      return { title: `Position #${index + 1}`, category: "Bench" };
  }
}

/**
 * Evaluates whether a player is severely out of position in the batting lineup.
 * Flags tailenders opening or star batters stranded at #10/#11.
 *
 * @param player - Player edition record.
 * @param index - Lineup slot index (0 to 10).
 * @returns Mismatch diagnostic.
 */
export interface PositionMismatch {
  isMismatch: boolean;
  type?: "TAILENDER_OPENING" | "BATTER_STRANDED";
  severity?: "HIGH" | "MEDIUM";
  message?: string;
}

export function getPlayerPositionMismatch(
  player: PlayerEditionRecord,
  index: number
): PositionMismatch {
  const isBowler = player.role === "BOWL";
  const battingSkill = player.subRatings?.batting ?? player.ovr;

  // Specialist bowler or weak batter placed in top 4 (#1 to #4)
  if ((isBowler || battingSkill < 60) && index <= 3) {
    return {
      isMismatch: true,
      type: "TAILENDER_OPENING",
      severity: index <= 1 ? "HIGH" : "MEDIUM",
      message: index <= 1 ? "Tailender Opening (Collapse Risk)" : "Bowler in Top 4",
    };
  }

  // Elite batsman stranded in the tail (#9, #10, #11)
  if (player.role === "BAT" && battingSkill >= 80 && index >= 8) {
    return {
      isMismatch: true,
      type: "BATTER_STRANDED",
      severity: "HIGH",
      message: "Star Batter Stranded in Tail",
    };
  }

  return { isMismatch: false };
}

