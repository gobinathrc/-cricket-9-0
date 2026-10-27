import { PlayerEditionRecord, TacticalFormation, TournamentSquad } from "../types/cricket";
import { DEFAULT_FORMATION } from "../data/formations";
import { isRoleGateClosed } from "./lineup";
import { logInfo, logWarn } from "../utils/logger";

/**
 * Encapsulates the ongoing 11-round drafting session state.
 */
export interface DraftSessionState {
  currentRound: number; // 1 to 11
  maxRounds: number; // 11
  formation: TacticalFormation; // Active tactical configuration
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
 * @param formation - Chosen tactical formation (default: Standard Balanced 1-4-2-4).
 * @returns Initialized DraftSessionState.
 */
export function createDraftSession(
  squads: TournamentSquad[],
  formation: TacticalFormation = DEFAULT_FORMATION
): DraftSessionState {
  logInfo("Initializing new 11-round draft session", {
    totalSquads: squads.length,
    formation: formation.shortCode,
  });
  return {
    currentRound: 1,
    maxRounds: 11,
    formation,
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

  // Filter squads to only those that have at least one un-drafted eligible player whose role gate is open
  const openGateSquads = state.availableSquadOptions
    .map((squad) => ({
      ...squad,
      roster: squad.roster.filter(
        (player) =>
          !state.draftedAthleteIds.includes(player.athleteId) &&
          !isRoleGateClosed(player.role, state.draftedPlayers)
      ),
    }))
    .filter((squad) => squad.roster.length > 0);

  const eligibleSquads = state.availableSquadOptions
    .map((squad) => ({
      ...squad,
      roster: squad.roster.filter(
        (player) => !state.draftedAthleteIds.includes(player.athleteId)
      ),
    }))
    .filter((squad) => squad.roster.length > 0);

  const candidatePool = openGateSquads.length > 0 ? openGateSquads : eligibleSquads;

  if (candidatePool.length === 0) {
    throw new Error("No eligible players remaining across available squads");
  }

  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  const selectedBase = candidatePool[randomIndex];

  // Return the full squad with already-drafted athletes filtered out so user can see full team with gated cards
  const fullSquad = state.availableSquadOptions.find((s) => s.id === selectedBase.id) || selectedBase;
  const activeSquad: TournamentSquad = {
    ...fullSquad,
    roster: fullSquad.roster.filter(
      (player) => !state.draftedAthleteIds.includes(player.athleteId)
    ),
  };

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
 * Automatically simulates and drafts a complete 11-player squad across random tournament squads,
 * strictly abiding by role gate quotas and multi-edition player uniqueness.
 *
 * @param squads - Catalog of tournament squads.
 * @returns Complete 11-player DraftSessionState.
 */
export function autoDraftCompleteTeam(squads: TournamentSquad[]): DraftSessionState {
  let session = createDraftSession(squads);
  while (!session.isComplete && session.currentRound <= session.maxRounds) {
    session = spinDraftWheel(session);
    if (!session.activeSquad) break;
    const pickable = session.activeSquad.roster.filter(
      (p) => !isRoleGateClosed(p.role, session.draftedPlayers)
    );
    if (pickable.length === 0) break;
    const randomPick = pickable[Math.floor(Math.random() * pickable.length)];
    session = selectDraftPick(session, randomPick);
  }
  return session;
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
