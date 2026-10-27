import { NextRequest, NextResponse } from "next/server";
import { ALL_TOURNAMENT_SQUADS, getSquadById } from "../../../../data/squads";
import { DEFAULT_FORMATION } from "../../../../data/formations";
import { selectDraftPick, DraftSessionState } from "../../../../engine/draft";
import { isRoleGateClosed, getRoleGateQuota } from "../../../../engine/lineup";
import { PlayerEditionRecord, TacticalFormation } from "../../../../types/cricket";
import { logInfo, logWarn, logError } from "../../../../utils/logger";

interface PickRequestBody {
  activeSquadId: string;
  playerId: string;
  currentRound: number;
  draftedPlayers: PlayerEditionRecord[];
  draftedAthleteIds: string[];
  formation?: TacticalFormation;
}

/**
 * Handles server-side validation and locking of a player pick into the Starting XI.
 * Intercepts duplicate athletes and unauthorized card injections.
 *
 * @param request - NextRequest containing pick identifiers and current session arrays.
 * @returns JSON response with updated squad state and completion status.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: PickRequestBody = await request.json();

    if (!body.activeSquadId || !body.playerId || typeof body.currentRound !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required fields: activeSquadId, playerId, currentRound" },
        { status: 400 }
      );
    }

    const squad = getSquadById(body.activeSquadId);
    if (!squad) {
      logWarn("API: Pick rejected - Squad not found", { squadId: body.activeSquadId });
      return NextResponse.json(
        { success: false, error: `Squad with ID ${body.activeSquadId} does not exist` },
        { status: 404 }
      );
    }

    const candidatePlayer = squad.roster.find((p) => p.id === body.playerId);
    if (!candidatePlayer) {
      logWarn("API: Pick rejected - Player not found in target squad", { playerId: body.playerId });
      return NextResponse.json(
        { success: false, error: `Player ${body.playerId} does not belong to squad ${squad.teamName}` },
        { status: 400 }
      );
    }

    if (body.draftedAthleteIds.includes(candidatePlayer.athleteId)) {
      logWarn("API: Pick rejected - Duplicate athlete collision", { athleteId: candidatePlayer.athleteId });
      return NextResponse.json(
        { success: false, error: `Athlete ${candidatePlayer.name} has already been drafted in another edition` },
        { status: 400 }
      );
    }

    // Role Gate: Prevent drafting a role whose tactical quota is already full
    if (isRoleGateClosed(candidatePlayer.role, body.draftedPlayers || [])) {
      const quota = getRoleGateQuota(candidatePlayer.role, body.draftedPlayers || []);
      logWarn("API: Pick rejected - Role gate quota already met", {
        role: candidatePlayer.role,
        current: quota.current,
        max: quota.max,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Tactical quota already met for role ${candidatePlayer.role} (${quota.current}/${quota.max}). Cannot draft another ${candidatePlayer.role}.`,
        },
        { status: 422 }
      );
    }

    const stateStub: DraftSessionState = {
      currentRound: body.currentRound,
      maxRounds: 11,
      formation: body.formation || DEFAULT_FORMATION,
      activeSquad: squad,
      availableSquadOptions: ALL_TOURNAMENT_SQUADS,
      draftedPlayers: body.draftedPlayers || [],
      draftedAthleteIds: body.draftedAthleteIds || [],
      isComplete: false,
    };

    const updatedState = selectDraftPick(stateStub, candidatePlayer);

    logInfo("API: Pick confirmed and verified on server", {
      player: candidatePlayer.name,
      ovr: candidatePlayer.ovr,
      totalDrafted: updatedState.draftedPlayers.length,
      isComplete: updatedState.isComplete,
    });

    return NextResponse.json({
      success: true,
      data: {
        draftedPlayers: updatedState.draftedPlayers,
        draftedAthleteIds: updatedState.draftedAthleteIds,
        currentRound: updatedState.currentRound,
        isComplete: updatedState.isComplete,
      },
    });
  } catch (error) {
    logError("API: Error processing draft pick", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
