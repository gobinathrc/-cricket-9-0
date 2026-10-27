import { NextRequest, NextResponse } from "next/server";
import { ALL_TOURNAMENT_SQUADS } from "../../../../data/squads";
import { DEFAULT_FORMATION } from "../../../../data/formations";
import { spinDraftWheel, DraftSessionState } from "../../../../engine/draft";
import { logInfo, logError } from "../../../../utils/logger";

interface SpinRequestBody {
  currentRound: number;
  draftedAthleteIds: string[];
  draftedPlayers?: unknown[];
}

/**
 * Handles server-authoritative randomized squad spinning for the current draft round.
 * Sanitizes roster to prevent already-drafted athletes from being exposed.
 *
 * @param request - NextRequest containing current round and existing picks.
 * @returns JSON response with updated activeSquad.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SpinRequestBody = await request.json();

    if (!body || typeof body.currentRound !== "number" || !Array.isArray(body.draftedAthleteIds)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: currentRound (number) and draftedAthleteIds (array) required" },
        { status: 400 }
      );
    }

    if (body.currentRound > 11) {
      return NextResponse.json(
        { success: false, error: "Draft is already complete (max 11 rounds reached)" },
        { status: 400 }
      );
    }

    const stateStub: DraftSessionState = {
      currentRound: body.currentRound,
      maxRounds: 11,
      formation: DEFAULT_FORMATION,
      activeSquad: null,
      availableSquadOptions: ALL_TOURNAMENT_SQUADS,
      draftedPlayers: (body.draftedPlayers as any) || [],
      draftedAthleteIds: body.draftedAthleteIds,
      isComplete: false,
    };

    const updatedState = spinDraftWheel(stateStub);

    logInfo("API: Wheel spun successfully", {
      round: updatedState.currentRound,
      squadName: updatedState.activeSquad?.teamName,
      eligibleRosterCount: updatedState.activeSquad?.roster.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        activeSquad: updatedState.activeSquad,
        currentRound: updatedState.currentRound,
      },
    });
  } catch (error) {
    logError("API: Error spinning draft wheel", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to spin wheel" },
      { status: 500 }
    );
  }
}
