import { TournamentSquad } from "../types/cricket";
import { INDIA_EDITIONS } from "./editions/india";
import { INTERNATIONAL_EDITIONS } from "./editions/international";

/**
 * Aggregated catalog of historical tournament squads available for random selection on the draft wheel.
 */
export const ALL_TOURNAMENT_SQUADS: TournamentSquad[] = [
  ...INDIA_EDITIONS,
  ...INTERNATIONAL_EDITIONS,
];

/**
 * Retrieves a specific tournament squad by unique identifier.
 *
 * @param id - Squad identifier string.
 * @returns Matched TournamentSquad or undefined.
 */
export function getSquadById(id: string): TournamentSquad | undefined {
  return ALL_TOURNAMENT_SQUADS.find((squad) => squad.id === id);
}

/**
 * Retrieves all squads for a given World Cup edition year.
 *
 * @param year - Target tournament year.
 * @returns Array of TournamentSquad objects.
 */
export function getSquadsByYear(year: number): TournamentSquad[] {
  return ALL_TOURNAMENT_SQUADS.filter((squad) => squad.editionYear === year);
}
