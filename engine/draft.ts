import { PlayerEditionRecord, TournamentSquad } from "../types/cricket";
import { logInfo, logWarn } from "../utils/logger";

/**
 * Encapsulates the ongoing 11-round drafting session state.
 */
export interface DraftSessionState {
  currentRound: number; // 1 to 11
  maxRounds: number; // 11
  activeSquad: TournamentSquad | null;
  availableSquadOptions: TournamentSquad[];
  draftedPlayers: PlayerEditionRecord[];
  draftedAthleteIds: string[]; // Set of string IDs to prevent multi-edition player duplication
  isComplete: boolean;
}

/**
 * Initializes a new 11-round draft session.
 *
 * @param squads - Full database of historical tournament squads.
 * @returns Initialized DraftSessionState.
 */
export function createDraftSession(squads: TournamentSquad[]): DraftSessionState {
  logInfo("Initializing new 11-round draft session", { totalSquads: squads.length });
  return {
    currentRound: 1,
    maxRounds: 11,
    activeSquad: null,
    availableSquadOptions: squads,
    draftedPlayers: [],
    draftedAthleteIds: [],
    isComplete: false,
  };
}

/**
 * Spins the wheel to randomly select a historical squad for the current round.
 * Filters the squad roster so players whose other editions were already drafted cannot be picked again.
 *
 * @param state - Current draft session state.
 * @returns Updated draft session state with the spun squad and sanitized pick pool.
 */
export function spinDraftWheel(state: DraftSessionState): DraftSessionState {
  if (state.isComplete || state.currentRound > state.maxRounds) {
    logWarn("Attempted to spin wheel on completed draft session");
    return state;
  }

  // Filter squads to only those that have at least one un-drafted eligible player remaining
  const eligibleSquads = state.availableSquadOptions
    .map((squad) => ({
      ...squad,
      roster: squad.roster.filter(
        (player) => !state.draftedAthleteIds.includes(player.athleteId)
      ),
    }))
    .filter((squad) => squad.roster.length > 0);

  if (eligibleSquads.length === 0) {
    throw new Error("No eligible players remaining across available squads");
  }

  const randomIndex = Math.floor(Math.random() * eligibleSquads.length);
  const activeSquad = eligibleSquads[randomIndex];

  logInfo(`Draft Wheel spun: Round ${state.currentRound}/${state.maxRounds}`, {
    squad: activeSquad.teamName,
    year: activeSquad.editionYear,
    eligiblePlayers: activeSquad.roster.length,
  });

  return {
    ...state,
    activeSquad,
  };
}

/**
 * Locks in a chosen player from the active squad's roster into the user's starting XI.
 *
 * @param state - Current draft session state.
 * @param player - Selected player edition record.
 * @returns Updated draft session state advancing the round.
 */
export function selectDraftPick(
  state: DraftSessionState,
  player: PlayerEditionRecord
): DraftSessionState {
  if (!state.activeSquad) {
    throw new Error("Cannot select a pick before the draft wheel has spun");
  }

  if (state.draftedAthleteIds.includes(player.athleteId)) {
    throw new Error(`Player ${player.name} has already been drafted in another edition`);
  }

  const updatedPlayers = [...state.draftedPlayers, player];
  const updatedAthleteIds = [...state.draftedAthleteIds, player.athleteId];
  const nextRound = state.currentRound + 1;
  const isComplete = updatedPlayers.length >= state.maxRounds;

  logInfo(`Pick locked in: ${player.name} (${player.editionYear}) - OVR: ${player.ovr}`, {
    round: state.currentRound,
    totalDrafted: updatedPlayers.length,
    isComplete,
  });

  return {
    ...state,
    currentRound: nextRound,
    draftedPlayers: updatedPlayers,
    draftedAthleteIds: updatedAthleteIds,
    activeSquad: null, // Clear active squad until next spin
    isComplete,
  };
}
